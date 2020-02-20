const _ = require('lodash');
const fs = require('fs');
const { parseInput } = require('./parser.js')
const store = require('./store.js')


const NAME = 'a_example'

const fullSolve = (data) => {
  const recur = (pack, index = 0) => {
    pack.size += data.slices[index]
    pack[index] = 1
    if (pack.size > data.limit) {
      return { size: 0 }
    }
    let max = pack
    for (let i = index + 1; i < data.slices.length; i++) {
      const next = recur({...pack}, i)
      if (max.size < next.size) {
        max = next
      }
    }
    return max
  }

  return recur({ size: 0 })
}
const fullSolveBack = (data) => {
  const recur = (pack, index = 0) => {
    let max = pack
    for (let i = index; i < data.slices.length; i++) {
      let next = { ... pack }
      next.size -= data.slices[i]
      delete next[i]
      if (next.size > data.limit) {
        next = recur(next, i + 1)
      }
      if (next && next.size === data.limit) {
        return next
      }
      if ( next.size <= data.limit && (max.size < next.size || max.size > data.limit) ) {
        max = next
      }
    }
    return max
  }


  const pack =  recur({ size: data.slices.reduce((a, b) => a + b, 0), ...Array(data.slices.length).fill(1) })
  delete pack.size
  const res = `${Object.keys(pack).length}\n${Object.keys(pack).map(key => data.slices[key]).join(' ')}`
  return res
}

const solve = (inputName) => {
  const filename = inputName + '.in'
  const data = parseInput(filename)
  const initData = {}
  // const store = store.createStore(NAME, initData)
  // console.time('rec')
  // console.log(fullSolve(data))
  // console.timeEnd('rec')
  console.time('Back')
  const res = fullSolveBack(data)
  console.timeEnd('Back')
  fs.writeFileSync('./tmp/' + inputName + '.out', res)

}


solve('c_medium')
