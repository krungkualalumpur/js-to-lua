import * as Babel from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  isArrayInferable,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  ForGenericStatement,
  forGenericStatement,
  identifier,
  LuaExpression,
  LuaLVal,
  LuaStatement,
  LuaTableKeyField,
  unhandledStatement,
} from '@js-to-lua/lua-types';
import { isSingleElementArray } from '@js-to-lua/shared-utils';
import { applyTo } from 'ramda';
import { IdentifierStrictHandlerFunction } from '../expression/identifier-handler-types';
import { createInnerBodyStatementHandler } from '../inner-statement-body-handler';
import { createExtractForStatementDeclaration } from './for-statement-extract-declaration';
import { createExtractForOfAssignmentStatement } from './for-of-statement-extract-statement';

export const createForOfStatementHandler = (
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleExpression: HandlerFunction<LuaExpression, Babel.Expression>,
  handleStatement: HandlerFunction<LuaStatement, Babel.Statement>,
  handleLVal: HandlerFunction<LuaLVal, Babel.LVal>,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    Babel.ObjectMethod | Babel.ObjectProperty
  >
): BaseNodeHandler<ForGenericStatement, Babel.ForOfStatement> => {
  const bodyStatementHandler = createInnerBodyStatementHandler(handleStatement);
  return createHandler('ForOfStatement', (source, config, node) => {
    if (node.await) {
      return withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX TODO: Unhandled node for type: ${node.type} with await modifier`,
        getNodeSource(source, node)
      );
    }
    const rightExpression: LuaExpression = handleExpression(
      source,
      config,
      node.right
    );
    if (!Babel.isVariableDeclaration(node.left)) {
      const result = createExtractForOfAssignmentStatement(
        handleIdentifierStrict,
        handleExpression,
        handleStatement,
        handleLVal,
        handleObjectField
      )(source, config, node.left);

      return result
        ? forGenericStatement(
            [identifier('_'), result.identifier],
            [
              applyTo(callExpression(identifier('ipairs'), [rightExpression]))(
                (expression) =>
                  isArrayInferable(rightExpression)
                    ? expression
                    : withTrailingConversionComment(
                        expression,
                        `ROBLOX CHECK: check if '${getNodeSource(
                          source,
                          node.right
                        )}' is an Array`
                      )
              ),
            ],
            [result.statement, bodyStatementHandler(source, config, node.body)]
          )
        : withTrailingConversionComment(
            unhandledStatement(),
            `ROBLOX TODO: Unhandled node for type: ${node.type} where left side is not handled`,
            getNodeSource(source, node)
          );
    }

    if (!isSingleElementArray(node.left.declarations)) {
      return withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX TODO: Unhandled node for type: ${node.type} where left side declaration doesn't have exactly one declarator`,
        getNodeSource(source, node)
      );
    }

    const { id, statements } = createExtractForStatementDeclaration(
      handleIdentifierStrict,
      handleExpression,
      handleStatement,
      handleLVal,
      handleObjectField
    )(source, config, {
      ...node,
      left: { ...node.left, declarations: node.left.declarations },
    });

    return forGenericStatement(
      [identifier('_'), id],
      [
        applyTo(callExpression(identifier('ipairs'), [rightExpression]))(
          (expression) =>
            isArrayInferable(rightExpression)
              ? expression
              : withTrailingConversionComment(
                  expression,
                  `ROBLOX CHECK: check if '${getNodeSource(
                    source,
                    node.right
                  )}' is an Array`
                )
        ),
      ],
      [...statements, bodyStatementHandler(source, config, node.body)]
    );
  });
};
