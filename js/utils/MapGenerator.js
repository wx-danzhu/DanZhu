function generateMap(stage) {
  let level = stage;
  const map = [];
  const set = new Set();
  if (level > 20) {
    level = 20;
  }
  for (let i = 0; i < level * 6; i += 1) { // a proportion of level input
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
