import Phaser from '../libs/phaser-wx';

export default class LevelSquare extends Phaser.Sprite {
  constructor(game, x, y, properties) {
    const bmd = game.add.bitmapData(70, 70);

    bmd.ctx.fillStyle = '#474838';
    bmd.ctx.fillRect(0, 0, 70, 70);

    super(game, x, y, bmd);
    this.game = game;

    this.anchor.setTo(0.5, 0.5);

    const style = { font: '20px Arial', fill: '#FFF' };
    const text = this.game.make.text(0, 0, properties.name, style);
    text.anchor.setTo(0.5, 0.5);
    this.addChild(text);
  }

  addClick(clickFn, context) {
    this.events.onInputUp.add(clickFn, context);
  }
}
