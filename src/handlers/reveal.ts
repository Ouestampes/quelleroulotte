import { getState } from '../util/state';
import { emitPublic } from '../windows/public';

export const revealCurrentAnswer = () => {
  const game = getState().game;
  emitPublic('answerUpdated', game.questions[game.pos].answer);
};
