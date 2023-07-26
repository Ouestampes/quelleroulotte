import { emitQuestion, updateControls } from '../roulotte';
import { pauseTimer } from '../timer';
import { setState } from '../util/state';

export const stopGame = () => {
  // Le timer ne sera renvoyé qu'après un redémarrage du jeu
  pauseTimer();

  setState({
    game: {
      questions: [],
      pos: -1,
      categories: [],
    },
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
