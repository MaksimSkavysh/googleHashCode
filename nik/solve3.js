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
    fit += data.bookScore[bookId] * data.bookIndex[i]
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

const findMax = (data, ts, sortedLibs) => {
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


const fitBook = (data, avalLibs) => {
  let maxLib

  let maxScore = 0

  for(const lib of avalLibs) {
    if (!data.bookScore2[lib.bookIds[0]] && lib.bookIds.length) {
      lib.bookIds.shift()
    }
    if (data.bookScore2[lib.bookIds[0]] > maxScore) {
      maxScore = data.bookScore2[lib.bookIds[0]]
      maxLib = lib
    }
  }

  return {
    lib: maxLib,
    score: maxScore,
  }
}


const solve = (inputName) => {
  const filename = inputName
  const data = parseInput(filename)
  data.bookScore2 = data.bookScore.slice()
  calcBookIndex(data)
  const result = []

  let totalScore = 0

  let ts = data.days
  let maxLib
  const sortedLibs = []
  do {
    maxLib = findMax(data, ts, sortedLibs)
    if (!maxLib.lib) {
      break
    }
    // console.log(maxLib)
    maxLib.usedIds.forEach(id => {
      // data.bookScore[id] = 0
    })
    // result.push(`${maxLib.lib.id} ${maxLib.usedIds.length}\n${maxLib.usedIds.join(' ')}`)
    ts -= maxLib.lib.signup

    maxLib.lib.avalTs = data.days - ts
    maxLib.lib.signupTmp = maxLib.lib.signup
    maxLib.lib.order = []
    maxLib.lib.bookIds.sort((a, b) => data.bookScore2[b] - data.bookScore2[a])

    maxLib.lib.signup = ts + 10000000
    sortedLibs.push(maxLib.lib)
  } while(ts > 0)

  for (let time = 0; time < data.days; time++) {
    // console.log('f', time)
    const avalLib = sortedLibs.filter(lib => lib.avalTs >= time && lib.bookIds.length)
    avalLib.forEach(lib => {
      lib.free = lib.parallel

      // lib.bookIds.sort((a, b) => data.bookScore2[b]*data.bookIndex[b] - data.bookScore2[a]*data.bookIndex[a])
    })

    calcBookIndex(data)

    while (avalLib.some(lib => lib.free && lib.bookIds.length)) {
      //console.log('w')
      // console.log('booksToAdd', time, booksToAdd, totalScore)
      const { lib, score } = fitBook(data, avalLib)
      let bookId
      bookId = lib.bookIds.shift()

      if (!lib.bookIds.length) {
        lib.parallel = 0
        lib.free = 0
      }
      lib.free--
      lib.order.push(bookId)
      data.bookScore2[bookId] = 0
      totalScore += score
       // console.log('booksToAdd', time, totalScore)
    }

  }

  console.log(inputName, totalScore)
  const resultStr = `${sortedLibs.length}\n${sortedLibs.map(lib => `${lib.id} ${lib.order.length}\n${lib.order.join(' ')}`).join('\n')}`

  fs.writeFileSync('../out3/' + inputName + '.txt', resultStr)
  //console.log(resultStr)
}



// INPUTS.forEach(name => solve(name))
INPUTS_FASR.forEach(name => solve(name))

// solve(INPUTS[4])


