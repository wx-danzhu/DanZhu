import BootState from './BootState.js';

export default class DanzhuGame {
  constructor(game) {
    game.state.add('boot', new BootState(game));
  }
}
