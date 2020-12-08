package app.cyla.decryption

import android.widget.Toast
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod


class DecryptionModule(reactContext: ReactApplicationContext?) : ReactContextBaseJavaModule(reactContext) {
    override fun getName(): String {
        return "DecryptionModule"
    }
    
    @ReactMethod
    fun fetchUserBlob(userId: String, promise: Promise) {
        Toast.makeText(reactApplicationContext.baseContext, userId, Toast.LENGTH_LONG).show()
        promise.resolve(userId);
    }
}
