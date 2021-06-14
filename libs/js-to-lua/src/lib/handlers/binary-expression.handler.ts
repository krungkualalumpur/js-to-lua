import { BinaryExpression, Expression } from '@babel/types';
import {
  binaryExpression,
  callExpression,
  identifier,
  LuaBinaryExpression,
  LuaCallExpression,
  LuaExpression,
  LuaStringLiteral,
  UnhandledNode,
  numericLiteral,
  arrayIndexOf,
  objectKeys,
  withConversionComment,
} from '@js-to-lua/lua-types';
import {
  BaseNodeHandler,
  createHandler,
  createHandlerFunction,
  HandlerFunction,
} from '../types';
import { defaultHandler } from '../utils/default.handler';

export const createBinaryExpressionHandler = (
  handleExpression: HandlerFunction<Expression, LuaExpression>
): BaseNodeHandler<BinaryExpression, LuaBinaryExpression | UnhandledNode> =>
  createHandler('BinaryExpression', (source, node) => {
    const handleOperandAsString: HandlerFunction<
      Expression,
      LuaCallExpression | LuaStringLiteral
    > = createHandlerFunction((source, node: Expression) => {
      if (node.type === 'StringLiteral') {
        return handleExpression(source, node);
      }
      return callExpression(identifier('tostring'), [
        handleExpression(source, node),
      ]);
    });

    const handleBinaryAddOperator = createHandlerFunction(
      (source: string, node: BinaryExpression & { operator: '+' }) => {
        if (
          node.left.type === 'StringLiteral' ||
          node.right.type === 'StringLiteral'
        ) {
          return binaryExpression(
            handleOperandAsString(source, node.left as Expression),
            '..',
            handleOperandAsString(source, node.right)
          );
        } else {
          return binaryExpression(
            handleExpression(source, node.left as Expression),
            node.operator,
            handleExpression(source, node.right)
          );
        }
      }
    );

    switch (node.operator) {
      case '-':
      case '/':
      case '*':
      case '%':
        return binaryExpression(
          handleExpression(source, node.left as Expression),
          node.operator,
          handleExpression(source, node.right)
        );
      case '**':
        return binaryExpression(
          handleExpression(source, node.left as Expression),
          '^',
          handleExpression(source, node.right)
        );
      case '==':
        return withConversionComment(
          binaryExpression(
            handleExpression(source, node.left as Expression),
            node.operator,
            handleExpression(source, node.right)
          ),
          `ROBLOX CHECK: loose equality used upstream`
        );
      case '>':
      case '<':
      case '>=':
      case '<=':
        return withConversionComment(
          binaryExpression(
            handleExpression(source, node.left as Expression),
            node.operator,
            handleExpression(source, node.right)
          ),
          `ROBLOX CHECK: operator '${node.operator}' works only if either both arguments are strings or both are a number`
        );
      case '!=':
        return withConversionComment(
          binaryExpression(
            handleExpression(source, node.left as Expression),
            '~=',
            handleExpression(source, node.right)
          ),
          `ROBLOX CHECK: loose inequality used upstream`
        );
      case '===':
        return binaryExpression(
          handleExpression(source, node.left as Expression),
          '==',
          handleExpression(source, node.right)
        );
      case '!==':
        return binaryExpression(
          handleExpression(source, node.left as Expression),
          '~=',
          handleExpression(source, node.right)
        );

      case '+':
        return handleBinaryAddOperator(source, { ...node, operator: '+' });
      case 'in':
        return binaryExpression(
          callExpression(arrayIndexOf(), [
            callExpression(objectKeys(), [
              handleExpression(source, node.right),
            ]),
            handleOperandAsString(source, node.left as Expression),
          ]),
          '~=',
          numericLiteral(-1)
        );
      default:
        return defaultHandler(source, node);
    }
  });
