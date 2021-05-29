/* global wx:readonly */

import Phaser from '../../libs/phaser-wx';
import Common from '../atlas/common';
import Pause from '../objects/Pause';
import Wall from '../objects/wall';
import generateMap from '../../utils/MapGenerator';

const wallWidth = 10;
const wallHeight = 50;

export default class InfiniteGameState extends Phaser.State {
  constructor(game) {
    super();
    this.game = game;
  }

  createAudio(name, src, loop = false, autoplay = false) {
    const audio = wx.createInnerAudioContext();
    audio.autoplay = autoplay;
    audio.loop = loop;
    audio.src = src;
    audio.playIfNotMuted = (() => {
      if (!this.game.mute) {
        audio.play();
      }
    });
    if (!this.game.audio) {
      this.game.audio = {};
    }
    this.game.audio[name] = audio;
  }

  destroyAudios() {
    // eslint-disable-next-line no-restricted-syntax
    for (const audio of Object.values(this.game.audio)) {
      audio.destroy();
    }
  }

  preload() {
    this.game.load.image('cannon', 'assets/plane/images/hero.png');
    this.game.load.image('brick', 'assets/rolling_ball/block_small.png');
    this.game.load.image('bomb', 'assets/rolling_ball/block_locked_small.png');
    this.game.load.image('bullet', 'assets/rolling_ball/ball_blue_small.png');
    this.game.load.spritesheet('explosion', 'assets/plane/images/explosion.png', 47, 64, 19);

    this.game.load.atlas('common', 'assets/plane/images/common.png', null, Common);

    this.createAudio('bgm', 'assets/plane/audio/bgm.mp3', true);
    this.createAudio('boom', 'assets/plane/audio/boom.mp3');
    this.createAudio('bullet', 'assets/plane/audio/bullet.mp3');
    this.createAudio('pass', 'assets/plane/audio/pass.mp3');
  }

  init(parameters) {
    if (parameters) {
      this.map = parameters.map;
      this.level = level;
      this.score = parameters.score;
      this.bullet = parameters.bullet;
    }
  }

  create() {
    this.dragging = false;
    this.canDrag = true;

    // start physics engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.stage.backgroundColor = '#042960';

    this.game.input.onDown.add(this.dragStart, this);
    this.game.input.onUp.add(this.dragStop, this);

    // world walls
    this.wallGroup = this.game.add.group();
    this.wallTop = new Wall(this.game, this.game.width / 2, 0, '#5DECBF');
    this.wallTop.height = wallHeight + wallHeight;
    this.wallTop.width = this.game.width + 10;
    this.game.physics.arcade.enable(this.wallTop);
    this.wallTop.body.immovable = true;
    this.wallGroup.add(this.wallTop);
    this.wallLeft = new Wall(this.game, 0, this.game.height / 2, '#5DECBF');
    this.wallLeft.height = this.game.height + 10;
    this.wallLeft.width = wallWidth + wallWidth;
    this.game.physics.arcade.enable(this.wallLeft);
    this.wallLeft.body.immovable = true;
    this.wallGroup.add(this.wallLeft);
    this.wallRight = new Wall(this.game, this.game.width, this.game.height / 2, '#5DECBF');
    this.wallRight.height = this.game.height + 10;
    this.wallRight.width = wallWidth + wallWidth;
    this.game.physics.arcade.enable(this.wallRight);
    this.wallRight.body.immovable = true;
    this.wallGroup.add(this.wallRight);

    // bricks
    this.brickGroup = this.game.add.group();
    this.brickGroup.enableBody = true;
    this.brickGroup.physicsBodyType = Phaser.Physics.ARCADE;

    // bombs
    this.bombGroup = this.game.add.group();
    this.bombGroup.enableBody = true;
    this.bombGroup.physicsBodyType = Phaser.Physics.ARCADE;

    // bullet
    this.bulletGroup = this.game.add.group();
    this.bulletGroup.enableBody = true;
    this.bulletGroup.physicsBodyType = Phaser.Physics.ARCADE;

    // explosion
    this.explosionGroup = this.game.add.group();
    this.explosionGroup.enableBody = true;

    // cannon
    this.cannon = this.game.add.sprite(this.game.width / 2, this.game.height - 50, 'cannon');
    this.cannon.anchor.setTo(0.5, 0.5);
    this.cannon.scale.setTo(0.5, 0.5);

    // aiming lines
    this.aimingLineGroup = this.game.add.group();

    // score
    const style = { font: '24px', fill: '#ffffff' };
    this.scoreText = this.game.add.text(40, 15, `Score: ${this.score}`, style);

    // bullet left
    this.bulletLeft = this.bullet;
    this.bulletText = this.game.add.text(140, 15, `Bullet: ${this.bulletLeft}`, style);

    // generate bricks
    this.generateBricks(this.map);

    // generate bombs
    this.generateBombs(this.map);

    // pause
    this.pause = new Pause(this.game, 26, 26, 'arrowBack');
    this.pause.addClick(this.showPause, this);

    // set total health number
    this.totalHealth = 0;
    this.brickGroup.forEach(
      (brick) => {
        // console.log(Math.sqrt(Math.pow(brick.x - xpos, 2) + Math.pow(brick.y - ypos, 2)));
        this.totalHealth += brick.health;
      });
    this.bombGroup.forEach(
      (bomb) => {
        // console.log(Math.sqrt(Math.pow(brick.x - xpos, 2) + Math.pow(brick.y - ypos, 2)));
        this.totalHealth += bomb.health;
      });
    // console.log("printing total health");
    // console.log(this.totalHealth);
  }

