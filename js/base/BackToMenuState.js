import Phaser from '../libs/phaser-wx.js';
import Arrow from '../objects/Arrow.js';

export default class BackToMenuState extends Phaser.State {
  
  constructor(game) {
    super();
    this.game = game;
  }

  create() {
    console.log("creating ur little arrow...");
    this.arrowBack = new Arrow(this.game, 26, 26, 'arrowBack');
    this.arrowBack.addClick(this.backToMenu, this);
  }

  backToMenu() {
    console.log("directing back to menu...");
    this.game.state.start('menu');
  }

}
 