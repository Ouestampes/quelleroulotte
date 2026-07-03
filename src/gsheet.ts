import fs from 'fs/promises';
import {JWT} from 'google-auth-library';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { markdown } from 'markdown-pro';
import { resolve } from 'path';

import { Question } from './types/state';
import { getState, setState } from './util/state';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
  'https://www.googleapis.com/auth/drive.file',
];

export const loadRoulotteFromGsheet = async (): Promise<void> => {
  let creds = null;
  const credsFile = resolve(getState().dataPath, 'creds.json');
  const credsData = await fs.readFile(credsFile, 'utf-8');
  creds = JSON.parse(credsData);

  const jwt = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: SCOPES,
  });

  const doc = new GoogleSpreadsheet(creds.sheet, jwt);
  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[0];
  const rows = await sheet.getRows();
  const roulotte: Question[] = [];
  for (const row of rows) {
    const rowObj = Object.values(row.toObject());
    if (rowObj.length === 5) {
      roulotte.push({
        id: +rowObj[0],
        category: rowObj[1],
        theme: rowObj[2],
        question: markdown(rowObj[3], { useWrapper: false }).replace(
          / (\?|!|:)/,
          '&nbsp;$1',
        ),
        answer: markdown(rowObj[4], { useWrapper: false }),
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
