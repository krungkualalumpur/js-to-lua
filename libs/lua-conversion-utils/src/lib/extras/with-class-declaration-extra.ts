import {
  isNodeGroup,
  isTypeAliasDeclaration,
  LuaNode,
  LuaNodeGroup,
  LuaStatement,
  LuaTypeAliasDeclaration,
} from '@js-to-lua/lua-types';
import {
  createWithSourceTypeExtra,
  hasSourceTypeExtra,
} from './with-source-type-extra';

const classDeclarationSourceType = 'ClassDeclaration';

export const withClassDeclarationExtra = createWithSourceTypeExtra(
  classDeclarationSourceType
);

export const isClassDeclaration = (
  node: LuaNode
): node is LuaNodeGroup<ClassDeclarationBody> =>
  isNodeGroup(node) &&
  hasSourceTypeExtra(classDeclarationSourceType, node) &&
  isClassDeclarationBody(node.body);

export type ClassDeclarationBody = [
  LuaTypeAliasDeclaration,
  LuaTypeAliasDeclaration,
  LuaStatement,
  ...LuaStatement[]
];

const isClassDeclarationBody = (
  body: LuaStatement[]
): body is ClassDeclarationBody =>
  body.length >= 3 &&
  isTypeAliasDeclaration(body[0]) &&
  isTypeAliasDeclaration(body[1]);
