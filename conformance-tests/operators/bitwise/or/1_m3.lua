local a = 5
local b = 2

bit32.bor(a, b) --[[ ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1] ]]
