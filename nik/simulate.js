const _ = require('lodash');
const { parseInput, parseOutput } = require('./parser.js')

const inFile = './qualification_round_2016.in/example.in'
const outFile = './out/example.out'

const inData = parseInput(inFile)
const outData = parseOutput(outFile)

const dist = (a, b) => Math.ceil(Math.hypot(a[0] - b[0], a[1] - b[1]))

const simulate = () => {
  const drones = inData.drones
  const commandsByDrone = _.groupBy(outData, a => a[0])
  let tik = 0

  while (tik <= inData.turns) {
    const freeDrones = drones.filter(d => d.freeTime <= tik)
    freeDrones.forEach(drone => {
      const command = commandsByDrone[drone.id] && commandsByDrone[drone.id].shift()
      if (!command) {
        return
      }
      switch (command[1]) {
        case 'L': {
          const [_id, c, wh, prod, count] = command
          const d = dist(inData.warehouses[wh].pos, drone.pos) + 1
          drone.pack[prod] += count
          drone.freeTime += d
          drone.pos = inData.warehouses[wh].pos
          break;
        }
        case 'D': {
          const [_id, c, ordId, prod, count] = command
          const d = dist(inData.orders[ordId].pos, drone.pos) + 1
          drone.freeTime += d
          drone.pack[prod] -= count
          inData.orders[ordId].pack[prod] -= count

          drone.pos = inData.orders[ordId].pos

          if (Object.values(inData.orders[ordId].pack).every(a => a === 0)) {
            inData.orders[ordId].doneIn = tik + d - 1
          }
          break;
        }
      }
    })

    tik++
  }

  console.log(inData.orders)
}

simulate()
