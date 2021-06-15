export default {
  outputPath: './dist/output-tests/',
  inputPath: './conformance-tests',
  excludeFiles: [
    // ---- Milestone 1 ----
    'conformance-tests/base-types/strings/template-escape-new-line.js',
    'conformance-tests/base-types/strings/escape-sequences.js',
    'conformance-tests/base-types/strings/hex-escape-sequences.js',
    'conformance-tests/base-types/strings/octal-escape-sequence-follow-by-8.js',
    'conformance-tests/base-types/strings/octal-escape-sequences.js',
    'conformance-tests/structural-types/object/single-false-key-to-boolean.js',

    // ---- Milestone 2 ----

    // the following tests are failing because of a bug in stylua:
    // https://github.com/JohnnyMorganz/StyLua/issues/187
    'conformance-tests/expressions/call/method-expression-string_m2.js',
    'conformance-tests/expressions/call/method-expression_m2.js',
    'conformance-tests/expressions/call/method-nested_m2.js',
    'conformance-tests/expressions/call/method_m2.js',
    'conformance-tests/structural-types/object/object-method.js',
    'conformance-tests/structural-types/object/method-simple_m2.js',
    'conformance-tests/structural-types/object/method-simple-with-args_m2.js',
    'conformance-tests/structural-types/object/method-simple-with-args-typed_m2.ts',
    'conformance-tests/structural-types/object/method-simple-typed_m2.ts',
    'conformance-tests/structural-types/object/method-function-expression_m2.js',
    'conformance-tests/structural-types/object/method-function-expression-with-args_m2.js',
    'conformance-tests/structural-types/object/method-function-expression-with-args-typed_m2.ts',
    'conformance-tests/structural-types/object/method-function-expression-typed_m2.ts',
    'conformance-tests/structural-types/object/method-expression-property_m2.js',
    'conformance-tests/structural-types/object/method-expression-property-with-args_m2.js',
    'conformance-tests/structural-types/object/method-expression-property-function-expression_m2.js',
    'conformance-tests/structural-types/object/method-expression-property-function-expression-with-args_m2.js',

    // ---- Milestone 3 ----

    'conformance-tests/operators/relational/equality/8_m3.js',
    'conformance-tests/operators/relational/equality/9_m3.js',

    'conformance-tests/operators/relational/inequality/8_m3.js',
    'conformance-tests/operators/relational/inequality/9_m3.js',

    'conformance-tests/operators/bitwise/shift-left/0_m3.js',
    'conformance-tests/operators/bitwise/shift-left/1_m3.js',
    'conformance-tests/operators/bitwise/shift-left/2_m3.js',
    'conformance-tests/operators/bitwise/shift-left/3_m3.js',
    'conformance-tests/operators/bitwise/shift-left/4_m3.js',

    'conformance-tests/operators/bitwise/shift-right/0_m3.js',
    'conformance-tests/operators/bitwise/shift-right/1_m3.js',
    'conformance-tests/operators/bitwise/shift-right/2_m3.js',
    'conformance-tests/operators/bitwise/shift-right/3_m3.js',
    'conformance-tests/operators/bitwise/shift-right/4_m3.js',

    'conformance-tests/operators/bitwise/shift-right-unsigned/0_m3.js',
    'conformance-tests/operators/bitwise/shift-right-unsigned/1_m3.js',
    'conformance-tests/operators/bitwise/shift-right-unsigned/2_m3.js',
    'conformance-tests/operators/bitwise/shift-right-unsigned/3_m3.js',
    'conformance-tests/operators/bitwise/shift-right-unsigned/4_m3.js',
    'conformance-tests/operators/bitwise/shift-right-unsigned/5_m3.js',

    'conformance-tests/operators/bitwise/and/0_m3.js',
    'conformance-tests/operators/bitwise/and/1_m3.js',
    'conformance-tests/operators/bitwise/and/2_m3.js',
    'conformance-tests/operators/bitwise/and/3_m3.js',
    'conformance-tests/operators/bitwise/and/4_m3.js',
    'conformance-tests/operators/bitwise/and/5_m3.js',

    'conformance-tests/operators/bitwise/or/0_m3.js',
    'conformance-tests/operators/bitwise/or/1_m3.js',
    'conformance-tests/operators/bitwise/or/2_m3.js',
    'conformance-tests/operators/bitwise/or/3_m3.js',
    'conformance-tests/operators/bitwise/or/4_m3.js',
    'conformance-tests/operators/bitwise/or/5_m3.js',

    'conformance-tests/operators/bitwise/xor/0_m3.js',
    'conformance-tests/operators/bitwise/xor/1_m3.js',
    'conformance-tests/operators/bitwise/xor/2_m3.js',
    'conformance-tests/operators/bitwise/xor/3_m3.js',
    'conformance-tests/operators/bitwise/xor/4_m3.js',
    'conformance-tests/operators/bitwise/xor/5_m3.js',

    'conformance-tests/operators/logical/and/right-side-falsy-0_m3.js',
    'conformance-tests/operators/logical/and/right-side-falsy-1_m3.js',
    'conformance-tests/operators/logical/and/right-side-falsy-2_m3.js',
    'conformance-tests/operators/logical/and/right-side-falsy-3_m3.js',
    'conformance-tests/operators/logical/and/right-side-falsy-4_m3.js',
    'conformance-tests/operators/logical/and/right-side-falsy-5_m3.js',
    'conformance-tests/operators/logical/and/right-side-truthy-0_m3.js',
    'conformance-tests/operators/logical/and/right-side-truthy-1_m3.js',
    'conformance-tests/operators/logical/and/right-side-truthy-2_m3.js',
    'conformance-tests/operators/logical/and/right-side-truthy-3_m3.js',
    'conformance-tests/operators/logical/and/right-side-truthy-4_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-0_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-1_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-2_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-3_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-4_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-5_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-6_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-7_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-8_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-9_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-10_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-11_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-12_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-13_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-14_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-15_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-16_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-17_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-18_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-19_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-20_m3.js',
    'conformance-tests/operators/logical/and/right-side-unknown-21_m3.js',

    'conformance-tests/operators/logical/or/0_m3.js',
    'conformance-tests/operators/logical/or/1_m3.js',
    'conformance-tests/operators/logical/or/2_m3.js',
    'conformance-tests/operators/logical/or/3_m3.js',
    'conformance-tests/operators/logical/or/4_m3.js',
    'conformance-tests/operators/logical/or/5_m3.js',
    'conformance-tests/operators/logical/or/6_m3.js',
    'conformance-tests/operators/logical/or/7_m3.js',
    'conformance-tests/operators/logical/or/8_m3.js',
    'conformance-tests/operators/logical/or/9_m3.js',
    'conformance-tests/operators/logical/or/10_m3.js',
    'conformance-tests/operators/logical/or/11_m3.js',
    'conformance-tests/operators/logical/or/12_m3.js',
    'conformance-tests/operators/logical/or/13_m3.js',
    'conformance-tests/operators/logical/or/14_m3.js',
    'conformance-tests/operators/logical/or/15_m3.js',
    'conformance-tests/operators/logical/or/16_m3.js',
    'conformance-tests/operators/logical/or/17_m3.js',
    'conformance-tests/operators/logical/or/18_m3.js',
    'conformance-tests/operators/logical/or/19_m3.js',
    'conformance-tests/operators/logical/or/20_m3.js',
    'conformance-tests/operators/logical/or/21_m3.js',

    // ---- Milestone 4 ----
    'conformance-tests/operators/relational/in/string-key_m4.js',
    'conformance-tests/operators/relational/in/string_m4.js',

    'conformance-tests/operators/ternary/0_m4.js',
    'conformance-tests/operators/ternary/1_m4.js',
    'conformance-tests/operators/ternary/2_m4.js',
    'conformance-tests/operators/ternary/3_m4.js',
    'conformance-tests/operators/ternary/4_m4.js',
    'conformance-tests/operators/ternary/5_m4.js',
    'conformance-tests/operators/ternary/6_m4.js',
  ],
};
