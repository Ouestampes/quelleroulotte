import { ipcMain } from 'electron';

import { lastQuestion } from './handlers/gotoLast';
import { nextQuestion } from './handlers/next';
import { pauseGame } from './handlers/pause';
import { prevQuestion } from './handlers/previous';
import { publishWaitingMessage } from './handlers/publishWaiting';
import { revealCurrentAnswer } from './handlers/reveal';
import { startGame } from './handlers/start';
import { stopGame } from './handlers/stop';
import { togglePublicFullscreen } from './windows/public';

export function loadHandles() {
  ipcMain.handle('previous', prevQuestion);
  ipcMain.handle('next', nextQuestion);
  ipcMain.handle('reveal', revealCurrentAnswer);
  ipcMain.handle('gotoLast', lastQuestion);
  ipcMain.handle('start', startGame);
  ipcMain.handle('pause', pauseGame);
  ipcMain.handle('stop', stopGame);
  ipcMain.handle('fullscreen', togglePublicFullscreen);
  ipcMain.handle('updatePublicText', publishWaitingMessage);
}
