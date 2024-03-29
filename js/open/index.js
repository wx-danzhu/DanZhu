import PIXI from '../libs/pixi-wx';
import Phaser from '../libs/phaser-wx';

import RankingListState from './RankingListState';

export default class OpenExamples {
  constructor(game) {
    Phaser.XTexture = (xCanvas, x, y, w, h) => new PIXI.Texture(
      new PIXI.BaseTexture(xCanvas), new PIXI.Rectangle(x, y, w, h),
    );

    game.state.add('rankinglist', new RankingListState(game));
  }
}
