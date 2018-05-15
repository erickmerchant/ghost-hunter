const chalk = require('chalk')
const path = require('path')
const assert = require('assert')
const promisify = require('util').promisify
const glob = promisify(require('glob'))
const readFile = promisify(require('fs').readFile)

module.exports = function (deps) {
  assert.ok(deps.error)

  assert.equal(typeof deps.error.write, 'function')

  return function ({option, parameter}) {
    parameter('sourcemap', {
      description: 'The sourcemap',
      required: true
    })

    parameter('files', {
      description: 'A glob to your code',
      required: true,
      multiple: true
    })

    option('base', {
      description: 'What to resolve source map files against',
      type: function directory (val) {
        if (val == null) return '.'

        return val
      }
    })

    return function (args) {
      return Promise.all([
        readFile(args.sourcemap).then((sourcemap) => JSON.parse(sourcemap)),
        Promise.all(args.files.map((files) => glob(files, {nodir: true})))
          .then(function (files) {
            return files.reduce((files, current) => files.concat(current.map((file) => path.resolve(file))), [])
          })
      ]).then(function ([sourcemap, files]) {
        const sources = sourcemap.sources.map((file) => path.resolve(args.base, file))

        for (let file of files) {
          if (!sources.includes(file)) {
            deps.error.write(chalk.red(file) + '\n')
          }
        }
      })
    }
  }
}
