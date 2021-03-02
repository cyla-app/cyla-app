package app.cyla.util

import app.cyla.api.model.Day
import com.cossacklabs.themis.SecureCell
import com.cossacklabs.themis.SymmetricKey
import java.nio.charset.Charset
import java.security.MessageDigest

class Themis {
    companion object {
        fun createEncryptedSymmetricKey(passphrase: String): Pair<SymmetricKey, ByteArray> {
            val key = SymmetricKey()

            val encryptedKey = encryptUserKey(key, passphrase)

            return Pair(key, encryptedKey)
        }

        fun generateAuthKey(passphrase: String): ByteArray {
            val instance = MessageDigest.getInstance("SHA-512")
            instance.update(passphrase.encodeToByteArray())
            return instance.digest()
        }

        fun encryptUserKey(
                userKey: SymmetricKey,
                passphrase: String
        ) : ByteArray {
            val userKeyCell = SecureCell.SealWithPassphrase(passphrase)
            return userKeyCell.encrypt(userKey.toByteArray())
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

        fun decryptString(
            key: SymmetricKey,
            data: ByteArray,
            context: ByteArray
        ): String {
            return decryptData(key, data, context).toString(Charset.forName("UTF-8"))
        }

        private fun decryptData(
            key: SymmetricKey,
            data: ByteArray,
            context: ByteArray?
        ): ByteArray {
            val dataCell = SecureCell.SealWithKey(key)
            return if (context == null || context.isEmpty()) {
                dataCell.decrypt(data)
            } else {
                dataCell.decrypt(data, context)
            }
        }

        fun decryptData(
            key: SymmetricKey,
            data: ByteArray
        ): ByteArray {
            return decryptData(key, data, null)
        }

        fun decryptDayInfo(
            userKey: SymmetricKey,
            day: Day
        ): ByteArray {
            val dayKey = SymmetricKey(decryptData(userKey, day.dayKey))
            return decryptData(dayKey, day.dayInfo, day.date.toString().toByteArray())
        }

        private fun encryptData(
            key: SymmetricKey,
            data: ByteArray,
            context: ByteArray?
        ): ByteArray {
            val dataCell = SecureCell.SealWithKey(key)
            return if (context == null || context.isEmpty()) {
                dataCell.encrypt(data)
            } else {
                dataCell.encrypt(data, context)
            }
        }

        fun encryptData(
            key: SymmetricKey,
            data: ByteArray
        ): ByteArray {
            return encryptData(key, data, null)
        }

        /**
         * Encrypts day with a new, random date key. The date key is encrypted using the userKey.
         * Additionally, the date is used as encryption context for the dayInfo.
         */
        fun encryptDayInfo(
            userKey: SymmetricKey,
            dayInfo: ByteArray,
            dateContext: String
        ): Pair<ByteArray, ByteArray> {
            val dayKey = SymmetricKey();
            return Pair(
                encryptData(dayKey, dayInfo, dateContext.toByteArray()),
                encryptData(userKey, dayKey.toByteArray())
            )
        }
    }
}
