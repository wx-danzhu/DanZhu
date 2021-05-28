/* global wx:readonly, canvas:readonly */
/* eslint-disable no-new */

import Phaser from './libs/phaser-wx';
import Boot from './boot/index';
import DanzhuGame from './game/index';
import OpenExamples from './open/index';

// 保存原始的canvas
wx.originContext = canvas.getContext('2d');

const game = new Phaser.Game({
  width: 375,
  height: 667,
  renderer: Phaser.CANVAS,
  canvas,
});

new Boot(game);
new DanzhuGame(game);
new OpenExamples(game);

game.state.start('boot');
