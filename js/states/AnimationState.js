import Phaser from '../libs/phaser-wx';

export default class AnimationState extends Phaser.State {
  constructor(game) {
    super();
    this.game = game;
  }

  create() {
    this.game.state.start('menu');
  }
}
