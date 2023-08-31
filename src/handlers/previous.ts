import { emitQuestion } from '../roulotte';
import { getState, setState } from '../util/state';

export const prevQuestion = (): void => {
  const game = getState().game;
  if (game.pos <= 0) return null;
  game.pos -= 1;
  setState({ game });
  emitQuestion(game.questions[game.pos]);
};
