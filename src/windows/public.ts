import { BrowserWindow } from 'electron';
import { resolve } from 'path';

import { GAME_TITLE_MESSAGE, WAITING_MESSAGE } from '../util/constants';
import { getState } from '../util/state';

let publicWindow: BrowserWindow;

// Envoyer un message à la fenêtre publique
export const emitPublic = (type: string, data: unknown) => {
  if (publicWindow) publicWindow.webContents.send(type, data);
};

export const togglePublicFullscreen = () =>
  publicWindow?.setFullScreen(!publicWindow.isFullScreen());

export const createPublicWindow = () => {
  if (publicWindow) return;

  publicWindow = new BrowserWindow({
    width: 1000,
    height: 700,
    show: false,
    title: `${GAME_TITLE_MESSAGE} - Public`,
    icon: resolve(getState().resourcePath, 'frontend/assets/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  publicWindow.setMenu(null);
  publicWindow.webContents.session.clearCache();
  publicWindow.loadURL(
    `file://${resolve(getState().resourcePath, 'frontend/public/index.html')}`,
  );

  publicWindow.once('ready-to-show', () => {
    publicWindow.show();

    emitPublic('publicTextUpdated', {
      title: GAME_TITLE_MESSAGE,
      waiting: WAITING_MESSAGE,
    });
  });

  publicWindow.on('closed', () => {
    publicWindow = null;
  });
};
