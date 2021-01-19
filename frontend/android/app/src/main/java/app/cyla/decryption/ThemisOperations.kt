package app.cyla.decryption

import com.cossacklabs.themis.SecureCell
import com.cossacklabs.themis.SymmetricKey
import java.nio.charset.Charset

class ThemisOperations {
    companion object {
        fun createUserKey(passphrase: String): Pair<SymmetricKey, ByteArray> {
            val userKey = SymmetricKey()

            val userKeyCell = SecureCell.SealWithPassphrase(passphrase)
                .encrypt(userKey.toByteArray())

            return Pair(userKey, userKeyCell)
        }

        fun getAuthKey(username: String, passphrase: String): ByteArray {
            //ContextImprint needs a key and a context. We simply take use the passphrase and username.
            val key = SymmetricKey(passphrase.toByteArray())
            val context = username.toByteArray()
            return SecureCell.ContextImprintWithKey(key).encrypt(username.toByteArray(), context)
        }

        fun decryptUserKey(
                userKeyCellData: ByteArray,
                passphrase: String
        ): SymmetricKey {
            val userKeyCell = SecureCell.SealWithPassphrase(passphrase)
            return SymmetricKey(userKeyCell.decrypt(userKeyCellData))
        }

        fun decryptData(
                key: SymmetricKey,
                data: ByteArray
        ): String {
            val dataCell = SecureCell.SealWithKey(key)
            return dataCell.decrypt(data).toString(Charset.forName("UTF-8"))
        }       
        
        fun encryptData(
                key: SymmetricKey,
                data: String
        ): ByteArray {
            val dataCell = SecureCell.SealWithKey(key)
            return dataCell.encrypt(data.toByteArray())
        }
    }
}
