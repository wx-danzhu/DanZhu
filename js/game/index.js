import DanzhuGameState from './states/DanzhuGameState';
import InfiniteGameState from './states/InfiniteGameState';
import InfiniteGameAnimation from './states/InfiniteGameAnimationState';

export default class DanzhuGame {
  constructor(game) {
    game.state.add('danzhuGame', new DanzhuGameState(game));
    game.state.add('infiniteGame', new InfiniteGameState(game));
    game.state.add('infiniteGameAnimation', new InfiniteGameAnimation(game));
  }
}
