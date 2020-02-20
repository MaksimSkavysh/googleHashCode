const _ = require('lodash');
const fs = require('fs');
const { parseInput } = require('./parser.js')
const store = require('./store.js')

const INPUTS = ['a_example', 'b_read_on', 'c_incunabula', 'd_tough_choices', 'e_so_many_books', 'f_libraries_of_the_world']
const INPUTS_FASR = ['a_example', 'b_read_on', 'c_incunabula', 'e_so_many_books', 'f_libraries_of_the_world']


const NAME = INPUTS[0]







const fitLib = (data, lib, ts) => {
  const profitableTs = ts - lib.signup
  const booksLimit = profitableTs * lib.parallel
  let score = 0
  lib.bookIds.sort((a, b) => data.bookScore[b] - data.bookScore[a])
  const usedIds = []

  const bookToRead = Math.min(booksLimit , lib.bookIds.length)
  for (let i = 0; i < bookToRead; i++) {
    const bookId = lib.bookIds[i]
    score += data.bookScore[bookId]
    usedIds.push(bookId)
  }
  return {
    score: score,
    scorePlain: score,
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
    score: maxVal.score,
    scorePlain: maxVal.scorePlain
  }
}


const solve = (inputName) => {
  const filename = inputName
  const data = parseInput(filename)

  const result = []

  let totalScore = 0

  let ts = data.days
  let maxLib
  do {
    maxLib = findMax(data, ts)
    if (!maxLib.lib) {
      break
    }
    totalScore += maxLib.scorePlain
    // console.log(maxLib)
    maxLib.usedIds.forEach(id => {
      data.bookScore[id] = 0
    })
    result.push(`${maxLib.lib.id} ${maxLib.usedIds.length}\n${maxLib.usedIds.join(' ')}`)
    ts -= maxLib.lib.signup
    maxLib.lib.signup = ts + 10000000
  } while(ts > 0)
  console.log(inputName, totalScore)

  const resultStr = `${result.length}\n${result.join('\n')}`

  fs.writeFileSync('../out2/' + inputName + '.txt', resultStr)
  //console.log(resultStr)
}



// INPUTS.forEach(name => solve(name))
INPUTS_FASR.forEach(name => solve(name))

// solve(INPUTS[4])


