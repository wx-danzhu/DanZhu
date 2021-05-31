/* global wx:readonly */

import Phaser from '../../libs/phaser-wx';
import Pause from '../objects/Pause';
import Wall from '../objects/Wall';
import Buttons from '../../config/StartMenu';

const wallWidth = 10;
const wallHeight = 50;

const initialShotNumber = 20;
const bulletsPerShot = 10;
const defaultBrickHealth = 10;

function calculateStarNumber(bulletNumber) {
  if (bulletNumber / (initialShotNumber * bulletsPerShot) > 0.5) {
    return 3;
  } if (bulletNumber / (initialShotNumber * bulletsPerShot) > 0.25) {
    return 2;
  }
  return 1;
}

export default class GameState extends Phaser.State {
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
        if (name !== 'bgm') {
          audio.stop();
        }
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
    this.createAudio('bgm', 'assets/soundEffects/bgm.mp3', true);
    this.createAudio('boom', 'assets/soundEffects/boom.mp3');
    this.createAudio('bullet', 'assets/soundEffects/bullet.wav');
    this.createAudio('brick', 'assets/soundEffects/brick.wav');
    this.createAudio('pass', 'assets/soundEffects/pass.mp3');
  }

  init(parameters) {
    if (parameters) {
      this.map = parameters.map;
      this.levelKey = parameters;
      this.levelIndex = parameters.index;
    }
  }

  create() {
    this.dragging = false;
    this.canDrag = true;

    // start physics engine
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.stage.backgroundColor = '#00B5C6';

    this.game.input.onDown.add(this.dragStart, this);
    this.game.input.onUp.add(this.dragStop, this);

    // world walls
    this.wallGroup = this.game.add.group();
    // this.wallGroup.enableBody = true;
    // this.wallGroup.physicsBodyType = Phaser.Physics.ARCADE;
    // this.wallTop = this.wallGroup.create(-80, -10, 'wall');
    // this.wallTop.scale.setTo(10, 1);
    this.wallTop = new Wall(this.game, this.game.width / 2, 0, '#5DECBF');
    this.wallTop.height = wallHeight + wallHeight;
    this.wallTop.width = this.game.width + 10;
    this.game.physics.arcade.enable(this.wallTop);
    this.wallTop.body.immovable = true;
    this.wallGroup.add(this.wallTop);
    // this.wallLeft = this.wallGroup.create(-55, -10, 'wall');
    // this.wallLeft.scale.setTo(1, 15);
    this.wallLeft = new Wall(this.game, 0, this.game.height / 2, '#5DECBF');
    this.wallLeft.height = this.game.height + 10;
    this.wallLeft.width = wallWidth + wallWidth;
    this.game.physics.arcade.enable(this.wallLeft);
    this.wallLeft.body.immovable = true;
    this.wallGroup.add(this.wallLeft);
    // this.wallRight = this.wallGroup.create(this.game.width - 9, -10, 'wall');
    // this.wallRight.scale.setTo(1, 15);
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
    this.cannon.scale.setTo(0.07, 0.07);

    // aiming lines
    this.aimingLineGroup = this.game.add.group();

    // generate bricks
    this.generateBricks(this.map);

    // bullet left
    const style = { font: '24px', fill: '#ffffff' };
    this.bulletLeft = initialShotNumber * bulletsPerShot;
    this.bulletText = this.game.add.text(50, 15, `子弹: ${this.bulletLeft}`, style);

    // pause
    this.pause = new Pause(this.game, 26, 26, 'arrowBack');
    this.pause.addClick(this.showPause, this);
  }

  update() {
    // play bgm here so that it starts after brought back from background
    if (!this.game.paused) {
      this.game.audio.bgm.playIfNotMuted();
    }
    // detect collision between bullets and bricks
    this.game.physics.arcade.collide(this.brickGroup, this.bulletGroup, this.hit, null, this);
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
      aimingLine.scale.setTo(0.3, 0.3);
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
    const locations = map;
    locations.forEach((location) => {
      if (location[0] < 0 || location[0] > 9 || location[1] < 0 || location[1] > 11) {
        return;
      }
      const brick = this.brickGroup.create(startPosX + location[0] * brickLen, startPosY + location[1] * brickLen, 'brick');
      brick.body.immovable = true;
      if (location.length > 2) {
        // eslint-disable-next-line prefer-destructuring
        brick.health = location[2];
      } else {
        brick.health = defaultBrickHealth;
      }
      brick.anchor.setTo(0, 0);
      brick.height = brickLen;
      brick.width = brickLen;

      const textStyle = { font: '24px Courier', fill: '#000000' };
      brick.healthText = this.game.add.text(0, 0, `${brick.health}`, textStyle);
      brick.healthText.anchor.set(0.5);
      brick.healthText.x = Math.floor(brick.x + brick.width / 2 + 1);
      brick.healthText.y = Math.floor(brick.y + brick.height / 2 + 4);
    });
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
    if (!bullet && this.bulletLeft >= 1) {
      this.game.audio.bullet.playIfNotMuted();
      this.bulletGroup.removeAll();
      this.aimingLineGroup.removeAll();
      const bulletAngle = this.cannon.rotation + Math.PI / 2; // 0 -> left, pi/2 -> up
      for (let i = 0; i < bulletsPerShot; i += 1) {
        this.game.time.events.add((Phaser.Timer.SECOND / 10) * i, () => {
          if (this.bulletLeft <= 0) {
            return;
          }
          const newBullet = this.bulletGroup.create(this.cannon.x, this.cannon.y, 'bullet');
          newBullet.body.bounce.set(1);
          newBullet.outOfBoundsKill = true;
          newBullet.checkWorldBounds = true;
          newBullet.anchor.setTo(0.5, 0.5);
          newBullet.scale.setTo(1, 1);
          newBullet.body.velocity.x = Math.cos(Math.PI - bulletAngle) * 500;
          newBullet.body.velocity.y = -Math.sin(Math.PI - bulletAngle) * 500;
          newBullet.events.onKilled.add(this.checkGameStatus, this);
          this.bulletLeft -= 1;
          this.bulletText.text = `子弹: ${this.bulletLeft}`;
          if (calculateStarNumber(this.bulletLeft) === 3) {
            this.bulletText.setStyle({ font: '24px', fill: '#ffffff' }, true);
          } else if (calculateStarNumber(this.bulletLeft) === 2) {
            this.bulletText.setStyle({ font: '24px', fill: '#fff633' }, true);
          } else {
            this.bulletText.setStyle({ font: '24px', fill: '#ff3333' }, true);
          }
        }, this);
      }
    }
  }

  hit(brick) {
    brick.damage(1);
    // eslint-disable-next-line no-param-reassign
    brick.healthText.text = `${brick.health}`;
    brick.healthText.setStyle({ font: 'bold 26px Courier', fill: '#E74C3C' }, true);
    // eslint-disable-next-line no-param-reassign
    brick.healthText.anim = setTimeout(() => {
      brick.healthText.setStyle({ font: '24px Courier', fill: '#000000' }, true);
    }, 200);
    if (brick.health <= 0) {
      brick.kill();
      brick.healthText.destroy();
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
      this.game.audio.brick.playIfNotMuted();
    }
  }

  // show pause menu, currently not working
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

  checkGameStatus() {
    const bullet = this.bulletGroup.getFirstExists(true);
    if (bullet) {
      // if there are still bullets on the screen
      return;
    }
    const brick = this.brickGroup.getFirstExists(true);
    if (!brick) {
      this.goToNextGame();
    } else if (this.bulletLeft <= 0) {
      this.gameEnd();
    }
  }

  // show goToNextGame menu
  goToNextGame() {
    this.game.audio.pass.playIfNotMuted();
    this.canDrag = false;
    this.game.paused = true;
    const dialog = this.game.add.sprite(this.game.width / 2, this.game.height / 2, 'common', 'dialog');
    this.dialog = dialog;
    dialog.anchor.setTo(0.5, 0.5);
    dialog.scale.setTo(2.5, 2.5);

    const style = { font: '16px', fill: '#ffffff' };
    const maxLevel = Buttons[1].children.length;
    if (this.levelIndex !== maxLevel) {
      // 下一关
      this.nextLevelButton = this.game.add.sprite(0, 0, 'common', 'button');
      this.nextLevelButton.anchor.setTo(0.5, 0.5);
      this.nextLevelButton.scale.setTo(1.2, 0.7);
      dialog.addChild(this.nextLevelButton);

      const nextLevelText = this.game.add.text(0, 2, '下一关', style);
      nextLevelText.anchor.setTo(0.5, 0.5);
      nextLevelText.scale.setTo(0.55 / 1.2, 0.55 / 0.7);
      this.nextLevelButton.addChild(nextLevelText);
    } else {
      const passAllStyle = { font: '16px', fill: '#000000' };
      const passAllText = this.game.add.text(0, 2, '恭喜通关!', passAllStyle);
      passAllText.anchor.setTo(0.5, 0.7);
      passAllText.scale.setTo(0.7, 0.7);
      dialog.addChild(passAllText);
    }

    // 返回
    this.backButton = this.game.add.sprite(0, 16, 'common', 'button');
    this.backButton.anchor.setTo(0.5, 0.5);
    this.backButton.scale.setTo(1.2, 0.7);
    dialog.addChild(this.backButton);

    const backText = this.game.add.text(0, 2, '返回', style);
    backText.anchor.setTo(0.5, 0.5);
    backText.scale.setTo(0.55 / 1.2, 0.55 / 0.7);
    this.backButton.addChild(backText);

    this.game.input.onDown.add(this.goToNextDown, this);

    let starSign;
    switch (calculateStarNumber(this.bulletLeft)) {
      case 3:
        starSign = 'threeStars';
        break;
      case 2:
        starSign = 'twoStars';
        break;
      case 1:
        starSign = 'oneStar';
        break;
      default:
        starSign = 'oneStar';
        break;
    }
    const starImage = this.game.add.sprite(0, -38, starSign);
    starImage.anchor.setTo(0.5, 0.5);
    starImage.scale.setTo(0.2, 0.2);
    dialog.addChild(starImage);
  }

  goToNextDown(event) {
    if (!this.game.paused) {
      return;
    }
    let goToNextBonuds = null;
    const maxLevel = Buttons[1].children.length;
    if (this.levelIndex !== maxLevel) {
      goToNextBonuds = this.nextLevelButton.getBounds();
    }
    const backBonuds = this.backButton.getBounds();
    if (Phaser.Rectangle.contains(backBonuds, event.x, event.y)) {
      // back button pressed
      this.game.paused = false;
      this.game.input.onDown.remove(this.gameEndMenuDown, this);
      this.destroyAudios();
      this.game.state.start('menu');
    } else if (this.levelIndex !== maxLevel
      && Phaser.Rectangle.contains(goToNextBonuds, event.x, event.y)) {
      // go to next level
      this.game.paused = false;
      this.game.input.onDown.remove(this.goToNextDown, this);
      const list = Buttons[1].children;
      this.destroyAudios();
      this.state.game.state.start(
        'danzhuGame',
        true, false, list[this.levelIndex].key,
      );
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

    // 重玩本关
    this.restartButton = this.game.add.sprite(0, 0, 'common', 'button');
    this.restartButton.anchor.setTo(0.5, 0.5);
    this.restartButton.scale.setTo(1.2, 0.7);
    dialog.addChild(this.restartButton);

    const restartText = this.game.add.text(0, 2, '重玩', style);
    restartText.anchor.setTo(0.5, 0.5);
    restartText.scale.setTo(0.55 / 1.2, 0.55 / 0.7);
    this.restartButton.addChild(restartText);

    // 返回
    this.backToMenuButton = this.game.add.sprite(0, 16, 'common', 'button');
    this.backToMenuButton.anchor.setTo(0.5, 0.5);
    this.backToMenuButton.scale.setTo(1.2, 0.7);
    dialog.addChild(this.backToMenuButton);

    const backToMenuText = this.game.add.text(0, 2, '返回', style);
    backToMenuText.anchor.setTo(0.5, 0.5);
    backToMenuText.scale.setTo(0.55 / 1.2, 0.55 / 0.7);
    this.backToMenuButton.addChild(backToMenuText);

    this.game.input.onDown.add(this.gameEndMenuDown, this);
  }

  gameEndMenuDown(event) {
    if (!this.game.paused) {
      return;
    }
    const restartBonuds = this.restartButton.getBounds();
    const backBonuds = this.backToMenuButton.getBounds();
    if (Phaser.Rectangle.contains(backBonuds, event.x, event.y)) {
      // back button pressed
      this.game.paused = false;
      this.game.input.onDown.remove(this.gameEndMenuDown, this);
      this.destroyAudios();
      this.game.state.start('menu');
    } else if (Phaser.Rectangle.contains(restartBonuds, event.x, event.y)) {
      // restart this level
      this.game.paused = false;
      this.game.input.onDown.remove(this.gameEndMenuDown, this);
      this.destroyAudios();
      this.state.game.state.start('danzhuGame', true, false, this.levelKey);
    }
  }
}
