const fs = require('fs')
const path = require('path')
const { ENTRY_FILE_EXTENSIONS } = require('./constants')

const getEntryFile = srcPath => {
  const extname = path.extname(srcPath)
  if (ENTRY_FILE_EXTENSIONS.includes(extname)) return srcPath

  const assumedEntries = [
    ...ENTRY_FILE_EXTENSIONS.map(extension => `${srcPath}${extension}`),
    ...ENTRY_FILE_EXTENSIONS.map(extension =>
      path.join(srcPath, `index${extension}`)
    ),
  ]
  const entry = assumedEntries.find(file => fs.existsSync(file))

  return entry || ''
}

module.exports = getEntryFile