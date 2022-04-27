type BaseClass = { method: (self: BaseClass) -> any, abstractMethod: (self: BaseClass) -> any }
local BaseClass = {}
BaseClass.__index = BaseClass
function BaseClass.new(): BaseClass
	local self = setmetatable({}, BaseClass)
	return (self :: any) :: BaseClass
end
function BaseClass:method() end
function BaseClass.staticMethod() end
function BaseClass:abstractMethod()
	error("not implemented abstract method")
end
type MyClass = { method: (self: MyClass) -> any, abstractMethod: (self: MyClass) -> any }
local MyClass = setmetatable({}, { __index = BaseClass })
MyClass.__index = MyClass
function MyClass.new(): MyClass
	local self = setmetatable({}, MyClass) --[[ ROBLOX TODO: super constructor may be used ]]
	return (self :: any) :: MyClass
end
function MyClass:method() end
function MyClass.staticMethod() end
function MyClass:abstractMethod() end
