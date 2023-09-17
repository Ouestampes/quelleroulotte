import { emitQuestion, updateControls } from '../roulotte';
import { pauseTimer } from '../timer';
import { setGame } from '../util/state';

export const stopGame = (): void => {
  // Le timer ne sera renvoyé qu'après un redémarrage du jeu
  pauseTimer();

  setGame({
    questions: [],
    pos: -1,
    categories: [],
  });

  updateControls('stopped');

  emitQuestion({
    question: '',
    category: '',
    theme: '',
    id: 0,
    answer: '',
  });
};
