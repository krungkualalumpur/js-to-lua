local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Array = LuauPolyfill.Array
Array.concat(arr, { 1, 2, 3 }) --[[ ROBLOX CHECK: check if 'arr' is an Array ]]
