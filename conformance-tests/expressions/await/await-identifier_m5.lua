local function f()
	return Promise.resolve():andThen(function()
		local bar = foo:expect()
	end)
end
