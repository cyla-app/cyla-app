package app.cyla.util

import android.content.Context
import app.cyla.invoker.ApiClient
import okhttp3.OkHttpClient

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

