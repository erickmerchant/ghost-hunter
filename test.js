const test = require('tape')
const execa = require('execa')
const {red} = require('kleur')
const path = require('path')

test('index.js - no output', async (t) => {
  t.plan(1)

  const messages = []

  await require('./index')({
    error: {
      write(line) {
        messages.push(line)
      }
    }
  })({
    sourcemap: 'fixtures/no-output/bundle.js.map',
    files: ['fixtures/no-output/src/*.js'],
    base: 'fixtures/no-output/'
  })

  t.deepEqual([], messages)
})

test('index.js - output', async (t) => {
  t.plan(1)

  const messages = []

  await require('./index')({
    error: {
      write(line) {
        messages.push(line)
      }
    }
  })({
    sourcemap: 'fixtures/output/bundle.js.map',
    files: ['fixtures/output/src/*.js'],
    base: 'fixtures/output/'
  })

  t.deepEqual([`${red(path.join(process.cwd(), 'fixtures/output/src/c.js'))}\n`], messages)
})

test('cli.js', async (t) => {
  t.plan(4)

  try {
    await execa('node', ['./cli.js', '-h'])
  } catch (e) {
    t.ok(e)

    t.equal(e.stdout.includes('Usage'), true)

    t.equal(e.stdout.includes('Options'), true)

    t.equal(e.stdout.includes('Parameters'), true)
  }
})
