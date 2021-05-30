import Phaser from '../../libs/phaser-wx';

export default class InfiniteGameAnimation extends Phaser.State {
  constructor(game) {
    super();
    this.game = game;
  }

  init(parameters) {
    if (parameters) {
      this.map = parameters.map;
      this.level = parameters.level;
      this.score = parameters.score;
      this.bullet = parameters.bullet;
    }
  }

  create() {
    const style = { font: '65px Cursive', fill: '#117A65' };
    const levelText = this.game.add.text(this.game.width / 2, this.game.height / 2 - 40, 'LEVEL', style);
    levelText.anchor.setTo(0.5, 0.5);
    levelText.alpha = 0.0;
    const numberText = this.game.add.text(this.game.width / 2, this.game.height / 2 + 40, `${this.level}`, style);
    numberText.anchor.setTo(0.5, 0.5);
    numberText.alpha = 0.0;
    this.game.add.tween(levelText).to({ alpha: 1 }, 1500, Phaser.Easing.Quadratic.In, true);
    this.game.add.tween(numberText).to({ alpha: 1 }, 1500, Phaser.Easing.Quadratic.In, true);
    this.game.time.events.add(Phaser.Timer.SECOND * 2, () => {
      this.startGame();
    });
  }

  startGame() {
    this.state.game.state.start('infiniteGame', true, false,
      {
        map: this.map,
        level: this.level,
        score: this.score,
        bullet: this.bullet,
      });
  }
}
