import { LuaNode } from '../lua-nodes.types';
import { printNumeric } from './primitives/print-numeric';
import { printString } from './primitives/print-string';

export const printNode = (node: LuaNode, source: string): string => {
  switch (node.type) {
    case 'Program':
      return node.body.map((node) => printNode(node, source)).join('\n');
    case 'ExpressionStatement':
      return printNode(node.expression, source);
    case 'NumericLiteral':
      return printNumeric(node);
    case 'StringLiteral':
      return printString(node);
    case 'BooleanLiteral':
      return node.value.toString();
    case 'Identifier':
      return node.name;
    case 'VariableDeclaration':
      return `local ${node.identifiers
        .map((id) => printNode(id, source))
        .join(', ')}${
        node.values.length
          ? ` = ${node.values.map((value) => printNode(value, source))}`
          : ''
      }`;
    case 'VariableDeclaratorIdentifier':
      return node.value.name;
    case 'VariableDeclaratorValue':
      return `${node.value ? ` ${printNode(node.value, source)}` : 'nil'}`;
    case 'TableConstructor':
      return `{ ${node.elements.map((e) => printNode(e, source)).join(', ')} }`;
    case 'TableNoKeyField':
      return printNode(node.value, source);
    case 'NilLiteral':
      return 'nil';
    case 'UnhandledNode':
      return `
--[[
${source.slice(node.start, node.end)}
]]
      `;
    default:
      return '--[[ default ]]';
  }
};
