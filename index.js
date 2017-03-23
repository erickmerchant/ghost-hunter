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
    required: true
  })

  option('base', {
    description: 'What to resolve source map files against',
    default: process.cwd()
  })

  return function (args) {
    return Promise.all([
      readFile(args.sourcemap).then((sourcemap) => JSON.parse(sourcemap)),
      glob(args.files).then((files) => files.map((file) => path.resolve(file)))
    ]).then(function ([sourcemap, files]) {
      const sources = sourcemap.sources.map((file) => path.resolve(args.base, file))

      files.forEach(function (file) {
        if (!sources.includes(file)) {
          console.error(chalk.red(file))
        }
      })
    })
  }
})(process.argv.slice(2))
