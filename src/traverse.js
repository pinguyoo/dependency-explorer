const fs = require('fs')
const path = require('path')
const { ENTRY_FILE_EXTENSIONS } = require('./constants')
const findImports = require('./find-imports')
const getAbsoluteFilePath = require('./get-absolute-file-path')

const getAbsoluteImportPath = ({ src, importPath, root }) => {
  const filePath = getAbsoluteFilePath({ src, filePath: importPath, root })

  if (!fs.existsSync(filePath)) return importPath

  return filePath
}

const shouldIgnoreFile = ({ src, exclusions }) => {
  const isInExclusions = exclusions.filter(exclusion => src.startsWith(exclusion)).length > 0
  if (isInExclusions) return true

  const extension = path.extname(src)
  if (!ENTRY_FILE_EXTENSIONS.includes(extension)) return true

  return false
}

const traverseImportFiles = ({ src, doAction, set, previousResult = null, root, exclusions = [] }) => {
  if (shouldIgnoreFile({ src, exclusions })) return

  const imports = findImports(src)
  imports.forEach(importPath => {
    const absoluteImportPath = getAbsoluteImportPath({ src, importPath, root })
    if (set.has(absoluteImportPath)) return

    set.add(absoluteImportPath)
    if (!fs.existsSync(absoluteImportPath)) return doAction?.(importPath)

    if (shouldIgnoreFile({ src: absoluteImportPath, exclusions })) return

    const result = doAction?.(absoluteImportPath, previousResult)
    traverseImportFiles({
      src: absoluteImportPath,
      doAction,
      set,
      previousResult: result,
      root,
      exclusions,
    })
  })
}

const traverseFolder = ({ src, doAction, set, root, exclusions = [] }) => {
  const items = fs.readdirSync(src)
  for (const item of items) {
    const itemPath = path.join(src, item)
    if (!fs.existsSync(itemPath)) continue

    const stat = fs.statSync(itemPath)
    if (stat.isDirectory()) {
      traverse({ src: itemPath, doAction, set, root, exclusions })
      continue
    }

    if (shouldIgnoreFile({ src: itemPath, exclusions })) continue

    doAction?.(itemPath)
    traverseImportFiles({ src: itemPath, doAction, set, root, exclusions })
  }
}

// eslint-disable-next-line no-unused-vars
const traverse = ({ src, doAction = () => {}, set, root, exclusions = [] }) => {
  if (!src) return
  if (exclusions.includes(src)) return
  if (!fs.existsSync(src)) return

  const stat = fs.statSync(src)
  if (stat.isDirectory()) {
    traverseFolder({ src, doAction, set, root, exclusions })
    return
  }

  if (shouldIgnoreFile({ src, exclusions })) return

  doAction?.(src)
  traverseImportFiles({ src, doAction, set, root, exclusions })
}

module.exports = ({ sources = [], doAction, root, exclusions = [] }) => {
  const set = new Set()
  sources.forEach(src => traverse({ src, doAction, set, root, exclusions }))
}
