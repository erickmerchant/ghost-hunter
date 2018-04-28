const test = require('tape')
const execa = require('execa')
const chalk = require('chalk')
const path = require('path')

const noopDeps = {
  error: {
    write () {}
  }
}
const noopDefiners = {
  parameter () {},
  option () {}
}

test('index.js - options and parameters', function (t) {
  t.plan(7)

  const parameters = {}
  const options = {}

  require('./index')(noopDeps)({
    parameter (name, args) {
      parameters[name] = args
    },
    option (name, args) {
      options[name] = args
    }
  })

  t.ok(parameters.sourcemap)

  t.equal(parameters.sourcemap.required, true)

  t.ok(parameters.files)

  t.equal(parameters.files.required, true)

  t.equal(parameters.files.multiple, true)

  t.ok(options.base)

  t.equal(options.base.type(), '.')
})

test('index.js - no output', function (t) {
  t.plan(1)

  const messages = []

  require('./index')({
    error: {
      write (line) {
        messages.push(line)
      }
    }
  })(noopDefiners)({
    sourcemap: 'fixtures/no-output/bundle.js.map',
    files: ['fixtures/no-output/src/*.js'],
    base: 'fixtures/no-output/'
  })
    .then(function () {
      t.deepEqual([], messages)
    })
})

test('index.js - output', function (t) {
  t.plan(1)

  const messages = []

  require('./index')({
    error: {
      write (line) {
        messages.push(line)
      }
    }
  })(noopDefiners)({
    sourcemap: 'fixtures/output/bundle.js.map',
    files: ['fixtures/output/src/*.js'],
    base: 'fixtures/output/'
  })
    .then(function () {
      t.deepEqual([chalk.red(path.join(process.cwd(), 'fixtures/output/src/c.js')) + '\n'], messages)
    })
})

test('cli.js', async function (t) {
  t.plan(4)

  try {
    await execa('node', ['./cli.js', '-h'])
  } catch (e) {
    t.ok(e)

    t.equal(e.stderr.includes('Usage'), true)

    t.equal(e.stderr.includes('Options'), true)

    t.equal(e.stderr.includes('Parameters'), true)
  }
})
