#!/usr/bin/env node
'use strict'

require('dotenv').config()

const fs = require('fs')
const path = require('path')
const meow = require('meow')
const chalk = require('chalk')

// -------------------------------------------------------------
// Constants.
// -------------------------------------------------------------

const usage = `
  Usage
    $ deploy-docker-image

  Options
    -n, --name     Set the image name (package.json "name", or "DEPLOY_NAME" in .env)
    -s, --server   Specify SSH name of the server ("DEPLOY_SERVER" in .env)
    -v, --version  Output the version number
    -h, --help     Output the version number

  Examples
    $ deploy-docker-image -n app -s web
`

const flags = {
  name: {
    type: 'string',
    alias: 'n'
  },
  server: {
    type: 'string',
    alias: 's'
  }
}

// -------------------------------------------------------------
// Parse arguments.
// -------------------------------------------------------------

const cli = meow(usage, {
  flags
})

if (cli.flags.h) {
  cli.showHelp()
  process.exit(0)
}

if (cli.flags.v) {
  cli.showVersion()
  process.exit(0)
}

// -------------------------------------------------------------
// Read current working directory potential package.json.
//
// Useful for node projects.
// If it fails, we don't care.
// -------------------------------------------------------------

let cwdPackage = {}

try {
  const cwdRawPackage = fs.readFileSync(
    path.join(process.cwd(), 'package.json'),
    {encoding: 'utf8'}
  )

  cwdPackage = JSON.parse(cwdRawPackage)
} catch {}

// -------------------------------------------------------------
// Check.
// -------------------------------------------------------------

function getValue(flagKey, envKey, packageKey = '') {
  // 1. Search in flags.
  let result = cli.flags[flagKey]

  // 2. Search in .env.
  if (!result && process.env[envKey]) {
    result = process.env[envKey]
  }

  // 3. Search in package.json.
  if (!result && cwdPackage[packageKey]) {
    result = cwdPackage[packageKey]
  }

  return result
}

const name = getValue('name', 'DEPLOY_NAME', 'name')
const server = getValue('server', 'DEPLOY_SERVER')

if (!name || !server) {
  if (!name) console.error(chalk.red('Error: no name provided.'))
  if (!server) console.error(chalk.red('Error: no server provided.'))
  process.exit(1)
}

console.log('Found name:', chalk.blue(name))
console.log('Found server:', chalk.blue(server))
console.log('')

// -------------------------------------------------------------
// Start.
// -------------------------------------------------------------

console.log(chalk.green(`Starting deployment in '${process.cwd()}'…`))
console.log('')
