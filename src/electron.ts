import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  Menu,
} from "electron";
import { resolve } from "path";

import { loadRoulotteFromGsheet } from "./gsheet";
import { initMenu } from "./menu";
import {
  lastQuestion,
  nextQuestion,
  pauseGame,
  prevQuestion,
  revealCurrentAnswer,
  startOrUnpause,
  stopGame,
} from "./roulotte";
import { getState } from "./util/state";

let controllerWindow: Electron.BrowserWindow;
let publicWindow: Electron.BrowserWindow;

export function startElectron() {
  /** On attend l'évènement ready d'Electron pour commencer à afficher des trucs */
  app.on("ready", async () => {
    loadHandles();
    await initElectronWindow();
  });
}

function loadHandles() {
  ipcMain.handle("gsheet:download", async () => {
    try {
      await loadRoulotteFromGsheet();
    } catch (err) {
      // Non-fatal, on va charger le fichier depuis le fichier
      await showLoadError();
    }
  });

  ipcMain.handle("roulotte:previous", prevQuestion);
  ipcMain.handle("roulotte:next", nextQuestion);
  ipcMain.handle("roulotte:reveal", revealCurrentAnswer);
  ipcMain.handle("roulotte:gotoLast", lastQuestion);
  ipcMain.handle("roulotte:start", () => {
    createPublicWindow();
    startOrUnpause();
  });
  ipcMain.handle("roulotte:pause", pauseGame);
  ipcMain.handle("roulotte:stop", stopGame);
}

async function initElectronWindow() {
  await createControllerWindow();
  createPublicWindow();
  updateMenu();
}

export async function updateMenu() {
  const menu = Menu.buildFromTemplate(initMenu());
  // Setup de l'application sur la fenêtre du contrôleur sous Windows, sinon sur le bureau sous macOS
  process.platform === "darwin"
    ? Menu.setApplicationMenu(menu)
    : controllerWindow?.setMenu(menu);
}

async function createControllerWindow() {
  // Create the browser window
  controllerWindow = new BrowserWindow({
    width: 500,
    height: 400,
    show: false,
    title: "Quelle Roulotte ? - Contrôleur",
    icon: resolve(getState().resourcePath, 'assets/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  controllerWindow.webContents.session.clearCache();
  controllerWindow?.loadURL(
    `file://${resolve(getState().resourcePath, "frontend/admin/index.html")}`
  );

  controllerWindow.once("ready-to-show", () => {
    controllerWindow.show();
  });
  // On ferme tout si la fenêtre contrôleur est fermée
  controllerWindow.on("closed", () => {
    app.quit();
  });
}

export async function createPublicWindow() {
  if (publicWindow) return;
  publicWindow = new BrowserWindow({
    width: 500,
    height: 300,
    title: "Quelle Roulotte ? - Public",
    icon: resolve(getState().resourcePath, 'assets/icon.png'),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  publicWindow.setMenu(null);
  publicWindow.webContents.session.clearCache();
  publicWindow?.loadURL(
    `file://${resolve(getState().resourcePath, "frontend/player/index.html")}`
  );
  publicWindow.once("ready-to-show", () => {
    publicWindow.show();
  });
  publicWindow.on("closed", () => {
    publicWindow = null;
  });
}

export function togglePublicFullscreen() {
  publicWindow?.setFullScreen(!getState().publicFullscreen);
}

export function showPublicWindow() {
  publicWindow.show();
}

export function emitPublic(type: string, data: any) {
  if (publicWindow) publicWindow.webContents.send(type, data);
}

export function emitController(type: string, data: any) {
  if (controllerWindow) controllerWindow.webContents.send(type, data);
}

export async function showLoadError() {
  await dialog.showMessageBox(controllerWindow, {
    message:
      "Impossible de lire le Gsheet. On va charger un roulotte.json local s'il existe.\nPour lire depuis le Gsheet, assurez-vous d'avoir le fichier \"creds.json\" et/ou d'être connecté à Internet.",
    type: "error",
  });
}
