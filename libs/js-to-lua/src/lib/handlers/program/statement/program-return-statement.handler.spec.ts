import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  functionDeclaration,
  identifier,
  nodeGroup,
  program,
  returnStatement,
} from '@js-to-lua/lua-types';
import { getProgramNode } from '../program.spec.utils';
import { handleProgram } from '../program.handler';

const source = '';
describe('Program handler', () => {
  describe('Return Statement Handler', () => {
    it(`should handle empty ReturnStatement `, () => {
      const given = getProgramNode(`
        function func() {
          return
        }
      `);
      const expected = program([
        functionDeclaration(identifier('func'), [], [returnStatement()]),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle simple ReturnStatement `, () => {
      const given = getProgramNode(`
        function func() {
          return foo
        }
      `);
      const expected = program([
        functionDeclaration(
          identifier('func'),
          [],
          [returnStatement(identifier('foo'))]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });

    it(`should handle ReturnStatement that yields another statement`, () => {
      const given = getProgramNode(`
        function func() {
          return foo = bar
        }
      `);
      const expected = program([
        functionDeclaration(
          identifier('func'),
          [],
          [
            nodeGroup([
              assignmentStatement(
                AssignmentStatementOperatorEnum.EQ,
                [identifier('foo')],
                [identifier('bar')]
              ),
              returnStatement(identifier('foo')),
            ]),
          ]
        ),
      ]);

      expect(handleProgram.handler(source, {}, given)).toEqual(expected);
    });
  });
});
