---
--- Script to update a user's information on the db. Fails with return 0 if the user doesn't exist.
--- KEYS:
---     [1]: Key to the users entry on the db. E.g.: user:<userId>
--- ARGV:
---     [1:-1]: Fields and values for the new user. Order doens't matter, but they should be in corresponding pairs
---             (e.g. "backupInfo"-field-name followed by "bacupInfo"-field-value and so on)
---
---

local isUserExist = redis.call('EXISTS', KEYS[1])
if isUserExist == 0 then
    return 0
else
    --- HSET only returns non-zero if the fields are new...
    redis.call('HSET', KEYS[1], unpack(ARGV, 1, #ARGV))
    return 1
end
