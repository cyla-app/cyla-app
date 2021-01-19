package app.cyla

import android.util.Log
import com.cossacklabs.themis.SecureCompare
import com.facebook.react.bridge.Promise
import com.squareup.moshi.JsonAdapter
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import okio.ByteString
import java.lang.Exception

data class SuccAuthInfo(
        val jwt: String,
        val uuid: String,
        val userKey: String
)

class LoginWebSocketListener(private val hashedKey: ByteArray,
                             private var comparator: SecureCompare,
                             private val promise: Promise,
                             val onSuccAuth: (SuccAuthInfo) -> Unit) : WebSocketListener() {

    override fun onOpen(ws: WebSocket, response: Response) {
        comparator = SecureCompare(hashedKey)
        Log.v("Login", "Starting auth")
        val initMessage = comparator.begin()
        ws.send(ByteString.of(initMessage,0, initMessage.size))
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
                Log.v("Login", "Comparison successful")
                ws.close(1000, "Comparison ended successfully")
                val succData = decodeSuccMsg(bytes)
                onSuccAuth(succData)
            }
            else -> {
                Log.v("Login", "Comparison unsuccessful")
                ws.close(1000, "Comparison finished")
                promise.reject(Exception("Comparison was unsuccessful"))
            }
        }
    }

    override fun onClosing(ws: WebSocket, code: Int, reason: String) {
        Log.v("Login", "Closing websocket")
        Log.v("Login", "Reason: $reason")
        ws.close(code, reason)
        promise.reject(Exception("Unexpected closing due to $reason"))
    }

    override fun onFailure(ws: WebSocket, t: Throwable, response: Response?) {
        Log.v("Login", "Failure on websocket listener", t)
        ws.close(1001, "Client Error")
        promise.reject(t)
    }

    private fun decodeSuccMsg(bytes: ByteString) : SuccAuthInfo {
        val moshi = Moshi.Builder().add(KotlinJsonAdapterFactory()).build()
        val adapter : JsonAdapter<SuccAuthInfo>  = moshi.adapter(SuccAuthInfo::class.java)
        return adapter.fromJson(bytes.utf8())!!
    }


}