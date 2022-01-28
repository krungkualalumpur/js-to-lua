import {
  selfIdentifier,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  expressionStatement,
  functionDeclaration,
  identifier,
  LuaProgram,
  memberExpression,
  nodeGroup,
  program,
  returnStatement,
  stringLiteral,
  tableConstructor,
  tableNameKeyField,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeLiteral,
  typePropertySignature,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { handleProgram } from '../program.handler';
import { getProgramNode } from '../program.spec.utils';

const source = '';

describe('Program handler', () => {
  describe('Class Declaration', () => {
    describe('Base Class', () => {
      const baseClassDefaultExpectedNodes = [
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('BaseClass'))],
          [variableDeclaratorValue(tableConstructor())]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [
            memberExpression(
              identifier('BaseClass'),
              '.',
              identifier('__index')
            ),
          ],
          [identifier('BaseClass')]
        ),
      ];
      it('should convert class', () => {
        const given = getProgramNode(`
     class BaseClass {}
    `);

        const expected: LuaProgram = program([
          nodeGroup([
            withTrailingConversionComment(
              typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
              `ROBLOX TODO: replace 'any' type/ add missing`
            ),
            ...baseClassDefaultExpectedNodes,
            functionDeclaration(
              identifier(`BaseClass.new`),
              [],
              nodeGroup([
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('BaseClass'),
                      ])
                    ),
                  ]
                ),
                returnStatement(selfIdentifier()),
              ]),
              undefined,
              false
            ),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class constructor to <ClassId>.new function', () => {
        const given = getProgramNode(`
        class BaseClass{
            constructor(){}
        }
       `);

        const expected: LuaProgram = program([
          nodeGroup([
            withTrailingConversionComment(
              typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
              `ROBLOX TODO: replace 'any' type/ add missing`
            ),
            ...baseClassDefaultExpectedNodes,
            functionDeclaration(
              identifier('BaseClass.new'),
              [],
              nodeGroup([
                variableDeclaration(
                  [variableDeclaratorIdentifier(identifier('self'))],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('BaseClass'),
                      ])
                    ),
                  ]
                ),
                returnStatement(identifier('self')),
              ]),
              undefined,
              false
            ),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class methods to <ClassId>:<methodName> function', () => {
        const given = getProgramNode(`
        class BaseClass{
            myMethod(){}
        }
       `);

        const expected: LuaProgram = program([
          nodeGroup([
            withTrailingConversionComment(
              typeAliasDeclaration(
                identifier('BaseClass'),
                typeLiteral([
                  typePropertySignature(
                    identifier('myMethod'),
                    typeAnnotation(typeAny())
                  ),
                ])
              ),
              `ROBLOX TODO: replace 'any' type/ add missing`
            ),
            ...baseClassDefaultExpectedNodes,
            functionDeclaration(
              identifier(`BaseClass.new`),
              [],
              nodeGroup([
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('BaseClass'),
                      ])
                    ),
                  ]
                ),
                returnStatement(selfIdentifier()),
              ]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('BaseClass:myMethod'),
              [],
              nodeGroup([]),
              undefined,
              false
            ),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert static class methods to <ClassId>.<methodName> function', () => {
        const given = getProgramNode(`
        class BaseClass{
            static myStaticMethod(){}
        }
       `);

        const expected: LuaProgram = program([
          nodeGroup([
            withTrailingConversionComment(
              typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
              `ROBLOX TODO: replace 'any' type/ add missing`
            ),
            ...baseClassDefaultExpectedNodes,
            functionDeclaration(
              identifier(`BaseClass.new`),
              [],
              nodeGroup([
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('BaseClass'),
                      ])
                    ),
                  ]
                ),
                returnStatement(selfIdentifier()),
              ]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('BaseClass.myStaticMethod'),
              [],
              nodeGroup([]),
              undefined,
              false
            ),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert static properties to <ClassId>.<property>', () => {
        const given = getProgramNode(`
        class BaseClass{
            static staticProperty = "foo"
        }
       `);

        const expected: LuaProgram = program([
          nodeGroup([
            withTrailingConversionComment(
              typeAliasDeclaration(identifier('BaseClass'), typeLiteral([])),
              `ROBLOX TODO: replace 'any' type/ add missing`
            ),
            ...baseClassDefaultExpectedNodes,
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [
                memberExpression(
                  identifier('BaseClass'),
                  '.',
                  identifier('staticProperty')
                ),
              ],
              [stringLiteral('foo')]
            ),
            functionDeclaration(
              identifier(`BaseClass.new`),
              [],
              nodeGroup([
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('BaseClass'),
                      ])
                    ),
                  ]
                ),
                returnStatement(selfIdentifier()),
              ]),
              undefined,
              false
            ),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class abstract methods to <ClassId>:<methodName> function', () => {
        const given = getProgramNode(`
        abstract class BaseClass{
            abstract myMethod();
        }
       `);

        const expected: LuaProgram = program([
          nodeGroup([
            withTrailingConversionComment(
              typeAliasDeclaration(
                identifier('BaseClass'),
                typeLiteral([
                  typePropertySignature(
                    identifier('myMethod'),
                    typeAnnotation(typeAny())
                  ),
                ])
              ),
              `ROBLOX TODO: replace 'any' type/ add missing`
            ),
            ...baseClassDefaultExpectedNodes,
            functionDeclaration(
              identifier(`BaseClass.new`),
              [],
              nodeGroup([
                variableDeclaration(
                  [variableDeclaratorIdentifier(selfIdentifier())],
                  [
                    variableDeclaratorValue(
                      callExpression(identifier('setmetatable'), [
                        tableConstructor(),
                        identifier('BaseClass'),
                      ])
                    ),
                  ]
                ),
                returnStatement(selfIdentifier()),
              ]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('BaseClass:myMethod'),
              [],
              nodeGroup([
                expressionStatement(
                  callExpression(identifier('error'), [
                    stringLiteral('not implemented abstract method'),
                  ])
                ),
              ]),
              undefined,
              false
            ),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });

    describe('SubClass', () => {
      const subClassDefaultExpectedNodes = [
        variableDeclaration(
          [variableDeclaratorIdentifier(identifier('SubClass'))],
          [
            variableDeclaratorValue(
              callExpression(identifier('setmetatable'), [
                tableConstructor(),
                tableConstructor([
                  tableNameKeyField(
                    identifier('__index'),
                    identifier('BaseClass')
                  ),
                ]),
              ])
            ),
          ]
        ),
        assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [
            memberExpression(
              identifier('SubClass'),
              '.',
              identifier('__index')
            ),
          ],
          [identifier('SubClass')]
        ),
      ];
      it('should convert class', () => {
        const given = getProgramNode(`
        class SubClass extends BaseClass{}
       `);

        const expected: LuaProgram = program([
          nodeGroup([
            withTrailingConversionComment(
              typeAliasDeclaration(identifier('SubClass'), typeLiteral([])),
              `ROBLOX TODO: replace 'any' type/ add missing`
            ),
            ...subClassDefaultExpectedNodes,
            functionDeclaration(
              identifier(`SubClass.new`),
              [],
              nodeGroup([
                withTrailingConversionComment(
                  variableDeclaration(
                    [variableDeclaratorIdentifier(selfIdentifier())],
                    [
                      variableDeclaratorValue(
                        callExpression(identifier('setmetatable'), [
                          tableConstructor(),
                          identifier('SubClass'),
                        ])
                      ),
                    ]
                  ),
                  `ROBLOX TODO: super constructor may be used`
                ),
                returnStatement(selfIdentifier()),
              ]),
              undefined,
              false
            ),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class constructor to <ClassId>.new function', () => {
        const given = getProgramNode(`
        class SubClass extends BaseClass{
            constructor(){}
        }
       `);

        const expected: LuaProgram = program([
          nodeGroup([
            withTrailingConversionComment(
              typeAliasDeclaration(identifier('SubClass'), typeLiteral([])),
              `ROBLOX TODO: replace 'any' type/ add missing`
            ),
            ...subClassDefaultExpectedNodes,
            functionDeclaration(
              identifier('SubClass.new'),
              [],
              nodeGroup([
                withTrailingConversionComment(
                  variableDeclaration(
                    [variableDeclaratorIdentifier(identifier('self'))],
                    [
                      variableDeclaratorValue(
                        callExpression(identifier('setmetatable'), [
                          tableConstructor(),
                          identifier('SubClass'),
                        ])
                      ),
                    ]
                  ),
                  `ROBLOX TODO: super constructor may be used`
                ),
                returnStatement(identifier('self')),
              ]),
              undefined,
              false
            ),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert class methods to <ClassId>:<methodName> function', () => {
        const given = getProgramNode(`
        class SubClass extends BaseClass{
            myMethod(){}
        }
       `);

        const expected: LuaProgram = program([
          nodeGroup([
            withTrailingConversionComment(
              typeAliasDeclaration(
                identifier('SubClass'),
                typeLiteral([
                  typePropertySignature(
                    identifier('myMethod'),
                    typeAnnotation(typeAny())
                  ),
                ])
              ),
              `ROBLOX TODO: replace 'any' type/ add missing`
            ),
            ...subClassDefaultExpectedNodes,
            functionDeclaration(
              identifier(`SubClass.new`),
              [],
              nodeGroup([
                withTrailingConversionComment(
                  variableDeclaration(
                    [variableDeclaratorIdentifier(selfIdentifier())],
                    [
                      variableDeclaratorValue(
                        callExpression(identifier('setmetatable'), [
                          tableConstructor(),
                          identifier('SubClass'),
                        ])
                      ),
                    ]
                  ),
                  `ROBLOX TODO: super constructor may be used`
                ),
                returnStatement(selfIdentifier()),
              ]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('SubClass:myMethod'),
              [],
              nodeGroup([]),
              undefined,
              false
            ),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
      it('should convert static class methods to <ClassId>.<methodName> function', () => {
        const given = getProgramNode(`
        class SubClass extends BaseClass{
            static myStaticMethod(){}
        }
       `);

        const expected: LuaProgram = program([
          nodeGroup([
            withTrailingConversionComment(
              typeAliasDeclaration(identifier('SubClass'), typeLiteral([])),
              `ROBLOX TODO: replace 'any' type/ add missing`
            ),
            ...subClassDefaultExpectedNodes,
            functionDeclaration(
              identifier(`SubClass.new`),
              [],
              nodeGroup([
                withTrailingConversionComment(
                  variableDeclaration(
                    [variableDeclaratorIdentifier(selfIdentifier())],
                    [
                      variableDeclaratorValue(
                        callExpression(identifier('setmetatable'), [
                          tableConstructor(),
                          identifier('SubClass'),
                        ])
                      ),
                    ]
                  ),
                  `ROBLOX TODO: super constructor may be used`
                ),
                returnStatement(selfIdentifier()),
              ]),
              undefined,
              false
            ),
            functionDeclaration(
              identifier('SubClass.myStaticMethod'),
              [],
              nodeGroup([]),
              undefined,
              false
            ),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });

      it('should convert static properties to <ClassId>.<property>', () => {
        const given = getProgramNode(`
        class SubClass extends BaseClass{
            static staticProperty = "foo"
        }
       `);

        const expected: LuaProgram = program([
          nodeGroup([
            withTrailingConversionComment(
              typeAliasDeclaration(identifier('SubClass'), typeLiteral([])),
              `ROBLOX TODO: replace 'any' type/ add missing`
            ),
            ...subClassDefaultExpectedNodes,
            assignmentStatement(
              AssignmentStatementOperatorEnum.EQ,
              [
                memberExpression(
                  identifier('SubClass'),
                  '.',
                  identifier('staticProperty')
                ),
              ],
              [stringLiteral('foo')]
            ),
            functionDeclaration(
              identifier(`SubClass.new`),
              [],
              nodeGroup([
                withTrailingConversionComment(
                  variableDeclaration(
                    [variableDeclaratorIdentifier(selfIdentifier())],
                    [
                      variableDeclaratorValue(
                        callExpression(identifier('setmetatable'), [
                          tableConstructor(),
                          identifier('SubClass'),
                        ])
                      ),
                    ]
                  ),
                  `ROBLOX TODO: super constructor may be used`
                ),
                returnStatement(selfIdentifier()),
              ]),
              undefined,
              false
            ),
          ]),
        ]);

        expect(handleProgram.handler(source, {}, given)).toEqual(expected);
      });
    });
  });
});
