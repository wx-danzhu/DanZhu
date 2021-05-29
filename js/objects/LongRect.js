import Phaser from '../libs/phaser-wx';

const width = 260;
const height = 80;

export default class LongRect extends Phaser.Sprite {
  constructor(game, x, y, properties) {
    const bmd = game.add.bitmapData(width, height);

    bmd.ctx.beginPath();
    bmd.ctx.fillStyle = '#595954';
    bmd.ctx.fillRect(0, 0, width, height);
    bmd.ctx.fill();

    super(game, x, y, bmd);
    this.game = game;

    this.anchor.setTo(0.5, 0.5);

    const style = { font: '32px Arial', fill: '#FFF' };
    const text = this.game.make.text(0, 0, properties.name, style);
    text.anchor.setTo(0.5, 0.5);
    this.addChild(text);

    this.events.onInputDown.add(this.onDown, this);
    this.events.onInputUp.add(this.onUp, this);
  }

  onDown() {
    this.scale.setTo(1.2, 1.2);
  }

  onUp() {
    this.scale.setTo(1, 1);
  }

  addClick(clickFn, context) {
    this.events.onInputUp.add(clickFn, context);
  }
}
