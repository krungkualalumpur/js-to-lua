local Packages --[[ ROBLOX comment: must define Packages module ]]
local LuauPolyfill = require(Packages.LuauPolyfill)
local Boolean = LuauPolyfill.Boolean
local falsy2 = nil
local truthy = {}
local foo = (function()
	if Boolean.toJSBoolean(falsy2) then
		return truthy
	else
		return falsy2
	end
end)()