  update() {
    // play bgm here so that it starts after brought back from background
    this.game.audio.bgm.playIfNotMuted();
    // detect collision between bullets and bricks
    this.game.physics.arcade.collide(this.brickGroup, this.bulletGroup, this.hit, null, this);
    // detect collision between bullets and bombs
    this.game.physics.arcade.collide(this.bombGroup, this.bulletGroup, this.hitBomb, null, this);
    // detect collision between bullets and walls
    this.game.physics.arcade.collide(this.wallGroup, this.bulletGroup);
    // aiming and no bullet is shown
    if (this.dragging && !this.bulletGroup.getFirstExists(true)) {
      const p = this.game.input.activePointer;
      const angle = Phaser.Math.angleBetween(p.x, p.y, this.cannon.x, this.cannon.y) - Math.PI / 2;

      // rotate cannon to point towards pointer.
      this.cannon.rotation = angle;

      // show aiming assistance
      this.drawAimingLines(angle + Math.PI / 2);
    }
  }

  drawAimingLines() {
    const lineLength = 500;
    const gapLength = 20;
    const angle = this.cannon.rotation + Math.PI / 2;
    const deltaX = Math.cos(Math.PI - angle) * gapLength;
    const deltaY = -Math.sin(Math.PI - angle) * gapLength;
    this.aimingLineGroup.removeAll();
    let currentLength = 0;
    let currentX = this.cannon.x;
    let currentY = this.cannon.y;
    while (currentLength < lineLength) {
      const aimingLine = this.aimingLineGroup.create(currentX, currentY, 'bullet');
      aimingLine.anchor.setTo(0.5, 0.5);
      aimingLine.scale.setTo(0.1, 0.1);
      currentX += deltaX;
      currentY += deltaY;
      currentLength += gapLength;

      if (this.checkAlOverlap(aimingLine)) {
        aimingLine.destroy();
        break;
      }
    }
  }

  checkAlOverlap(aimingLine) {
    let overlapping = false;
    const boundsA = new Phaser.Rectangle(aimingLine.left, aimingLine.top,
      aimingLine.width, aimingLine.height);
    this.wallGroup.forEachExists((o) => {
      const boundsB = o.getBounds();
      if (Phaser.Rectangle.intersects(boundsA, boundsB)) {
        overlapping = true;
      }
    }, this);
    if (overlapping) {
      return true;
    }
    this.brickGroup.forEachExists((o) => {
      const boundsB = o.getBounds();
      if (Phaser.Rectangle.intersects(boundsA, boundsB)) {
        overlapping = true;
      }
    }, this);

    return overlapping;
  }

