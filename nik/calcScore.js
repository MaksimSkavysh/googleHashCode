const { parseInput, parseOutput } = require('./parser.js')


const INPUTS = ['a_example', 'b_read_on', 'c_incunabula', 'd_tough_choices', 'e_so_many_books', 'f_libraries_of_the_world']



const calcScore = (filename) => {
  let data
  let out
  try {

    data = parseInput(filename)
    out = parseOutput(filename, 'out2')
  } catch(err) {
    return 'no file'
  }
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
  console.log(filename, score)
}

INPUTS.forEach(calcScore)
