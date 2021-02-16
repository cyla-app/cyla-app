package app.cyla.auth

import com.cossacklabs.themis.SecureCompare
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okhttp3.*
import okio.ByteString
import java.net.URL
import kotlin.coroutines.Continuation
import kotlin.coroutines.resume
import kotlin.coroutines.resumeWithException
import kotlin.coroutines.suspendCoroutine

class SecureCompareLogin {
    data class SuccessAuthInfo(
        val jwt: String,
        val uuid: String,
        val userKey: String
    )

    private class LoginWebSocketListener(
        private val authKey: ByteArray,
        private val cont: Continuation<SuccessAuthInfo>
    ) : WebSocketListener() {

        companion object {
            const val CLOSE_NORMAL = 1000
            const val CLOSE_PROTOCOL_ERROR = 1002
            const val CLOSE_GOING_AWAY = 1001
        }

        private val comparator = SecureCompare(authKey)

        override fun onOpen(ws: WebSocket, response: Response) {
            val initMessage = comparator.begin()
            ws.send(ByteString.of(initMessage, 0, initMessage.size))
        }

        override fun onMessage(ws: WebSocket, bytes: ByteString) {
            when (comparator.result) {
                SecureCompare.CompareResult.NOT_READY -> {
                    val nextMessage = comparator.proceed(bytes.toByteArray())
                    if (nextMessage != null) {
                        ws.send(ByteString.of(nextMessage, 0, nextMessage.size))
                    } else {
                        return
                    }
                }
                SecureCompare.CompareResult.MATCH -> {
                    ws.close(CLOSE_NORMAL, "Comparison ended successfully")
                    val successData = decodeSuccessMessage(bytes)
                    cont.resume(successData)
                }
                else -> {
                    ws.close(CLOSE_PROTOCOL_ERROR, "Comparison finished")
                }
            }
        }

        override fun onClosing(ws: WebSocket, code: Int, reason: String) {
            if (code != CLOSE_NORMAL) {
                cont.resumeWithException(Exception("Comparison was unsuccessful"))
            }
        }

        override fun onFailure(ws: WebSocket, t: Throwable, response: Response?) {
            ws.close(CLOSE_GOING_AWAY, "Client Error")
        }

        private fun decodeSuccessMessage(bytes: ByteString): SuccessAuthInfo {
            val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()
            val adapter: JsonAdapter<SuccessAuthInfo> = moshi.adapter(SuccessAuthInfo::class.java)
            return adapter.fromJson(bytes.utf8())!!
        }
    }

    suspend fun login(username: String, authKey: ByteArray, url: URL): SuccessAuthInfo {
        val host = url.host
        val protocol = if (url.protocol == "https") "wss" else "ws"
        val port = if (url.port == -1) (if (url.protocol == "https") 443 else 80) else url.port

        return suspendCoroutine { cont: Continuation<SuccessAuthInfo> ->
            val wsListener = LoginWebSocketListener(authKey, cont)
            OkHttpClient.Builder().build().newWebSocket(
                Request.Builder()
                    .cacheControl(CacheControl.Builder().noCache().build())
                    .url("$protocol://${host}:$port/login/$username")
                    .build(),
                wsListener
            )
        }
    }
}
