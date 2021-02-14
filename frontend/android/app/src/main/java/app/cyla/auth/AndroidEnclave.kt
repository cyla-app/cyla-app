package app.cyla.auth

import android.app.KeyguardManager
import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.security.keystore.UserNotAuthenticatedException
import android.util.Log
import android.widget.Toast
import androidx.biometric.BiometricManager
import androidx.biometric.BiometricManager.Authenticators
import androidx.biometric.BiometricManager.BIOMETRIC_SUCCESS
import androidx.biometric.BiometricPrompt
import androidx.core.content.ContextCompat
import app.cyla.MainActivity
import java.nio.charset.Charset
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

class AndroidEnclave(private val context: MainActivity) {
    companion object {
        private const val KEYSTORE_ALIAS = "passphrase"
        private val KEY_SIZE = 256
        private val ANDROID_KEYSTORE = "AndroidKeyStore"
        private val ENCRYPTION_BLOCK_MODE = KeyProperties.BLOCK_MODE_GCM
        private val ENCRYPTION_PADDING = KeyProperties.ENCRYPTION_PADDING_NONE
        private val ENCRYPTION_ALGORITHM = KeyProperties.KEY_ALGORITHM_AES
    }

    private val promptInfo = BiometricPrompt.PromptInfo.Builder()
        .setTitle("Passphrase Store")
        .setDescription("Authenticate to store your credentials securely.")
        .setAllowedAuthenticators(Authenticators.BIOMETRIC_STRONG)
        .setNegativeButtonText("Cancel?")
        .build()

    private fun getCipher(): Cipher {
        val transformation = "$ENCRYPTION_ALGORITHM/$ENCRYPTION_BLOCK_MODE/$ENCRYPTION_PADDING"
        return Cipher.getInstance(transformation)
    }
    
    private fun initKeyGenerator(): KeyGenerator {
        val keyGenerator: KeyGenerator = KeyGenerator
            .getInstance(ENCRYPTION_ALGORITHM, ANDROID_KEYSTORE)

        val specBuilder = KeyGenParameterSpec.Builder(
            KEYSTORE_ALIAS,
            KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
        )
            .setBlockModes(ENCRYPTION_BLOCK_MODE)
            .setEncryptionPaddings(ENCRYPTION_PADDING)
            .setKeySize(KEY_SIZE)


        val keyguardManager = context.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager

        if (keyguardManager.isDeviceSecure) {
            val biometricManager = BiometricManager.from(context)
            if (biometricManager.canAuthenticate(Authenticators.BIOMETRIC_STRONG) == BIOMETRIC_SUCCESS) {
                specBuilder.setUserAuthenticationRequired(true)
                specBuilder.setUserAuthenticationValidityDurationSeconds(10)
            } else {
                Toast.makeText(context, "BIOMETRIC_STRONG not available", Toast.LENGTH_LONG).show()
                specBuilder.setUserAuthenticationRequired(false)
            }
        } else {
            Toast.makeText(context, "isDeviceSecure == false", Toast.LENGTH_LONG).show()
            specBuilder.setUserAuthenticationRequired(false)
        }


        keyGenerator.init(specBuilder.build());
        return keyGenerator
    }

    private fun authenticate(cipher: Cipher?, callback: BiometricPrompt.AuthenticationCallback) {
        val executor = ContextCompat.getMainExecutor(context)

        val biometricPrompt = BiometricPrompt(context, executor, callback)

        context.runOnUiThread {
            if (cipher != null) {
                biometricPrompt.authenticate(promptInfo, BiometricPrompt.CryptoObject(cipher))
            } else {
                biometricPrompt.authenticate(promptInfo)
            }
        }
    }


    fun encryptPassphrase(passphrase: String, callback: (Pair<ByteArray, ByteArray>?, String?) -> Unit) {
        val keyGenerator = initKeyGenerator()
        val secretKey: SecretKey = keyGenerator.generateKey();
        val cipher: Cipher = getCipher();
        
        try {
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            callback(Pair(cipher.doFinal(passphrase.encodeToByteArray()), cipher.iv), null)
        } catch (e: UserNotAuthenticatedException) {
            authenticate(null, object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    callback(null, "Authentication error $errorCode :: $errString")
                }

                override fun onAuthenticationFailed() {
                    //callback(null, "Authentication failed")
                }

                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    //val cipher = result.cryptoObject?.cipher!!
                    cipher.init(Cipher.ENCRYPT_MODE, secretKey);
                    callback(Pair(cipher.doFinal(passphrase.encodeToByteArray()), cipher.iv), null)
                }
            })
        }
    }

    fun decryptPassphrase(cipherText: ByteArray, iv: ByteArray, callback: (String?, String?) -> Unit) {
        val keyStore = KeyStore.getInstance(ANDROID_KEYSTORE);
        keyStore.load(null);

        val secretKeyEntry = keyStore.getEntry(KEYSTORE_ALIAS, null) as KeyStore.SecretKeyEntry
        val secretKey = secretKeyEntry.secretKey

        val cipher: Cipher = getCipher();

        try {
            cipher.init(Cipher.DECRYPT_MODE, secretKey, GCMParameterSpec(128, iv))
            val plainText = cipher.doFinal(cipherText)
            callback(plainText.toString(Charset.forName("UTF-8")), null)
        } catch (e: UserNotAuthenticatedException) {
            authenticate(null, object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    callback(null, "Authentication error $errorCode :: $errString")
                }

                override fun onAuthenticationFailed() {
                    //callback(null, "Authentication failed")
                }

                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    cipher.init(Cipher.DECRYPT_MODE, secretKey, GCMParameterSpec(128, iv))
                    val plainText = cipher.doFinal(cipherText)
                    callback(plainText.toString(Charset.forName("UTF-8")), null)
                }
            })
        }
    }
}

