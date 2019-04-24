const {red} = require('kleur')
const path = require('path')
const promisify = require('util').promisify
const glob = promisify(require('glob'))
const streamPromise = require('stream-to-promise')
const createReadStream = require('fs').createReadStream

module.exports = ({console}) => async (args) => {
  const [sourcemap, files] = await Promise.all([
    streamPromise(createReadStream(args.sourcemap)).then((sourcemap) => JSON.parse(sourcemap)),
    Promise.all(args.file.map((files) => glob(files, {nodir: true})))
      .then((files) => files.reduce((files, current) => {
        files.push(...current.map((file) => path.resolve(file)))

        return files
      }, []))
  ])

  const sources = sourcemap.sources.map((file) => path.resolve(args.base, file))

  for (const file of files) {
    if (!sources.includes(file)) {
      console.error(`${red(file)}`)
    }
  }
}
