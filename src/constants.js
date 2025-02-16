exports.MAIN_ALIAS = '~/'
exports.ROOT_ALIAS = '@/'

const FILE_EXTENSION_MAP = {
  JS: '.js',
  VUE: '.vue',
  CJS: '.cjs',
  STYL: '.styl',
  PNG: '.png',
  JPG: '.jpg',
  SVG: '.svg',
  CSS: '.css',
  SCSS: '.scss',
}
exports.FILE_EXTENSION_MAP = FILE_EXTENSION_MAP

exports.ENTRY_FILE_EXTENSIONS = Object.values(FILE_EXTENSION_MAP)

exports.AST_TYPE = {
  ArrayExpression: 'ArrayExpression',
  AwaitExpression: 'AwaitExpression',
  CallExpression: 'CallExpression',
  FunctionExpression: 'FunctionExpression',
  MemberExpression: 'MemberExpression',
  NewExpression: 'NewExpression',
  ObjectExpression: 'ObjectExpression',
  Identifier: 'Identifier',
  Literal: 'Literal',
  Property: 'Property',
  ImportDeclaration: 'ImportDeclaration',
  ImportDefaultSpecifier: 'ImportDefaultSpecifier',
  ImportSpecifier: 'ImportSpecifier',
  ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
  ImportExpression: 'ImportExpression',
  ExportDefaultDeclaration: 'ExportDefaultDeclaration',
  VariableDeclaration: 'VariableDeclaration',
  VariableDeclarator: 'VariableDeclarator',
  ExpressionStatement: 'ExpressionStatement',
  ReturnStatement: 'ReturnStatement',
  SpreadElement: 'SpreadElement',
  ObjectPattern: 'ObjectPattern',
  Program: 'Program',
  TSTypeParameterInstantiation: 'TSTypeParameterInstantiation',
  TSTypeReference: 'TSTypeReference',
  Line: 'Line',
  ExportNamedDeclaration: 'ExportNamedDeclaration',
  ExportAllDeclaration: 'ExportAllDeclaration',
  ThisExpression: 'ThisExpression',
  ArrowFunctionExpression: 'ArrowFunctionExpression',
}
