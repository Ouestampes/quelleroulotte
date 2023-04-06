import fs from "fs/promises";
import { GoogleSpreadsheet } from "google-spreadsheet";
import { markdown } from "markdown-pro";
import { resolve } from "path";

import { sendQuestionsLoaded } from "./roulotte";
import { Question } from "./types/roulotte";
import { getState } from "./util/state";

export async function loadRoulotteFromGsheet() {
  const credsFile = await fs.readFile(
    resolve(getState().dataPath, "creds.json"),
    "utf-8"
  );
  const creds = JSON.parse(credsFile);
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
          "&nbsp;$1"
        ),
        answer: markdown(row._rawData[4], { useWrapper: false }),
      });
    }
  }
  await fs.writeFile(
    resolve(getState().dataPath, "roulotte.json"),
    JSON.stringify(roulotte, null, 2),
    "utf-8"
  );
  sendQuestionsLoaded(roulotte.length, [
    ...new Set(roulotte.map((question) => question.category)),
  ]);
}
