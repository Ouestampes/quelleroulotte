import fs from 'fs/promises';
import { resolve } from 'path';

import { loadRoulotteFromFile, loadRoulotteFromGsheet } from './gsheet';
import { Game, Question } from './types/state';
import { getGame, getState, setGame } from './util/state';
import { emitAdmin, showError, updateMenu } from './windows/admin';
import { emitPublic } from './windows/public';

let roulotte: Question[];

// Chargement de la roulotte, d'abord en la récupérant depuis un gsheet puis en la lisant depuis un fichier
export async function loadRoulotte(): Promise<void> {
  try {
    await loadRoulotteFromGsheet();
  } catch (err) {
    // Non-fatal, on va charger le fichier depuis le fichier
    showError(
      "Impossible de lire le Gsheet. On va charger un roulotte.json local s'il existe.\nPour lire depuis le Gsheet, assurez-vous d'avoir le fichier \"creds.json\" et/ou d'être connecté à Internet.",
    );
  }
  roulotte = await loadRoulotteFromFile();
  emitAdmin('questionsLoaded', {
    length: roulotte.length,
    categories: [...new Set(roulotte.map(question => question.category))],
  });
}

export const getQuestions = (categories: string[] = []): Question[] => {
  return categories.length > 0
    ? roulotte.filter(q => categories.includes(q.category))
    : roulotte;
};

export const updateControls = (status: Game['status']): void => {
  setGame({ status });
  updateMenu();
  emitAdmin('statusUpdated', status);
  emitPublic('statusUpdated', status);
};

export const emitQuestion = (question: Question): void => {
  emitAdmin('questionUpdated', question);
  emitPublic('questionUpdated', question);
};

export const reportQuestion = async (): Promise<void> => {
  const game = getGame();
  const id = game.questions[game.pos].id;
  const badFile = resolve(getState().dataPath, 'badIDs.txt');
  let badQuestions: string[] = [];
  try {
    const raw = await fs.readFile(badFile, 'utf-8');
    badQuestions = raw.split('\n');
  } catch (err) {
    // Pas de problème si el fichier n'existe pas
  }
  badQuestions.push(id.toString());
  await fs.writeFile(badFile, badQuestions.join('\n'), 'utf-8');
};

export const goToQuestion = async (id: number): Promise<void> => {
  const game = getGame();
  // On pioche la question depuis la roulotte principale peu importe les filtres. Si quelqu'un demande une question qui appartient pas à la catégorie voulue c'est SON problème :)
  const question = roulotte.find(q => q.id === id);

  if (!question) {
    showError('Impossible de trouver cette question !');
    return;
  }

  game.questions.push(question);
  game.pos += 1;
  setGame(game);
  emitQuestion(game.questions[game.pos]);
};
