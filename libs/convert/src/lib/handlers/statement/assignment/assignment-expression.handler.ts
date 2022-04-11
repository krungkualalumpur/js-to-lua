import {
  AssignmentExpression,
  BinaryExpression,
  Expression,
  LVal,
  ObjectMethod,
  ObjectProperty,
} from '@babel/types';
import { createHandler, HandlerFunction } from '@js-to-lua/handler-utils';
import { getReturnExpressions } from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  functionExpression,
  LuaBinaryExpression,
  LuaCallExpression,
  LuaExpression,
  LuaLVal,
  LuaTableKeyField,
  nodeGroup,
  returnStatement,
  UnhandledStatement,
} from '@js-to-lua/lua-types';
import { IdentifierStrictHandlerFunction } from '../../expression/identifier-handler-types';
import { createAssignmentStatementHandlerFunction } from './assignment-statement.handler';

export const createAssignmentExpressionHandlerFunction = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleLVal: HandlerFunction<LuaLVal, LVal>,
  handleIdentifierStrict: IdentifierStrictHandlerFunction,
  handleObjectField: HandlerFunction<
    LuaTableKeyField,
    ObjectMethod | ObjectProperty
  >,
  handleBinaryExpression: HandlerFunction<
    LuaBinaryExpression | LuaCallExpression | UnhandledStatement,
    BinaryExpression
  >
) =>
  createHandler(
    'AssignmentExpression',
    (source, config, node: AssignmentExpression) => {
      const assignmentStatement = createAssignmentStatementHandlerFunction(
        handleExpression,
        handleLVal,
        handleIdentifierStrict,
        handleObjectField,
        handleBinaryExpression
      ).handler(source, config, node);
      return callExpression(
        functionExpression(
          [],
          nodeGroup([
            assignmentStatement,
            returnStatement(...getReturnExpressions(assignmentStatement)),
          ])
        ),
        []
      );
    }
  );
