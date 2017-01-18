# StandardTS

Opinionated code style for TypeScript based on StandardJS.

```npm install standardts -g```

## Currently supported
 - no semicolons
 - single quotes
 - use spaces for indent
 - no unused variables
 - use always `===` (only `== null` check allowed)
 - parameters named `err` or `error` must always be handled

## Usage
```
standardts <files...> [--fix]
```

`standardts` by default will run linting on every `ts` or `tsx` file in the current working directory (omitting `node_modules` and `typings`)

## Missing core rules
 - use always 2 spaces for indent (currently [http://palantir.github.io/tslint/rules/indent/](indent rule) doesn't  support it)
 - promise helpers
 - typescript specific rules
 - react specific rules

## TSlint rules created thanks to this project:
 - `handle-callback-err`

## Development
Package is under *heavy* development. Community input is appreciated.
