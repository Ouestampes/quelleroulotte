/* eslint-env browser */

const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('questionUpdated', (_, data) => {
  const question = document.querySelector('.ip--question');
  const id = document.querySelector('.ip--id');
  const answer = document.querySelector('.ip--answer');
  question.innerHTML = data.question;
  id.innerHTML = data.id;
  answer.innerHTML = data.answer;
});

ipcRenderer.on('time', (_, data) => {
  const timer = document.querySelector('.ip--timer');
  timer.innerHTML = data;
});

const dlAgainButton = document.getElementById('dl-again');
dlAgainButton.addEventListener('click', async () => {
  await ipcRenderer.invoke('gsheet:download');
});
