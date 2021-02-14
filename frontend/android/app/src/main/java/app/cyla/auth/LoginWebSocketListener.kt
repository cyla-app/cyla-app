package app.cyla.auth

import com.cossacklabs.themis.SecureCompare
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import okio.ByteString

data class SuccessAuthInfo(
    val jwt: String,
    val uuid: String,
    val userKey: String
)

class LoginWebSocketListener(
    private val authKey: ByteArray,
    private val onFailure: (String) -> Unit,
    private val onSuccess: (SuccessAuthInfo) -> Unit
) : WebSocketListener() {

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
                ws.close(1000, "Comparison ended successfully")
                val successData = decodeSuccessMessage(bytes)
                onSuccess(successData)
            }
            else -> {
                ws.close(1000, "Comparison finished")
                onFailure("Comparison was unsuccessful")
            }
        }
    }

    override fun onClosing(ws: WebSocket, code: Int, reason: String) {
        ws.close(code, reason)
        //onFailure("Unexpected closing due to $code: $reason") FIXME: this also happens during success?
    }

    override fun onFailure(ws: WebSocket, t: Throwable, response: Response?) {
        ws.close(1001, "Client Error")
        onFailure(t.message ?: "Unknown error")
    }

    private fun decodeSuccessMessage(bytes: ByteString): SuccessAuthInfo {
        val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()
        val adapter: JsonAdapter<SuccessAuthInfo> = moshi.adapter(SuccessAuthInfo::class.java)
        return adapter.fromJson(bytes.utf8())!!
    }
}
