import { app } from 'electron';

import { MenuItemBuilderFunction } from '../types/electron';
import { gameTitleMessage } from '../util/constants';

const builder: MenuItemBuilderFunction = options => {
  const { isMac } = options;
  return {
    label: isMac ? gameTitleMessage : '&Fichier',
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
