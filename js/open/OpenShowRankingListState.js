/* global wx:readonly */

import Phaser from '../libs/phaser-wx';
import BackToMenuState from '../base/BackToMenuState';

export default class OpenShowRankingListState extends BackToMenuState {
  constructor(game) {
    super();
    this.game = game;
  }

  init(key) {
    super.init(key);
  }

  create() {
    super.create();

    this.openDataContext = wx.getOpenDataContext();
    this.sharedCanvas = this.openDataContext.canvas;

    const text = '好友排行';
    const style = { font: '32px Arial', fill: '#17202A', align: 'center' };
    this.t = this.game.add.text(this.game.world.centerX - 160, 50, text, style);
    this.t.inputEnabled = true;
    this.listener();
  }

  update() {
    if (this.game.renderType === Phaser.HEADLESS) {
      wx.originContext.drawImage(this.sharedCanvas, 0, 0, 375, 667);
    }
  }

  listener() {
    const openDataContext = wx.getOpenDataContext();
    this.openDataContext.postMessage({
      action: 'SHOW_RANKING_LIST',
    });

    const sharedCanvas = openDataContext.canvas;

    setTimeout(() => {
      this.game.add.sprite(0, 100, Phaser.XTexture(sharedCanvas, 0, 0, 375, 667));
    }, 1000);
  }
}
