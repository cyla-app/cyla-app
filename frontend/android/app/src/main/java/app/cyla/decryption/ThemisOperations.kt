package app.cyla.decryption

import android.util.Base64
import app.cyla.api.model.Day
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

        fun base64Decode(string: String): ByteArray {
            return Base64.decode(string, Base64.NO_WRAP)
        }

        fun base64Encode(buffer: ByteArray): String {
            return Base64.encodeToString(buffer, Base64.NO_WRAP)
        }
    }
}
