#!/usr/bin/env node

const command = require('sergeant')
const hunter = require('./index')

command('ghost-hunter', 'find unused files using a sourcemap', ({option, parameter}) => {
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
    description: 'A directory to resolve source map files against',
    type(val = '.') {
      return val
    },
    alias: 'b'
  })

  return (args) => hunter({error: process.stderr})(args)
})(process.argv.slice(2))
