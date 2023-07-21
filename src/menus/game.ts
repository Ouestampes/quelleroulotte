import { lastQuestion } from '../handlers/gotoLast';
import { nextQuestion } from '../handlers/next';
import { pauseGame } from '../handlers/pause';
import { prevQuestion } from '../handlers/previous';
import { revealCurrentAnswer } from '../handlers/reveal';
import { startGame } from '../handlers/start';
import { stopGame } from '../handlers/stop';
import { startTimer } from '../roulotte';
import { MenuItemBuilderFunction } from '../types/electron';
import { getState } from '../util/state';

const builder: MenuItemBuilderFunction = () => ({
  label: '&Partie',
  submenu: [
    {
      label: getState().game.status === 'stopped' ? '&Démarrer' : '&Arrêter',
      click: () => {
        if (getState().game.status === 'stopped') {
          startGame(null, []);
        } else {
          stopGame();
        }
      },
    },
    {
      label: getState().game.status === 'paused' ? '&Reprendre' : '&Pause',
      click: () => {
        if (getState().game.status === 'paused') {
          startTimer();
        } else {
          pauseGame();
        }
      },
    },
    { type: 'separator' },
    { label: 'Question &Suivante', click: () => nextQuestion() },
    { label: 'Question &Précédente', click: () => prevQuestion() },
    { label: 'D&ernière Question', click: () => lastQuestion() },
    {
      label: 'Ré&véler la réponse au Public',
      click: () => revealCurrentAnswer(),
    },
  ],
});

export default builder;
