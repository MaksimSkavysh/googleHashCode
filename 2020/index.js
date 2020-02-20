const R = require('ramda')
const fs = require('fs')

const readFile = (file) => fs.readFileSync(file, { encoding: 'utf-8' })
