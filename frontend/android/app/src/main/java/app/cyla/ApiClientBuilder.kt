package app.cyla

import android.content.Context
import android.net.ConnectivityManager
import android.util.Log
import app.cyla.invoker.ApiClient
import okhttp3.Cache
import okhttp3.OkHttpClient
import java.io.File
import java.io.IOException

class ApiClientBuilder(private val offlineCache: Boolean,private val context: Context, private val basePath: String?) {

    fun build(): ApiClient {
        val builder = OkHttpClient.Builder()

        if (this.offlineCache) {
            val offlineInterceptor = OfflineInterceptor(context)
            builder.cache(offlineInterceptor.getCache()).addInterceptor(offlineInterceptor)
        }

        val apiClient = ApiClient(builder.build())
        if (this.basePath !== null) {
            apiClient.basePath = this.basePath
        }
        return apiClient
    }
}

