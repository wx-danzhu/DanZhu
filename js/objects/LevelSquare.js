import Phaser from '../libs/phaser-wx.js';

export default class LevelSquare extends Phaser.Sprite {
  
  constructor(game, x, y, properties) {
    
    var bmd = game.add.bitmapData(40, 40);

    bmd.ctx.fillStyle = "#fff";
    bmd.ctx.fillRect(0, 0, 40, 40);

    super(game, x, y, bmd);
    this.game = game;

    this.anchor.setTo(0.5, 0.5);

    var style = { font: "20px Arial", fill: "#000", align: "center" };
    var text = this.game.make.text(0, 0, properties.name, style);
    text.anchor.setTo(0.5, 0.5);
    this.addChild(text);

  }

  addClick(clickFn, context) {

    this.events.onInputUp.add(clickFn, context);

  }

}
 