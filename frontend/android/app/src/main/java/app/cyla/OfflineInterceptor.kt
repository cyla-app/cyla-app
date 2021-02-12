package app.cyla

import android.content.Context
import android.net.ConnectivityManager
import android.util.Log
import okhttp3.Cache
import okhttp3.Interceptor
import okhttp3.Response
import java.io.File
import java.io.IOException

class OfflineInterceptor(private val context: Context) : Interceptor {
    companion object {
        private const val MEGABYTE = 1000000
    }

    private fun isNetworkAvailable(): Boolean {
        val cm = this.context.getSystemService(Context.CONNECTIVITY_SERVICE) as ConnectivityManager
        val activeNetwork = cm.activeNetworkInfo
        return activeNetwork != null &&
                activeNetwork.isConnectedOrConnecting
    }

    override fun intercept(chain: Interceptor.Chain): Response {
        var request = chain.request();
        request = if (isNetworkAvailable()) {
            request.newBuilder()
                .header("Cache-Control", "public, max-age=0").build();
        } else {
            request.newBuilder()
                .header("Cache-Control", "public, only-if-cached, max-stale=" + 60 * 60 * 24 * 7).build();
        }
        return chain.proceed(request)
    }

    fun getCache(): Cache {
        val httpCacheDirectory = File(this.context.cacheDir, "responses")
        return Cache(httpCacheDirectory, 10L * MEGABYTE)
    }
}
