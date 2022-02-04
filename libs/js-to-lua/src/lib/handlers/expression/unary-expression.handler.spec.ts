import {
  booleanLiteral as babelBooleanLiteral,
  identifier as babelIdentifier,
  numericLiteral as babelNumericLiteral,
  stringLiteral as babelStringLiteral,
  unaryExpression as babelUnaryExpression,
  UnaryExpression,
} from '@babel/types';
import { forwardHandlerRef } from '@js-to-lua/handler-utils';
import {
  bit32Identifier,
  booleanMethod,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  booleanLiteral,
  callExpression,
  identifier,
  LuaCallExpression,
  LuaIdentifier,
  LuaUnaryExpression,
  LuaUnaryNegationExpression,
  LuaUnaryVoidExpression,
  memberExpression,
  nilLiteral,
  numericLiteral,
  unaryExpression,
  unaryNegationExpression,
  unaryVoidExpression,
} from '@js-to-lua/lua-types';
import { handleExpression } from '../expression-statement.handler';
import { createUnaryExpressionHandler } from './unary-expression.handler';

const source = '';

describe('Unary Expression Handler', () => {
  it(`should handle typeof operator`, () => {
    const given: UnaryExpression = babelUnaryExpression(
      'typeof',
      babelIdentifier('foo'),
      true
    );

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaCallExpression = callExpression(identifier('typeof'), [
      identifier('foo'),
    ]);

    expect(handleUnaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle plus operator`, () => {
    const given: UnaryExpression = babelUnaryExpression(
      '+',
      babelIdentifier('foo'),
      true
    );

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaCallExpression = callExpression(identifier('tonumber'), [
      identifier('foo'),
    ]);

    expect(handleUnaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle minus operator`, () => {
    const given: UnaryExpression = babelUnaryExpression(
      '-',
      babelIdentifier('foo'),
      true
    );

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaUnaryExpression = unaryExpression(
      '-',
      identifier('foo')
    );

    expect(handleUnaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle void operator`, () => {
    const given: UnaryExpression = babelUnaryExpression(
      'void',
      babelIdentifier('foo'),
      true
    );

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaUnaryVoidExpression = unaryVoidExpression(
      identifier('foo')
    );

    expect(handleUnaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle void operator with string literals`, () => {
    const given: UnaryExpression = babelUnaryExpression(
      'void',
      babelStringLiteral('foo'),
      true
    );

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaIdentifier = identifier('nil');

    expect(handleUnaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle void operator with numeric literals`, () => {
    const given: UnaryExpression = babelUnaryExpression(
      'void',
      babelNumericLiteral(0),
      true
    );

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaIdentifier = identifier('nil');

    expect(handleUnaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle void operator with boolean literals`, () => {
    const given: UnaryExpression = babelUnaryExpression(
      'void',
      babelBooleanLiteral(false),
      true
    );

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaIdentifier = identifier('nil');

    expect(handleUnaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle negation operator`, () => {
    const given: UnaryExpression = babelUnaryExpression(
      '!',
      babelIdentifier('foo'),
      true
    );

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaUnaryNegationExpression = unaryNegationExpression(
      callExpression(booleanMethod('toJSBoolean'), [identifier('foo')])
    );

    expect(handleUnaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle negation operator of BooleanLiteral`, () => {
    const given: UnaryExpression = babelUnaryExpression(
      '!',
      babelBooleanLiteral(true),
      true
    );

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaUnaryNegationExpression = unaryNegationExpression(
      booleanLiteral(true)
    );

    expect(handleUnaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle double negation operator`, () => {
    const given: UnaryExpression = babelUnaryExpression(
      '!',
      babelUnaryExpression('!', babelIdentifier('foo'), true),
      true
    );

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaUnaryNegationExpression = unaryNegationExpression(
      unaryNegationExpression(
        callExpression(booleanMethod('toJSBoolean'), [identifier('foo')])
      )
    );

    expect(handleUnaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle delete operator`, () => {
    const given: UnaryExpression = babelUnaryExpression(
      'delete',
      babelIdentifier('foo'),
      true
    );

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected = assignmentStatement(
      AssignmentStatementOperatorEnum.EQ,
      [identifier('foo')],
      [nilLiteral()]
    );

    expect(handleUnaryExpression.handler(source, {}, given)).toEqual(expected);
  });

  it(`should handle ~ operator`, () => {
    const given: UnaryExpression = babelUnaryExpression(
      '~',
      babelNumericLiteral(5),
      true
    );

    const handleUnaryExpression = createUnaryExpressionHandler(
      forwardHandlerRef(() => handleExpression)
    );

    const expected: LuaCallExpression = withTrailingConversionComment(
      callExpression(
        memberExpression(bit32Identifier(), '.', identifier('bnot')),
        [numericLiteral(5)]
      ),
      'ROBLOX CHECK: `bit32.bnot` clamps arguments and result to [0,2^32 - 1]'
    );

    expect(handleUnaryExpression.handler(source, {}, given)).toEqual(expected);
  });
});
