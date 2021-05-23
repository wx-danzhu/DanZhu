import DanzhuPreloadState from './states/DanzhuPreloadState.js';
import DanzhuGameState from './states/DanzhuGameState.js';

export default class DanzhuGame {
  constructor(game) {
    game.state.add('danzhuPreload', new DanzhuPreloadState(game));
    game.state.add('DanzhuGame', new DanzhuGameState(game));
  }
}
