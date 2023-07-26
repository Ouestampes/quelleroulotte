import { emitQuestion } from '../roulotte';
import { getState, setState } from '../util/state';

export const lastQuestion = () => {
  const game = getState().game;

  // La position démarre à 0
  game.pos = game.questions.length - 1;
  setState({ game });

  emitQuestion(game.questions[game.pos]);
};
