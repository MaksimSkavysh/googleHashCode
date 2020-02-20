const _ = require('lodash');
const fs = require('fs');
const { parseInput } = require('./parser.js')
const store = require('./store.js')

const INPUTS = ['a_example', 'b_read_on', 'c_incunabula', 'd_tough_choices', 'e_so_many_books', 'f_libraries_of_the_world']


const NAME = INPUTS[0]







const fitLib = (data, lib, ts) => {
  const profitableTs = ts - lib.signup
  const booksLimit = profitableTs * lib.parallel
  let score = 0
  lib.bookIds.sort((a, b) => data.bookScore[b] - data.bookScore[a])
  const usedIds = []
  for (let i = 0; i < booksLimit && i < lib.bookIds.length; i++) {
    const bookId = lib.bookIds[i]
    score += data.bookScore[bookId]
    usedIds.push(bookId)
  }
  return {
    score,
    usedIds,
  }
}

const findMax = (data, ts) => {
  let maxVal = { score: 0 }
  let maxLib = null

  for(const lib of data.libs) {
    const fit = fitLib(data, lib, ts)
    if (fit.score > maxVal.score) {
      maxVal = fit
      maxLib = lib
    }
  }


  return {
    lib: maxLib,
    usedIds: maxVal.usedIds,
    score: maxVal.score
  }
}


const solve = (inputName) => {
  const filename = inputName
  const data = parseInput(filename)

  const result = []

  let ts = data.days
  let maxLib
  do {
    maxLib = findMax(data, ts)
    if (!maxLib.lib) {
      break
    }
    // console.log(maxLib)
    maxLib.usedIds.forEach(id => {
      data.bookScore[id] = 0
    })
    result.push(`${maxLib.lib.id} ${maxLib.usedIds.length}\n${maxLib.usedIds.join(' ')}`)
    ts -= maxLib.lib.signup
    maxLib.lib.signup = ts + 10000000
  } while(ts > 0)

  const resultStr = `${result.length}\n${result.join('\n')}`

  fs.writeFileSync('../out/' + inputName + '.txt', resultStr)
  //console.log(resultStr)
}



// INPUTS.forEach(name => solve(name))

solve(INPUTS[4])


