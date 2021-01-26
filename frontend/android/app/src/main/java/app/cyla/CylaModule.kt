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
import okhttp3.Cache
import okhttp3.CacheControl
import okhttp3.OkHttpClient
import okhttp3.Request
import java.io.File
import java.io.IOException
import java.time.LocalDate
import java.util.concurrent.CompletableFuture

// Value of the Schema name for jwt bearer auth as defined in the OpenAPI spec.
private const val JWT_AUTH_SCHEMA_NAME = "bearerJWTAuth"

class CylaModule(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        private const val MEGABYTE = 1000000
        private const val APP_PREFERENCES_NAME = "app_storage"
        private const val ENCRYPTION_PREFERENCES_NAME = "encryption_storage"
    }

    data class UserSetupInfo(
        val userId: String,
        val username: String,
        val jwtString: String?,
        val userKey: SymmetricKey
    )

    private lateinit var userKey: SymmetricKey
    private lateinit var username: String
    private val apiClient = lazy {
        val httpCacheDirectory = File(reactApplicationContext.cacheDir, "responses")

        var cache: Cache? = null
        try {
            cache = Cache(httpCacheDirectory, 10L * MEGABYTE)
        } catch (e: IOException) {
            Log.e("OKHttp", "Could not create http cache", e)
        }

        val builder = OkHttpClient.Builder()
        builder.cache(cache)

        val apiClient = ApiClient(builder.build())
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

    private fun loadStoredUserInfo(): Pair<UserSetupInfo, String> {
        val (passphraseCipherText, passphraseIV) = getEncryptionStorage().getPassphrase()!!
        val passphrase = decryptPassphrase(passphraseCipherText, passphraseIV)
        val encryptedUserKey = getEncryptionStorage().getEncryptedUserKey()!!
        val userKey = decryptUserKey(encryptedUserKey, passphrase)

        return Pair(UserSetupInfo(
                userId = getAppStorage().getUserId()?: throw Exception("userId not in app storage"),
                username = getAppStorage().getUserName()?: throw Exception("username not in app storage"),
                userKey = userKey,
                jwtString = null), passphrase)
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
            .putUserEncryptedInfo(encryptedUserKey, authKey, passphraseInfo)
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
    fun loadUser(promise: Promise) {
        val setupInfo = loadStoredUserInfo().first
        setupCylaModuleUserInfo(setupInfo)
        promise.resolve(setupInfo.userId)

    }
    @ReactMethod
    fun setupUserAndSession(promise: Promise) {
            val (setupInfo, passphrase) = loadStoredUserInfo()
            login(setupInfo.username, passphrase, promise)
    }

    @ReactMethod
    fun setupUserNew(username: String, passphrase: String, promise: Promise) {
        try {
            val userSetupInfo = createNewUserKey(username, passphrase)
            setupCylaModuleUserInfo(userSetupInfo)
            promise.resolve(userSetupInfo.userId)

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
        try {
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
                    //TODO: Move out setupCylaModuleUserInfo
                    setupCylaModuleUserInfo(UserSetupInfo(it.uuid, username, it.jwt, userKey))
                    promise.resolve(it.uuid)
                } catch (e: Exception) {
                    promise.reject(e)
                }
            }
            apiClient.value.httpClient.newWebSocket(
                Request.Builder()
                    .cacheControl(CacheControl.Builder().noCache().build())
                    .url("ws://localhost:5000/login/$username")
                    .build(),
                wsListener
            )
        } catch (e: Exception) {
            Log.e("Login", e.message, e)
            promise.reject(e)
        }
    }

    private fun updateAuthInfo(jwtString: String?) {
        //HttpBearer ignores the header if it is null
        val jwtAuth = apiClient.value.getAuthentication(JWT_AUTH_SCHEMA_NAME) as HttpBearerAuth
        jwtAuth.bearerToken = jwtString
    }
}
