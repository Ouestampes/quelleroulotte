/* eslint-env browser */

const ipcRenderer = require("electron").ipcRenderer;

ipcRenderer.on("questionUpdated", (_, data) => {
  const question = document.querySelector(".ip--question");
  question.innerHTML = data.question;

  // Réinitialiser l'affichage de la réponse
  const answer = document.querySelector(".ip--answer");
  answer.innerHTML = "";
});

ipcRenderer.on("answerUpdated", (_, data) => {
  const answer = document.querySelector(".ip--answer");
  answer.innerHTML = data;
});
