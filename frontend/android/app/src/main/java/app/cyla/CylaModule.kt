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

import android.net.ConnectivityManager
import app.cyla.api.StatsApi
import app.cyla.api.model.DayStatsUpdate
import app.cyla.api.model.Stats


// Value of the Schema name for jwt bearer auth as defined in the OpenAPI spec.
private const val JWT_AUTH_SCHEMA_NAME = "bearerJWTAuth"

class CylaModule(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        private const val MEGABYTE = 1000000
        private const val APP_PREFERENCES_NAME = "app_storage"
        private const val ENCRYPTION_PREFERENCES_NAME = "encryption_storage"

    }

    private fun isNetworkAvailable(): Boolean {
        val cm = reactApplicationContext.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val activeNetwork = cm.activeNetworkInfo
        return activeNetwork != null &&
                activeNetwork.isConnectedOrConnecting
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
            .cache(cache)
            .addInterceptor {
                var request = it.request();
                request = if (isNetworkAvailable()) {
                    request.newBuilder()
                        .header("Cache-Control", "public, max-age=0").build();
                } else {
                    request.newBuilder()
                        .header("Cache-Control", "public, only-if-cached, max-stale=" + 60 * 60 * 24 * 7).build();
                }
                it.proceed(request)
            }

        val apiClient = ApiClient(builder.build())
        apiClient.basePath = getAppStorage().getString("apiBasePath", apiClient.basePath)
        apiClient
    }

    private val dayApi = lazy {
        DayApi(apiClient.value)
    }

    private val userApi = lazy {
        val apiClient = ApiClient(OkHttpClient.Builder().build())
        apiClient.basePath = getAppStorage().getString("apiBasePath", apiClient.basePath)
        UserApi(apiClient)
    }

    private val statsApi = lazy {
        StatsApi(apiClient.value)
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

        return Pair(
            UserSetupInfo(
                userId = getAppStorage().getUserId() ?: throw Exception("userId not in app storage"),
                username = getAppStorage().getUserName() ?: throw Exception("username not in app storage"),
                userKey = userKey,
                jwtString = null
            ), passphrase
        )
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
    fun saveDay(iso8601date: String, dayJson: String, periods: String, promise: Promise) {
        CompletableFuture.supplyAsync {
            val charArray = periods.toCharArray()
            val byteArray = ByteArray(charArray.size) {
                charArray[it].toByte()
            }
 
            val day = Day()
            day.date = LocalDate.parse(iso8601date)
            day.version = 0

            val (encryptedDayInfo, encryptedDayKey) = ThemisOperations.encryptDayInfo(userKey, dayJson, iso8601date)
            day.dayInfo = encryptedDayInfo
            day.dayKey = encryptedDayKey

            val stats = Stats()

            // FIXME: Return better value to not give information
            stats.periodLengthStructure = if (byteArray.isEmpty()) ByteArray(0) else ThemisOperations.encryptData(userKey, byteArray)
            val statsUpdate = DayStatsUpdate()
            statsUpdate.day = day
            statsUpdate.stats = stats

            dayApi.value.modifyDayEntryWithStats(
                getAppStorage().getUserId()!!,
                statsUpdate
            )
            promise.resolve(null)
        }.exceptionally { throwable ->
            promise.reject(throwable)
        }
    }

    fun fetchPeriodStats(iso8601date: String, promise: Promise) {
        CompletableFuture.supplyAsync {
            
            val byteArray = statsApi.value.getStats(
                getAppStorage().getUserId()!!
            ).periodLengthStructure

            if (byteArray != null) {
                val newCharArray = IntArray(byteArray.size) {
                    byteArray[it].toInt().and(0xFF)
                }
                val newString = String(newCharArray, 0, newCharArray.size)

                promise.resolve(newString)
            }
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
                val json = ThemisOperations.decryptDayInfo(userKey, plainTextDay)
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
