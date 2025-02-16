const acorn = require('acorn')
const walk = require('acorn-walk')
const jsx = require('acorn-jsx')
const { extend } = require('acorn-jsx-walk')

module.exports = input => {
  const parser = acorn.Parser.extend(jsx())
  extend(walk.base)
  const ast = parser.parse(input, {
    sourceType: 'module',
    ecmaVersion: 2020,
  })

  return ast
}
