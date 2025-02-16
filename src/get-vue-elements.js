const compiler = require('@vue/compiler-sfc')

module.exports = content => {
  const descriptor = compiler.parse(content).descriptor
  const template = (descriptor.template?.content || '').trimStart()

  return {
    template,
    script: descriptor.script?.content || '',
    styles: descriptor.styles,
  }
}
