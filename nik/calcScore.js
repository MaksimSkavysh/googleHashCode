const { parseInput, parseOutput } = require('./parser.js')


const INPUTS = ['a_example', 'b_read_on', 'c_incunabula', 'd_tough_choices', 'e_so_many_books', 'f_libraries_of_the_world']



const calcScore = (data, out) => {
  let score = 0
  let ts = data.days
  while (ts && out.length) {
    const outLib = out.shift()
    const lib = data.libs[outLib.id]
    ts -= lib.signup
    const booksLimit = Math.min(ts * lib.parallel, outLib.bookIds.length)
    for (let i = 0; i < booksLimit; i++) {
      const bookId = outLib.bookIds[i]
      if (!lib.bookIds.includes(bookId)) {
        console.log(outLib, i)
        throw new Error(`no book ${bookId} in lib ${outLib.id}`)
      }
      score += data.bookScore[bookId]
    }
  }
  return score
}

const calcFileScore = (filename) => {
  let data
  let out
  try {

    data = parseInput(filename)
    out = parseOutput(filename, 'out3')
  } catch (err) {
    return 'no file'
  }
  const socre = calcScore(data, out)

  console.log(filename, socre)
}

// INPUTS.forEach(calcFileScore)

module.exports = {
  calcScore,
  check: () => INPUTS.forEach(calcFileScore)
}
