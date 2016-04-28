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
  rulesDirectory: join(__dirname, '../node_modules/tslint-eslint-rules/dist/rules')
}

program
  .version(packageInfo.version)
  .usage('<file ...>')
  .parse(process.argv)

const cwd = process.cwd()
const args = program.args.length !== 0 ? program.args : [`!(node_modules|typings)/**/*.ts`, `!(node_modules|typings)/**/*.tsx`]
const absolutePathToFiles = flatten(args.map((p) => join(cwd, p)).map((path) => glob.sync(path)))

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
  process.exit(0)
}

linitngFailures.forEach((failure) => {
  console.log(` ${failure.fileName}:${failure.startPosition.lineAndCharacter.line}:${failure.startPosition.lineAndCharacter.character}: ${failure.failure}`)
})
process.exit(1)
