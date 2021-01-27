package app.cyla.decryption

import com.cossacklabs.themis.SecureCell
import com.cossacklabs.themis.SymmetricKey
import java.nio.charset.Charset

class ThemisOperations {
    companion object {
        fun createUserKey(passphrase: String): Pair<SymmetricKey, ByteArray> {
            val userKey = SymmetricKey()

            val encryptedUserKey = SecureCell.SealWithPassphrase(passphrase)
                .encrypt(userKey.toByteArray())

            return Pair(userKey, encryptedUserKey)
        }

        fun getAuthKey(username: String, passphrase: String): ByteArray {
            //ContextImprint needs a key and a context. We simply take use the passphrase and username.
            val key = SymmetricKey(passphrase.toByteArray())
            val context = username.toByteArray()
            return SecureCell.ContextImprintWithKey(key).encrypt(username.toByteArray(), context)
        }

        fun decryptUserKey(
                encryptedUserKey: ByteArray,
                passphrase: String
        ): SymmetricKey {
            val userKeyCell = SecureCell.SealWithPassphrase(passphrase)
            return SymmetricKey(userKeyCell.decrypt(encryptedUserKey))
        }

        fun decryptString(
                key: SymmetricKey,
                data: ByteArray
        ): String {
            return decryptData(key, data).toString(Charset.forName("UTF-8"))
        }

        fun decryptData(
            key: SymmetricKey,
            data: ByteArray
        ): ByteArray {
            val dataCell = SecureCell.SealWithKey(key)
            return dataCell.decrypt(data)
        }

        fun encryptString(
                key: SymmetricKey,
                data: String
        ): ByteArray {
            return encryptData(key, data.toByteArray())
        }

        fun encryptData(
            key: SymmetricKey,
            data: ByteArray
        ): ByteArray {
            val dataCell = SecureCell.SealWithKey(key)
            return dataCell.encrypt(data)
        }
    }
}
