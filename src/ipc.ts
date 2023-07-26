import { ipcMain } from 'electron';

import { togglePublicFullscreen } from './handlers/fullscreen';
import { lastQuestion } from './handlers/gotoLast';
import { loadRoulotte } from './handlers/load';
import { nextQuestion } from './handlers/next';
import { pauseTimer } from './handlers/pause';
import { prevQuestion } from './handlers/previous';
import { revealCurrentAnswer } from './handlers/reveal';
import { startGame } from './handlers/start';
import { stopGame } from './handlers/stop';
import { publishTexts } from './handlers/texts';

export function loadHandles() {
  ipcMain.handle('gotoLast', lastQuestion);
  ipcMain.handle('load', loadRoulotte);
  ipcMain.handle('next', nextQuestion);
  ipcMain.handle('pause', pauseTimer);
  ipcMain.handle('previous', prevQuestion);
  ipcMain.handle('reveal', revealCurrentAnswer);
  ipcMain.handle('start', startGame);
  ipcMain.handle('stop', stopGame);
  ipcMain.handle('fullscreen', togglePublicFullscreen);
  ipcMain.handle('texts', publishTexts);
}
