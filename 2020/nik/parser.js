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
      id: i,
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
  // console.log(res)
  return res
}

const parseOutput = (filename, folder) => {
  const ril = createReader('../' + folder +'/'+ filename + '.txt')
  const [count] = ril()
  const libs = []
  for (let i = 0; i < count; i++) {
    const [id] = ril()
    const bookIds = ril()
    libs.push({
      id,
      bookIds,
    })
  }
  return libs
}


// console.log(parseInput('b_read_on'))

module.exports = {
  parseInput,
  parseOutput,
}

const getFilterBooks = (booksToFilter, allBooksIds) => {
  const filtered = {}
  allBooksIds.forEach(bookId => {
    if (!booksToFilter.includes(bookId)) {
      filtered[bookId] = true
    }
  })
  return Object.keys(filtered)
};

const filterWithStructure = (booksToFilter, data) => {
  for (let i = 0; i < data.length; i++) {
    data[i].bookIds = getFilterBooks(booksToFilter, data[i].bookIds);
  }
  return data
}
