import Phaser from '../libs/phaser-wx';
import Common from '../game/atlas/common';

export default class PreloadState extends Phaser.State {
  constructor(game) {
    super();
    this.game = game;
  }

  preload() {
    // menu assets
    this.game.load.image('arrowBack', 'assets/arrow_left.png');
    this.game.load.image('arrowUp', 'assets/up.png');
    this.game.load.image('arrowDown', 'assets/down.png');
    this.game.load.image('musicOn', 'assets/musicOn.png');
    this.game.load.image('musicOff', 'assets/musicOff.png');

    // game assets
    this.game.load.image('cannon', 'assets/images/Cannon.png');
    this.game.load.image('brick', 'assets/images/WoodenBox.jpg');
    this.game.load.image('bullet', 'assets/images/Bullet.png');
    this.game.load.spritesheet('explosion', 'assets/images/explosion.png', 47, 64, 19);
    this.game.load.image('oneStar', 'assets/images/oneStar.png');
    this.game.load.image('twoStars', 'assets/images/twoStars.png');
    this.game.load.image('threeStars', 'assets/images/threeStars.png');
    this.game.load.image('bomb', 'assets/images/Bomb.png');

    this.game.load.atlas('common', 'assets/common.png', null, Common);
  }

  create() {
    this.game.state.start('animation');
  }
}
