import Phaser from '../libs/phaser-wx.js';

import PlanePreloadState from './plane/states/PlanePreloadState.js'
import PlaneGameState from './plane/states/PlaneGameState.js'
import DanzhuPreloadState from './danzhu/states/DanzhuPreloadState.js'
import DanzhuGameState from './danzhu/states/DanzhuGameState.js'

export default class GameExamples {
  
  constructor(game) {
    
    game.state.add('planePreload', new PlanePreloadState(game));
    game.state.add('planeGame', new PlaneGameState(game));
    game.state.add('danzhuPreload', new DanzhuPreloadState(game));
    game.state.add('DanzhuGame', new DanzhuGameState(game));

  }

}
