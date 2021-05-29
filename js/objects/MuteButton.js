import Phaser from '../libs/phaser-wx';

export default class MuteButton extends Phaser.Sprite {
  constructor(game, x, y, value = true) {
    super(game, x, y, 'musicOn');
    this.setValue(value);
    this.game = game;
    this.game.world.add(this);

    this.anchor.setTo(0.5, 0.5);

    this.inputEnabled = true;

    this.events.onInputDown.add(this.onDown, this);
    this.events.onInputUp.add(this.onUp, this);
  }

  onDown() {
    this.scale.setTo(1.1, 1.1);
  }

  onUp() {
    this.scale.setTo(1, 1);
  }

  addClick(clickFn, context) {
    this.events.onInputUp.add(clickFn, context);
  }

  setValue(value) {
    if (value) {
      this.loadTexture('musicOn');
    } else {
      this.loadTexture('musicOff');
    }
  }

  showAndHide(show) {
    if (show) {
      this.inputEnabled = true;
      this.alpha = 1;
    } else {
      this.inputEnabled = false;
      this.alpha = 0;
    }
  }
}
