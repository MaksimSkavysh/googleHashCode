const _ = require('lodash');
const fs = require('fs');
const { parseInput } = require('2020/nik/parser.js')
const store = require('2020/nik/store.js')

const INPUTS = ['a_example', 'b_read_on', 'c_incunabula', 'd_tough_choices', 'e_so_many_books', 'f_libraries_of_the_world']
const INPUTS_FASR = ['a_example', 'b_read_on', 'c_incunabula', 'e_so_many_books', 'f_libraries_of_the_world']


const NAME = INPUTS[0]







const fitLib = (data, lib, ts) => {
  const profitableTs = ts - lib.signup
  const booksLimit = profitableTs * lib.parallel
  let score = 0
  let uniqs = 1
  let fit = 0

  const gsv = i => data.bookScore[i] * data.bookIndex[i]
  lib.bookIds.sort((a, b) => gsv(b) - gsv(a))
  const usedIds = []

  const bookToRead = Math.min(booksLimit , lib.bookIds.length)
  for (let i = 0; i < bookToRead; i++) {
    const bookId = lib.bookIds[i]
    uniqs += data.bookIndex[i]
    score += data.bookScore[bookId]
    fit += data.bookScore[bookId]
    usedIds.push(bookId)
  }
  // console.log(fit)
  return {
    score,
    fit: fit / lib.signup,
    uniqs,
    usedIds,
  }
}

const findMax = (data, ts) => {
  let maxVal = { fit: 0 }
  let maxLib = null

  for(const lib of data.libs) {
    const fit = fitLib(data, lib, ts)
    if (fit.fit > maxVal.fit) {
      maxVal = fit
      maxLib = lib
    }
  }


  return {
    lib: maxLib,
    ...maxVal,
  }
}

const calcBookIndex = (data) => {
  const bookIndex = Array(data.bookScore.length).fill(0)
  data.libs.forEach(lib => {
    lib.bookIds.forEach(id => bookIndex[id]++)
  })
  data.bookIndex = bookIndex
}


const solve = (inputName) => {
  const filename = inputName
  const data = parseInput(filename)

  const result = []

  calcBookIndex(data)

  let totalScore = 0

  let ts = data.days
  let maxLib
  do {
    maxLib = findMax(data, ts)
    if (!maxLib.lib) {
      break
    }
    totalScore += maxLib.score
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
// INPUTS_FASR.forEach(name => solve(name))

solve(INPUTS[3])


