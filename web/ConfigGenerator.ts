import template from './spec/templates/config'

const yaml = require('js-yaml')
const fs = require('fs')
const ejs = require('ejs')
import { writeToDisk } from './spec/gen/lib/helpers'

const layout = {
  cli: [
    { id: 'general', title: 'General' },
    { id: 'api', title: 'API' },
    { id: 'database', title: 'Database' },
    { id: 'dashboard', title: 'Dashboard' },
    { id: 'local', title: 'Local Development' },
    { id: 'auth', title: 'Auth' },
  ],
}

const main = (fileNames, options) => {
  try {
    const outputDir = options.o || options.output || ''
    fileNames.forEach((inputFileName) => {
      gen(inputFileName, outputDir)
    })
    return
  } catch (e) {
    console.log(e)
  }
}

async function gen(inputFileName, outputDir) {
  const spec = yaml.safeLoad(fs.readFileSync(inputFileName, 'utf8'))
  // console.log('spec', spec)

  const specLayout = layout[spec.info.id]
  const sections = specLayout.map((section) => {
    const parameters = spec.parameters.filter((parameter) => parameter.tags[0] === section.id)
    return { ...section, parameters }
  })

  const content = ejs.render(template, { info: spec.info, sections })
  // console.log(content)

  // Write to disk
  const dest = outputDir + `/${spec.info.id}.mdx`
  await writeToDisk(dest, content)
  console.log('Saved: ', dest)
}

// Run everything
const argv = require('minimist')(process.argv.slice(2))
main(argv['_'], argv)
