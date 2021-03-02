---
--- Generated by Luanalysis
--- Created by Besitzer.
--- DateTime: 02.03.2021 09:47
---
local savedAuthKey = redis.call('HGET', KEYS[1], ARGV[1])
--- KEYS[2] must be the old auth key
if savedAuthKey ~= KEYS[2] then
    return redis.error_reply("User or auth key incorrect")
else
    redis.call('HSET', KEYS[1], unpack(ARGV, 2, #ARGV))
    return 1
end
