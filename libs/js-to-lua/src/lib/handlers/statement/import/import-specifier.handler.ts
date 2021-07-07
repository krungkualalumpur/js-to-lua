import { combineStatementHandlers } from '../../../utils/combine-handlers';
import { HandlerFunction } from '../../../types';
import { Expression, Identifier } from '@babel/types';
import {
  LuaExpression,
  LuaIdentifier,
  LuaStatement,
} from '@js-to-lua/lua-types';
import { createImportNamedSpecifierHandler } from './import-named-specifier.handler';
import { createImportDefaultSpecifierHandler } from './import-default-specifier.handler';
import { createImportNamespaceSpecifierHandler } from './import-namespace-specifier.handler';

export const createImportSpecifierHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleIdentifier: HandlerFunction<LuaIdentifier, Identifier>,
  moduleIdentifier: LuaExpression
) =>
  combineStatementHandlers<LuaStatement>([
    createImportNamedSpecifierHandler(
      handleExpression,
      handleIdentifier,
      moduleIdentifier
    ),
    createImportDefaultSpecifierHandler(handleIdentifier, moduleIdentifier),
    createImportNamespaceSpecifierHandler(handleIdentifier, moduleIdentifier),
  ]);
