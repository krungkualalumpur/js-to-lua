import { TSUnknownKeyword } from '@babel/types';
import { createHandler } from '@js-to-lua/handler-utils';
import { identifier, LuaType, typeReference } from '@js-to-lua/lua-types';

export const createTsUnknownKeywordHandler = () =>
  createHandler<LuaType, TSUnknownKeyword>('TSUnknownKeyword', () =>
    typeReference(identifier('unknown'))
  );
