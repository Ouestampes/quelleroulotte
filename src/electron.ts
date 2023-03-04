import { app, BrowserWindow, dialog, Menu } from 'electron';
import { resolve } from 'path';

import { initMenu } from './menu';
import { getState } from './util/state';

let controllerWindow: Electron.BrowserWindow;
let publicWindow: Electron.BrowserWindow;

export function startElectron() {
	/** On attend l'évènement ready d'Electron pour commencer à afficher des trucs */
	app.on('ready', async () => {
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
	process.platform === 'darwin'
		? Menu.setApplicationMenu(menu)
		: controllerWindow?.setMenu(menu);
}

async function createControllerWindow() {
	// Create the browser window
	controllerWindow = new BrowserWindow({
		width: 500,
		height: 400,
		show: false,
		title: 'Quelle Roulotte ? - Contrôleur',
		// icon: resolve(state.resourcePath, 'build/icon1024.png'),
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	controllerWindow.webContents.session.clearCache();
	controllerWindow?.loadURL(`file://${resolve(getState().resourcePath, 'frontend/admin/index.html')}`);

	controllerWindow.once('ready-to-show', () => {
		controllerWindow.show();
	});
	// On ferme tout si la fenêtre contrôleur est fermée
	controllerWindow.on('closed', () => {
		app.quit();
	});
}

export async function createPublicWindow() {
	if (publicWindow) return;
	publicWindow = new BrowserWindow({
		width: 500,
		height: 300,
		title: 'Quelle Roulotte ? - Public',
		// icon: resolve(state.resourcePath, 'build/icon1024.png'),
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});
	publicWindow.setMenu(null);
	publicWindow.webContents.session.clearCache();
	publicWindow?.loadURL(`file://${resolve(getState().resourcePath, 'frontend/player/index.html')}`);
	publicWindow.once('ready-to-show', () => {
		publicWindow.show();
	});
	publicWindow.on('closed', () => {
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
		message: 'Impossible de lire le Gsheet. On va charger un roulotte.json local s\'il existe.\nPour lire depuis le Gsheet, assurez-vous d\'avoir le fichier "creds.json" et/ou d\'être connecté à Internet.',
		type: 'error'
	});
}
