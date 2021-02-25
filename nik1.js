
const { parseInput, write, parseOutput } = require('./parser')





const TASK = 'a'


const interTic = (inter) => {

}


const simulate = (data, inters) => {
  for (let time = 0; time < data.TIME; time++) {
    for (const inter of inters) {
      const greenStreet = inter.schedule[inter.current][0]

    }
  }
}


const run = (TASK = 'a') => {

  const shedule = []

  const data = parseInput(TASK)

  // const out = parseOutput(TASK)
  const intersections = Array(data.intersections)
  for (let i = 0; i < data.intersections; i++) {
    intersections[i] = {
      cars: [],
      inStreets: {},
      // schedule: out[i]
    }
  }

  for (let carId = 0; carId < data.cars.length; carId++) {
    const path = data.cars[carId]
    const startStreet = path[0]
    const ii = data.streetsMap[startStreet].from
    intersections[ii].cars.push(carId)
  }
  const streetsMap = {}

  for (const street of data.streets) {
    intersections[street.to].inStreets[street.name] = -1
  }
  for (const path of data.cars) {
    for (const pathElement of path) {
      if(!streetsMap[pathElement]) {
        streetsMap[pathElement] = 0
      }
      streetsMap[pathElement]++
    }
  }

  console.log(streetsMap)

  const entrArr = Object.entries(streetsMap).sort((a, b) => a[1] - b[1])
  const max = Math.max(...entrArr.map(a => a[1]))
  const entrMap = entrArr.reduce((acc, item, index, arr) => {
    acc[item[0]] = Math.round(item[1]/max * 4) + 1
    return acc
  }, {})
  // console.log(entrMap)


  for (let i = 0; i < intersections.length; i++) {
    for (const street in intersections[i].inStreets) {
      intersections[i].inStreets[street] = entrMap[street]
      // console.log('intersections', intersections)
      if (entrMap[street] == undefined)
        // delete intersections[i].inStreets[street]
        intersections[i].inStreets[street] = 1
      // console.log(intersections[i].inStreets[street])
    }
  }
  // console.log(data)
  // console.log(intersections)
  // // console.log(out)

  // simulate(data, inter)

  write(TASK, intersections)
}




const TASKS = ['a', 'b', 'c', 'd', 'e', 'f']


// run('b')

for (const task of TASKS) {

  run(task)

}
