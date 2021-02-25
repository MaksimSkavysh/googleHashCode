const { parseInput, write } = require('./parser')





const TASK = 'a'



const run = (TASK = 'a') => {

  const shedule = []

  const data = parseInput(TASK)
  const intersections = Array(data.intersections)
  for (let i = 0; i < data.intersections; i++) {
    intersections[i] = {
      cars: [],
      inStreets: {}
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

  console.log(intersections)

  for (let i = 0; i < intersections.length; i++) {

  }

  write(TASK, intersections)
}




const TASKS = ['a', 'b', 'c', 'd', 'e', 'f']


for (const task of TASKS) {

  run(task)

}
