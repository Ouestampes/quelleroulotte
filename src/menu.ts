import editMenu from "./menus/edit";
import fileMenu from "./menus/file";
import gameMenu from "./menus/game";
import viewMenu from "./menus/view";
import windowMenu from "./menus/window";
import { MenuItemBuilderOptions } from "./types/electron";
import { removeNulls } from "./util/objectHelpers";

export function initMenu() {
  const options: MenuItemBuilderOptions = {
    isMac: process.platform === "darwin",
  };
  return removeNulls([
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
  ]);
}
