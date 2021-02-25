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

const parseOutput = (filename) => {
  const ril = createReader('./inputs/' + filename + '.txt')
  const [intersections] = ril()
  const schedule = {}
  for (let i = 0; i < intersections; i++) {
    const [id] = ril()
    const [streetsCount] = ril()
    const scheduleList = []
    for (let j = 0; j < streetsCount; j++) {
      const [name, timing] = ril()
      scheduleList.push([name, timing])
    }
    schedule[id] = scheduleList
  }
  return schedule
}

module.exports = {
  parseInput
}

const test = () => {
  const input = parseInput('a')
  const { T } = input
  console.log(input)
  const out = parseOutput('out_example');
  console.log('out', out)
}

test()
