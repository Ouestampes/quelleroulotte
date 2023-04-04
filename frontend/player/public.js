/* eslint-env browser */

const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('texts', (_, texts) => {
  const ipTitle = document.querySelector('.ip--title');
  ipTitle.innerHTML = texts.title;
  const ipWaiting = document.querySelector('.ip--waiting');
  ipWaiting.innerHTML = texts.waiting;
});

ipcRenderer.on('status', (_, data) => {
  document
    .querySelectorAll('.started, .paused, .stopped')
    .forEach(
      (e) => (e.style.display = e.classList.contains(data) ? 'block' : 'none'),
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

ipcRenderer.on('answerUpdated', (_, data) => {
  const answer = document.querySelector('.ip--answer');
  answer.innerHTML = data;
});

window.addEventListener('keydown', async (e) => {
  switch (e.key) {
    case 'F11':
      await ipcRenderer.invoke('roulotte:fullscreen');
      break;
    case 'ArrowLeft':
      await ipcRenderer.invoke('roulotte:previous');
      break;
    case 'ArrowRight':
      await ipcRenderer.invoke('roulotte:next');
      break;
    case 'ArrowUp':
    case 'ArrowDown':
      await ipcRenderer.invoke('roulotte:reveal');
      break;
    default:
      break;
  }
});

window.addEventListener('dblclick', async () => {
  await ipcRenderer.invoke('roulotte:fullscreen');
});
