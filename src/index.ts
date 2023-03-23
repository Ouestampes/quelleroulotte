import { app } from "electron";
import { dirname, resolve } from "path";
import { createInterface } from "readline";
import sourceMapSupport from "source-map-support";

import { showLoadError, startElectron } from "./electron";
import { loadRoulotteFromGsheet } from "./gsheet";
import { loadRoulotteFromFile } from "./roulotte";
import { setState } from "./util/state";

// Utile pour récupérer les vraies lignes d'erreur en cas de plantage
sourceMapSupport.install();

// On traîte les exceptions plutôt que de planter comme une merde
process.on("uncaughtException", (exception: any) => {
  console.log("Uncaught exception:", exception);
});

process.on("unhandledRejection", (error: Error) => {
  console.log("Unhandled Rejection at:", error);
});

// On gère les CTRL+C et autres en ligne de commande (dev uniquement)

process.on("SIGINT", () => {
  app.quit();
});

process.on("SIGTERM", () => {
  app.quit();
});

// CTRL+C de Windows

if (process.platform === "win32") {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.on("SIGINT", () => {
    app.quit();
  });
}

// On définit les chemins dont on va avoir besoin selon si on est en développement ou dans l'app packagée d'Electron

let appPath: string;
// les ressources c'est l'endroit où il y a tous nos fichiers utilisés par l'app (genre les pages à afficher)
let resourcePath: string;

// Tests pour savoir où on est
// Est-ce qu'on est packagé dans un joli executable?
if (app.isPackaged) {
  // Démarrage de l'executable. Sur Mac les chemins sont différents.
  appPath =
    process.platform === "darwin"
      ? resolve(app.getAppPath(), "../../../../")
      : resolve(app.getAppPath(), "../../");
  resourcePath = process.resourcesPath;
} else if (app.getAppPath().endsWith(".asar")) {
  // Démarrage depuis un fichier ASAR directement
  appPath = dirname(app.getAppPath());
  resourcePath = appPath;
} else {
  // Démarrage depuis le git du code source
  appPath = app.getAppPath();
  console.log(appPath);
  resourcePath = appPath;
}

setState({
  resourcePath,
  appPath,
  dataPath: appPath,
});

async function main() {
  startElectron();
  try {
    await loadRoulotteFromGsheet();
  } catch (err) {
    console.error(err);
    // Non-fatal, on va charger le fichier depuis le fichier
    await showLoadError();
  }
  await loadRoulotteFromFile();
}

main().catch((err) => console.log(err));
