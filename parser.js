const fs = require('fs')
const _ = require('lodash')

const intReg = /^\d+$/

const pi = a => intReg.test(a) ? parseInt(a, 10) : a

const createReader = filename => {
  const fileLines = fs.readFileSync(filename).toString().split('\n')
  let index = 0
  return () => fileLines[index++].split(' ').map(pi)
}


const parseInput = filename => {
  const ril = createReader('./inputs/' + filename + '.txt')
  const [TIME, intersections, STREETS_COUNT, CARS_COUNT, points] = ril()
  const streets = []
  for (let i = 0; i < STREETS_COUNT; i++) {
    const [from, to, name, time] = ril()
    streets.push({
      from,
      to,
      name,
      time,
    })
  }
  const streetsMap = streets.reduce((acc, street) => {
    acc[street.name] = street
    return acc
  }, {})
  const cars = []

  for (let i = 0; i < CARS_COUNT; i++) {
    const carPath = ril()
    carPath.shift()
    cars.push(carPath)
  }

  const res = {
    TIME,
    intersections,
    streets,
    streetsMap,
    cars,
    points,
  }
  return res

}

module.exports = {
  parseInput
}

console.log(parseInput('a'))
