# StandardTS

Opinionated code style for TypeScript based on StandardJS.

```npm install standardts -g```

## Currently supported
 - no semicolons
 - single quotes
 - no unused variables
 - use always `===` (only `== null` check allowed)

## Usage
```
standardts <files...>
```

`standardts` by default will run linting on every ts or tsx file in the current working directory (omitting `node_modules` and `typings`) 


## Development
Package is under *heavy* development. Community input is appreciated.