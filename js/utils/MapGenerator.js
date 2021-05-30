function generateMap(stage) {
  let level = stage;
  const map = [];
  const set = new Set();
  if (!level) {
    level = 1;
  }
  let brickNum = 2 * level + 10;
  if (brickNum > 40) {
    brickNum = 40;
  }
  for (let i = 0; i < brickNum; i += 1) { // a proportion of level input
    let num = Math.floor(Math.random() * 111);
    while (set.has(num)) {
      num = Math.floor(Math.random() * 111);
    }
    set.add(num);
    map.push([Math.floor(num / 10), num % 10]);
  }
  return map;
}

module.exports = generateMap;
