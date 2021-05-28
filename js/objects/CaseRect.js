import Phaser from '../libs/phaser-wx';

export default class CaseRect extends Phaser.Sprite {
  constructor(game, x, y, properties) {
    const bmd = game.add.bitmapData(game.width - 100, 30);

    bmd.ctx.fillStyle = '#fff';
    bmd.ctx.fillRect(0, 0, game.width - 100, 30);

    super(game, x, y, bmd);
    this.game = game;

    this.anchor.setTo(0.5, 0.5);

    const style = { font: '20px Arial', fill: '#000', align: 'center' };
    const text = this.game.make.text(0, 0, properties.name, style);
    text.anchor.setTo(0.5, 0.5);
    this.addChild(text);
  }

  addClick(clickFn, context) {
    this.events.onInputUp.add(clickFn, context);
  }
}
