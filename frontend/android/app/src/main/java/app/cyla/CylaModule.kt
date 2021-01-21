package app.cyla

import android.content.Context
import android.content.SharedPreferences
import android.util.Base64
import android.util.Log
import app.cyla.api.DayApi
import app.cyla.api.UserApi
import app.cyla.api.model.Day
import app.cyla.api.model.User
import app.cyla.decryption.*
import app.cyla.decryption.AndroidEnclave.Companion.decryptPassphrase
import app.cyla.decryption.AndroidEnclave.Companion.encryptPassphrase
import app.cyla.decryption.ThemisOperations.Companion.getAuthKey
import app.cyla.decryption.ThemisOperations.Companion.createUserKey
import app.cyla.decryption.ThemisOperations.Companion.decryptUserKey
import app.cyla.invoker.ApiClient
import app.cyla.invoker.auth.HttpBearerAuth
import com.cossacklabs.themis.SecureCompare
import com.cossacklabs.themis.SymmetricKey
import com.facebook.react.bridge.*
import okhttp3.Request
import java.time.LocalDate
import java.util.concurrent.CompletableFuture

// Value of the Schema name for jwt bearer auth as defined in the OpenAPI spec.
private const val JWT_AUTH_SCHEMA_NAME = "bearerJWTAuth"

class CylaModule(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        private const val APP_PREFERENCES_NAME = "app_storage"
        private const val ENCRYPTION_PREFERENCES_NAME = "encryption_storage"
    }

    data class UserSetupInfo(
            val userId : String,
            val username : String,
            val jwtString : String,
            val userKey : SymmetricKey
    )

    private lateinit var userKey: SymmetricKey
    private lateinit var username: String
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

    private fun loadStoredUserInfo(): Pair<String, String> {
        val (passphraseCipherText, passphraseIV) = getEncryptionStorage().getPassphrase()!!
        val passphrase = decryptPassphrase(passphraseCipherText, passphraseIV)

        val username = getAppStorage().getUserName()
            ?: throw Exception("username is not in app storage")

        return Pair(username, passphrase)
    }

    private fun createNewUserKey(username: String, passphrase: String): UserSetupInfo {
        val passphraseInfo = encryptPassphrase(reactApplicationContext, passphrase)
        val (userKey, encryptedUserKey) = createUserKey(passphrase)
        val authKey = getAuthKey(username, passphrase)

        val user = User()
        user.id = null
        user.userKeyBackup = encryptedUserKey
        user.username = username
        user.authKey = authKey
        val userCreatedResponse = userApi.value.createUser(user)
        val userId = userCreatedResponse.userId!!
        val jwtString = userCreatedResponse.jwt!!

        getEncryptionStorage().edit()
                .putUserEncryptedInfo(encryptedUserKey, authKey, passphraseInfo )
                .apply()

        getAppStorage().edit()
                .putUserAppInfo(userId, username)
                .apply()

        return UserSetupInfo(userId, username, jwtString, userKey)
    }

    private fun setupCylaModuleUserInfo(userSetupInfo: UserSetupInfo) {
        this.userKey = userSetupInfo.userKey
        this.username = userSetupInfo.username
        updateAuthInfo(userSetupInfo.jwtString)
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
    fun setupUser(username: String?, passphrase: String?, promise: Promise) {
        try {
            if (username == null || passphrase == null) {
                val (username, passphrase) = loadStoredUserInfo()
                login(username, passphrase, promise)
            } else {
                 val userSetupInfo = createNewUserKey(username, passphrase)
                setupCylaModuleUserInfo(userSetupInfo)
                promise.resolve(userSetupInfo.userId)
            }

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
    fun fetchDaysByRange(iso8601dateFrom: String, iso8601dateTo: String, promise: Promise) {
        val userId = getAppStorage().getUserId()

        CompletableFuture.supplyAsync {
            val days = dayApi.value.getDayByUserAndRange(
                userId!!,
                LocalDate.parse(iso8601dateFrom),
                LocalDate.parse(iso8601dateTo)
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

    @ReactMethod
    fun login(username: String, passphrase: String, promise: Promise) {
        try{
            Log.v("Login", "attempting login")
            val authKey = getAuthKey(username, passphrase)
            val comparator = SecureCompare()
            val wsListener = LoginWebSocketListener(authKey, comparator, promise) {
                try {
                    val encryptedUserKey = Base64.decode(it.userKey, Base64.DEFAULT)
                    val userKey = decryptUserKey(encryptedUserKey, passphrase)
                    val passphraseInfo = encryptPassphrase(reactApplicationContext, passphrase)
                    getEncryptionStorage().edit()
                            .putUserEncryptedInfo(encryptedUserKey, authKey, passphraseInfo)
                            .apply()
                    getAppStorage().edit()
                            .putUserAppInfo(it.uuid, username)
                            .apply()

                    setupCylaModuleUserInfo(UserSetupInfo(it.uuid, username, it.jwt, userKey))
                    promise.resolve(it.uuid)
                } catch (e: Exception) {
                    promise.reject(e)

                }
            }
            apiClient.value.httpClient.newWebSocket(
                    Request.Builder().url("ws://localhost:5000/login/$username").build(),
                    wsListener)
        } catch (e: Exception) {
            Log.e("Login", e.message, e)
            promise.reject(e)
        }
    }

    private fun updateAuthInfo(jwtString : String) {
        val jwtAuth = apiClient.value.getAuthentication(JWT_AUTH_SCHEMA_NAME) as HttpBearerAuth
        jwtAuth.bearerToken = jwtString
    }
}
