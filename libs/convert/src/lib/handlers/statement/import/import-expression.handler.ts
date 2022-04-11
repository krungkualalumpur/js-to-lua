import { StringLiteral } from '@babel/types';
import { createHandlerFunction } from '@js-to-lua/handler-utils';
import {
  getModulePath,
  memberExpressionFromPath,
  withExtras,
} from '@js-to-lua/lua-conversion-utils';
import {
  callExpression,
  identifier,
  LuaCallExpression,
} from '@js-to-lua/lua-types';

export const createImportExpressionHandler = () => {
  return createHandlerFunction(
    (
      source,
      config: { isInitFile?: boolean },
      node: StringLiteral
    ): LuaCallExpression => {
      const { isRelative, path } = getModulePath(
        { isInitFile: !!config.isInitFile },
        node.value
      );

      const requireExpression = callExpression(identifier('require'), [
        memberExpressionFromPath(path),
      ]);
      return isRelative
        ? requireExpression
        : withExtras<{ needsPackages: true }, LuaCallExpression>({
            needsPackages: true,
          })(requireExpression);
    }
  );
};
