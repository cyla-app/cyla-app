package app.cyla

import android.util.Log
import com.cossacklabs.themis.SecureCompare
import okhttp3.Response
import okhttp3.WebSocket
import okhttp3.WebSocketListener
import okio.ByteString
import java.util.concurrent.locks.Condition
import java.util.concurrent.locks.ReentrantLock
import kotlin.concurrent.withLock

class LoginWebSocketListener(private val hashedKey: ByteArray,
                             private var comparator: SecureCompare,
                             private val authLock: ReentrantLock,
                             private val authCondition: Condition) : WebSocketListener() {


    var token: String = "token"

    override fun onOpen(ws: WebSocket, response: Response) {
        comparator = SecureCompare(hashedKey)
        Log.v("Login", "Starting auth")
        val initMessage = comparator.begin()
        ws.send(ByteString.of(initMessage,0, initMessage.size))
    }

    override fun onMessage(ws: WebSocket, bytes: ByteString) {
        authLock.withLock {
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
                    token = bytes.base64()
                    ws.close(1000, "Comparison ended successfully")
                    authCondition.signal()
                }
                else -> {
                    Log.v("Login", "Comparison unsuccessful")
                    token = bytes.base64()
                    ws.close(1000, "Comparison finished")
                    authCondition.signal()
                }
            }
        }
    }

    override fun onClosing(ws: WebSocket, code: Int, reason: String) {
        Log.v("Login", "Closing websocket")
        ws.close(code, reason)
    }

    override fun onFailure(ws: WebSocket, t: Throwable, response: Response?) {
        Log.v("Login", "Failure on websocket listener", t)
        ws.close(1006, "Client Error")
        if(authLock.isHeldByCurrentThread) {
            authCondition.signal()
            authLock.unlock()
        }
    }


}