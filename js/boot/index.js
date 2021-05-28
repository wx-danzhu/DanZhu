import BootState from './BootState';
import Boot2State from '../states/BootState';
import PreloadState from '../states/PreloadState';
import AnimationState from '../states/AnimationState';
import MenuState from '../states/MenuState';
import SubMenuState from '../states/SubMenuState';
import LevelMenuState from '../states/LevelMenuState';
import LicenseState from '../states/LicenseState';

export default class DanzhuGame {
  constructor(game) {
    game.state.add('boot', new BootState(game));
    game.state.add('boot2', new Boot2State(game));
    game.state.add('preload', new PreloadState(game));
    game.state.add('animation', new AnimationState(game));
    game.state.add('menu', new MenuState(game));
    game.state.add('submenu', new SubMenuState(game));
    game.state.add('levelmenu', new LevelMenuState(game));
    game.state.add('licensepage', new LicenseState(game));
  }
}
