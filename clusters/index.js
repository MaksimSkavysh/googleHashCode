const R = require('ramda')
const fs = require('fs')

const readFile = (file) => fs.readFileSync(file, { encoding: 'utf-8' })

const sortByProp = prop => R.compose(R.reverse, R.sortBy(R.prop(prop)))
const sortPerSlot = sortByProp('perSlot')
const sortByCapacity = sortByProp('capacity')

const readData = () => {
  const raw = readFile('./dc.in')
  const data = raw.split('\n').map(s => s.split(' ').map(v => Number(v)))
  const [rowsCount, slotsCount, unavailableSlotsCount, poolsCount, serversCount ] = data.shift()
  const unavailableSlots = R.range(0, unavailableSlotsCount).map(i => data.shift()).map(([row, slot]) => ({ row, slot }) )
  const servers = sortPerSlot(R.range(0, serversCount)
    .map(i => data.shift())
    .map(([slots, capacity], index) => ({ slots, capacity, perSlot: capacity/slots, id: index, place: null })))
    .map((server, index) => {
      server.id = index + 1
      return server
    })
  const field = R.range(0, rowsCount).map(() =>(new Array(slotsCount)).fill(null))
  unavailableSlots.forEach(({ row, slot }) => (field[row][slot] = 'x'))
  const pools = (new Array(poolsCount)).fill(null).map(() => [])
  return { field, rowsCount, slotsCount, poolsCount, servers, pools, serversCount }
}

const greedyPlaceToPool = (pools, server, serverMap) => {
  let v = Infinity
  let index = 0
  pools.forEach((l, i) => {
    const s = R.sum(l.map(R.prop('capacity')))
    if (s < v) {
      index = i
      v = s
    }
  })
  pools[index].push(server)
}

const IsInsertAvailable = ({ row, slot }, { slots },  fields) => {
  const currentRow = fields[row]
  if (currentRow.length < slot + slots) {
    return [false]
  }
  const rowPart = R.range(slot, slot + slots).map((slotIndex) => currentRow[slotIndex])
  const placedServers = rowPart.filter(R.complement(R.isNil))
  return [placedServers.length === 0, placedServers]
}

const tryInsertServer = ({ row, slot }, server, field) => {
  const { slots, id, place } = server
  if (place) {
    return false
  }
  const [insertAvailable] = IsInsertAvailable({ row, slot }, { slots, id }, field)
  if (!insertAvailable) {
    return false
  }
  R.range(slot, slot + slots).forEach(slotIndex => {
    field[row][slotIndex] = id
  })
  server.place = [row, slot]
  return slots
}

const main = () => {
  const { field, rowsCount, slotsCount, pools, servers } = readData()
  const serversByIdMap = servers.reduce((acc, s) => {
    acc[s.id] = s
    return acc
  }, {})
  const serversBySlots = R.map(sortByCapacity, R.groupBy(R.prop('slots'), servers))

  const data = {}
  for (let server of servers) {
    data[server.id] = []
    let currentPlace = { row: 0, slot: 0 }
    for (let slot = 0; slot < slotsCount; slot++) {
      for (let row = 0; row < rowsCount; row++) {
        tryInsertServer({ row, slot }, server, field)
      }
    }
  }

  const usedServers = servers.filter(s => !!s.place)
  usedServers.forEach(server => greedyPlaceToPool(pools, server))
  const rowsSum = R.range(0, rowsCount).map(excludedRow => {
    const a = pools.map((pool) => {
      return pool.filter(({ place: [row] }) => row !== excludedRow).map(R.prop('capacity')).reduce((acc, v) => acc + v)
    })
    return Math.min(...a)
  })
  const res = Math.min(...rowsSum)
  debugger
  console.log('score', res)
}

main()
