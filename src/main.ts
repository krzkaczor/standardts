const program = require('commander')
const path = require('path')
const Linter = require("tslint")
const fs = require("fs")

const packageInfo = require('../package.json')
const rules = require('./../rules.json')

const options = {
    configuration: {
        rules
    },
    formatter: "json",
    rulesDirectory: "node_modules/tslint-eslint-rules/dist/rules"
}

program
    .version(packageInfo.version)
    .usage('<file ...>')
    .parse(process.argv)

const cwd = process.cwd()
const absolutePathToFiles = program.args.map((p:string) => path.join(cwd, p))

const linitngFailures = absolutePathToFiles.reduce((failures: any, absPath:string) => {
    const source = fs.readFileSync(absPath, "utf8")
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

linitngFailures.forEach((failure :any) => {
    console.log(` ${failure.fileName}:${failure.startPosition.lineAndCharacter.line}:${failure.startPosition.lineAndCharacter.character}: ${failure.failure}`)
})
process.exit(1)
