/* eslint-env browser */

const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('questionUpdated', (_, data) => {
  const question = document.querySelector('.ip--question');
  const id = document.querySelector('.ip--id');

  question.innerHTML = data.question;
  id.innerHTML = data.id;

  // Réinitialiser l'affichage de la réponse
  const answer = document.querySelector('.ip--answer');
  answer.innerHTML = '';
});

ipcRenderer.on('answerUpdated', (_, data) => {
  const answer = document.querySelector('.ip--answer');
  answer.innerHTML = data;
});
