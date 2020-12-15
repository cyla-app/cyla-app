package app.cyla.decryption

import android.app.KeyguardManager
import android.content.Context
import android.hardware.biometrics.BiometricManager
import android.hardware.biometrics.BiometricManager.BIOMETRIC_SUCCESS
import android.os.Build
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import java.nio.charset.Charset
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

class AndroidEnclave {
    companion object {
        private const val KEYSTORE_ALIAS = "passphrase"
        private const val KEY_STORE_INSTANCE = "AndroidKeyStore"
        private const val CIPHER_TRANSFORMATION = "AES/GCM/NoPadding"

        private fun initKeyGenerator(context: Context): KeyGenerator {
            val keyGenerator: KeyGenerator = KeyGenerator
                .getInstance(KeyProperties.KEY_ALGORITHM_AES, KEY_STORE_INSTANCE)

            val specBuilder = KeyGenParameterSpec.Builder(
                KEYSTORE_ALIAS,
                KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
            )
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setUserAuthenticationRequired(false) // FIXME: Enable biomentric in the future

//            val keyguardManager = context.getSystemService(Context.KEYGUARD_SERVICE) as KeyguardManager
//            
//            if (keyguardManager.isDeviceSecure) {
//                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.Q) {
//                    val biometricManager = context.getSystemService(Context.BIOMETRIC_SERVICE) as BiometricManager
//                    if (biometricManager.canAuthenticate() == BIOMETRIC_SUCCESS) {
//                        specBuilder.setUserAuthenticationRequired(true)
//                        specBuilder.setUserAuthenticationValidityDurationSeconds(0)
//                    }
//                } else {
//                    specBuilder.setUserAuthenticationRequired(true)
//                    specBuilder.setUserAuthenticationValidityDurationSeconds(60)
//                }
//            }


            keyGenerator.init(specBuilder.build());
            return keyGenerator
        }

        private fun initEncryptionCipher(secretKey: SecretKey): Cipher {
            val cipher: Cipher = Cipher.getInstance(CIPHER_TRANSFORMATION);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            return cipher
        }

        fun encryptPassphrase(context: Context, passphrase: String): Pair<ByteArray, ByteArray> {
            val keyGenerator = initKeyGenerator(context)
            val secretKey: SecretKey = keyGenerator.generateKey();
            val cipher: Cipher = initEncryptionCipher(secretKey)
            val iv = cipher.iv;
            return Pair(cipher.doFinal(passphrase.encodeToByteArray()), iv)
        }

        fun decryptPassphrase(cipherText: ByteArray, iv: ByteArray): String {
            val keyStore = KeyStore.getInstance(KEY_STORE_INSTANCE);
            keyStore.load(null);

            val secretKeyEntry = keyStore.getEntry(KEYSTORE_ALIAS, null) as KeyStore.SecretKeyEntry

            val secretKey = secretKeyEntry.secretKey

            val cipher = Cipher.getInstance(CIPHER_TRANSFORMATION)
            val spec = GCMParameterSpec(128, iv)
            cipher.init(Cipher.DECRYPT_MODE, secretKey, spec)

            val plainText = cipher.doFinal(cipherText)

            return plainText.toString(Charset.forName("UTF-8"))
        }
    }
}