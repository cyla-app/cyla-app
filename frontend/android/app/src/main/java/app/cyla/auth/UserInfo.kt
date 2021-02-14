package app.cyla.auth

import com.cossacklabs.themis.SymmetricKey

data class UserInfo(
    val userId: String,
    val username: String,
    val jwtToken: String?,
    val userKey: SymmetricKey
)
