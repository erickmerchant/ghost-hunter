#!/usr/bin/env node

const command = require('sergeant')
const hunter = require('./index')

command('ghost-hunter', hunter({error: process.stderr}))(process.argv.slice(2))
