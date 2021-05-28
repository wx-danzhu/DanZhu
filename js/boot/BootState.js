import Phaser from '../libs/phaser-wx';

export default class PreloadState extends Phaser.State {
  constructor(game) {
    super();
    this.game = game;
  }

  preload() {
    this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
  }

  create() {
    this.game.state.start('boot2');
  }
}
