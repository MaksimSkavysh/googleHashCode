const { parseInput, parseOutput } = require('./parser')

const openStreetByTime = function * (input, schedule) {
  const { TIME, streets } = input
  const scheduleByTime = []
  // const s
  const entries = Object.entries(schedule)
  for (let i = 0; i < TIME; i++) {
    const obj = entries.reduce((acc, [node, scheduleList]) => {
      let index = 0
      let current = i
      while (current > -1) {
        current = current - scheduleList[index][1]
        if (current > -1) {
          index = (index + 1) % scheduleList.length
        }
      }
      acc[node] = scheduleList[index][0]
      return acc
    }, {})
    yield obj
    // scheduleByTime.push(obj)
  }
  return scheduleByTime
}

const start = (input, schedule) => {

  let score = 0
  const { TIME, streets, cars } = input

  const city = {}
  for (const street of streets) {
    city[street.name] = {
      queue: [],
      rode: Array(street.time),
    }
  }

  for (let carId = 0; carId < cars.length; carId++) {
    city[cars[carId][0]].queue.push(carId)
  }

  const scheduleByTimeGen = openStreetByTime(input, schedule)

  const TICK = (t) => {
    console.log(t)
    for (const street in city) {
      const toQueue = city[street].rode.pop()
      if (toQueue !== undefined) {
        city[street].queue.push(toQueue)
      }
      city[street].rode.unshift()
    }
    const scheduleByTime = scheduleByTimeGen.next()
    for (const inter in scheduleByTime[t]) {
      const greenStreet = scheduleByTime[t][inter]
      const carId = city[greenStreet].queue.pop()
      if (carId === undefined) continue
      const car = cars[carId]
      car.shift()
      if (car.length !== 0) {
        city[car[0]].rode[0] = carId
      } else {
        score ++
      }
    }

  }

  for (let i = 0; i < TIME; i++) {
    TICK(i)
  }

  console.log(score)


  console.log('scheduleByTime', scheduleByTime)
}

const test = (TEST = 'a') => {
  const input = parseInput(TEST)
  // console.log(input)
  const out = parseOutput(TEST);
  // console.log('out', out)
  start(input, out)
  // const s
}

test('a')
