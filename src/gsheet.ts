import fs from 'fs/promises';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { resolve } from 'path';

import { Question } from './types/roulotte';
import { getState } from './util/state';

export async function loadRoulotteFromGsheet() {
	const credsFile = await fs.readFile(resolve(getState().dataPath, 'creds.json'), 'utf-8');
	const creds = JSON.parse(credsFile);
	const doc = new GoogleSpreadsheet(creds.sheet);
	await doc.useServiceAccountAuth(creds);
	await doc.loadInfo();
	const sheet = doc.sheetsByIndex[0];
	const rows = await sheet.getRows();
	const roulotte: Question[] = [];
	for (const row of rows) {
		roulotte.push({
			id: +row['N°'],
			category: row['Catégorie'],
			theme: row['Thème'],
			question: row['Question (CTRL + flèche du bas pour aller à la dernière ligne remplie) --- Noms d\'oeuvres en italique'],
			answer: row['Réponse'],
		});
	}
	await fs.writeFile(resolve(getState().dataPath, 'roulotte.json'), JSON.stringify(roulotte, null, 2), 'utf-8');
}
