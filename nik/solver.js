const _ = require('lodash');
const { parseInput, parseOutput } = require('./parser.js')

const inFile = './qualification_round_2016.in/example.in'
const outFile = './out/example.out'

const inData = parseInput(inFile)

const dist = (a, b) => Math.ceil(Math.hypot(a[0] - b[0], a[1] - b[1]))

const distMap =

const simulate = () => {
  const { drones, warehouses, orders } = inData

}
