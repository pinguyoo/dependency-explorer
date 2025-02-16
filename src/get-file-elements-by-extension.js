const fs = require('fs')
const path = require('path')
const { FILE_EXTENSION_MAP } = require('./constants')
const getVueElements = require('./get-vue-elements')

module.exports = filePath => {
  if (!fs.existsSync(filePath)) return {}

  const extension = path.extname(filePath)
  const content = fs.readFileSync(filePath, 'utf8')

  if (extension === FILE_EXTENSION_MAP.VUE) {
    return getVueElements(content)
  }

  if (extension === FILE_EXTENSION_MAP.JS) {
    return { script: content }
  }

  return {}
}
