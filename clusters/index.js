const R = require('ramda')
const fs = require('fs')

const readFile = (file) => fs.readFileSync(file, { encoding: 'utf-8' })

const sortByProp = prop => R.compose(R.reverse, R.sortBy(R.prop(prop)))
const sortPerSlot = sortByProp('perSlot')
const sortByCapacity = sortByProp('capacity')

const IsInsertAvailable = ({ row, slot }, { slots },  fields) => {
  const currentRow = fields[row]
  if (currentRow.length < slot + slots) {
    return [false]
  }
  const rowPart = R.range(slot, slot + slots).map((slotIndex) => currentRow[slotIndex])
  const placedServers = rowPart.filter(R.complement(R.isNil))
  return [placedServers.length === 0, placedServers]
}

const tryInsertServer = ({ row, slot }, { slots, id }, fields) => {
  const [insertAvailable] = IsInsertAvailable({ row, slot }, { slots, id }, fields)
  if (!insertAvailable) {
    return false
  }
  R.range(slot, slot + slots).forEach(slotIndex => {
    fields[row][slotIndex] = id
  })
  return true
}

const f = [
  [null, null, null],
  [null, null, 1],
  [null, null, null],
]
const res = tryInsertServer({ row: 1, slot: 0 }, { slots: 2, id: 2 }, f)
debugger
console.log(res, f)

const main = () => {
  const raw = readFile('./dc.in')
  const data = raw.split('\n').map(s => s.split(' ').map(v => Number(v)))
  const [rowsCount, slotsCount, unavailableSlotsCount, poolsCount, serversCount ] = data.shift()

  const unavailableSlots = R.range(0, unavailableSlotsCount).map(i => data.shift()).map(([row, slot]) => ({ row, slot }) )

  const servers = sortPerSlot(R.range(0, serversCount)
    .map(i => data.shift())
    .map(([slots, capacity], index) => ({ slots, capacity, perSlot: capacity/slots, id: index })))
  const serversByMap = servers.reduce((acc, s) => {
    acc[s.id] = s
    return acc
  }, {})
  const serversBySlots = R.map(sortByCapacity, R.groupBy(R.prop('slots'), servers))

  const field = R.range(0, rowsCount).map(() => new Array(slotsCount).map(i => undefined))
  unavailableSlots.forEach(({ row, slot }) => (field[row][slot] = 'x'))

  debugger
  console.log('serversBySlots', serversBySlots, unavailableSlots, servers)
}

main()
