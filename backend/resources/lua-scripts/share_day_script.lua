---
--- Script to add a shared day to the database.
--- It checks for the existence of the day make sure only existing days can be shared.
--- This script DOESN'T check for existence of the day's user.
---
---
local isDayExist = redis.call("ZRANK", KEYS[1], ARGV[2]);
if not isDayExist then
    return redis.error_reply("Day doesn't exist")
else
    redis.call("ZADD", KEYS[2], 0, ARGV[2]);
    redis.call("EXPIREAT", KEYS[2], ARGV[1])

    redis.call("HSET", KEYS[3], unpack(ARGV, 3, #ARGV))
    redis.call("EXPIREAT", KEYS[3], ARGV[1])
    return 1
end
