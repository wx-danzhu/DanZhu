import Phaser from '../libs/phaser-wx';
import Arrow from '../objects/Arrow';
import Examples from '../config/StartMenu';

export default class BackToSubMenuState extends Phaser.State {
  constructor(game) {
    super();
    this.game = game;

    this.map = {};
    for (let i = 0; i < 3; i += 1) {
      this.map[Examples[i].key] = Examples[i];
    }
  }

  init(key) {
    this.key = key;
  }

  create() {
    this.arrowBack = new Arrow(this.game, 26, 26, 'arrowBack');
    this.arrowBack.addClick(this.backToMenu, this);
  }

  backToMenu() {
    this.game.renderType = Phaser.CANVAS;
    this.game.state.start('submenu', true, false, this.map[this.key]);
  }
}
