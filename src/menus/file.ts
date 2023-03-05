import { app } from "electron";

import { MenuItemBuilderFunction } from "../types/electron";

const builder: MenuItemBuilderFunction = (options) => {
  const { isMac } = options;
  return {
    label: isMac ? "Quelle Roulotte?" : "&Fichier",
    submenu: [
      {
        label: "&Quitter",
        accelerator: "CmdOrCtrl+Q",
        click: () => {
          app.quit();
        },
      },
    ],
  };
};

export default builder;
