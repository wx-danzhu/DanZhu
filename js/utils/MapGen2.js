const leftX = 10;
const rightX = 365;
const topY = 50;
const cannonX = 187.5;
const cannonY = 617;
const brickLen = (rightX - leftX) / 10;

function getRandomBrickPosHealth() {
  return [
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 10) + 5,
  ];
}

function inRange(x, y) {
  if (x < 0) {
    return false;
  }
  if (x > 9) {
    return false;
  }
  if (y < 0) {
    return false;
  }
  if (y > 11) {
    return false;
  }
  return true;
}

function getSurrounding(brick) {
  const [x, y] = brick;
  return [
    [x - 1, y - 1],
    [x - 1, y],
    [x - 1, y + 1],
    [x, y - 1],
    [x, y + 1],
    [x + 1, y - 1],
    [x + 1, y],
    [x + 1, y + 1],
  ];
}

function pointInMap(point, map) {
  for (let i = 0; i < map.length; i += 1) {
    if (map[i][0] === point[0] && map[i][1] === point[1]) {
      return true;
    }
  }
  return false;
}

function generateNew(map) {
  const possibilities = []; // [x, y, prob]
  let totalPossibility = 0;
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 12; j += 1) {
      possibilities.push([i, j, 1]);
      totalPossibility += 1;
    }
  }
  map.forEach((brick) => {
    getSurrounding(brick)
      .filter(inRange)
      .forEach((pos) => {
        for (let i = 0; i < possibilities.length; i += 1) {
          if (possibilities[i][0] === pos[0] && possibilities[i][1] === pos[1]) {
            if (pointInMap(pos, map)) {
              possibilities[i][2] += 1;
              totalPossibility += 1;
            } else if (pointInMap([
              brick[0] + brick[0] - pos[0],
              brick[1] + brick[1] - pos[1],
            ], map)) {
              possibilities[i][2] += brick[2];
              totalPossibility += brick[2];
            } else {
              possibilities[i][2] += 2;
              totalPossibility += 2;
            }
            return;
          }
        }
      });
  });
  const rnd = Math.floor(Math.random() * totalPossibility);
  let accProb = 0;
  possibilities.forEach((x) => {
    accProb += x[2];
    if (accProb > rnd) {
      return x;
    }
  });
  return getRandomBrickPosHealth();
}

function calculateTotalHealth(map) {
  let res = 0;
  map.forEach((brick) => {
    res += brick[2];
  });
  return res;
}

function generateMap(stage) {
  let level = stage;
  if (!stage || stage < 1) {
    level = 1;
  }
  if (stage > 10) {
    level = 10;
  }
  const totalHealth = level * 50 + 100;
  const map = [];
  while (calculateTotalHealth(map) < totalHealth) {
    const newBrick = generateNew(map);
    let updated = false;
    for (let i = 0; i < map.length; i += 1) {
      if (map[i][0] === newBrick[0] && map[i][1] === newBrick[1]) {
        map[i][2] += newBrick[2];
        updated = true;
        break;
      }
    }
    if (!updated) {
      map.push(newBrick);
    }
  }
  return map;
}

module.exports = generateMap;
