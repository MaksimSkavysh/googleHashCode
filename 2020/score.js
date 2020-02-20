const getRowSums = (row, servers, poolCount) =>{
  let prev = -1;
  const rowSums = (new Array(poolCount)).fill(0);
  for (const serverId of row) {
    if (serverId !== prev) {
      prev = serverId;
      rowSums[servers[serverId][2]] += servers[serverId][1];
    }
  }
  return rowSums;
}

const result = (fields, servers, poolCount) => {
  let poolSums = (new Array(poolCount)).fill(0);
  let maxRowSum = (new Array(poolCount)).fill(0);

  for (const row of fields) {
    const rowSums = getRowSums(row, servers, poolCount);
    for (let i = 0; i < poolCount; ++i) {
      poolSums[i] += rowSums[i];
      if (rowSums[i] > maxRowSum[i]) {
        maxRowSum[i] = rowSums[i];
      }
    }
  }

  for (let i = 0; i < poolCount; ++i) {
    poolSums[i] -= maxRowSum[i];
  }

  return poolSums;
}

const getScore = (fields, servers, poolCount) => Math.min(...result(fields, servers, poolCount))

// const poolCount = 2
// const fields = [[1, 1, 2], [3, 3, 4]];
// const servers = [[1, 1, -1], [1, 2, 0], [3, 4, 1], [2, 3, 1], [2, 3, 0]]; // [slots, capacity, pool]
// const r = getScore(fields, servers, poolCount)
// debugger
// console.log('r', r)

module.exports({
  getScore
})