  generateBricks(map) {
    const startPosX = this.wallLeft.right;
    const startPosY = this.wallTop.bottom;
    const endPosX = this.wallRight.left;
    const brickLen = (endPosX - startPosX) / 10;
    const locations = map || [
      [0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
      [0, 1],
      [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2],
      [0, 10],
    ];
    locations.forEach((location) => {
      if (location[0] < 0 || location[0] > 9 || location[1] < 0 || location[1] > 11) {
        return;
      }
      const brick = this.brickGroup.create(startPosX + location[0] * brickLen, startPosY + location[1] * brickLen, 'brick');
      brick.body.immovable = true;
      brick.health = 10;
      brick.anchor.setTo(0, 0);
      brick.height = brickLen;
      brick.width = brickLen;
    });
  }
  generateBombs() {
    const start_pos_x = this.wallLeft.right;
    const start_pos_y = this.wallTop.bottom;
    const end_pos_x = this.wallRight.left;
    const bomb_len = (end_pos_x - start_pos_x) / 10;

    let locations = [];
    if (Math.random() < 0.3) {
      let num = Math.floor(Math.random() * 111);
      locations = [[Math.floor(num / 10), num % 10]];
      let coord = [start_pos_x + locations[0][0] * bomb_len, start_pos_y + locations[0][1] * bomb_len];
      while (this.isOccupied(coord)) {
        num = Math.floor(Math.random() * 111);
        locations = [[Math.floor(num / 10), num % 10]];
      }
    };

    locations.forEach((location) => {
      if (location[0] < 0 || location[0] > 9 || location[1] < 0 || location[1] > 11) {
        return;
      }
      const bomb = this.bombGroup.create(start_pos_x + location[0] * bomb_len, start_pos_y + location[1] * bomb_len, 'bomb');
      bomb.body.immovable = true;
      bomb.health = 1;
      bomb.anchor.setTo(0, 0);
      bomb.height = bomb_len;
      bomb.width = bomb_len;
    });
  }

  isOccupied(location) {
    this.brickGroup.forEach(
      (brick) => {
        if (location[0] === brick.x && location[1] === brick.y) {
          return false;
        }
        // console.log(location[0]);
        // console.log(brick.x);
        // console.log(location[0] === brick.x);
      }
    );
  }

  hitBomb(bomb, bullet) {
    const xpos = bomb.x;
    const ypos = bomb.y;
    bomb.health--;
    this.totalHealth--;
    if (bomb.health <= 0) {
      bomb.kill();
    }
    var explosion = this.explosionGroup.getFirstExists(false);
    if (!explosion) {
      explosion = this.explosionGroup.create(bomb.x, bomb.y, 'explosion');
      explosion.anchor.setTo(0.5, 0.5);
    } else {
      explosion.reset(bomb.x, bomb.y);
    }
    var anim = explosion.animations.add('explosion');
    anim.play('explosion', 20);
    anim.onComplete.add(function () {
      explosion.kill();
    }, this);
    this.game.audio.boom.playIfNotMuted();
    this.brickGroup.forEach(
      (brick) => {
        // console.log(Math.sqrt(Math.pow(brick.x - xpos, 2) + Math.pow(brick.y - ypos, 2)));
        if (Math.sqrt(Math.pow(brick.x - xpos, 2) + Math.pow(brick.y - ypos, 2)) < 100) {
          this.killBrick(brick);
        }
      }
    );
    this.checkGameStatus();
  }

  killBrick(brick) {
    const healthLeft = brick.health;
    this.score += healthLeft;
    this.scoreText.text = this.score + '';
    this.totalHealth -= healthLeft;
    brick.health == 0;
    brick.kill();
    var explosion = this.explosionGroup.getFirstExists(false);
    if (!explosion) {
      explosion = this.explosionGroup.create(brick.x, brick.y, 'explosion');
      explosion.anchor.setTo(0.5, 0.5);
    } else {
      explosion.reset(brick.x, brick.y);
    }
    var anim = explosion.animations.add('explosion');
    anim.play('explosion', 20);
    anim.onComplete.add(function () {
      explosion.kill();
    }, this);
    this.game.audio.boom.playIfNotMuted();
    const score = this.score + '';
    wx.setUserCloudStorage({
      KVDataList: [{
        key: "score",
        value: score,
      }],
      success() {
        // eslint-disable-next-line no-console
        console.log(`save score ${score} success`);
      },
      fail() {
        // eslint-disable-next-line no-console
        console.log(`save score ${score} fail`);
      },
    });
    this.checkGameStatus();
  }

  checkGameStatus() {
    if (this.totalHealth <= 0) {
      this.goToNextGame();
    }
    if (this.bulletLeft <= 0) {
      setTimeout(() => {
        this.gameEnd();
      }, 4000);
    }
  }

  goToNextGame() {
    this.game.audio.pass.playIfNotMuted();
    setTimeout(() => {
      // show some animation here
      this.game.audio.pass.playIfNotMuted();
      this.state.game.state.start('infiniteGame', true, false,
        {
          map: generateMap(this.level + 1),
          level: this.level + 1,
          score: this.score,
          bullet: this.bulletLeft + 10,
        });
    }, 4000);
  }

  dragStart(event) {
    if (this.canDrag && event.y > this.wallTop.bottom) {
      this.dragging = true;
    }
  }

  dragStop() {
    if (this.dragging) {
      this.dragging = false;
      this.shoot();
    }
  }

  shoot() {
    const bullet = this.bulletGroup.getFirstExists(true);
    if (!bullet) {
      this.bulletLeft--;
      this.bulletText.text = `Bullet: ${this.bulletLeft}`;
      this.game.audio.bullet.playIfNotMuted();
      this.bulletGroup.removeAll();
      this.aimingLineGroup.removeAll();
      const bulletAngle = this.cannon.rotation + Math.PI / 2; // 0 -> left, pi/2 -> up
      for (let i = 0; i < 10; i += 1) {
        this.game.time.events.add((Phaser.Timer.SECOND / 10) * i, () => {
          const newBullet = this.bulletGroup.create(this.cannon.x, this.cannon.y, 'bullet');
          newBullet.body.bounce.set(1);
          newBullet.outOfBoundsKill = true;
          newBullet.checkWorldBounds = true;
          newBullet.anchor.setTo(0.5, 0.5);
          newBullet.scale.setTo(0.3, 0.3);
          newBullet.body.velocity.x = Math.cos(Math.PI - bulletAngle) * 500;
          newBullet.body.velocity.y = -Math.sin(Math.PI - bulletAngle) * 500;
        }, this);
      }
      this.checkGameStatus();
    }
  }

  hit(brick) {
    this.score += 1;
    this.scoreText.text = `${this.score}`;
    brick.damage(1);
    this.totalHealth--;
    if (brick.health <= 0) {
      brick.kill();
      let explosion = this.explosionGroup.getFirstExists(false);
      if (!explosion) {
        explosion = this.explosionGroup.create(brick.x, brick.y, 'explosion');
        explosion.anchor.setTo(0.5, 0.5);
      } else {
        explosion.reset(brick.x, brick.y);
      }
      const anim = explosion.animations.add('explosion');
      anim.play('explosion', 20);
      anim.onComplete.add(() => {
        explosion.kill();
      }, this);
      this.game.audio.boom.playIfNotMuted();
    }
    const score = `${this.score}`;
    wx.setUserCloudStorage({
      KVDataList: [{
        key: 'score',
        value: score,
      }],
      success() {
        // eslint-disable-next-line no-console
        console.log(`save score ${score} success`);
      },
      fail() {
        // eslint-disable-next-line no-console
        console.log(`save score ${score} fail`);
      },
    });
    this.checkGameStatus();
  }

  // show pause menu
  showPause() {
    this.canDrag = false;
    this.game.paused = true;
    const dialog = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'common', 'dialog');
    this.dialog = dialog;
    dialog.anchor.setTo(0.5, 0.5);
    dialog.scale.setTo(2.5, 2.5);

    const style = { font: '16px', fill: '#ffffff' };
    const pauseMenuText = this.game.add.text(2, -35, '菜单', style);
    pauseMenuText.anchor.setTo(0.5, 0.5);
    pauseMenuText.scale.setTo(0.7, 0.7);
    dialog.addChild(pauseMenuText);

    // 继续
    this.continueButton = this.game.add.sprite(0, 0, 'common', 'button');
    this.continueButton.anchor.setTo(0.5, 0.5);
    this.continueButton.scale.setTo(1.2, 0.7);
    dialog.addChild(this.continueButton);

    const continueText = this.game.add.text(0, 2, '继续', style);
    continueText.anchor.setTo(0.5, 0.5);
    continueText.scale.setTo(0.55 / 1.2, 0.55 / 0.7);
    this.continueButton.addChild(continueText);

    // 返回
    this.backButton = this.game.add.sprite(0, 16, 'common', 'button');
    this.backButton.anchor.setTo(0.5, 0.5);
    this.backButton.scale.setTo(1.2, 0.7);
    dialog.addChild(this.backButton);

    const backText = this.game.add.text(0, 2, '返回', style);
    backText.anchor.setTo(0.5, 0.5);
    backText.scale.setTo(0.55 / 1.2, 0.55 / 0.7);
    this.backButton.addChild(backText);

    this.game.input.onDown.add(this.pausemenuDown, this);
  }

