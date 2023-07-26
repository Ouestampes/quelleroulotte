import { resetTimer, startTimer } from '../timer';
import { getState, setState } from '../util/state';
import { createPublicWindow } from '../windows/public';
import { nextQuestion } from './next';

export const startGame = (_: null, categories: string[]) => {
  createPublicWindow();
  const game = getState().game;

  if (game.status === 'stopped') {
    setState({
      game: {
        questions: [],
        pos: -1,
        categories,
        questionsAsked: 0,
      },
    });

    // On tire la première question
    nextQuestion();

    // On initialise le timer
    resetTimer();
  }

  startTimer();
};
