const chalk = require('chalk')
const path = require('path')
const thenify = require('thenify')
const glob = thenify(require('glob'))
const readFile = thenify(require('fs').readFile)

module.exports = function (args) {
  return Promise.all([
    readFile(args.sourcemap).then((sourcemap) => JSON.parse(sourcemap)),
    Promise.all(args.files.map((files) => glob(files, {nodir: true})))
  ]).then(function ([sourcemap, files]) {
    files = files.reduce((files, current) => files.concat(current.map((file) => path.resolve(file))), [])

    const sources = sourcemap.sources.map((file) => path.resolve(args.base, file))

    files.forEach(function (file) {
      if (!sources.includes(file)) {
        console.error(chalk.red(file))
      }
    })
  })
}
