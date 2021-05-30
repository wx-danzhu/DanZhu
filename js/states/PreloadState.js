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
    this.game.load.image('arrowUp', 'assets/icons/Black/1x/up.png');
    this.game.load.image('arrowDown', 'assets/icons/Black/1x/down.png');
    this.game.load.image('musicOn', 'assets/icons/Black/1x/musicOn.png');
    this.game.load.image('musicOff', 'assets/icons/Black/1x/musicOff.png');

    // game assets
    this.game.load.image('cannon', 'assets/plane/images/hero.png');
    this.game.load.image('brick', 'assets/rolling_ball/block_small.png');
    this.game.load.image('bullet', 'assets/rolling_ball/ball_blue_small.png');
    this.game.load.spritesheet('explosion', 'assets/plane/images/explosion.png', 47, 64, 19);
    this.game.load.image('oneStar', 'assets/plane/images/oneStar.png');
    this.game.load.image('twoStars', 'assets/plane/images/twoStars.png');
    this.game.load.image('threeStars', 'assets/plane/images/threeStars.png');
    this.game.load.image('bomb', 'assets/rolling_ball/block_locked_small.png');

    this.game.load.atlas('common', 'assets/plane/images/common.png', null, Common);
  }

  create() {
    this.game.state.start('animation');
  }
}
