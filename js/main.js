import Phaser from 'libs/phaser-wx.js';
import BootState from 'states/BootState.js'
import DanzhuGame from 'game/index.js';
import PreloadState from 'states/PreloadState.js'
import AnimationState from 'states/AnimationState.js'
import MenuState from 'states/MenuState.js'
import SubMenuState from 'states/SubMenuState.js'
import LevelMenuState from 'states/LevelMenuState.js'

// 保存原始的canvas
wx.originContext = canvas.getContext('2d');

var game = new Phaser.Game({
  width: 375,
  height: 667,
  renderer: Phaser.CANVAS,
  canvas: canvas
});

game.state.add('boot', new BootState(game));
game.state.add('preload', new PreloadState(game));
game.state.add('animation', new AnimationState(game));
game.state.add('menu', new MenuState(game));
game.state.add('submenu', new SubMenuState(game));
game.state.add('levelmenu', new LevelMenuState(game));

new DanzhuGame(game);

//game.state.start('menu');
game.state.start('boot');
//game.state.start('danzhuPreload');
