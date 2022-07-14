type MockModule = {
	spyOn: (
		self: MockModule,
		object: T,
		methodName: M,
		accessType: "get"
	) -> SpyInstance<any --[[ ROBLOX FIXME: Luau types cannot be used for indexing. ]] --[[ Upstream: T[M] ]], {}>,
	spyOn: (
		self: MockModule,
		object: T,
		methodName: M,
		accessType: "set"
	) -> SpyInstance<(), Array<any --[[ ROBLOX FIXME: Luau types cannot be used for indexing. ]] --[[ Upstream: T[M] ]]>>,
	spyOn: (self: MockModule, object: T, methodName: M) -> any, -- eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types --[[ ROBLOX TODO: Unhandled node for type: TSConditionalType ]] --[[ T[M] extends (...args: Array<any>) => any ? SpyInstance<ReturnType<T[M]>, Parameters<T[M]>> : never ]]
	spyOn: (self: MockModule, object: T, methodName: M, accessType: ("get" | "set")?) -> any,
}
local MockModule = {}
MockModule.__index = MockModule
function MockModule.new(): MockModule
	local self = setmetatable({}, MockModule)
	return (self :: any) :: MockModule
end
function MockModule:spyOn(
	object: T,
	methodName: M,
	accessType: "get"
): SpyInstance<any --[[ ROBLOX FIXME: Luau types cannot be used for indexing. ]] --[[ Upstream: T[M] ]], {}>
	error("not implemented method")
end
function MockModule:spyOn(
	object: T,
	methodName: M,
	accessType: "set"
): SpyInstance<(), Array<any --[[ ROBLOX FIXME: Luau types cannot be used for indexing. ]] --[[ Upstream: T[M] ]]>>
	error("not implemented method")
end
function MockModule:spyOn(
	object: T,
	methodName: M
): any --[[ ROBLOX TODO: Unhandled node for type: TSConditionalType ]] --[[ T[M] extends (...args: Array<any>) => any ? SpyInstance<ReturnType<T[M]>, Parameters<T[M]>> : never ]]
	error("not implemented method")
end
function MockModule:spyOn(object: T, methodName: M, accessType: ("get" | "set")?) end
