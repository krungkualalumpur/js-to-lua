import {
  BinaryExpression,
  Expression,
  isStringLiteral as isBabelStringLiteral,
  isTemplateLiteral as isBabelTemplateLiteral,
} from '@babel/types';
import {
  arrayIndexOf,
  binaryExpression,
  callExpression,
  identifier,
  isStringInferable,
  LuaBinaryExpression,
  LuaCallExpression,
  LuaExpression,
  LuaStringLiteral,
  numericLiteral,
  objectKeys,
  UnhandledStatement,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import {
  createHandler,
  createHandlerFunction,
  HandlerFunction,
<<<<<<< HEAD:libs/js-to-lua/src/lib/handlers/expression/binary-expression.handler.ts
} from '../../types';
import { defaultExpressionHandler } from '../../utils/default-handlers';
import { bit32MethodCall } from '../../utils/bit-32-method';
=======
} from '../types';
import { defaultStatementHandler } from '../utils/default-handlers';
import { bit32MethodCall } from '../utils/bit-32-method';
>>>>>>> parent of 5751854 (handle template strings with interpolated expressions (#243)):libs/js-to-lua/src/lib/handlers/binary-expression.handler.ts

export const createBinaryExpressionHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>
) =>
  createHandler<
    LuaBinaryExpression | LuaCallExpression | UnhandledStatement,
    BinaryExpression
  >('BinaryExpression', (source, config, node) => {
    const handleOperandAsString: HandlerFunction<
      LuaCallExpression | LuaStringLiteral,
      Expression
    > = createHandlerFunction((source, config, node: Expression) => {
      const operandNode = handleExpression(source, config, node);

      if (isStringInferable(operandNode)) {
        return operandNode;
      }
      return callExpression(identifier('tostring'), [operandNode]);
    });

<<<<<<< HEAD:libs/js-to-lua/src/lib/handlers/expression/binary-expression.handler.ts
      const handleBinaryAddOperator = createHandlerFunction(
        (
          source: string,
          config,
          node: BinaryExpression & { operator: '+' }
        ) => {
          if (
            isBabelStringLiteral(node.left) ||
            isBabelStringLiteral(node.right) ||
            isBabelTemplateLiteral(node.left) ||
            isBabelTemplateLiteral(node.right)
          ) {
            return binaryExpression(
              handleOperandAsString(source, config, node.left as Expression),
              '..',
              handleOperandAsString(source, config, node.right)
            );
          } else {
            return binaryExpression(
              handleExpression(source, config, node.left as Expression),
              node.operator,
              handleExpression(source, config, node.right)
            );
          }
        }
      );

      switch (node.operator) {
        case '-':
        case '/':
        case '*':
        case '%':
=======
    const handleBinaryAddOperator = createHandlerFunction(
      (source: string, config, node: BinaryExpression & { operator: '+' }) => {
        if (
          isBabelStringLiteral(node.left) ||
          isBabelStringLiteral(node.right)
        ) {
          return binaryExpression(
            handleOperandAsString(source, config, node.left as Expression),
            '..',
            handleOperandAsString(source, config, node.right)
          );
        } else {
>>>>>>> parent of 5751854 (handle template strings with interpolated expressions (#243)):libs/js-to-lua/src/lib/handlers/binary-expression.handler.ts
          return binaryExpression(
            handleExpression(source, config, node.left as Expression),
            node.operator,
            handleExpression(source, config, node.right)
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
          handleExpression(source, config, node.left as Expression),
          node.operator,
          handleExpression(source, config, node.right)
        );
      case '**':
        return binaryExpression(
          handleExpression(source, config, node.left as Expression),
          '^',
          handleExpression(source, config, node.right)
        );
      case '==':
        return withTrailingConversionComment(
          binaryExpression(
            handleExpression(source, config, node.left as Expression),
            node.operator,
            handleExpression(source, config, node.right)
          ),
          `ROBLOX CHECK: loose equality used upstream`
        );
      case '>':
      case '<':
      case '>=':
      case '<=':
        return withTrailingConversionComment(
          binaryExpression(
            handleExpression(source, config, node.left as Expression),
            node.operator,
            handleExpression(source, config, node.right)
          ),
          `ROBLOX CHECK: operator '${node.operator}' works only if either both arguments are strings or both are a number`
        );
      case '!=':
        return withTrailingConversionComment(
          binaryExpression(
            handleExpression(source, config, node.left as Expression),
            '~=',
            handleExpression(source, config, node.right)
          ),
          `ROBLOX CHECK: loose inequality used upstream`
        );
      case '===':
        return binaryExpression(
          handleExpression(source, config, node.left as Expression),
          '==',
          handleExpression(source, config, node.right)
        );
      case '!==':
        return binaryExpression(
          handleExpression(source, config, node.left as Expression),
          '~=',
          handleExpression(source, config, node.right)
        );

      case '+':
        return handleBinaryAddOperator(source, config, {
          ...node,
          operator: '+',
        });
      case 'in':
        return binaryExpression(
          callExpression(arrayIndexOf(), [
            callExpression(objectKeys(), [
              handleExpression(source, config, node.right),
            ]),
            handleOperandAsString(source, config, node.left as Expression),
          ]),
          '~=',
          numericLiteral(-1)
        );
      case '&':
        return withTrailingConversionComment(
          bit32MethodCall(
            'band',
            handleExpression(source, config, node.left as Expression),
            handleExpression(source, config, node.right as Expression)
          ),
          'ROBLOX CHECK: `bit32.band` clamps arguments and result to [0,2^32 - 1]'
        );

      case '|':
        return withTrailingConversionComment(
          bit32MethodCall(
            'bor',
            handleExpression(source, config, node.left as Expression),
            handleExpression(source, config, node.right as Expression)
          ),
          'ROBLOX CHECK: `bit32.bor` clamps arguments and result to [0,2^32 - 1]'
        );
      case '^':
        return withTrailingConversionComment(
          bit32MethodCall(
            'bxor',
            handleExpression(source, config, node.left as Expression),
            handleExpression(source, config, node.right as Expression)
          ),
          'ROBLOX CHECK: `bit32.bxor` clamps arguments and result to [0,2^32 - 1]'
        );
      case '>>>':
        return withTrailingConversionComment(
          bit32MethodCall(
            'rshift',
            handleExpression(source, config, node.left as Expression),
            handleExpression(source, config, node.right as Expression)
          ),
          'ROBLOX CHECK: `bit32.rshift` clamps arguments and result to [0,2^32 - 1]'
        );
      case '>>':
        return withTrailingConversionComment(
          bit32MethodCall(
            'arshift',
            handleExpression(source, config, node.left as Expression),
            handleExpression(source, config, node.right as Expression)
          ),
          'ROBLOX CHECK: `bit32.arshift` clamps arguments and result to [0,2^32 - 1]'
        );
      case '<<':
        return withTrailingConversionComment(
          bit32MethodCall(
            'lshift',
            handleExpression(source, config, node.left as Expression),
            handleExpression(source, config, node.right as Expression)
          ),
          'ROBLOX CHECK: `bit32.lshift` clamps arguments and result to [0,2^32 - 1]'
        );
      default:
        return defaultStatementHandler(source, config, node);
    }
  });
