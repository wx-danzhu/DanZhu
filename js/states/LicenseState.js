import BackToMenuState from '../base/BackToMenuState';

export default class LicenseState extends BackToMenuState {
  constructor(game) {
    super();
    this.game = game;
  }

  init(key) {
    super.init(key);
  }

  create() {
    super.create();

    const text = 'Our license page';
    const style = { font: '20px Arial', fill: '#17202A', align: 'center' };
    this.t = this.game.add.text(this.game.world.centerX - 160, 50, text, style);
    this.t.inputEnabled = true;
  }
}
