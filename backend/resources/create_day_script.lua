---
--- Script to add a day entry to the database, only if it doesn't exit.
--- If the day isn't already present, then it is added to both the Hash for that day and to the set for keeping tabs
--- on users days.
--- KEYS:
---     [1]: Key to the users information. E.g. : user:<userId>
---     [2]: Key to the Sorted set of days for that user. E.g. : user:<userId>:day
---     [3]: Key to the Hash for the user's day. E.g. : user:<userId>:day:<date>
--- ARGV:
---     [1]: date
---     [2:-1]: Remaining values are the fields for day. The order doens't matter, but they should come in pairs
---             (e.g. first "date"-field name, then "date"-value, then "dayInfo"-field name and so on.)
--- Return:
---     0 if the entry already exists or the user doesn't exist
---     number of fields added, otherwise
---

--- Refactor into a single EXISTS call
local isUserExist = redis.call('EXISTS', KEYS[1])
local isDayPresent = redis.call('EXISTS', KEYS[3]);
if isDayPresent == 1 or isUserExist == 0 then
    return 0
else
    redis.call('ZADD', KEYS[2], 0, ARGV[1]);
    return redis.call('HSET', KEYS[3], unpack(ARGV, 2, #ARGV))
end
