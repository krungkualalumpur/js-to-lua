local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
Array.filter(arr, table.unpack(args)) --[[ ROBLOX CHECK: check if 'arr' is an Array ]]
