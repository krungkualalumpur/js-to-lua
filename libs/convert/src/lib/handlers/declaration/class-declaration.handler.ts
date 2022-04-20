import {
  ClassBody,
  ClassDeclaration,
  ClassMethod,
  ClassPrivateMethod,
  ClassPrivateProperty,
  ClassProperty,
  Declaration,
  Expression,
  FlowType,
  isClassMethod,
  isClassPrivateMethod,
  isClassPrivateProperty,
  isClassProperty,
  isIdentifier as isBabelIdentifier,
  isPrivateName,
  isTSDeclareMethod,
  isTSParameterProperty,
  LVal,
  Noop,
  Statement,
  TSDeclareMethod,
  TSParameterProperty,
  TSType,
  TSTypeAnnotation,
  TypeAnnotation,
} from '@babel/types';
import {
  BaseNodeHandler,
  createHandler,
  HandlerFunction,
} from '@js-to-lua/handler-utils';
import {
  getNodeSource,
  selfIdentifier,
  withClassDeclarationExtra,
  withTrailingConversionComment,
} from '@js-to-lua/lua-conversion-utils';
import {
  assignmentStatement,
  AssignmentStatementOperatorEnum,
  callExpression,
  functionDeclaration,
  identifier,
  isIdentifier,
  LuaDeclaration,
  LuaExpression,
  LuaIdentifier,
  LuaLVal,
  LuaNodeGroup,
  LuaPropertySignature,
  LuaStatement,
  LuaType,
  LuaTypeAnnotation,
  memberExpression,
  nodeGroup,
  returnStatement,
  tableConstructor,
  tableNameKeyField,
  typeAliasDeclaration,
  typeAnnotation,
  typeAny,
  typeCastExpression,
  typeLiteral,
  typePropertySignature,
  typeReference,
  unhandledStatement,
  variableDeclaration,
  variableDeclaratorIdentifier,
  variableDeclaratorValue,
} from '@js-to-lua/lua-types';
import { Unpacked } from '@js-to-lua/shared-utils';
import { createFunctionBodyHandler } from '../expression/function-body.handler';
import {
  createFunctionParamsBodyHandler,
  createFunctionParamsHandler,
} from '../function-params.handler';
import { createAssignmentPatternHandlerFunction } from '../statement/assignment/assignment-pattern.handler';

