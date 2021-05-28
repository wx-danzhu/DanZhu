import Phaser from '../libs/phaser-wx';

export default class Title extends Phaser.Sprite {
  constructor(game, x, y, properties) {
    const bmd = game.add.bitmapData(100, 100);

    super(game, x, y, bmd);
    this.game = game;

    this.anchor.setTo(0.5, 0.5);

    const style = { font: '50px Arial', fill: '#000', align: 'center' };
    const text = this.game.make.text(10, 0, properties.name, style);
    text.anchor.setTo(0.5, 0.5);
    this.addChild(text);

    this.events.onInputDown.add(this.onDown, this);
    this.events.onInputUp.add(this.onUp, this);
  }

  onDown() {
    this.scale.setTo(1.3, 1.3);
  }

  onUp() {
    this.scale.setTo(1, 1);
  }
}
