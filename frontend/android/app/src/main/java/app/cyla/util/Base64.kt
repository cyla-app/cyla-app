package app.cyla.util

import android.util.Base64

class Base64 {
    companion object {
        fun base64Decode(string: String): ByteArray {
            return Base64.decode(string, Base64.NO_WRAP)
        }

        fun base64Encode(buffer: ByteArray): String {
            return Base64.encodeToString(buffer, Base64.NO_WRAP)
        }
    }
}
