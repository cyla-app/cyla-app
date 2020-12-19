package app.cyla.decryption

import android.content.SharedPreferences
import android.util.Base64

private const val PREFERENCE_KEY_PASSPHRASE_IV = "passphraseIV"
private const val PREFERENCE_KEY_USER_KEY_CELL = "userKeyCell"
private const val PREFERENCE_KEY_PASSPHRASE_CIPHER_TEXT = "passphraseCipherText"
private const val PREFERENCE_KEY_USER_ID = "userId"


fun SharedPreferences.getUserId(): String? {
    return this.getString(PREFERENCE_KEY_USER_ID, null)
}

fun SharedPreferences.Editor.putUserId(userId: String): SharedPreferences.Editor {
    this.putString(PREFERENCE_KEY_USER_ID, userId)
    return this
}

fun SharedPreferences.getBase64(key: String): ByteArray? {
    val value = this.getString(key, null) ?: return null

    return Base64.decode(value, Base64.DEFAULT)
}

fun SharedPreferences.Editor.putBase64(key: String, value: ByteArray): SharedPreferences.Editor {
    this.putString(key, Base64.encodeToString(value, Base64.DEFAULT))
    return this
}

fun SharedPreferences.getUserKeyCell(): ByteArray? {
    return this.getBase64(PREFERENCE_KEY_USER_KEY_CELL)
}

fun SharedPreferences.Editor.putUserKeyCell(userKeyCell: ByteArray): SharedPreferences.Editor {
    this.putBase64(PREFERENCE_KEY_USER_KEY_CELL, userKeyCell)
    return this
}

fun SharedPreferences.getPassphrase(): Pair<ByteArray, ByteArray>? {
    val passphrase = this.getBase64(PREFERENCE_KEY_PASSPHRASE_CIPHER_TEXT)
    val iv = this.getBase64(PREFERENCE_KEY_PASSPHRASE_IV)

    if (iv == null || passphrase == null) {
        return null
    }

    return Pair(passphrase, iv)
}

fun SharedPreferences.Editor.putPassphrase(cipherText: ByteArray, iv: ByteArray): SharedPreferences.Editor {
    this.putBase64(PREFERENCE_KEY_PASSPHRASE_CIPHER_TEXT, cipherText)
    this.putBase64(PREFERENCE_KEY_PASSPHRASE_IV, iv)
    return this
}

fun SharedPreferences.doRequiredAttributesExist(): Boolean {
    return this.contains(PREFERENCE_KEY_PASSPHRASE_IV) &&
            this.contains(PREFERENCE_KEY_PASSPHRASE_CIPHER_TEXT) &&
            this.contains(PREFERENCE_KEY_USER_KEY_CELL)
}

