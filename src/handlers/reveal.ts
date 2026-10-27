import { getGame } from '../util/state';
import { emitPublic } from '../windows/public';

export const revealCurrentAnswer = (): void => {
  const game = getGame();
  if (game.questions[game.pos]) {
    emitPublic('answerUpdated', game.questions[game.pos].answer);
  }
};
