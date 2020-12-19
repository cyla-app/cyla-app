package app.cyla

import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import android.widget.Toast
import app.cyla.api.DayApi
import app.cyla.api.UserApi
import app.cyla.api.model.Day
import app.cyla.api.model.User
import app.cyla.decryption.*
import app.cyla.decryption.AndroidEnclave.Companion.decryptPassphrase
import app.cyla.decryption.AndroidEnclave.Companion.encryptPassphrase
import app.cyla.decryption.ThemisOperations.Companion.createUserKey
import app.cyla.decryption.ThemisOperations.Companion.decryptUserKey
import app.cyla.invoker.ApiClient
import com.cossacklabs.themis.SymmetricKey
import com.facebook.react.bridge.*
import java.time.LocalDate
import java.util.concurrent.CompletableFuture

class CylaModule(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        private const val APP_PREFERENCES_NAME = "app_storage"
        private const val ENCRYPTION_PREFERENCES_NAME = "encryption_storage"
    }

    private lateinit var userKey: SymmetricKey
//    private val moshi = Moshi.Builder()
//        .add(KotlinJsonAdapterFactory())
//        .add(OffsetDateTimeAdapter())
//        .build()

    //    private val jsonDayAdapter: JsonAdapter<app.cyla.decryption.models.Day> =
//        moshi.adapter(app.cyla.decryption.models.Day::class.java)
    private val apiClient = lazy {
        val apiClient = ApiClient()
        apiClient.basePath = getAppStorage().getString("apiBasePath", apiClient.basePath)
        apiClient
    }
    
    private val dayApi = lazy {
        DayApi(apiClient.value)
    }

    private val userApi = lazy {
        UserApi(apiClient.value)
    }

    override fun getName(): String {
        return "CylaModule"
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

        val user = User()
        user.id = null
        user.userKeyBackup = userKey.toByteArray()
        val userId = userApi.value.createUser(user)
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
    fun isUserSignedIn(promise: Promise) {
        promise.resolve(getEncryptionStorage().doRequiredAttributesExist())
    }

    @ReactMethod
    fun postDay(iso8601date: String, dayJson: String, promise: Promise) {
        CompletableFuture.supplyAsync {
            // Transform for validation  
//            jsonDayAdapter.fromJson(dayJson)

            val day = Day()
            day.date = LocalDate.parse(iso8601date)
            day.version = 0
            day.dayInfo = ThemisOperations.encryptData(userKey, dayJson)

            dayApi.value.modifyDayEntry(
                getAppStorage().getUserId()!!,
                day
            )
            promise.resolve(null)
        }.exceptionally { throwable ->
            promise.reject(throwable)
        }
    }

    @ReactMethod
    fun fetchDaysByMonths(months: Int, promise: Promise) {
        val userId = getAppStorage().getUserId()

        CompletableFuture.supplyAsync {
            val days = dayApi.value.getDayByUserAndRange(
                userId!!,
                LocalDate.now().minusMonths(months.toLong()),
                LocalDate.now()
            )

            val writableNativeArray = WritableNativeArray()
            for (plainTextDay in days) {
                val json = ThemisOperations.decryptData(userKey, plainTextDay.dayInfo)
                writableNativeArray.pushString(json)
            }
            promise.resolve(writableNativeArray)
        }.exceptionally { throwable ->
            promise.reject(throwable)
        }
    }
}
