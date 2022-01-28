import { BaseLuaNode, isNodeType } from '../node.types';
import { LuaExpression, LuaLVal } from '../expression';

export interface LuaVariableDeclaration extends BaseLuaNode {
  type: 'VariableDeclaration';
  identifiers: LuaVariableDeclaratorIdentifier[];
  values: LuaVariableDeclaratorValue[];
}

export interface LuaVariableDeclarator extends BaseLuaNode {
  type: 'VariableDeclarator';
  id: LuaLVal;
  init: LuaExpression | null;
}

export interface LuaVariableDeclaratorIdentifier extends BaseLuaNode {
  type: 'VariableDeclaratorIdentifier';
  value: LuaLVal;
}

export interface LuaVariableDeclaratorValue extends BaseLuaNode {
  type: 'VariableDeclaratorValue';
  value: LuaExpression | null;
}

export const variableDeclaration = (
  identifiers: LuaVariableDeclaration['identifiers'],
  values: LuaVariableDeclaration['values']
): LuaVariableDeclaration => ({
  type: 'VariableDeclaration',
  identifiers,
  values,
});

export const variableDeclaratorIdentifier = (
  value: LuaVariableDeclaratorIdentifier['value']
): LuaVariableDeclaratorIdentifier => ({
  type: 'VariableDeclaratorIdentifier',
  value,
});

export const variableDeclaratorValue = (
  value: LuaVariableDeclaratorValue['value']
): LuaVariableDeclaratorValue => ({
  type: 'VariableDeclaratorValue',
  value,
});

export const variableDeclarator = (
  id: LuaVariableDeclarator['id'],
  init: LuaVariableDeclarator['init']
): LuaVariableDeclarator => ({
  type: 'VariableDeclarator',
  id,
  init,
});

export const isVariableDeclaration = isNodeType<LuaVariableDeclaration>(
  'VariableDeclaration'
);
