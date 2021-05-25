import Phaser from '../libs/phaser-wx.js';

export default class PreloadState extends Phaser.State {
  
  constructor(game) {
    super();
    this.game = game;
  }

  preload() {
    console.log("loading ur arrow back here -------")
    this.game.load.image('arrowBack', 'assets/arrow_left.png');
  }

  create() {
    this.game.state.start('animation');
  }

}
