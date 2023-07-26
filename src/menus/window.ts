import { MenuItemBuilderFunction } from '../types/electron';
import { createPublicWindow } from '../windows/public';

const builder: MenuItemBuilderFunction = () => ({
  label: '&Fenêtre',
  submenu: [
    { label: '&Minimiser', role: 'minimize' },
    {
      label: '&Afficher la fenêtre publique',
      click: () => {
        createPublicWindow();
      },
    },
  ],
});

export default builder;
