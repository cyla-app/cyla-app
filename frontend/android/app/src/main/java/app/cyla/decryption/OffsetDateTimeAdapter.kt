package app.cyla.decryption

import com.squareup.moshi.*
import java.io.IOException
import java.time.OffsetDateTime
import java.time.format.DateTimeFormatter

class OffsetDateTimeAdapter : JsonAdapter<OffsetDateTime?>() {
    @Throws(IOException::class)
    @FromJson
    override fun fromJson(reader: JsonReader): OffsetDateTime? {
        if (reader.peek() === JsonReader.Token.NULL) {
            return reader.nextNull()
        }
        val string: String = reader.nextString()
        return OffsetDateTime.parse(string)
    }

    @Throws(IOException::class)
    @ToJson
    override fun toJson(writer: JsonWriter, value: OffsetDateTime?) {
        if (value == null) {
            writer.nullValue()
        } else {
            writer.value(value.format(DateTimeFormatter.ISO_DATE))
        }
    }
}
