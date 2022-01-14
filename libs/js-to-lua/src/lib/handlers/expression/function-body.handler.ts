import { EmptyConfig, HandlerFunction } from '../../types';
import {
  callExpression,
  expressionStatement,
  identifier,
  isExpression,
  isNodeGroup,
  LuaExpression,
  LuaStatement,
  returnStatement,
  stringLiteral,
} from '@js-to-lua/lua-types';
import {
  ArrowFunctionExpression,
  ClassMethod,
  ClassPrivateMethod,
  Expression,
  FunctionDeclaration,
  FunctionExpression,
  isTSDeclareMethod,
  Statement,
  TSDeclareMethod,
} from '@babel/types';
import { applyTo, curry } from 'ramda';
import { getReturnExpressions } from '../../utils/get-return-expressions';
import { createExpressionStatement } from '../../utils/create-expression-statement';

type FunctionTypes =
  | FunctionDeclaration
  | FunctionExpression
  | ArrowFunctionExpression
  | ClassMethod
  | ClassPrivateMethod
  | TSDeclareMethod;

export const createFunctionBodyHandler = (
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleExpressionAsStatement: HandlerFunction<
    LuaExpression | LuaStatement,
    Expression
  >
) =>
  curry(
    (
      source: string,
      config: EmptyConfig,
      node: FunctionTypes
    ): LuaStatement[] => {
      if (isTSDeclareMethod(node)) {
        return [
          expressionStatement(
            callExpression(identifier('error'), [
              stringLiteral(
                `not implemented ${node.abstract ? 'abstract ' : ''}method`
              ),
            ])
          ),
        ];
      }

      const nodeBody = node.body;
      return nodeBody.type === 'BlockStatement'
        ? nodeBody.body.map(handleStatement(source, config))
        : applyTo(
            {
              expression: handleExpressionAsStatement(source, config, nodeBody),
              babelExpression: nodeBody,
            },
            ({ expression, babelExpression }) => {
              const returnExpressions = getReturnExpressions(expression);
              return returnExpressions.every((e) => e === expression)
                ? [returnStatement(...returnExpressions)]
                : [
                    ...applyTo(
                      isNodeGroup(expression)
                        ? expression.body.filter(
                            (e) =>
                              !returnExpressions.includes(e as LuaExpression)
                          )
                        : [expression],
                      (expressions: Array<LuaExpression | LuaStatement>) =>
                        expressions.map((expression) =>
                          isExpression(expression)
                            ? createExpressionStatement(
                                source,
                                babelExpression,
                                expression
                              )
                            : expression
                        )
                    ),
                    returnStatement(...returnExpressions),
                  ];
            }
          );
    }
  );
