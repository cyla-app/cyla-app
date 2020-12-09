---
--- Script to update information on the db. Fails with return 0 if the resource doesn't exist.
--- KEYS:
---     [1]: Key to the entry on the db. E.g.: user:<userId> or user:<userId>:days:<date>
--- ARGV:
---     [1:-1]: Fields and values for the updated entry. Order doens't matter, but they should be in corresponding pairs
---             (e.g. "backupInfo"-field-name followed by "backupInfo"-field-value and so on)
---
---

local isExist = redis.call('EXISTS', KEYS[1])
if isExist == 0 then
    return 0
else
    --- HSET only returns non-zero if the fields are new...
    redis.call('HSET', KEYS[1], unpack(ARGV, 1, #ARGV))
    return 1
end
