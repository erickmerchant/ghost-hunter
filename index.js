#!/usr/bin/env node
'use strict'

const command = require('sergeant')
const chalk = require('chalk')
const path = require('path')
const thenify = require('thenify')
const glob = thenify(require('glob'))
const readFile = thenify(require('fs').readFile)

command('ghost-hunter', function ({option, parameter}) {
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
    default: { value: '.' }
  })

  return function (args) {
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
})(process.argv.slice(2))
