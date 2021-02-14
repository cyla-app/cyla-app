package app.cyla.auth

import android.app.KeyguardManager
import android.content.Context
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.security.keystore.UserNotAuthenticatedException
import android.util.Log
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
        private const val KEY_STORE_INSTANCE = "AndroidKeyStore"
        private const val CIPHER_TRANSFORMATION = "AES/GCM/NoPadding"
    }

    private val promptInfo = BiometricPrompt.PromptInfo.Builder()
        .setTitle("Passphrase Store")
        .setDescription("Authenticate to store your credentials securely.")
        .setAllowedAuthenticators(Authenticators.BIOMETRIC_STRONG)
        .setNegativeButtonText("Cancel?")
        .build()

    private fun initKeyGenerator(): KeyGenerator {
        val keyGenerator: KeyGenerator = KeyGenerator
            .getInstance(KeyProperties.KEY_ALGORITHM_AES, KEY_STORE_INSTANCE)

        val specBuilder = KeyGenParameterSpec.Builder(
            KEYSTORE_ALIAS,
            KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
        )
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)


        val keyguardManager = context.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager

        if (keyguardManager.isDeviceSecure) {
            val biometricManager = BiometricManager.from(context)
            if (biometricManager.canAuthenticate(Authenticators.BIOMETRIC_STRONG) == BIOMETRIC_SUCCESS) {
                specBuilder.setUserAuthenticationRequired(true)
                specBuilder.setUserAuthenticationValidityDurationSeconds(5 * 60)
            } else {
                specBuilder.setUserAuthenticationRequired(false)
            }
        } else {
            specBuilder.setUserAuthenticationRequired(false)
        }


        keyGenerator.init(specBuilder.build());
        return keyGenerator
    }

    private fun authenticate(cipher: Cipher, callback: BiometricPrompt.AuthenticationCallback) {
        val executor = ContextCompat.getMainExecutor(context)

        val biometricPrompt = BiometricPrompt(context, executor, callback)

        context.runOnUiThread {
            biometricPrompt.authenticate(promptInfo, BiometricPrompt.CryptoObject(cipher))
        }
    }


    fun encryptPassphrase(passphrase: String, callback: (Pair<ByteArray, ByteArray>?, String?) -> Unit) {
        val keyGenerator = initKeyGenerator()
        val secretKey: SecretKey = keyGenerator.generateKey();

        val cipher: Cipher = Cipher.getInstance(CIPHER_TRANSFORMATION);
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);

        try {
            val iv = cipher.iv;
            callback(Pair(cipher.doFinal(passphrase.encodeToByteArray()), iv), null)
        } catch (e: UserNotAuthenticatedException) {
            authenticate(cipher, object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    callback(null, "Authentication error $errorCode :: $errString")
                }

                override fun onAuthenticationFailed() {
                    callback(null, "Authentication failed")
                }

                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    val cipher = result.cryptoObject?.cipher!!
                    val iv = cipher.iv;
                    callback(Pair(cipher.doFinal(passphrase.encodeToByteArray()), iv), null)
                }
            })
        }
    }

    fun decryptPassphrase(cipherText: ByteArray, iv: ByteArray, callback: (String?, String?) -> Unit) {
        val keyStore = KeyStore.getInstance(KEY_STORE_INSTANCE);
        keyStore.load(null);

        val secretKeyEntry = keyStore.getEntry(KEYSTORE_ALIAS, null) as KeyStore.SecretKeyEntry
        val secretKey = secretKeyEntry.secretKey

        val cipher: Cipher = Cipher.getInstance(CIPHER_TRANSFORMATION);
        val spec = GCMParameterSpec(128, iv)
        cipher.init(Cipher.DECRYPT_MODE, secretKey, spec)

        try {
            val plainText = cipher.doFinal(cipherText)
            callback(plainText.toString(Charset.forName("UTF-8")), null)
        } catch (e: UserNotAuthenticatedException) {
            authenticate(cipher, object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    callback(null, "Authentication error $errorCode :: $errString")
                }

                override fun onAuthenticationFailed() {
                    callback(null, "Authentication failed")
                }

                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    val cipher = result.cryptoObject?.cipher!!
                    val plainText = cipher.doFinal(cipherText)
                    callback(plainText.toString(Charset.forName("UTF-8")), null)
                }
            })
        }
    }
}

