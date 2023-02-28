import { app, BrowserWindow, Menu } from 'electron';
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
	const menu = Menu.buildFromTemplate(initMenu());
	// Setup de l'application sur la fenêtre du contrôleur sous Windows, sinon sur le bureau sous macOS
	process.platform === 'darwin' 
		? Menu.setApplicationMenu(menu) 
		: controllerWindow?.setMenu(menu);
}

async function createControllerWindow() {
	// Create the browser window
	controllerWindow = new BrowserWindow({
		width: 1400,
		height: 900,
		show: false,
		title: 'Quelle Roulotte ? - Contrôleur',
		// icon: resolve(state.resourcePath, 'build/icon1024.png'),
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});

	controllerWindow.webContents.session.clearCache();
	controllerWindow?.loadURL(`file://${resolve(getState().resourcePath, 'controller/index.html')}`);
	
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
		width: 1400,
		height: 900,
		title: 'Quelle Roulotte ? - Public',
		// icon: resolve(state.resourcePath, 'build/icon1024.png'),
		webPreferences: {
			nodeIntegration: true,
			contextIsolation: false,
		},
	});
	publicWindow.setMenu(null);
	publicWindow.webContents.session.clearCache();
	publicWindow?.loadURL(`file://${resolve(getState().resourcePath, 'public/index.html')}`);
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
