const fs = require('fs')

const createStore = (name, initData = {}, version = 0) => {
  const filename = `./tmp/${name}(${version}).json`
  let data = {}

  try {
    data = JSON.parse(fs.readFileSync(filename).toString())
  } catch (err) {
    data = initData
  }

  setInterval(() => {
    fs.writeFile(filename, JSON.stringify(data))
  }, 5000)
  return data
}

module.exports = {
  createStore
}