  pausemenuDown(event) {
    if (!this.game.paused) {
      return;
    }
    const continueBonuds = this.continueButton.getBounds();
    const backBonuds = this.backButton.getBounds();

    if (Phaser.Rectangle.contains(continueBonuds, event.x, event.y)) {
      // continue button pressed
      this.dialog.destroy();
      this.game.paused = false;
      this.game.input.onDown.remove(this.pausemenuDown, this);
      this.game.time.events.add(Phaser.Timer.SECOND, () => {
        this.canDrag = true;
      });
    } else if (Phaser.Rectangle.contains(backBonuds, event.x, event.y)) {
      // back button pressed
      this.game.paused = false;
      this.game.input.onDown.remove(this.pausemenuDown, this);
      this.destroyAudios();
      this.game.state.start('menu');
    }
  }

  // show gameEnd menu
  gameEnd() {
    this.canDrag = false;
    this.game.paused = true;
    const dialog = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'common', 'dialog');
    this.dialog = dialog;
    dialog.anchor.setTo(0.5, 0.5);
    dialog.scale.setTo(2.5, 2.5);

    const style = { font: '16px', fill: '#ffffff' };
    const gameEndMenuText = this.game.add.text(2, -35, '游戏结束', style);
    gameEndMenuText.anchor.setTo(0.5, 0.5);
    gameEndMenuText.scale.setTo(0.7, 0.7);
    dialog.addChild(gameEndMenuText);

    const gameEndScoreText = this.game.add.text(0, -8, '得分: ' + this.score, style);
    gameEndScoreText.anchor.setTo(0.5, 0.5);
    gameEndScoreText.scale.setTo(0.6, 0.6);
    dialog.addChild(gameEndScoreText);

    // 返回
    this.backButton = this.game.add.sprite(0, 16, 'common', 'button');
    this.backButton.anchor.setTo(0.5, 0.5);
    this.backButton.scale.setTo(1.2, 0.7);
    dialog.addChild(this.backButton);

    const backText = this.game.add.text(0, 2, '返回', style);
    backText.anchor.setTo(0.5, 0.5);
    backText.scale.setTo(0.55 / 1.2, 0.55 / 0.7);
    this.backButton.addChild(backText);

    this.game.input.onDown.add(this.gameEndMenuDown, this);
  }

  gameEndMenuDown(event) {
    if (!this.game.paused) {
      return;
    }
    const backBonuds = this.backButton.getBounds();
    if (Phaser.Rectangle.contains(backBonuds, event.x, event.y)) {
      // back button pressed
      this.game.paused = false;
      this.game.input.onDown.remove(this.gameEndMenuDown, this);
      this.destroyAudios();
      this.game.state.start('menu');
    }
  }

}