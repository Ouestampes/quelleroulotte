import { lastQuestion } from '../handlers/gotoLast';
import { nextQuestion } from '../handlers/next';
import { prevQuestion } from '../handlers/previous';
import { revealCurrentAnswer } from '../handlers/reveal';
import { startGame } from '../handlers/start';
import { stopGame } from '../handlers/stop';
import { pauseTimer, startTimer } from '../timer';
import { MenuItemBuilderFunction } from '../types/electron';
import { getGame } from '../util/state';

const builder: MenuItemBuilderFunction = () => ({
  label: '&Partie',
  submenu: [
    {
      label: getGame().status === 'stopped' ? '&Démarrer' : '&Arrêter',
      click: (): void => {
        getGame().status === 'stopped' ? startGame(null, []) : stopGame();
      },
    },
    {
      label: getGame().status === 'paused' ? '&Reprendre' : '&Pause',
      click: (): void => {
        getGame().status === 'paused' ? startTimer() : pauseTimer();
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