export const createClassDeclarationHandler = (
  handleExpression: HandlerFunction<LuaExpression, Expression>,
  handleExpressionAsStatement: HandlerFunction<
    LuaExpression | LuaStatement,
    Expression
  >,
  handleIdentifier: HandlerFunction<LuaLVal, LVal>,
  handleStatement: HandlerFunction<LuaStatement, Statement>,
  handleDeclaration: HandlerFunction<
    LuaNodeGroup | LuaDeclaration,
    Declaration
  >,
  handleLVal: HandlerFunction<LuaLVal, LVal>,
  handleTypeAnnotation: HandlerFunction<
    LuaTypeAnnotation,
    TypeAnnotation | TSTypeAnnotation | Noop
  >,
  handleType: HandlerFunction<LuaType, FlowType | TSType>
): BaseNodeHandler<LuaNodeGroup, ClassDeclaration> =>
  createHandler('ClassDeclaration', (source, config, node) => {
    let unhandledAssignments = 0;
    const handleAssignmentPattern = createAssignmentPatternHandlerFunction(
      handleExpression,
      handleIdentifier
    );

    const functionParamsHandler = createFunctionParamsHandler(
      handleIdentifier,
      handleTypeAnnotation,
      handleType
    );

    const handleParamsBody = createFunctionParamsBodyHandler(
      handleDeclaration,
      handleAssignmentPattern,
      handleLVal
    );

    const functionBodyHandler = createFunctionBodyHandler(
      handleStatement,
      handleExpressionAsStatement
    );

    const declaratorValue = node.superClass
      ? callExpression(identifier('setmetatable'), [
          tableConstructor(),
          tableConstructor([
            tableNameKeyField(
              identifier('__index'),
              handleExpression(source, config, node.superClass)
            ),
          ]),
        ])
      : tableConstructor();

    type ClassBodyNode = Unpacked<ClassBody['body']>;

    const isClassConstructor = (node: ClassBodyNode): node is ClassMethod =>
      isClassMethod(node) &&
      isBabelIdentifier(node.key) &&
      node.key.name === 'constructor';

    const constructorMethod = node.body.body.find(isClassConstructor);

    const isAnyClassProperty = (
      node: ClassBodyNode
    ): node is ClassProperty | ClassPrivateProperty =>
      isClassProperty(node) || isClassPrivateProperty(node);

    const isAnyClassMethod = (
      node: ClassBodyNode
    ): node is ClassMethod | ClassPrivateMethod | TSDeclareMethod =>
      isClassMethod(node) ||
      isClassPrivateMethod(node) ||
      isTSDeclareMethod(node);

    const isPublic = (node: {
      accessibility?: 'public' | 'private' | 'protected' | null;
    }): boolean => !node.accessibility || node.accessibility === 'public';

    const isPublicClassMethod = (
      node: ClassBodyNode
    ): node is ClassMethod | TSDeclareMethod =>
      (isClassMethod(node) || isTSDeclareMethod(node)) && isPublic(node);

    const nonStaticInitializedClassProperties = node.body.body
      .filter(isAnyClassProperty)
      .filter((n) => n.value && !n.static);

    const staticInitializedClassProperties = node.body.body
      .filter(isAnyClassProperty)
      .filter((n) => n.value && n.static);

    const bodyWithoutConstructor = node.body.body.filter(
      (n) => !isClassConstructor(n)
    );

    const constructorPublicTsParameters: TSParameterProperty[] =
      (constructorMethod &&
        constructorMethod.params.filter(
          (n): n is TSParameterProperty =>
            isTSParameterProperty(n) && n.accessibility === 'public'
        )) ||
      [];

    const publicMethodsAndProperties = [
      ...bodyWithoutConstructor.filter(
        (n): n is ClassMethod | TSDeclareMethod | ClassProperty =>
          (isPublicClassMethod(n) || isClassProperty(n)) &&
          !n.static &&
          isPublic(n)
      ),
    ];

    function removeTypeAnnotations<T>(node: T) {
      return {
        ...node,
        ...((node as any).typeAnnotation ? { typeAnnotation: null } : {}),
      } as T;
    }

    const classNodeMaybeIdentifier = handleIdentifier(source, config, node.id);

    if (!isIdentifier(classNodeMaybeIdentifier)) {
      return withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX comment: unhandled class with identifier of type ${classNodeMaybeIdentifier.type}`,
        getNodeSource(source, node)
      );
    }
    const classNodeIdentifier = classNodeMaybeIdentifier;

    const publicTypes: LuaPropertySignature[] = [
      ...constructorPublicTsParameters.map((n) => {
        let id: LuaIdentifier;
        if (isBabelIdentifier(n.parameter)) {
          id = handleIdentifier(source, config, n.parameter);
        } else {
          if (isBabelIdentifier(n.parameter.left)) {
            id = handleIdentifier(source, config, n.parameter.left);
          } else {
            id = withTrailingConversionComment(
              identifier(`__unhandled__${'_'.repeat(unhandledAssignments++)}`),
              getNodeSource(source, n.parameter.left)
            );
          }
        }
        return typePropertySignature(
          removeTypeAnnotations(id),
          typeAnnotation(typeAny())
        );
      }),
      ...publicMethodsAndProperties.map((n) => {
        return typePropertySignature(
          removeTypeAnnotations(handleExpression(source, config, n.key)),
          typeAnnotation(typeAny())
        );
      }),
    ];

    const classConversion = [
      variableDeclaration(
        [variableDeclaratorIdentifier(classNodeIdentifier)],
        [variableDeclaratorValue(declaratorValue)]
      ),
      assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [memberExpression(classNodeIdentifier, '.', identifier('__index'))],
        [classNodeIdentifier]
      ),
      ...staticInitializedClassProperties.map(handleStaticProps),
      ...handleConstructor(constructorMethod),
      ...bodyWithoutConstructor
        .filter((n) => !isAnyClassProperty(n))
        .map((n) => {
          if (isAnyClassMethod(n)) {
            return handleClassMethod(n);
          } else {
            return withTrailingConversionComment(
              unhandledStatement(),
              `ROBLOX comment: unhandled class body node type ${n.type}`,
              getNodeSource(source, n)
            );
          }
        }),
    ];

    return withClassDeclarationExtra(
      nodeGroup([
        withTrailingConversionComment(
          typeAliasDeclaration(classNodeIdentifier, typeLiteral(publicTypes)),
          `ROBLOX TODO: replace 'any' type/ add missing`
        ),
        ...classConversion,
      ])
    );

    function handleStaticProps(property: ClassProperty | ClassPrivateProperty) {
      return assignmentStatement(
        AssignmentStatementOperatorEnum.EQ,
        [
          memberExpression(
            classNodeIdentifier,
            '.',
            handleExpression(source, config, property.key as Expression)
          ),
        ],
        [handleExpression(source, config, property.value!)]
      );
    }

    function handleConstructorTsParameterProp(node: TSParameterProperty) {
      if (isBabelIdentifier(node.parameter)) {
        return assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [
            memberExpression(
              selfIdentifier(),
              '.',
              handleIdentifier(
                source,
                config,
                removeTypeAnnotations(node.parameter)
              )
            ),
          ],
          [
            handleIdentifier(
              source,
              config,
              removeTypeAnnotations(node.parameter)
            ),
          ]
        );
      }

      if (isBabelIdentifier(node.parameter.left)) {
        return assignmentStatement(
          AssignmentStatementOperatorEnum.EQ,
          [
            memberExpression(
              selfIdentifier(),
              '.',
              handleIdentifier(
                source,
                config,
                removeTypeAnnotations(node.parameter.left)
              )
            ),
          ],
          [
            handleIdentifier(
              source,
              config,
              removeTypeAnnotations(node.parameter.left)
            ),
          ]
        );
      }
      return withTrailingConversionComment(
        unhandledStatement(),
        `ROBLOX comment: unhandled parameter type ${node.parameter.type} and left value of type ${node.parameter.left.type}`,
        getNodeSource(source, node.parameter)
      );
    }

    function handleConstructor(constructorMethod?: ClassMethod) {
      const defaultSelfDeclaration = variableDeclaration(
        [variableDeclaratorIdentifier(selfIdentifier())],
        [
          variableDeclaratorValue(
            callExpression(identifier('setmetatable'), [
              tableConstructor(),
              classNodeIdentifier,
            ])
          ),
        ]
      );

      return constructorMethod
        ? [
            functionDeclaration(
              identifier(`${classNodeIdentifier.name}.new`),
              [...functionParamsHandler(source, config, constructorMethod)],
              nodeGroup([
                node.superClass
                  ? withTrailingConversionComment(
                      defaultSelfDeclaration,
                      `ROBLOX TODO: super constructor may be used`
                    )
                  : defaultSelfDeclaration,
                ...handleParamsBody(source, config, constructorMethod),
                ...constructorMethod.params
                  .filter((n): n is TSParameterProperty =>
                    isTSParameterProperty(n)
                  )
                  .map(handleConstructorTsParameterProp),
                ...nonStaticInitializedClassProperties.map((n) =>
                  assignmentStatement(
                    AssignmentStatementOperatorEnum.EQ,
                    [
                      memberExpression(
                        selfIdentifier(),
                        '.',
                        handleExpression(source, config, n.key as Expression)
                      ),
                    ],
                    [handleExpression(source, config, n.value!)]
                  )
                ),
                ...functionBodyHandler(source, config, constructorMethod),
                returnStatement(
                  typeCastExpression(
                    typeCastExpression(selfIdentifier(), typeAny()),
                    typeReference(classNodeIdentifier)
                  )
                ),
              ]),
              typeAnnotation(typeReference(classNodeIdentifier)),
              false
            ),
          ]
        : [
            functionDeclaration(
              identifier(`${(classNodeIdentifier as LuaIdentifier).name}.new`),
              [],
              nodeGroup([
                node.superClass
                  ? withTrailingConversionComment(
                      defaultSelfDeclaration,
                      `ROBLOX TODO: super constructor may be used`
                    )
                  : defaultSelfDeclaration,
                returnStatement(
                  typeCastExpression(
                    typeCastExpression(selfIdentifier(), typeAny()),
                    typeReference(classNodeIdentifier)
                  )
                ),
              ]),
              typeAnnotation(typeReference(classNodeIdentifier)),
              false
            ),
          ];
    }

    function handleClassMethod(
      node: ClassMethod | ClassPrivateMethod | TSDeclareMethod
    ) {
      if (isPrivateName(node.key)) {
        return withTrailingConversionComment(
          unhandledStatement(),
          `ROBLOX comment: unhandled class body node type ${node.key.type}`,
          getNodeSource(source, node)
        );
      }
      const id = handleExpression(source, config, node.key);

      return isBabelIdentifier(node.key) && isIdentifier(id)
        ? functionDeclaration(
            identifier(
              `${(classNodeIdentifier as LuaIdentifier).name}${
                node.static ? '.' : ':'
              }${id.name}`
            ),
            [...functionParamsHandler(source, config, node)],
            nodeGroup([
              ...handleParamsBody(source, config, node),
              ...functionBodyHandler(source, config, node),
            ]),
            node.returnType
              ? handleTypeAnnotation(source, config, node.returnType)
              : undefined,
            false
          )
        : withTrailingConversionComment(
            unhandledStatement(),
            `ROBLOX comment: unhandled key type ${node.key.type}`,
            getNodeSource(source, node.key)
          );
    }
  });
