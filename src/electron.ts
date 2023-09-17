import { App, app } from 'electron';

import { loadHandles } from './ipc';
import { loadRoulotte } from './roulotte';
import { createAdminWindow, updateMenu } from './windows/admin';
import { createPublicWindow } from './windows/public';

// On attend l'évènement ready d'Electron pour commencer à afficher des trucs
export const startElectron = async (): Promise<App> =>
  app.on('ready', async () => {
    loadHandles();
    createAdminWindow();
    createPublicWindow();
    updateMenu();
    await loadRoulotte();
  });
