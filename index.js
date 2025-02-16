const traverse = require('./src/traverse')
const { input } = require('@inquirer/prompts')

const validateName = value => {
  if (!value) return 'Please provide a valid file or directory path'
  return true
}

const main = async () => {
  try {
    const entryFilePath = await input({
      message: 'Enter the entry file or directory path of the project you want to explore: e.g. src/pages/index.vue',
      validate: validateName,
    })

    traverse({
      sources: [entryFilePath],
      doAction: name => console.log(name),
    })
  } catch (error) {
    console.error(error)
  }
}

main()