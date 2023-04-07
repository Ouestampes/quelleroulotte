import { app } from 'electron';

import { DEFAULT_TITLE_MESSAGE } from '../roulotte';
import { MenuItemBuilderFunction } from '../types/electron';

const builder: MenuItemBuilderFunction = options => {
  const { isMac } = options;
  return {
    label: isMac ? DEFAULT_TITLE_MESSAGE : '&Fichier',
    submenu: [
      {
        label: '&Quitter',
        accelerator: 'CmdOrCtrl+Q',
        click: () => {
          app.quit();
        },
      },
    ],
  };
};

export default builder;
