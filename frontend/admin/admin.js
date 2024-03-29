/* eslint-env browser */

const { ipcRenderer } = require('electron');

ipcRenderer.on('questionsLoaded', (_, data) => {
  const nbLoaded = document.querySelector('.ip--nbLoaded');
  nbLoaded.innerHTML = data.length;

  document.getElementById('categories-radios').innerHTML = '';

  for (const category of data.categories) {
    const radio = document.createElement('input');
    radio.type = 'checkbox';
    radio.name = 'categories[]';
    radio.value = category;
    radio.id = `radio-${category.toLowerCase()}`;

    const label = document.createElement('label');
    label.innerHTML = category;
    label.setAttribute('for', `radio-${category.toLowerCase()}`);

    const br = document.createElement('br');

    document.getElementById('categories-radios').append(radio, label, br);
  }
});

document
  .getElementById('categories-selectall')
  .addEventListener('click', () => {
    const ele = document.getElementById('categories-radios');
    for (let i = 0; i < ele.length; i += 1) {
      if (ele[i].type === 'checkbox') ele[i].checked = true;
    }
  });

ipcRenderer.on('questionUpdated', (_, data) => {
  const question = document.querySelector('.ip--question');
  const id = document.querySelector('.ip--id');
  const answer = document.querySelector('.ip--answer');
  const category = document.querySelector('.ip--category');
  const theme = document.querySelector('.ip--theme');
  question.innerHTML = data.question.question;
  id.innerHTML = data.question.id;
  answer.innerHTML = data.question.answer;
  category.innerHTML = data.question.category;
  theme.innerHTML = data.question.theme;
});

ipcRenderer.on('time', (_, data) => {
  const timer = document.querySelector('.ip--timer');
  if (data === 0) return '0 secondes';

  const heures = Math.floor(data / 3600) % 24;
  data -= heures * 3600;

  const minutes = Math.floor(data / 60) % 60;
  data -= minutes * 60;

  const secondes = data % 60; // normalement pas utile le modulo mais bon
  let returnString = '';

  if (heures !== 0) returnString += `${heures} heure${heures > 1 ? 's' : ''} `;
  if (minutes !== 0)
    returnString += `${minutes} minute${minutes > 1 ? 's' : ''} `;
  if (secondes !== 0)
    returnString += `${secondes} seconde${secondes > 1 ? 's' : ''} `;

  timer.innerHTML = returnString;
});

ipcRenderer.on('statusUpdated', (_, data) => {
  document
    .querySelectorAll('.started, .paused, .stopped')
    .forEach(
      e => (e.style.display = e.classList.contains(data) ? 'flex' : 'none'),
    );
});

const startButton = document.getElementById('start');
startButton.addEventListener('click', async () => {
  const formData = new FormData(document.getElementById('categories-radios'));
  await ipcRenderer.invoke('start', [...formData.values()]);
});

const pauseButton = document.getElementById('pause');
pauseButton.addEventListener('click', async () => {
  await ipcRenderer.invoke('pause');
});

const stopButton = document.getElementById('stop');
stopButton.addEventListener('click', async () => {
  await ipcRenderer.invoke('stop');
});

const dlAgainButton = document.getElementById('dl-again');
dlAgainButton.addEventListener('click', async () => {
  await ipcRenderer.invoke('load');
});

const gotoLastButton = document.getElementById('goto-last');
gotoLastButton.addEventListener('click', async () => {
  await ipcRenderer.invoke('gotoLast');
});

const previousButton = document.getElementById('previous');
previousButton.addEventListener('click', async () => {
  await ipcRenderer.invoke('previous');
});

const nextButton = document.getElementById('next');
nextButton.addEventListener('click', async () => {
  await ipcRenderer.invoke('next');
});

const revealButton = document.getElementById('reveal');
revealButton.addEventListener('click', async () => {
  await ipcRenderer.invoke('reveal');
});

const textButton = document.getElementById('text');
textButton.addEventListener('click', async () => {
  await ipcRenderer.invoke(
    'text',
    document.getElementById('title').value,
    document.getElementById('waiting').value,
  );
});

const showCategories = document.getElementById('categories');
showCategories.addEventListener(
  'click',
  () => (document.getElementById('categories-modal').style.display = 'block'),
);

const submitCategories = document.getElementById('categories-submit');
submitCategories.addEventListener(
  'click',
  () => (document.getElementById('categories-modal').style.display = 'none'),
);

window.addEventListener('keydown', async e => {
  switch (e.key) {
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
