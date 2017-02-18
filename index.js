#!/usr/bin/env node
'use strict'

const command = require('sergeant/command')()
const assert = require('assert')
const chalk = require('chalk')
const path = require('path')
const thenify = require('thenify')
const glob = thenify(require('glob'))
const readFile = thenify(require('fs').readFile)

command.describe('')
.parameter('sourcemap', 'The sourcemap')
.parameter('files', 'A glob to your code')
.option('base', 'What to resolve source map files against')
.action(function (args) {
  assert.ok(args.has('files'), 'files are required')
  assert.ok(args.has('sourcemap'), 'sourcemap is required')

  return Promise.all([
    readFile(args.get('sourcemap')).then((sourcemap) => JSON.parse(sourcemap)),
    glob(args.get('files')).then((files) => files.map((file) => path.resolve(file)))
  ]).then(function ([sourcemap, files]) {
    let result = 0
    const sources = sourcemap.sources.map((file) => path.resolve(args.get('base') || process.cwd(), file))

    files.forEach(function (file) {
      if (!sources.includes(file)) {
        console.error(chalk.red(file))

        result = 1
      }
    })

    if (result) throw new Error()
  })
})

command.run().catch(function (err) {
  err.message && console.error(chalk.red(err.message))
})
