---
--- Generated by Luanalysis
--- Created by Besitzer.
--- DateTime: 19.02.2021 13:33
---
local shares = redis.call("SMEMBERS", KEYS[1])
local allShares = {}
for _, shareId in ipairs(shares) do
    table.insert(allShares, redis.call("HGETALL", KEYS[2] .. ":" .. shareId))
end
return allShares
