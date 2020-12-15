package app.cyla.decryption

import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import android.widget.Toast
import app.cyla.api.apis.DayApi
import app.cyla.api.apis.UserApi
import app.cyla.api.models.User
import app.cyla.decryption.AndroidEnclave.Companion.decryptPassphrase
import app.cyla.decryption.AndroidEnclave.Companion.encryptPassphrase
import app.cyla.decryption.ThemisOperations.Companion.createUserKey
import app.cyla.decryption.ThemisOperations.Companion.decryptUserKey
import app.cyla.decryption.models.Day
import com.cossacklabs.themis.SecureCell
import com.cossacklabs.themis.SymmetricKey
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import java.time.LocalDate
import java.util.concurrent.CompletableFuture


class DecryptionModule(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        private const val APP_PREFERENCES_NAME = "app_storage"
        private const val ENCRYPTION_PREFERENCES_NAME = "encryption_storage"
    }

    private lateinit var userKey: SymmetricKey
    private val moshi = Moshi.Builder()
        .add(KotlinJsonAdapterFactory())
        .add(OffsetDateTimeAdapter())
        .add(OffsetDateTimeAdapter())
        .build()
    private val jsonDayAdapter: JsonAdapter<Day> = moshi.adapter(Day::class.java)

    override fun getName(): String {
        return "DecryptionModule"
    }

    private fun getEncryptionStorage(): SharedPreferences {
        return reactApplicationContext.getSharedPreferences(ENCRYPTION_PREFERENCES_NAME, Context.MODE_PRIVATE)
    }

    private fun getAppStorage(): SharedPreferences {
        return reactApplicationContext.getSharedPreferences(APP_PREFERENCES_NAME, Context.MODE_PRIVATE)
    }

    private fun resetEncryptionStorage() {
        getEncryptionStorage().edit().clear().apply()
    }

    private fun loadStoredUserKey(): Pair<String, SymmetricKey> {
        val userKeyCellData = getEncryptionStorage().getUserKeyCell()!!
        val (passphraseCipherText, passphraseIV) = getEncryptionStorage().getPassphrase()!!
        val passphrase = decryptPassphrase(passphraseCipherText, passphraseIV)
        val userKey = decryptUserKey(userKeyCellData, passphrase)

        val userId = getAppStorage().getUserId()
            ?: throw Exception("userId is not in app storage")

        Toast.makeText(reactApplicationContext, "loaded: $passphrase", Toast.LENGTH_LONG).show()

        return Pair(userId, userKey)
    }

    private fun createNewUserKey(passphrase: String): Pair<String, SymmetricKey> {
        val (cipherText, iv) = encryptPassphrase(reactApplicationContext, passphrase)
        val (userKey, userKeyCell) = createUserKey(passphrase)

        getEncryptionStorage().edit()
            .putUserKeyCell(userKeyCell)
            .putPassphrase(cipherText, iv)
            .apply()

        Toast.makeText(reactApplicationContext, "stored: $passphrase", Toast.LENGTH_LONG).show()

        val userId = UserApi().createUser(User(null, userKey.toByteArray()))
        getAppStorage().edit()
            .putUserId(userId)
            .apply()
        return Pair(userId, userKey)
    }

    @ReactMethod
    fun getUserId(promise: Promise) {
        val userId = getAppStorage().getUserId()
        if (userId == null) {
            promise.reject("CYLA-1", "User id is null")
            return
        }
        promise.resolve(userId)
    }

    @ReactMethod
    fun setupUserKey(passphrase: String?, promise: Promise) {
        try {
            val (userId, userKey) = if (passphrase == null) {
                loadStoredUserKey()
            } else {
                createNewUserKey(passphrase)
            }

            this.userKey = userKey

            promise.resolve(userId)
        } catch (e: Exception) {
            Log.e("DecryptionModule", e.message, e)
            resetEncryptionStorage()
            promise.reject(e)
        }
    }

    @ReactMethod
    fun isUserKeyReady(promise: Promise) {
        promise.resolve(getEncryptionStorage().doRequiredAttributesExist())
    }

    @ReactMethod
    fun postDay(dayJson: String, promise: Promise) {
        CompletableFuture.supplyAsync {
            // Transform for validation  
            jsonDayAdapter.fromJson(dayJson)
            
            DayApi().createDayEntry(
                getAppStorage().getUserId()!!, app.cyla.api.models.Day(
                    null,
                    ByteArray(0), // FIXME
                    LocalDate.now(),
                    SecureCell.SealWithKey(userKey).encrypt(dayJson.toByteArray())
                )
            )
            promise.resolve(null)
        }.exceptionally { throwable ->
            promise.reject(throwable)
        }
    }

    @ReactMethod
    fun fetchDays(promise: Promise) {

    }
}
