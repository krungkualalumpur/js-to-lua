local a, b, c = 1, 2, 3
a *= 1
b *= c
c *= 1 --[[ ROBLOX DEVIATION: coerced from `true` to preserve JS behavior ]]
