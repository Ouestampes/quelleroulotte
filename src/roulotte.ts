import fs from "fs/promises";
import { sample } from "lodash";
import { resolve } from "path";
import Timeout = NodeJS.Timeout;
import { emitController, emitPublic, showLoadError, updateMenu } from "./electron";
import { Question } from "./types/roulotte";
import { getState, setState } from "./util/state";
import { saveRoulotteFromGsheet } from "./gsheet";

let roulotte: Question[];
let filteredRoulotte: Question[];
let timer = 0;
let timerInterval: Timeout;

// Chargement de la roulotte, d'abord en la récupérant depuis un gsheet puis en la lisant depuis un fichier
export async function loadRoulotte() {
  try {
		await saveRoulotteFromGsheet();
	} catch (err) {
		// Non-fatal, on va charger le fichier depuis le fichier
		await showLoadError();
	}
  await loadRoulotteFromFile();
}

/** Chargement depuis le fichier JSON en cache puis  */
export async function loadRoulotteFromFile() {
  const roulotteFile = resolve(getState().dataPath, "roulotte.json");
  // On teste si le fichier existe et on récupère sa date de MAJ pour l'écrire dans le state
  try {
    const { birthtime } = await fs.stat(roulotteFile);
    setState({ lastUpdate: new Date(birthtime) });
  } catch (err) {
    // Le fichier n'existe probablement pas, c'est pas grave pour le moment, la roulotte restera vide.
  }
  const raw = await fs.readFile(roulotteFile, "utf-8");
  roulotte = JSON.parse(raw);
  emitController("questionsLoaded", {
    length: roulotte.length, 
    categories: [...new Set(roulotte.map(question => question.category))]
  });  
}

function updateControls(status: string) {
  updateMenu();
  emitController("status", status);
  emitPublic("status", status);
}

/** Démarrer une partie */
export function startGame(categories: string[]) {
  setState({
    game: {
      status: "started",
      questions: [],
      pos: -1,
      categories,
    },
  });
  // Si une liste de catégorie est fournie on va préfiltrer nos questions
  if (categories.length > 0) {
    filteredRoulotte = roulotte.filter((q) => categories.includes(q.category));
  } else {
    filteredRoulotte = [...roulotte];
  }
  // On tire la première question
  nextQuestion();
  // On initialise le timer
  timer = 0;
  unpauseGame();
}

function timePasses() {
  timer += 1;
  emitController("time", timer);
}

export function stopGame() {
  timer = 0;
  // Le timer ne sera renvoyé qu'après un redémarrage du jeu
  pauseGame();
  setState({
    game: {
      status: "stopped",
      questions: [],
      pos: -1,
      categories: [],
    },
  });
  filteredRoulotte = [];
  updateControls("stopped");
  emitQuestion({
    question: "",
    category: "",
    theme: "",
    id: 0,
    answer: "",
  });
}

export function pauseGame() {
  clearInterval(timerInterval);
  timerInterval = null;
  setState({
    game: {
      status: "paused",
    },
  });
  updateControls("paused");
}

export function startOrUnpause(categories: string[]) {
  const game = getState().game;
  if (game.status === 'stopped') {
    startGame(categories);
  } else if (game.status === 'paused') {
    unpauseGame();
  }  
}

export function unpauseGame() {
  timerInterval = setInterval(timePasses, 1000);
  updateControls("started");
}

export function nextQuestion() {
  const game = getState().game;
  let id = null;
  // Si on est pas à la toute dernière position on repioche une question
  // Sinon on augmente notre position et on reprend la question.
  if (game.pos === game.questions.length - 1) {
    let counter = 1;
    while (id === null) {
      const randomQuestion = sample(filteredRoulotte);
      const alreadyUsedQuestions = game.questions.map((q) => q.id);
      if (!alreadyUsedQuestions.includes(randomQuestion.id)) {
        id = randomQuestion.id;
      }
      counter += 1;
      // Si c'est le cas on a plus de questions possibles
      if (counter >= filteredRoulotte.length) {
        return null;
      }
    }
    game.questions.push(filteredRoulotte.find((q) => q.id === id));
  }
  game.pos += 1;
  setState({ game });
  emitQuestion(game.questions[game.pos]);
}

export function prevQuestion() {
  const game = getState().game;
  if (game.pos <= 0) {
    return null;
  }
  game.pos -= 1;
  setState({ game });
  emitQuestion(game.questions[game.pos]);
}

export function lastQuestion() {
  const game = getState().game;
  // La position démarre à 0
  game.pos = game.questions.length - 1;
  setState({ game });
  emitQuestion(game.questions[game.pos]);
}

export async function reportQuestion() {
  const game = getState().game;
  const id = game.questions[game.pos].id;
  const badFile = resolve(getState().dataPath, "badIDs.txt");
  let badQuestions = [];
  try {
    const raw = await fs.readFile(badFile, "utf-8");
    badQuestions = raw.split("\n");
  } catch (err) {
    // Pas de problème si el fichier n'existe pas
  }
  badQuestions.push(id);
  await fs.writeFile(badFile, badQuestions.join("\n"), "utf-8");
}

export function goToQuestion(id: number) {
  const game = getState().game;
  // On pioche la question depuis la roulotte principale peu importe les filtres. Si quelqu'un demande une question qui appartient pas à la catégorie voulue c'est SON problème :)
  game.questions.push(roulotte.find((q) => q.id === id));
  game.pos += 1;
  setState({ game });
  emitQuestion(game.questions[game.pos]);
}

export function revealCurrentAnswer() {
  const game = getState().game;
  emitPublic("answerUpdated", game.questions[game.pos].answer);
}

function emitQuestion(question: Question) {
  emitPublic("questionUpdated", question);
  emitController("questionUpdated", question);
}
