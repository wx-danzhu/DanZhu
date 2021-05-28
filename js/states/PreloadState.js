import Phaser from '../libs/phaser-wx';

export default class PreloadState extends Phaser.State {
  constructor(game) {
    super();
    this.game = game;
  }

  preload() {
    this.game.load.image('arrowBack', 'assets/arrow_left.png');
  }

  create() {
    this.game.state.start('animation');
  }
}
