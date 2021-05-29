import Phaser from '../libs/phaser-wx';

export default class PreloadState extends Phaser.State {
  constructor(game) {
    super();
    this.game = game;
  }

  preload() {
    this.game.load.image('arrowBack', 'assets/arrow_left.png');
    this.game.load.image('arrowUp', 'assets/icons/Black/1x/up.png');
    this.game.load.image('arrowDown', 'assets/icons/Black/1x/down.png');
    this.game.load.image('musicOn', 'assets/icons/Black/1x/musicOn.png');
    this.game.load.image('musicOff', 'assets/icons/Black/1x/musicOff.png');
  }

  create() {
    this.game.state.start('animation');
  }
}
