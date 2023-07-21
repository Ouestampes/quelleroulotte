import {
  lastQuestion,
  nextQuestion,
  pauseGame,
  prevQuestion,
  revealCurrentAnswer,
  startGame,
  stopGame,
  unpauseGame,
} from '../roulotte';
import { MenuItemBuilderFunction } from '../types/electron';
import { getState } from '../util/state';

const builder: MenuItemBuilderFunction = () => ({
  label: '&Partie',
  submenu: [
    {
      label: getState().game.status === 'stopped' ? '&Démarrer' : '&Arrêter',
      click: () => {
        if (getState().game.status === 'stopped') {
          startGame([]);
        } else {
          stopGame();
        }
      },
    },
    {
      label: getState().game.status === 'paused' ? '&Reprendre' : '&Pause',
      click: () => {
        if (getState().game.status === 'paused') {
          unpauseGame();
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
