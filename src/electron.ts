import { app, BrowserWindow, dialog, Menu } from "electron";
import { resolve } from "path";
import { loadHandles } from "./ipc";

import { initMenu } from "./menu";
import { gameTitleMessage, waitingMessage } from "./util/constants";
import { getState } from "./util/state";

export let controllerWindow: Electron.BrowserWindow;
export let publicWindow: Electron.BrowserWindow;

export function startElectron() {
  // On attend l'évènement ready d'Electron pour commencer à afficher des trucs 
  app.on("ready", async () => {
    loadHandles();
    await initElectronWindow();
  });
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
    width: 700,
    height: 500,
    show: false,
    title: "Quelle Roulotte ? - Contrôleur",
    icon: resolve(getState().resourcePath, "frontend/assets/icon.png"),
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  controllerWindow.webContents.session.clearCache();
  controllerWindow?.loadURL(
    `file://${resolve(getState().resourcePath, "frontend/admin/index.html")}`
  );

  // Ceci permet d'attendre que Chromium soit prêt à afficher la page complète (il a tout chargé quoi) pour la montrer à l'écran, afin d'éviter que l'utilisateur voie la page se charger.
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
    width: 1000,
    height: 700,
    show: false,
    title: "Quelle Roulotte ? - Public",
    icon: resolve(getState().resourcePath, "frontend/assets/icon.png"),
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
    emitPublic("publicTextUpdated", {
      title: gameTitleMessage,
      waiting: waitingMessage,
    });
  });
  publicWindow.on("closed", () => {
    publicWindow = null;
  });
}

export function togglePublicFullscreen() {
  publicWindow?.setFullScreen(!publicWindow.isFullScreen());
}

export function showPublicWindow() {
  publicWindow.show();
}

// Envoyer un message à la fenêtre publique
export function emitPublic(type: string, data: any) {
  if (publicWindow) publicWindow.webContents.send(type, data);
}

// Envoyer un message à la fenêtre contrôleur
export function emitController(type: string, data: any) {
  if (controllerWindow) controllerWindow.webContents.send(type, data);
}

export async function showError(message: string) {
  await dialog.showMessageBox(controllerWindow, {
    message,
    type: "error",
  });
}
