import Phaser from 'libs/phaser-wx.js';
import DanzhuGame from 'game/index.js';

// 保存原始的canvas
wx.originContext = canvas.getContext('2d');

var game = new Phaser.Game({
  width: 375,
  height: 667,
  renderer: Phaser.CANVAS,
  canvas: canvas
});

new DanzhuGame(game);

game.state.start('danzhuPreload');
