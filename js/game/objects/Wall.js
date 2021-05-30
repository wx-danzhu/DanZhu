import Phaser from '../../libs/phaser-wx';

const width = 10;
const height = 10;

export default class Wall extends Phaser.Sprite {
  constructor(game, x, y, color) {
    const bmd = game.add.bitmapData(width, height);

    bmd.ctx.beginPath();
    bmd.ctx.fillStyle = color;
    bmd.ctx.fillRect(0, 0, width, height);
    bmd.ctx.fill();

    super(game, x, y, bmd);
    this.game = game;

    this.anchor.setTo(0.5, 0.5);
  }
}
