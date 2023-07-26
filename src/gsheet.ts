import fs from 'fs/promises';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { markdown } from 'markdown-pro';
import { resolve } from 'path';

import { Question } from './types/roulotte';
import { getState, setState } from './util/state';

export const loadRoulotteFromGsheet = async () => {
  let creds = null;
  const credsFile = resolve(getState().dataPath, 'creds.json');
  const credsData = await fs.readFile(credsFile, 'utf-8');
  creds = JSON.parse(credsData);

  const doc = new GoogleSpreadsheet(creds.sheet);
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  const roulotte: Question[] = [];
  for (const row of rows) {
    if (row._rawData.length === 5) {
      roulotte.push({
        id: +row._rawData[0],
        category: row._rawData[1],
        theme: row._rawData[2],
        question: markdown(row._rawData[3], { useWrapper: false }).replace(
          / (\?|!|:)/,
          '&nbsp;$1',
        ),
        answer: markdown(row._rawData[4], { useWrapper: false }),
      });
    }
  }
  await fs.writeFile(
    resolve(getState().dataPath, 'roulotte.json'),
    JSON.stringify(roulotte, null, 2),
    'utf-8',
  );
};

/** Chargement depuis le fichier JSON en cache */
export const loadRoulotteFromFile = async (): Promise<Question[]> => {
  const roulotteFile = resolve(getState().dataPath, 'roulotte.json');

  // On teste si le fichier existe et on récupère sa date de MAJ pour l'écrire dans le state
  try {
    const { birthtime } = await fs.stat(roulotteFile);
    setState({ lastUpdate: new Date(birthtime) });
  } catch (err) {
    // Le fichier n'existe probablement pas, c'est pas grave pour le moment, la roulotte restera vide.
  }

  const raw = await fs.readFile(roulotteFile, 'utf-8');
  return JSON.parse(raw);
};
