import { emitQuestion } from '../roulotte';
import { getGame, setGame } from '../util/state';

export const lastQuestion = (): void => {
  const game = getGame();

  // La position démarre à 0
  game.pos = game.questions.length - 1;
  setGame(game);

  emitQuestion(game.questions[game.pos]);
};
