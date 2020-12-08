package app.cyla.decryption

import android.content.Context
import android.content.SharedPreferences
import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import android.util.Base64
import android.widget.Toast
import com.cossacklabs.themis.SecureCell.SealWithPassphrase
import com.cossacklabs.themis.SymmetricKey
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import java.nio.charset.Charset
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec


const val KEYSTORE_ALIAS = "passphrase"

fun SharedPreferences.getBase64(key: String): ByteArray? {
    val value = this.getString(key, null) ?: return null

    return Base64.decode(value, Base64.DEFAULT)
}

fun SharedPreferences.Editor.putBase64(key: String, value: ByteArray): SharedPreferences.Editor {
    this.putString(key, Base64.encodeToString(value, Base64.DEFAULT))
    return this
}

class DecryptionModule(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "DecryptionModule"
    }

    private fun setupKeyGenerator(): KeyGenerator {
        val keyGenerator: KeyGenerator = KeyGenerator
            .getInstance(KeyProperties.KEY_ALGORITHM_AES, "AndroidKeyStore")

        val keyGenParameterSpec = KeyGenParameterSpec.Builder(
            KEYSTORE_ALIAS,
            KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT
        )
            .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
            .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
            .setUserAuthenticationRequired(false) // FIXME: Enable biomentric in the future
            .build()

        keyGenerator.init(keyGenParameterSpec);
        return keyGenerator
    }

    private fun setupEncryptionCipher(secretKey: SecretKey): Cipher {
        val cipher: Cipher = Cipher.getInstance("AES/GCM/NoPadding");
        cipher.init(Cipher.ENCRYPT_MODE, secretKey);
        return cipher
    }

    private fun getPreferences(): SharedPreferences {
        return reactApplicationContext.getSharedPreferences("encryption_storage", Context.MODE_PRIVATE)
    }

    private fun storeEncryptedPassphrase(passphrase: String) {
        val keyGenerator = setupKeyGenerator()
        val secretKey: SecretKey = keyGenerator.generateKey();
        val cipher: Cipher = setupEncryptionCipher(secretKey)
        val iv = cipher.iv;
        val cipherText = cipher.doFinal(passphrase.encodeToByteArray());

        getPreferences().edit()
            .putBase64("passphraseIV", iv)
            .putBase64("passphraseCipherText", cipherText)
            .apply()
    }

    private fun storeNewUserKey(passphrase: String): SymmetricKey {
        storeEncryptedPassphrase(passphrase)

        val userKey = SymmetricKey()

        val userKeyCell = SealWithPassphrase(passphrase)
            .encrypt(userKey.toByteArray())
        getPreferences().edit()
            .putBase64("userKeyCell", userKeyCell)
            .apply()

        Toast.makeText(reactApplicationContext, "stored phrase: " + passphrase, Toast.LENGTH_LONG).show()

        return userKey
    }


    private fun loadExistingUserKey(): SymmetricKey {
        val userKeyCellData = getPreferences().getBase64("userKeyCell")!!
        val passphraseIV = getPreferences().getBase64("passphraseIV")!!
        val passphraseCipherText = getPreferences().getBase64("passphraseCipherText")!!
        val passphrase = decryptPassphrase(passphraseCipherText, passphraseIV)

        Toast.makeText(reactApplicationContext, "loaded phrase: " + passphrase, Toast.LENGTH_LONG).show()

        val userKeyCell = SealWithPassphrase(passphrase)

        return SymmetricKey(userKeyCell.decrypt(userKeyCellData))
    }


    private fun decryptPassphrase(cipherText: ByteArray, iv: ByteArray): String {
        val keyStore = KeyStore.getInstance("AndroidKeyStore");
        keyStore.load(null);

        val secretKeyEntry = keyStore.getEntry(KEYSTORE_ALIAS, null) as KeyStore.SecretKeyEntry

        val secretKey = secretKeyEntry.secretKey

        val cipher = Cipher.getInstance("AES/GCM/NoPadding")
        val spec = GCMParameterSpec(128, iv)
        cipher.init(Cipher.DECRYPT_MODE, secretKey, spec)

        val plainText = cipher.doFinal(cipherText)

        return plainText.toString(Charset.forName("UTF-8"))
    }

    @ReactMethod
    fun setupUserKey(passphrase: String?, promise: Promise) {
        val userKey: SymmetricKey = if (passphrase == null) {
            loadExistingUserKey()
        } else {
            storeNewUserKey(passphrase)
        }
       
        // create account with userKeyCell
        promise.resolve(null)
    }


    @ReactMethod
    fun fetchUserBlob(userId: String, promise: Promise) {
//        initializeUserKey(userId, "pass123phrase", promise)
//        Toast.makeText(reactApplicationContext, userId, Toast.LENGTH_LONG).show()
        promise.resolve(userId)
    }
}
