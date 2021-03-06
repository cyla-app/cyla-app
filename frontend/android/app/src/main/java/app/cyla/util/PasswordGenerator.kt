package app.cyla.util

import java.util.*


object PasswordGenerator {
    const val allowedCharacters = "0123456789" +
            "abcdefghijklmnopqrstuvwxyz" +
            "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
            "!?_@#$%/&*()[]_=,./<>"

        fun generateRandomPassword() : String{
            val builder = StringBuilder()
            val lucky = Random()
            lucky.ints(6, 0, allowedCharacters.length).forEach{
                builder.append(allowedCharacters[it])
            }
            return String(builder)
        }
}