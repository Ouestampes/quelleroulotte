import { emitQuestion } from '../roulotte';
import { getGame, setGame } from '../util/state';

export const prevQuestion = (): void => {
  const game = getGame();
  if (game.pos <= 0) return;
  game.pos -= 1;
  setGame(game);
  emitQuestion(game.questions[game.pos]);
};
