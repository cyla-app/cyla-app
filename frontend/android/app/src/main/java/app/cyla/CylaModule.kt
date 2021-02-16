package app.cyla

import android.content.Context
import android.content.SharedPreferences
import app.cyla.api.DayApi
import app.cyla.api.UserApi
import app.cyla.util.*
import app.cyla.util.Themis.Companion.generateAuthKey
import app.cyla.util.Themis.Companion.createUserKey
import app.cyla.util.Themis.Companion.decryptUserKey
import app.cyla.invoker.auth.HttpBearerAuth
import com.facebook.react.bridge.*
import kotlinx.coroutines.*
import java.time.LocalDate
import java.util.concurrent.CompletableFuture

import app.cyla.api.StatsApi
import app.cyla.api.model.*
import app.cyla.auth.AndroidEnclave
import app.cyla.auth.SecureCompareLogin
import app.cyla.auth.UserInfo
import app.cyla.invoker.ApiException
import kotlinx.coroutines.Dispatchers
import java.net.URL

class CylaModule(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {
    companion object {
        private const val APP_PREFERENCES_NAME = "app_storage"
        private const val ENCRYPTION_PREFERENCES_NAME = "encryption_storage"
        private const val DAY_VERSION = 1

        // Value of the Schema name for jwt bearer auth as defined in the OpenAPI spec.
        private const val JWT_AUTH_SCHEMA_NAME = "bearerJWTAuth"
    }

    private lateinit var userInfo: UserInfo

    private val androidEnclave by lazy {
        AndroidEnclave(reactContext?.currentActivity as MainActivity)
    }

    private val dataApiClient = ApiClientBuilder(
        true,
        reactApplicationContext,
        getAppStorage().getString("apiBasePath", null)
    ).build()
    private val authApiClient = ApiClientBuilder(
        false,
        reactApplicationContext,
        getAppStorage().getString("apiBasePath", null)
    ).build()
    private val userApi = UserApi(authApiClient)
    private val dayApi = DayApi(dataApiClient)
    private val statsApi = StatsApi(dataApiClient)

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

    private suspend fun loadStoredUserInfo(): Triple<UserInfo, ByteArray, String> {
        val passphraseTuple = getEncryptionStorage().getPassphrase()
        val encryptedUserKey = getEncryptionStorage().getEncryptedUserKey()
        val userId = getAppStorage().getUserId()
        val username = getAppStorage().getUserName()

        if (passphraseTuple === null || encryptedUserKey === null || userId === null || username === null) {
            throw Exception("There is no data stored. Please login or create a new user!")
        }

        val (passphraseCipherText, passphraseIV) = passphraseTuple
        val passphrase = androidEnclave.decryptPassphrase(passphraseCipherText, passphraseIV)

        val userKey = decryptUserKey(encryptedUserKey, passphrase)

        return Triple(
            UserInfo(
                userId = userId,
                username = username,
                userKey = userKey,
                jwtToken = null
            ),
            encryptedUserKey,
            passphrase
        )
    }

    private fun createNewUserKey(username: String, passphrase: String): Triple<UserInfo, ByteArray, String> {
        val (userKey, encryptedUserKey) = createUserKey(passphrase)
        val authKey = generateAuthKey(passphrase)

        val user = User()
        user.id = null
        user.userKeyBackup = encryptedUserKey
        user.username = username
        user.authKey = authKey

        val userCreatedResponse = userApi.createUser(user)

        return Triple(
            UserInfo(
                userCreatedResponse.userId!!,
                username,
                userCreatedResponse.jwt,
                userKey,
            ),
            encryptedUserKey,
            passphrase
        )
    }

    private suspend fun setupUserInfo(
        userInfo: UserInfo,
        encryptedUserKey: ByteArray,
        passphrase: String,
    ) {
        val (encryptedPassphrase, iv) = androidEnclave.encryptPassphrase(passphrase)

        getEncryptionStorage().edit()
            .putEncryptedUserKey(encryptedUserKey)
            .apply()

        getAppStorage().edit()
            .putUserId(userInfo.userId)
            .putUserName(userInfo.username)
            .apply()

        getEncryptionStorage().edit()
            .putPassphrase(encryptedPassphrase, iv)
            .apply()

        this.userInfo = userInfo
        val jwtAuth = dataApiClient.getAuthentication(JWT_AUTH_SCHEMA_NAME) as HttpBearerAuth
        jwtAuth.bearerToken = userInfo.jwtToken
    }

    @ReactMethod
    fun setApiBaseUrl(apiBaseUrl: String, promise: Promise) {
        authApiClient.basePath = apiBaseUrl
        dataApiClient.basePath = apiBaseUrl
        getAppStorage().edit().putString("apiBasePath", apiBaseUrl).apply()
        promise.resolve(null)
    }
    
    @ReactMethod
    fun getUserId(promise: Promise) {
        val userId = getAppStorage().getUserId()
        if (userId == null) {
            promise.reject(Exception("User id is null"))
            return
        }
        promise.resolve(userId)
    }

    @ReactMethod
    fun loadUser(promise: Promise) {
        GlobalScope.launch(Dispatchers.Main.immediate) {
            try {
                val (userInfo, encryptedUserKey, passphrase) = loadStoredUserInfo()
                setupUserInfo(userInfo, encryptedUserKey, passphrase)
                promise.resolve(userInfo.userId)
            } catch (e: Throwable) {
                promise.reject(e)
            }
        }
    }

    @ReactMethod
    fun setupUserAndSession(promise: Promise) {
        GlobalScope.launch(Dispatchers.Main.immediate) {
            try {
                val (userInfo, _, passphrase) = loadStoredUserInfo()
                val successAuthInfo = login(userInfo.username, passphrase)
                promise.resolve(successAuthInfo.uuid)
            } catch (e: Throwable) {
                promise.reject(e)
            }
        }
    }

    @ReactMethod
    fun setupUserNew(username: String, passphrase: String, promise: Promise) {
        GlobalScope.launch(Dispatchers.IO) {
            try {
                val (userInfo, encryptedUserKey, _) = createNewUserKey(username, passphrase)
                withContext(Dispatchers.Main.immediate) {
                    setupUserInfo(userInfo, encryptedUserKey, passphrase)
                    promise.resolve(userInfo.userId)
                }
            } catch (e: Throwable) {
                resetEncryptionStorage()
                promise.reject(e)
            }
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
                userInfo.userKey,
                Base64.base64Decode(dayBase64),
                iso8601date
            )

            val day = Day()
            day.date = LocalDate.parse(iso8601date)
            day.version = DAY_VERSION
            day.dayInfo = encryptedDayInfo
            day.dayKey = encryptedDayKey

            // FIXME: Return better value to not give information
            val decodedPeriodStats = Base64.base64Decode(periodStats)
            val encryptedPeriodStats =
                if (decodedPeriodStats.isEmpty()) ByteArray(0) else Themis.encryptData(
                    userInfo.userKey,
                    decodedPeriodStats
                )

            val statistics = Statistic()
            statistics.prevHashValue = prevHashValue
            statistics.value = encryptedPeriodStats

            val stats = UserStats()
            stats.periodStats = statistics

            val statsUpdate = DayStatsUpdate()
            statsUpdate.day = day
            statsUpdate.userStats = stats

            dayApi.modifyDayEntryWithStats(
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
            val userStats = statsApi.getStats(
                getAppStorage().getUserId()!!
            )
            val periodStats = userStats.periodStats
            val encryptedStats = periodStats?.value

            if (periodStats != null && encryptedStats != null) {
                val decryptedStats = Themis.decryptData(userInfo.userKey, encryptedStats)

                val result = Arguments.createArray()
                result.pushString(Base64.base64Encode(decryptedStats))
                result.pushString(periodStats.hashValue)
                promise.resolve(result)
            } else if (periodStats != null && encryptedStats == null) {
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
            val days = dayApi.getDayByUserAndRange(
                userId!!,
                LocalDate.parse(iso8601dateFrom),
                LocalDate.parse(iso8601dateTo)
            )

            val base64Days = Arguments.createArray()
            for (day in days) {
                if (day.version != DAY_VERSION) {
                    throw Exception("Version ${day.version} of day is not supported")
                }

                val plaintextDay = Themis.decryptDayInfo(userInfo.userKey, day)
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

    private suspend fun login(username: String, passphrase: String): SecureCompareLogin.SuccessAuthInfo {
        val authKey = generateAuthKey(passphrase)
        val url = URL(authApiClient.basePath)

        val successAuthInfo = withContext(Dispatchers.IO) {
            SecureCompareLogin().login(username, authKey, url)
        }
        val encryptedUserKey = Base64.base64Decode(successAuthInfo.userKey)
        val userKey = decryptUserKey(encryptedUserKey, passphrase)

        setupUserInfo(
            UserInfo(
                successAuthInfo.uuid,
                username,
                successAuthInfo.jwt,
                userKey,
            ), encryptedUserKey,
            passphrase
        )
        return successAuthInfo
    }

    @ReactMethod
    fun login(username: String, passphrase: String, promise: Promise) {
        GlobalScope.launch(Dispatchers.Main.immediate) {
            try {
                val successAuthInfo = login(username, passphrase)
                promise.resolve(successAuthInfo.uuid)
            } catch (e: Throwable) {
                promise.reject(e)
            }
        }
    }
}
