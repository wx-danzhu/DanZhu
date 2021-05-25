import Phaser from '../libs/phaser-wx.js';
import BackToMenuState from '../base/BackToMenuState.js';

export default class LicenseState extends BackToMenuState {
  
  constructor(game) {
    super();
    this.game = game;
  }

  init(key) {
    super.init(key);
  }

  preload() {
  }

  create() {
    super.create();

    console.log("loading license page...");

    
    var text = "Our license page";
    var style = { font: "20px Arial", fill: "#17202A", align: "center" };
    this.t = this.game.add.text(this.game.world.centerX - 160, 50, text, style);
    this.t.inputEnabled = true;

  }

}
