import BootState from './BootState.js';
import Boot2State from '../states/BootState.js'
import PreloadState from '../states/PreloadState.js'
import AnimationState from '../states/AnimationState.js'
import MenuState from '../states/MenuState.js'
import SubMenuState from '../states/SubMenuState.js'
import LevelMenuState from '../states/LevelMenuState.js'

export default class DanzhuGame {
  constructor(game) {
    game.state.add('boot', new BootState(game));
    game.state.add('boot2', new Boot2State(game));
    game.state.add('preload', new PreloadState(game));
    game.state.add('animation', new AnimationState(game));
    game.state.add('menu', new MenuState(game));
    game.state.add('submenu', new SubMenuState(game));
    game.state.add('levelmenu', new LevelMenuState(game));
  }
}
