#!/usr/bin/env node

import * as program from 'commander'
import {join} from 'path'
import {Linter, RuleFailure} from 'tslint'
import * as fs from 'fs'
import * as glob from 'glob'
import {flatten} from 'lodash'

const packageInfo = require('../package.json')
const configuration = require('../tslint.json')

program
  .version(packageInfo.version)
  .usage('<file ...>')
  .option('--fix', 'Automatically fix some violations')
  .parse(process.argv)

interface Program extends program.IExportedCommand {
  fix: boolean
}

const cwd = process.cwd()
const args = program.args

const linter = new Linter({
  formatter: 'json',
  formattersDirectory: '',
  rulesDirectory: join(require.resolve('tslint-eslint-rules'), '../dist/rules'),
  fix: (program as Program).fix
})

let absolutePathToFiles: Array<string>

if (args.length > 0) {
  absolutePathToFiles = flatten(args.map((p) => join(cwd, p)).map((path) => glob.sync(path)))
} else {
  absolutePathToFiles = glob.sync('**/*.ts?(x)', {ignore: ['node_modules/**/*.ts?(x)', 'typings/**/*.ts?(x)']})
}

console.info(`Checking ${absolutePathToFiles.length} files...`)

const lintingFailures = absolutePathToFiles.reduce<RuleFailure[]>((failures, absPath) => {
  const source = fs.readFileSync(absPath, 'utf8')
  linter.lint(absPath, source, configuration)
  const results = linter.getResult()

  if (results.failureCount > 0) {
    return failures.concat(results.failures)
  } else {
    return failures
  }
}, [] as RuleFailure[])

if (lintingFailures.length === 0) {
  console.info('Done!')
  process.exit(0)
}

lintingFailures.forEach((failure) => {
  const fileName = failure.getFileName()
  const {line, character} = failure.getStartPosition().getLineAndCharacter()
  const message = failure.getFailure()
  console.log(` ${fileName}:${line + 1}:${character + 1}: ${message}`)
})
console.log(`Errors: ${lintingFailures.length}`)

process.exit(1)
