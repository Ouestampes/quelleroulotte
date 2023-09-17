/* eslint-env browser */

const { ipcRenderer } = require('electron');

ipcRenderer.on('publicTextUpdated', (_, text) => {
  const ipTitle = document.querySelector('.ip--title');
  ipTitle.innerHTML = text.title;
  const ipWaiting = document.querySelector('.ip--waiting');
  ipWaiting.innerHTML = text.waiting;
});

ipcRenderer.on('statusUpdated', (_, data) => {
  document
    .querySelectorAll('.started, .paused, .stopped')
    .forEach(
      e => (e.style.display = e.classList.contains(data) ? 'block' : 'none'),
    );
});

ipcRenderer.on('questionUpdated', (_, data) => {
  const question = document.querySelector('.ip--question');
  question.innerHTML = data.question;

  const id = document.querySelector('.ip--id');
  id.innerHTML = data.id;

  const category = document.querySelector('.ip--category');
  category.innerHTML = data.category;

  const theme = document.querySelector('.ip--theme');
  theme.innerHTML = data.theme;

  // Réinitialiser l'affichage de la réponse
  const answer = document.querySelector('.ip--answer');
  answer.innerHTML = '';
});

ipcRenderer.on('questionsAsked', (_, data) => {
  const questionsAsked = document.querySelector('.ip--questionsAsked');
  questionsAsked.innerHTML = data;
});

ipcRenderer.on('answerUpdated', (_, data) => {
  const answer = document.querySelector('.ip--answer');
  answer.innerHTML = data;
});

window.addEventListener('keydown', async e => {
  switch (e.key) {
    case 'F11':
      await ipcRenderer.invoke('fullscreen');
      break;
    case 'ArrowLeft':
      await ipcRenderer.invoke('previous');
      break;
    case 'ArrowRight':
      await ipcRenderer.invoke('next');
      break;
    case 'ArrowUp':
    case 'ArrowDown':
      await ipcRenderer.invoke('reveal');
      break;
    default:
      break;
  }
});

window.addEventListener('dblclick', async () => {
  await ipcRenderer.invoke('fullscreen');
});
