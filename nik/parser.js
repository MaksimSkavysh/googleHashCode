const fs = require('fs')
const _ = require('lodash');

const intReg = /^\d+$/

const pi = a => intReg.test(a) ? parseInt(a, 10) : a

const createReader = filename => {
  const fileLines = fs.readFileSync(filename).toString().split('\n')
  let index = 0
  return () => fileLines[index++].split(' ').map(pi)
}


const parseInput = filename => {
  const ril = createReader('../' + filename + '.txt')
  const [bookCount, libCount, days] = ril()
  const bookScore = ril()

  const libs = []
  for(let i = 0; i < libCount; ++i) {
    const [booksCount, signup, parallel] = ril()
    const bookIds = ril()
    libs.push({
      booksCount,
      signup,
      parallel,
      bookIds
    })
  }
  const res = {
    bookCount,
    libCount,
    bookScore,
    days,
    libs,
  }
  console.log(res)
  return res
}

console.log(parseInput('a_example'))

module.exports = {
  parseInput,
}
