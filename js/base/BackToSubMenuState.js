import Phaser from '../libs/phaser-wx.js';
import Arrow from '../objects/Arrow.js';
import Examples from '../config/StartMenu.js';

export default class BackToSubMenuState extends Phaser.State {
  
  constructor(game) {
    super();
    this.game = game;

    this.map = {};
    for(var i=0; i<3; i++) {
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
