package app.cyla

import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import androidx.fragment.app.FragmentActivity
import app.cyla.api.DayApi
import app.cyla.api.UserApi
import app.cyla.util.*
import app.cyla.auth.AndroidEnclave.Companion.decryptPassphrase
import app.cyla.auth.AndroidEnclave.Companion.encryptPassphrase
import app.cyla.util.Themis.Companion.getAuthKey
import app.cyla.util.Themis.Companion.createUserKey
import app.cyla.util.Themis.Companion.decryptUserKey
import app.cyla.invoker.auth.HttpBearerAuth
import com.cossacklabs.themis.SecureCompare
import com.cossacklabs.themis.SymmetricKey
import com.facebook.react.bridge.*
import okhttp3.CacheControl
import okhttp3.Request
import java.time.LocalDate
import java.util.concurrent.CompletableFuture

import app.cyla.api.StatsApi
import app.cyla.api.model.*
import app.cyla.auth.LoginWebSocketListener
import app.cyla.invoker.ApiException
import java.net.URL

class CylaModule(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        private const val APP_PREFERENCES_NAME = "app_storage"
        private const val ENCRYPTION_PREFERENCES_NAME = "encryption_storage"

        // Value of the Schema name for jwt bearer auth as defined in the OpenAPI spec.
        private const val JWT_AUTH_SCHEMA_NAME = "bearerJWTAuth"
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
        ApiClientBuilder(
            true,
            reactApplicationContext,
            getAppStorage().getString("apiBasePath", null)
        ).build()
    }

    private val userApi = lazy {
        UserApi(
            ApiClientBuilder(
                false,
                reactApplicationContext,
                getAppStorage().getString("apiBasePath", null)
            ).build()
        )
    }

    private val dayApi = lazy {
        DayApi(apiClient.value)
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

    private fun resetAppStorage() {
        getAppStorage().edit().clear().apply()
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
        val passphraseInfo = encryptPassphrase(reactApplicationContext.currentActivity as FragmentActivity, passphrase)
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

    private fun updateAuthInfo(jwtString: String?) {
        //HttpBearer ignores the header if it is null
        val jwtAuth = apiClient.value.getAuthentication(JWT_AUTH_SCHEMA_NAME) as HttpBearerAuth
        jwtAuth.bearerToken = jwtString
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
    fun saveDay(iso8601date: String, dayBase64: String, periodStats: String, prevHashValue: String?, promise: Promise) {
        CompletableFuture.supplyAsync {
            val (encryptedDayInfo, encryptedDayKey) = Themis.encryptDayInfo(
                userKey,
                Base64.base64Decode(dayBase64),
                iso8601date
            )
            
            val day = Day()
            day.date = LocalDate.parse(iso8601date)
            day.version = 1
            day.dayInfo = encryptedDayInfo
            day.dayKey = encryptedDayKey

            // FIXME: Return better value to not give information
            val decodedPeriodStats = Base64.base64Decode(periodStats)
            val encryptedPeriodStats = 
                if (decodedPeriodStats.isEmpty()) ByteArray(0) else Themis.encryptData(userKey, decodedPeriodStats)
            
            
            val statistics = Statistic()
            statistics.prevHashValue = prevHashValue
            statistics.value = encryptedPeriodStats

            val stats = UserStats()
            stats.periodStats = statistics

            val statsUpdate = DayStatsUpdate()
            statsUpdate.day = day
            statsUpdate.userStats = stats

            dayApi.value.modifyDayEntryWithStats(
                getAppStorage().getUserId()!!,
                statsUpdate
            )
            promise.resolve(null)
        }.exceptionally { throwable ->
            promise.reject(throwable)
        }
    }

    @ReactMethod
    fun fetchPeriodStats(promise: Promise) {
        CompletableFuture.supplyAsync {
            val userStats = statsApi.value.getStats(
                getAppStorage().getUserId()!!
            )
            val periodStats = userStats.periodStats
            val encryptedStats = periodStats?.value

            if (periodStats != null && encryptedStats != null) {
                val decryptedStats = Themis.decryptData(userKey, encryptedStats)
                
                val result = Arguments.createArray()
                result.pushString(Base64.base64Encode(decryptedStats))
                result.pushString(periodStats.hashValue)
                promise.resolve(result)
            } else if (periodStats != null) {
                // FIXME: stats exist but encryptedStats is null? why does this case exist?
                val result = Arguments.createArray()
                result.pushString(Base64.base64Encode(ByteArray(0)))
                result.pushString(periodStats.hashValue)
                promise.resolve(result)
            }
        }.exceptionally { throwable ->
            val cause = throwable.cause
            if (cause is ApiException && cause.code == 404) {
                promise.resolve(null)
            } else {
                promise.reject(throwable)
            }
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

            val base64Days = Arguments.createArray()
            for (day in days) {
                val plaintextDay = Themis.decryptDayInfo(userKey, day)
                base64Days.pushString(Base64.base64Encode(plaintextDay))
            }
            promise.resolve(base64Days)
        }.exceptionally { throwable ->
            promise.reject(throwable)
        }
    }

    @ReactMethod
    fun logout(promise: Promise) {
        resetEncryptionStorage()
        resetAppStorage()
        if (!reactApplicationContext.cacheDir.deleteRecursively()) {
            promise.reject(Exception("Failed to delete complete cache"))
        } else {
            promise.resolve(null)
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
                    val encryptedUserKey = Base64.base64Decode(it.userKey)
                    val userKey = decryptUserKey(encryptedUserKey, passphrase)
                    val passphraseInfo = encryptPassphrase(reactApplicationContext.currentActivity!! as FragmentActivity, passphrase)
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
            val url = URL(apiClient.value.basePath)
            val host = url.host
            val protocol = if (url.protocol === "https") "wss" else "ws" 
            apiClient.value.httpClient.newWebSocket(
                Request.Builder()
                    .cacheControl(CacheControl.Builder().noCache().build())
                    .url("$protocol://$host/login/$username") // FIXME use wss
                    .build(),
                wsListener
            )
        } catch (e: Exception) {
            Log.e("Login", e.message, e)
            promise.reject(e)
        }
    }
}
