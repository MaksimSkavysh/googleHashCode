const { parseInput } = require('./parser.js')

const INPUTS = ['a_example', 'b_read_on', 'c_incunabula', 'd_tough_choices', 'e_so_many_books', 'f_libraries_of_the_world']
const INPUTS_FASR = ['a_example', 'b_read_on', 'c_incunabula', 'e_so_many_books', 'f_libraries_of_the_world']


const config = {
  mutate: 0.01,
  crossover: 0.05,
}

let inputData

const data = {
  population: []
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

const fitPerson = (data, person) => {
  data.bookScore2 = data.bookScore.slice()
  let totalScore = 0
  for (let time = 0; time < data.days; time++) {
    // console.log('f', time)
    const avalLib = person.libs.filter(lib => lib.startTime <= time && lib.bookIds.length)
    avalLib.forEach(lib => {
      lib.free = lib.parallel

      // lib.bookIds.sort((a, b) => data.bookScore2[b]*data.bookIndex[b] - data.bookScore2[a]*data.bookIndex[a])
    })

    while (avalLib.some(lib => lib.free && lib.bookIds.length)) {
      const { lib, score } = fitBook(data, avalLib)
      if (!lib) {
        break
      }
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
    }
  }
  return {
    score: totalScore
  }
}

const fitPerson2 = (data, person) => {
  const bookScore2 = data.bookScore.slice()
  let totalScore = 0

  LIB_LOOP: for (const lib of person.libs) {
    const profitableTs = data.days - lib.startTime - 1
    let booksLimit = profitableTs * lib.parallel
    let i = 0
    while (booksLimit) {
      while (!bookScore2[lib.bookIds[i]]) {
        if (i>=lib.bookIds.length) {
          continue LIB_LOOP
        }
        i++
      }
      const bookId = lib.bookIds[i]
      totalScore += bookScore2[bookId]
      bookScore2[bookId] = 0
      lib.order.push(bookId)
      booksLimit--
    }
  }
  return {
    score: totalScore
  }

}

const calcPersonData = (person) => {
  if (person.done) {
    return
  }
  const tmpLibs = person.dna.map((order, id) => ({ id, order }))
  tmpLibs.sort((a, b) => a.order - b.order)
  const libs = []
  for (let time = 0, i = 0; time < inputData.days && i < tmpLibs.length; i++) {
    const lib = tmpLibs[i]
    time += inputData.libs[lib.id].signup
    lib.parallel = inputData.libs[lib.id].parallel
    lib.startTime = time
    lib.order = []
    lib.bookIds = inputData.libs[i].bookIds.slice()
    libs.push(lib)
  }
  person.libs = libs
  console.time('1')
  const { score } = fitPerson(inputData, person)
  console.timeEnd('1')
  console.time('2')
  const { score:s2 } = fitPerson2(inputData, person)
  console.timeEnd('2')
  console.log( { score, s2 })
  person.fit = score
  person.done = true
}

const randomPerson = () => {
  return {
    dna: Array(inputData.libs.length).fill(0).map(a => Math.random())
  }
}


const run = (filename) => {
  inputData = parseInput(filename)
  inputData.libs.forEach(lib => {
    lib.bookIds.sort((a, b) => inputData.bookScore[b] - inputData.bookScore[a])
  })

  const person = randomPerson()
  calcPersonData(person)
  console.log(person.fit)
}

run(INPUTS[4])


