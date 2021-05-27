import Phaser from '../libs/phaser-wx.js';
import BackToMenuState from '../base/BackToMenuState.js';

export default class OpenShowRankingListState extends BackToMenuState {
  
  constructor(game) {
    super();
    this.game = game;
  }

  init(key) {
    super.init(key);
  }

  preload() {
  }

  create() {
    super.create();

    console.log("creating ranking list...");

    this.openDataContext = wx.getOpenDataContext();
    this.sharedCanvas = this.openDataContext.canvas;
    
    var text = "好友排行";
    var style = { font: "32px Arial", fill: "#17202A", align: "center" };
    this.t = this.game.add.text(this.game.world.centerX - 160, 50, text, style);
    this.t.inputEnabled = true;
    this.listener();

  }

  update() {
    if(this.game.renderType === Phaser.HEADLESS) {

      wx.originContext.drawImage(this.sharedCanvas, 0, 0, 375, 667)
    }
  }

  listener() {
    
    var openDataContext = wx.getOpenDataContext();
    this.openDataContext.postMessage({
      action: 'SHOW_RANKING_LIST'
    });

    var sharedCanvas = openDataContext.canvas;

    setTimeout(function() {
      this.game.add.sprite(0, 100, Phaser.XTexture(sharedCanvas, 0, 0, 375, 667));
    }.bind(this), 1000);

  }

}
