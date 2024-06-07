import { BaseNodeHandler, createHandler } from '../../types';
import { TemplateLiteral } from '@babel/types';
import {
  LuaMultilineStringLiteral,
  LuaStringLiteral,
<<<<<<< HEAD
  memberExpression,
  multilineStringLiteral,
  stringInferableExpression,
  stringLiteral,
} from '@js-to-lua/lua-types';

export const createMultilineStringLiteralHandler = (
  expressionHandlerFunction: HandlerFunction<LuaExpression, Expression>
) => {
  return createHandler<
    LuaMultilineStringLiteral | LuaStringLiteral | LuaCallExpression,
    TemplateLiteral
  >('TemplateLiteral', (source, config, literal) => {
    const handleExpression = expressionHandlerFunction(source, config);

    return literal.expressions.length
      ? stringInferableExpression(
          callExpression(
            memberExpression(getLiteral(literal), ':', identifier('format')),
            literal.expressions.map(handleExpression)
          )
        )
      : getLiteral(literal);
  });
};

function getLiteral(literal: TemplateLiteral) {
=======
} from '@js-to-lua/lua-types';

export const handleMultilineStringLiteral: BaseNodeHandler<
  LuaMultilineStringLiteral | LuaStringLiteral,
  TemplateLiteral
> = createHandler('TemplateLiteral', (source, config, literal) => {
>>>>>>> parent of 5751854 (handle template strings with interpolated expressions (#243))
  return containsNewLine(literal)
    ? {
        type: 'MultilineStringLiteral',
        value: getMultilineString(literal),
      }
    : {
        type: 'StringLiteral',
        value: getString(literal),
      };
});

function getString(literal: TemplateLiteral) {
  return literal.quasis.reduce((accu, curr) => {
    return accu + (curr.value.cooked || curr.value.raw);
  }, '');
}

const getMultilineString = (literal: TemplateLiteral) => {
  const multilineString = getString(literal);
  return `${multilineString[0] === '\n' ? '\n' : ''}${multilineString}`;
};

const containsNewLine = (literal: TemplateLiteral): boolean => {
  return literal.quasis
    .map((element) => element.value.raw)
    .some((element) => /\n/.test(element));
};
