local obj = { objFoo = "bar", objFizz = "buzz", objFuzz = "jazz" }
local foo, fizz, fuzz
do
	local ref = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
	foo, fizz, fuzz = ref.foo, ref.fizz, ref.fuzz
end
local foo1, fizz1, fuzz1
do
	local ref = { foo = "bar", fizz = "buzz", fuzz = "jazz" }
	foo1, fizz1, fuzz1 = ref.foo, ref.fizz, ref.fuzz
end
local objFoo, objFizz, objFuzz
do
	local ref = Object.assign({}, obj)
	objFoo, objFizz, objFuzz = ref.objFoo, ref.objFizz, ref.objFuzz
end
