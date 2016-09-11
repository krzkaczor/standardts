#!/usr/bin/env node

import * as program from 'commander'
import {join} from 'path'
import * as Linter from 'tslint'
import * as fs from 'fs'
import * as glob from 'glob'
import {flatten} from 'lodash'

const packageInfo = require('../package.json')
const rules = require('./../tslint.json').rules

const options = {
  configuration: {
    rules
  },
  formatter: 'json',
  formattersDirectory: '',
  rulesDirectory: join(require.resolve('tslint-eslint-rules'), '../dist/rules')
}

program
  .version(packageInfo.version)
  .usage('<file ...>')
  .parse(process.argv)

const cwd = process.cwd()
const args = program.args

let absolutePathToFiles: Array<string>

if (args.length > 0) {
  absolutePathToFiles = flatten(args.map((p) => join(cwd, p)).map((path) => glob.sync(path)))
} else {
  absolutePathToFiles = glob.sync('**/*.ts', {ignore: [`node_modules/**/*.ts`, `typings/**/*.ts`]})
}

console.info(`Checking ${absolutePathToFiles.length} files...`)

const linitngFailures = absolutePathToFiles.reduce((failures, absPath) => {
  const source = fs.readFileSync(absPath, 'utf8')
  var ll = new Linter(absPath, source, options)
  const results = ll.lint()

  if (results.failureCount > 0) {
    return failures.concat(results.failures)
  } else {
    return failures
  }
}, [])

if (linitngFailures.length === 0) {
  console.info('Done!')
  process.exit(0)
}

linitngFailures.forEach((failure) => {
  console.log(` ${failure.fileName}:${failure.startPosition.lineAndCharacter.line + 1}:${failure.startPosition.lineAndCharacter.character + 1}: ${failure.failure}`)
})
console.log(`Errors: ${linitngFailures.length}`)

process.exit(1)
