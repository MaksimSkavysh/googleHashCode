const fs = require('fs')
const _ = require('lodash');

const intReg = /^\d+$/

const pi = a => intReg.test(a) ? parseInt(a, 10) : a

const createReader = filename => {
  const fileLines = fs.readFileSync(filename).toString().split('\n')
  let index = 0
  return () => fileLines[index++].split(' ').map(pi)
}


const parseInput = filename => {
  const ril = createReader(filename)
  const [rows, cols, dronesCount, turns, payload] = ril()
  const [productTypeCount] = ril()
  const productWeights = ril()
  const [warehouseCount] = ril()

  const emptyPack = () => _.range(0, productTypeCount).reduce((a, i) =>{
    a[i] = 0;
    return a
  }, {})

  const warehouses = []
  for (let i = 0; i < warehouseCount; i++) {
    const pos = ril()
    const pack = ril().reduce((acc, p) => {
      acc[p]++
      return acc
    }, emptyPack())
    warehouses.push({
      id: i,
      pos,
      pack,
    })
  }

  const startDronePos = warehouses[0].pos
  const drones = _.range(0, dronesCount).map(index => ({
    id: index,
    freeTime: 0,
    pack: emptyPack(),
    payload: payload,
    pos: [...startDronePos],
  }));

  const orders = []
  const [ordersCount] = ril()
  for (let i = 0; i < ordersCount; i++) {
    const pos = ril()

    ril()

    const pack = ril().reduce((acc, p) => {
      acc[p]++
      return acc
    }, emptyPack())

    orders.push({
      id: i,
      pos,
      pack,
    })
  }

  return {
    rows,
    dronesCount,
    cols,
    turns,
    payload,
    productTypeCount,
    productWeights,
    warehouses,
    orders,
    drones,
  }
}

const parseOutput = (filename) => {
  const ril = createReader(filename)
  const commandsCount = ril()
  const commands = []
  for (let i = 0; i < commandsCount; i++) {
    commands.push(ril())
  }
  return commands
}

console.log(parseInput('./qualification_round_2016.in/example.in'))
console.log(parseOutput('./out/example.out'))

module.exports = {
  parseInput,
  parseOutput,
}
