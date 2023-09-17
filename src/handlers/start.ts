import { IpcMainInvokeEvent } from 'electron';

import { resetTimer, startTimer } from '../timer';
import { getGame, setGame } from '../util/state';
import { createPublicWindow } from '../windows/public';
import { nextQuestion } from './next';

export const startGame = (
  _: IpcMainInvokeEvent | null,
  categories: string[],
): void => {
  createPublicWindow();
  const game = getGame();

  if (game.status === 'stopped') {
    setGame({
      questions: [],
      pos: -1,
      categories,
      questionsAsked: 0,
    });

    // On tire la première question
    nextQuestion();

    // On initialise le timer
    resetTimer();
  }

  startTimer();
};
