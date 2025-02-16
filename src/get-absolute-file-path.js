const path = require('path')
const { MAIN_ALIAS, ROOT_ALIAS  } = require('./constants')
const getEntryFile = require('./get-entry-file')

const getSourcePath = ({ src, filePath, root }) => {
  if (filePath.startsWith(MAIN_ALIAS)) {
    return path.resolve(root, filePath.replace(MAIN_ALIAS, ''))
  }

  if (filePath.startsWith(ROOT_ALIAS)) {
    return path.resolve(root, filePath.replace(ROOT_ALIAS, ''))
  }

  return path.resolve(path.dirname(src), filePath)
}

module.exports = ({ src, filePath, root }) => {
  const srcPath = getSourcePath({ src, filePath, root })
  return getEntryFile(srcPath)
}
