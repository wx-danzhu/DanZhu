import Phaser from 'libs/phaser-wx.js';
import Boot from 'boot/index.js';
import DanzhuGame from 'game/index.js';
import OpenExamples from 'open/index.js';

// 保存原始的canvas
wx.originContext = canvas.getContext('2d');

var game = new Phaser.Game({
  width: 375,
  height: 667,
  renderer: Phaser.CANVAS,
  canvas: canvas,
});

new Boot(game);
new DanzhuGame(game);
new OpenExamples(game);

game.state.start('boot');
