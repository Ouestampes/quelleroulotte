import {
  app,
  BrowserWindow,
  dialog,
  Menu,
  MessageBoxReturnValue,
} from 'electron';
import { resolve } from 'path';

import { initMenu } from '../menu';
import { GAME_TITLE_MESSAGE } from '../util/constants';
import { getState } from '../util/state';

let adminWindow: BrowserWindow;

// Envoyer un message à la fenêtre admin
export const emitAdmin = (type: string, data: unknown): void => {
  if (adminWindow) adminWindow.webContents.send(type, data);
};

export const showError = (message: string): Promise<MessageBoxReturnValue> =>
  dialog.showMessageBox(adminWindow, {
    message,
    type: 'error',
  });

export const updateMenu = (): void => {
  const menu = Menu.buildFromTemplate(initMenu());

  // Setup de l'application sur la fenêtre admin sous Windows, sinon sur le bureau sous macOS
  if (process.platform === 'darwin') {
    Menu.setApplicationMenu(menu);
  } else {
    adminWindow?.setMenu(menu);
  }

  // Enable for devTools on public window
  // TODO: Make this configurable or with a global hotkey
  // publicWindow.setMenu(menu);
};

export const createAdminWindow = (): void => {
  // Create the browser window
  adminWindow = new BrowserWindow({
    width: 700,
    height: 500,
    show: false,
    title: `${GAME_TITLE_MESSAGE} - Admin`,
    icon: resolve(getState().resourcePath, 'frontend/assets/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  adminWindow.webContents.session.clearCache();
  adminWindow.loadURL(
    `file://${resolve(getState().resourcePath, 'frontend/admin/index.html')}`,
  );

  // Ceci permet d'attendre que Chromium soit prêt à afficher la page complète (il a tout chargé quoi)
  // pour la montrer à l'écran, afin d'éviter que l'utilisateur voie la page se charger.
  adminWindow.once('ready-to-show', adminWindow.show);

  // On ferme tout si la fenêtre contrôleur est fermée
  adminWindow.on('closed', app.quit);
};
