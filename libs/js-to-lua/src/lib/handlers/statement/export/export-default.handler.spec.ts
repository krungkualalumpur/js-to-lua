import {
  blockStatement as babelBlockStatement,
  exportDefaultDeclaration as babelExportDefaultDeclaration,
  functionDeclaration as babelFunctionDeclaration,
  identifier as babelIdentifier,
  objectExpression as babelObjectExpression,
  objectProperty as babelObjectProperty,
  stringLiteral as babelStringLiteral,
} from '@babel/types';
import {
  assignmentStatement,
  functionDeclaration,
  identifier,
  memberExpression,
  nodeGroup,
  stringLiteral,
  tableConstructor,
  tableNameKeyField,
} from '@js-to-lua/lua-types';
import { createExportDefaultHandler } from './export-default.handler';
import { forwardHandlerRef } from '../../../utils/forward-handler-ref';
import {
  handleDeclaration,
  handleExpression,
} from '../../expression-statement.handler';

const { handler } = createExportDefaultHandler(
  forwardHandlerRef(() => handleDeclaration),
  forwardHandlerRef(() => handleExpression)
);

const source = '';

describe('Export Default Handler', () => {
  it(`should export default identifier`, () => {
    const given = babelExportDefaultDeclaration(babelIdentifier('foo'));

    const expected = assignmentStatement(
      [memberExpression(identifier('exports'), '.', identifier('default'))],
      [identifier('foo')]
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should export default ObjectExpression`, () => {
    const given = babelExportDefaultDeclaration(
      babelObjectExpression([
        babelObjectProperty(babelIdentifier('foo'), babelStringLiteral('bar')),
      ])
    );

    const expected = assignmentStatement(
      [memberExpression(identifier('exports'), '.', identifier('default'))],
      [
        tableConstructor([
          tableNameKeyField(identifier('foo'), stringLiteral('bar')),
        ]),
      ]
    );

    expect(handler(source, {}, given)).toEqual(expected);
  });

  it(`should export default function declaration`, () => {
    const given = babelExportDefaultDeclaration(
      babelFunctionDeclaration(
        babelIdentifier('foo'),
        [],
        babelBlockStatement([])
      )
    );

    const expected = nodeGroup([
      functionDeclaration(identifier('foo'), [], []),
      assignmentStatement(
        [memberExpression(identifier('exports'), '.', identifier('default'))],
        [identifier('foo')]
      ),
    ]);

    expect(handler(source, {}, given)).toEqual(expected);
  });
});
