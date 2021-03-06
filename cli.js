#!/usr/bin/env node

const {command, start} = require('sergeant')('ghost-hunter')
const hunter = require('./main.js')

command(({option, parameter, description}) => {
  description('find unused files using a sourcemap')

  parameter({
    name: 'sourcemap',
    description: 'the sourcemap',
    required: true
  })

  parameter({
    name: 'file',
    description: 'a file to check',
    required: true,
    multiple: true
  })

  option({
    name: 'base',
    description: 'A directory to resolve source map files against',
    type(val = '.') {
      return val
    },
    alias: 'b'
  })

  return (args) => hunter({console})(args)
})

start(process.argv.slice(2))
