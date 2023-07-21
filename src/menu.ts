import editMenu from './menus/edit';
import fileMenu from './menus/file';
import gameMenu from './menus/game';
import viewMenu from './menus/view';
import windowMenu from './menus/window';
import { MenuItemBuilderOptions } from './types/electron';

export const initMenu = () => {
  const options: MenuItemBuilderOptions = {
    isMac: process.platform === 'darwin',
  };

  return [
    // MAIN MENU / FILE MENU
    fileMenu(options),
    // VIEW MENU
    viewMenu(options),
    // EDIT MENU
    editMenu(options),
    // GAME MENU
    gameMenu(options),
    // WINDOW MENU
    windowMenu(options),
  ];
};
