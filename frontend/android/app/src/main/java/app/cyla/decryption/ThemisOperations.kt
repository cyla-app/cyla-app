package app.cyla.decryption

import com.cossacklabs.themis.SecureCell
import com.cossacklabs.themis.SymmetricKey


class ThemisOperations {
    companion object {
        fun createUserKey(passphrase: String): Pair<SymmetricKey, ByteArray> {
            val userKey = SymmetricKey()

            val userKeyCell = SecureCell.SealWithPassphrase(passphrase)
                .encrypt(userKey.toByteArray())

            return Pair(userKey, userKeyCell)
        }

        fun decryptUserKey(
            userKeyCellData: ByteArray,
            passphrase: String
        ): SymmetricKey {
            val userKeyCell = SecureCell.SealWithPassphrase(passphrase)
            return SymmetricKey(userKeyCell.decrypt(userKeyCellData))
        }
    }
}
