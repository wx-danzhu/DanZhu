import PIXI from '../libs/pixi-wx.js';
import Phaser from '../libs/phaser-wx.js';

import OpenShowRankingListState from './OpenShowRankingListState.js'

export default class OpenExamples {
  
  constructor(game) {
    
    Phaser.XTexture = function(xCanvas, x, y, w, h){
      return new PIXI.Texture(new PIXI.BaseTexture(xCanvas), new PIXI.Rectangle(x, y, w, h));
    };

    game.state.add('openShowRankingList', new OpenShowRankingListState(game));

  }

}
