/**
 * Generate a brick with random position and health.
 */
function getRandomBrickPosHealth() {
  return [
    Math.floor(Math.random() * 10),
    Math.floor(Math.random() * 12),
    Math.floor(Math.random() * 10) + 5,
  ];
}

/**
 * Test if the provided x y pair is allowed as a brick position.
 * @param {*} x
 * @param {*} y
 */
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

/**
 * Get an array of the positions surrounding a brick.
 * @param {*} brick
 */
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

/**
 * Test whether the point is in the map.
 * @param {*} point
 * @param {*} map
 */
function pointInMap(point, map) {
  for (let i = 0; i < map.length; i += 1) {
    if (map[i][0] === point[0] && map[i][1] === point[1]) {
      return true;
    }
  }
  return false;
}

/**
 * Generate a new brick for the map. <br/>
 * Assign a probability value to each possible location,
 * then use these values to find a random position for the new brick,
 * and use the probability value as its health.
 * @param {*} map
 */
function generateNew(map) {
  const possibilities = []; // [x, y, prob]
  let totalPossibility = 0;

  // give each possible position an initial probability value of 1
  for (let i = 0; i < 10; i += 1) {
    for (let j = 0; j < 12; j += 1) {
      possibilities.push([i, j, 1]);
      totalPossibility += 1;
    }
  }

  /**
   * Update the probability values:
   * For each existing brick in the map,
   * find all its surrounding positions that are within the allowed range,
   * if the position is occupied, increase its probability value by 1;
   * if the position on the other side of the brick is occupied,
   * increase its probability value by the brick's health;
   * otherwise, increase its probability value by 2;
   */
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
  // generate a random number and use it to select a brick in the probability list
  const rnd = Math.floor(Math.random() * totalPossibility);
  let accProb = 0;
  let res;
  possibilities.forEach((x) => {
    accProb += x[2];
    if (accProb > rnd) {
      res = x;
    }
    res = getRandomBrickPosHealth();
  });
  return res;
}

/**
 * Calculate the total health of all bricks in the map.
 * @param {*} map
 */
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
  // add new bricks to the map until total health exceeds `totalHealth`
  while (calculateTotalHealth(map) < totalHealth) {
    const newBrick = generateNew(map);
    let updated = false;
    for (let i = 0; i < map.length; i += 1) {
      // if the position is occupied by a brick, increase its health
      if (map[i][0] === newBrick[0] && map[i][1] === newBrick[1]) {
        map[i][2] += newBrick[2];
        updated = true;
        break;
      }
    }
    // if not occupide, add a new brick
    if (!updated) {
      map.push(newBrick);
    }
  }
  return map;
}

module.exports = generateMap;
