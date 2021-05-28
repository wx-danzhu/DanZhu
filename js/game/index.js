import DanzhuGameState from './states/DanzhuGameState';

export default class DanzhuGame {
  constructor(game) {
    game.state.add('danzhuGame', new DanzhuGameState(game));
  }
}
