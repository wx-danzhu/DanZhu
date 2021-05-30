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

/**
 *
 * @param {integer[][3]} map - [[0, 0, 10], [0, 1, 8], ...]
 * @param {float} angle - 0 < angle < 180
 * @param {integer} bulletsPerShot - 10
 * @param {integer} bulletVelocity - 10
 * @returns {boolean} can clear or not
 */
function canClear(map, angle, bulletsPerShot = 10, bulletVelocity = 500) {
  const sidesOfBricks = [];
  sidesOfBricks.push({
    brickIndex: -1,
    x: leftX,
  });
  sidesOfBricks.push({
    brickIndex: -1,
    x: rightX,
  });
  sidesOfBricks.push({
    brickIndex: -1,
    y: topY,
  });
  for (let i = 0; i < map.length; i += 1) {
    sidesOfBricks.push({
      brickIndex: i,
      x: map[i][0] * brickLen + leftX,
    });
    sidesOfBricks.push({
      brickIndex: i,
      y: map[i][1] * brickLen + topY,
    });
    sidesOfBricks.push({
      brickIndex: i,
      x: map[i][0] * brickLen + brickLen + leftX,
    });
    sidesOfBricks.push({
      brickIndex: i,
      y: map[i][1] * brickLen + brickLen + topY,
    });
  }
}

function generateMap() {
  const map = [];
  return map;
}

module.exports = generateMap;
