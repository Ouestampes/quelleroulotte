import { ipcMain } from 'electron';

import {
  createPublicWindow,
  emitPublic,
  togglePublicFullscreen,
} from './electron';
import {
  lastQuestion,
  nextQuestion,
  pauseGame,
  prevQuestion,
  revealCurrentAnswer,
  startOrUnpause,
  stopGame,
} from './roulotte';

export function loadHandles() {
  ipcMain.handle('roulotte:load', async () => {});

  ipcMain.handle('roulotte:previous', prevQuestion);
  ipcMain.handle('roulotte:next', nextQuestion);
  ipcMain.handle('roulotte:reveal', revealCurrentAnswer);
  ipcMain.handle('roulotte:gotoLast', lastQuestion);
  ipcMain.handle('roulotte:start', (_, categories: string[]) => {
    createPublicWindow();
    startOrUnpause(categories);
  });
  ipcMain.handle('roulotte:pause', pauseGame);
  ipcMain.handle('roulotte:stop', stopGame);
  ipcMain.handle('roulotte:fullscreen', togglePublicFullscreen);
  ipcMain.handle('roulotte:updatePublicText', (_, title, waiting) =>
    emitPublic('publicTextUpdated', { title, waiting }),
  );
}
