import { ipcMain } from "electron";
import { createPublicWindow, showLoadError, togglePublicFullscreen } from "./electron";
import { loadRoulotteFromGsheet } from "./gsheet";
import { changeTexts, lastQuestion, nextQuestion, pauseGame, prevQuestion, revealCurrentAnswer, startOrUnpause, stopGame } from "./roulotte";

export function loadHandles() {
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
	ipcMain.handle("roulotte:start", (_, categories: string[]) => {
	  createPublicWindow();
	  startOrUnpause(categories);
	});
	ipcMain.handle("roulotte:pause", pauseGame);
	ipcMain.handle("roulotte:stop", stopGame);
	ipcMain.handle("roulotte:fullscreen", togglePublicFullscreen);
	ipcMain.handle("roulotte:texts", (_, title, waiting) =>
	  changeTexts(title, waiting)
	);
  }
  