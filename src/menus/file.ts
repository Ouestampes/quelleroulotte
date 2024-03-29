import { app } from 'electron';

import { MenuItemBuilderFunction } from '../types/electron';
import { GAME_TITLE_MESSAGE } from '../util/constants';

const builder: MenuItemBuilderFunction = options => ({
  label: options?.isMac ? GAME_TITLE_MESSAGE : '&Fichier',
  submenu: [
    {
      label: '&Quitter',
      accelerator: 'CmdOrCtrl+Q',
      click: () => app.quit(),
    },
  ],
});

export default builder;
