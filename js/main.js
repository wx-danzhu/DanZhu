import Phaser from 'libs/phaser-wx.js';
import BootState from 'states/BootState.js'
import DanzhuGame from 'game/index.js';
import MenuState from 'states/MenuState.js'
import SubMenuState from 'states/SubMenuState.js'

// 保存原始的canvas
wx.originContext = canvas.getContext('2d');

var game = new Phaser.Game({
  width: 375,
  height: 667,
  renderer: Phaser.CANVAS,
  canvas: canvas
});

game.state.add('boot', new BootState(game));
game.state.add('menu', new MenuState(game));
game.state.add('submenu', new SubMenuState(game));

new DanzhuGame(game);

game.state.start('menu');
//game.state.start('boot');
//game.state.start('danzhuPreload');
