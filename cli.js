#!/usr/bin/env node

const command = require('sergeant')
const hunter = require('./index')

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

  return hunter
})(process.argv.slice(2))
