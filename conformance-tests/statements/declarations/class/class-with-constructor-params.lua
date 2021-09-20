type BaseClass = { publicConstructorParam: any } --[[ ROBLOX TODO: replace 'any' type/ add missing ]]
local BaseClass = {}
BaseClass.__index = BaseClass
function BaseClass.new(notAssignedParam, publicConstructorParam, privateConstructorParam)
	local self = setmetatable({}, BaseClass)
	self.publicConstructorParam = publicConstructorParam
	self.privateConstructorParam = privateConstructorParam
	return self
end
type MyClass = { publicConstructorParam: any } --[[ ROBLOX TODO: replace 'any' type/ add missing ]]
local MyClass = setmetatable({}, { __index = BaseClass })
MyClass.__index = MyClass
function MyClass.new(notAssignedParam, publicConstructorParam, privateConstructorParam)
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	self.publicConstructorParam = publicConstructorParam
	self.privateConstructorParam = privateConstructorParam
	return self
end
