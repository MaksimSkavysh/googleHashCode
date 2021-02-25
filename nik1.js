
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

  const out = parseOutput(TASK)
  const intersections = Array(data.intersections)
  for (let i = 0; i < data.intersections; i++) {
    intersections[i] = {
      cars: [],
      inStreets: {},
      schedule: out[i]
    }
  }

  for (let carId = 0; carId < data.cars.length; carId++) {
    const path = data.cars[carId]
    const startStreet = path[0]
    const ii = data.streetsMap[startStreet].from
    intersections[ii].cars.push(carId)
  }

  for (const street of data.streets) {
    intersections[street.to].inStreets[street.name] = 1
  }


  for (let i = 0; i < intersections.length; i++) {
    intersections[i].current = 0
    intersections[i].time = intersections[i].schedule[0][1]
  }
  console.log(data)
  console.log(intersections)
  // console.log(out)

  simulate(data, inter)

  write(TASK, intersections)
}




const TASKS = ['a', 'b', 'c', 'd', 'e', 'f']


run()

// for (const task of TASKS) {
//
//   run(task)
//
// }
