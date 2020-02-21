const { parseInput, parseOutput } = require('./parser.js')
const { calcScore, check } = require('./calcScore.js')

const INPUTS = ['a_example', 'b_read_on', 'c_incunabula', 'd_tough_choices', 'e_so_many_books', 'f_libraries_of_the_world']
const INPUTS_FASR = ['a_example', 'b_read_on', 'c_incunabula', 'e_so_many_books', 'f_libraries_of_the_world']


const config = {
  populationSize: 100,
  mutate: 0.001,
  crossover: 0.3,
  bestToNext: 2,
  randPerson: 2,
  randPow: 2
}

let inputData

const data = {
  population: []
}

const fitBook = (data, avalLibs) => {
  let maxLib

  let maxScore = 0

  for(const lib of avalLibs) {
    if (!lib.free) {
      continue
    }
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
  person.fit = totalScore
}

const fitPerson1 = (data, person) => {
  data.bookScore2 = data.bookScore.slice()
  let totalScore = 0

  for (let time = 0; time < data.days; time++) {
    if(!(time%1000)) {
      // console.log(time)
    }
    const avalLib = person.libs.filter(lib => (lib.startTime <= time) && lib.bookIds.length)
    avalLib.forEach(lib => {
      lib.free = lib.parallel

      // lib.bookIds.sort((a, b) => data.bookScore2[b]*data.bookIndex[b] - data.bookScore2[a]*data.bookIndex[a])
    })

    // calcBookIndex(data)

    while (avalLib.some(lib => lib.free && lib.bookIds.length)) {
      //console.log('w')
      // console.log('booksToAdd', time, booksToAdd, totalScore)
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
      totalScore += data.bookScore2[bookId]
      data.bookScore2[bookId] = 0
      // console.log('booksToAdd', time, totalScore)
    }
    // const ss = calcScore(dataCopy, sortedLibs.map(lib => ({ id: lib.id,  bookIds: lib.order })))
    // console.log({ totalScore, ss })

  }
  person.fit = totalScore
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
  person.fit = totalScore
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
    lib.signup = inputData.libs[lib.id].signup
    lib.order = []
    lib.bookIds = inputData.libs[lib.id].bookIds.slice()
    libs.push(lib)
  }
  person.libs = libs
  fitPerson(inputData, person)
  person.done = true
}

const randomPerson = () => {
  return {
    dna: Array(inputData.libs.length).fill(0).map(a => Math.random())
  }
}

const randIndex = () => Math.floor(Math.pow(Math.random(), config.randPow) * config.populationSize)

const mutate = (person) => {

}

const cross = (a, b) => {
  const newA = { dna: Array(a.dna.length) }
  const newB = { dna: Array(a.dna.length) }
  for (let i = 0; i < a.dna.length; i++) {
    let vals
    if (Math.random() < config.mutate) {
      vals = [Math.random(), Math.random()]
    } else if (Math.random() < config.crossover) {
      vals = [a.dna[i], b.dna[i]]
    } else {
      vals = [b.dna[i], a.dna[i]]
    }
    newA.dna[i] = vals[0]
    newB.dna[i] = vals[1]
  }
  return [newA, newB]
}

const calcPersonScore = (data, person) => {
  return calcScore(data, person.libs.map(lib => ({ id: lib.id,  bookIds: lib.order })))
}

const iter = (copy) => {
  data.population.forEach(calcPersonData)
  data.population.sort((a, b) => b.fit - a.fit)
  console.log(data.population[0].fit, calcPersonScore(copy, data.population[0]))
  const newPopulation = []
  for (let i = 0; i < (config.populationSize - config.bestToNext - config.randPerson) / 2; i++) {
    const a = data.population[randIndex()]
    const b = data.population[randIndex()]
    newPopulation.push(...cross(a, b))
  }
  newPopulation.push(...data.population.slice(0, config.bestToNext))
  newPopulation.push(...Array(config.randPerson).fill().map(randomPerson))
  data.population = newPopulation
}

const outToDna = (filename, count) => {
  const out = parseOutput(filename, 'out2')
  const dna = Array(count).fill(0.9999999)
  out.forEach((l, i) => {
    dna[l.id] = i / count
  })
  return { dna }
}


const run = (filename) => {
  inputData = parseInput(filename)
  console.log(inputData.libs.length)
  const inputDataCopy = parseInput(filename)
  inputData.libs.forEach(lib => {
    lib.bookIds.sort((a, b) => inputData.bookScore[b] - inputData.bookScore[a])
  })
  data.population = Array(config.populationSize).fill().map(a => randomPerson())


  data.population[0] = outToDna(filename, inputData.libs.length)
  calcPersonData(data.population[0])
  console.log('file', data.population[0].fit)
  for (let i = 0; i < 1000; i++) {
    iter(inputDataCopy)
  }
}

run(INPUTS[4])


