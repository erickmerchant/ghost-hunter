const kleur = require('kleur')
const path = require('path')
const assert = require('assert')
const promisify = require('util').promisify
const glob = promisify(require('glob'))
const streamPromise = require('stream-to-promise')
const createReadStream = require('fs').createReadStream

module.exports = (deps) => {
  assert.ok(deps.error)

  assert.strictEqual(typeof deps.error.write, 'function')

  return async (args) => {
    const [sourcemap, files] = await Promise.all([
      streamPromise(createReadStream(args.sourcemap)).then((sourcemap) => JSON.parse(sourcemap)),
      Promise.all(args.files.map((files) => glob(files, { nodir: true })))
        .then((files) => {
          return files.reduce((files, current) => files.concat(current.map((file) => path.resolve(file))), [])
        })
    ])

    const sources = sourcemap.sources.map((file) => path.resolve(args.base, file))

    for (const file of files) {
      if (!sources.includes(file)) {
        deps.error.write(kleur.red(file) + '\n')
      }
    }
  }
}
