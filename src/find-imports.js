
const fs = require('fs')
const path = require('path')
const { AST_TYPE, FILE_EXTENSION_MAP } = require('./constants')
const getFileElementsByExtension = require('./get-file-elements-by-extension')
const getAst = require('./get-ast')

const IMPORT_SOURCE_DECLARATIONS = [AST_TYPE.ImportDeclaration, AST_TYPE.ExportNamedDeclaration, AST_TYPE.ExportAllDeclaration]

const REQUIRE = 'require'
const LOAD_MODULE = 'loadModule'
const DYNAMIC_IMPORTS_REGEX = /import\s*\(\s*(?:\/\*[^*]*\*+(?:[^/*][^*]*\*+)*\/\s*)?(?:'([^']+)'|"([^"]+)")\s*\)/g
const SOURCE_REGEX = /src=['"](?:require\(['"])?([^'")]+)(?:['"]\))?['"]|require\(['"]([^'")]+)['"]\)/g
const URL_ELEMENT_REGEX = /url\(['"]([^'")]+)['"]\)/g
const AVAILABLE_EXTENSIONS = Object.values(FILE_EXTENSION_MAP)

const getIsAvailableRequireDeclaration = node => {
  if (node.type !== AST_TYPE.VariableDeclaration) return false
  const callerType = node.declarations[0].init?.type

  if (callerType !== AST_TYPE.CallExpression) return false

  return node.declarations[0].init.callee.name === REQUIRE
}

const getIsAvailableLoadModuleDeclaration = node => {
  if (node.type !== AST_TYPE.VariableDeclaration) return false

  const callerType = node.declarations[0].init?.type
  if (callerType !== AST_TYPE.MemberExpression) return false

  return node.declarations[0].init.object.name === LOAD_MODULE
}

const getDynamicImports = content => {
  const matches = [...content.matchAll(DYNAMIC_IMPORTS_REGEX)].map(match => match[1])
  return matches
}

const getSourceElements = content => {
  const matches = [...content.matchAll(SOURCE_REGEX)].map(match => match[1] || match[2])
  const availableElements = matches.filter(match => {
    const extname = path.extname(match)
    return AVAILABLE_EXTENSIONS.includes(extname)
  })
  return availableElements
}

const getURLImageElements = content => {
  const matches = [...content.matchAll(URL_ELEMENT_REGEX)].map(match => match[1])
  return matches
}

const getDeclarationArgument = ({ node, declarationFilter }) => {
  return node.filter(declarationFilter).map(node => node.declarations[0].init.arguments[0].value)
}

const getImportsFromScript = filePath => {
  const elements = getFileElementsByExtension(filePath)
  if (!elements.script) return []

  const ast = getAst(elements.script)
  const imports = ast.body
    .filter(node => IMPORT_SOURCE_DECLARATIONS.includes(node.type) && node.source)
    .map(node => node.source.value)
  const requires = getDeclarationArgument({ node: ast.body, declarationFilter: getIsAvailableRequireDeclaration })
  const loadModules = getDeclarationArgument({ node: ast.body, declarationFilter: getIsAvailableLoadModuleDeclaration })

  return [...imports, ...requires, ...loadModules]
}

module.exports = filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const dynamicImports = getDynamicImports(content)
    const sources = getSourceElements(content)
    const urlElements = getURLImageElements(content)

    return [...getImportsFromScript(filePath), ...dynamicImports, ...sources, ...urlElements].filter(Boolean)
  } catch (error) {
    console.error(error)
    return []
  }
}
