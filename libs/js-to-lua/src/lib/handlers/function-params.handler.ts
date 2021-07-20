import {
  ArrowFunctionExpression,
  AssignmentPattern,
  FunctionDeclaration,
  FunctionExpression,
  Identifier,
  isArrayPattern,
  isAssignmentPattern,
  isObjectPattern,
  LVal,
  variableDeclaration as babelVariableDeclaration,
  variableDeclarator as babelVariableDeclarator,
  identifier as babelIdentifier,
  Declaration,
  isIdentifier,
  ObjectMethod,
} from '@babel/types';
import {
  AssignmentStatement,
  identifier,
  LuaBinaryExpression,
  LuaDeclaration,
  LuaFunctionParam,
  LuaIdentifier,
  LuaMemberExpression,
  LuaNilLiteral,
  LuaNodeGroup,
  nodeGroup,
  UnhandledStatement,
  withTrailingConversionComment,
} from '@js-to-lua/lua-types';
import { createHandlerFunction, EmptyConfig, HandlerFunction } from '../types';
import { getNodeSource } from '../utils/get-node-source';
import { defaultStatementHandler } from '../utils/default-handlers';
import { anyPass } from 'ramda';

type FunctionTypes =
  | ArrowFunctionExpression
  | FunctionExpression
  | FunctionDeclaration
  | ObjectMethod;

export const createFunctionParamsHandler = (
  handleIdentifier: HandlerFunction<
    LuaNilLiteral | LuaIdentifier | LuaMemberExpression | LuaBinaryExpression,
    Identifier
  >
): ((
  source: string,
  config: EmptyConfig,
  node: FunctionTypes
) => LuaIdentifier[]) => {
  const defaultFunctionParamHandler: HandlerFunction<
    LuaFunctionParam,
    LVal
  > = createHandlerFunction((source, config, node) => {
    return withTrailingConversionComment(
      identifier('__unhandledIdentifier__'),
      `ROBLOX TODO: Unhandled node for type: ${node.type}`,
      getNodeSource(source, node)
    );
  });

  let paramRefIdCount = 0;

  return (source: string, config: EmptyConfig, node: FunctionTypes) =>
    node.params.map((param) => {
      if (
        isArrayPattern(param) ||
        isObjectPattern(param) ||
        (isAssignmentPattern(param) &&
          (isObjectPattern(param.left) || isArrayPattern(param.left)))
      ) {
        return identifier(`ref${'_'.repeat(paramRefIdCount++)}`);
      } else if (isIdentifier(param)) {
        return handleIdentifier(source, config, param) as LuaFunctionParam;
      } else if (isAssignmentPattern(param)) {
        return handleIdentifier(
          source,
          config,
          param.left as Identifier
        ) as LuaFunctionParam;
      }
      return defaultFunctionParamHandler(source, config, param);
    });
};

type ParamsBodyResponse = Array<
  LuaNodeGroup | LuaDeclaration | AssignmentStatement | UnhandledStatement
>;

export const createFunctionParamsBodyHandler = (
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Declaration
  >,
  handleAssignmentPattern: HandlerFunction<
    AssignmentStatement,
    AssignmentPattern
  >
): ((
  source: string,
  config: EmptyConfig,
  node: FunctionTypes
) => ParamsBodyResponse) => {
  return (source: string, config: EmptyConfig, node: FunctionTypes) => {
    let destructuringRefIdCount = 0;
    return node.params
      .filter((param) =>
        anyPass([isAssignmentPattern, isObjectPattern, isArrayPattern])(
          param,
          undefined
        )
      )
      .map((param) => {
        if (isAssignmentPattern(param)) {
          if (isArrayPattern(param.left) || isObjectPattern(param.left)) {
            return nodeGroup([
              handleAssignmentPattern(source, config, {
                ...param,
                left: babelIdentifier(
                  `ref${'_'.repeat(destructuringRefIdCount)}`
                ),
                right: { ...param.right },
              } as AssignmentPattern),
              handleDeclaration(
                source,
                node,
                babelVariableDeclaration('let', [
                  babelVariableDeclarator(
                    param.left,
                    babelIdentifier(
                      `ref${'_'.repeat(destructuringRefIdCount++)}`
                    )
                  ),
                ])
              ),
            ]);
          }
          return handleAssignmentPattern(
            source,
            config,
            param as AssignmentPattern
          );
        } else if (isArrayPattern(param)) {
          return handleDeclaration(
            source,
            node,
            babelVariableDeclaration('let', [
              babelVariableDeclarator(
                param,
                babelIdentifier(`ref${'_'.repeat(destructuringRefIdCount++)}`)
              ),
            ])
          );
        } else if (isObjectPattern(param)) {
          return handleDeclaration(
            source,
            node,
            babelVariableDeclaration('let', [
              babelVariableDeclarator(
                param,
                babelIdentifier(`ref${'_'.repeat(destructuringRefIdCount++)}`)
              ),
            ])
          );
        } else {
          return defaultStatementHandler(source, config, param);
        }
      });
  };
};
