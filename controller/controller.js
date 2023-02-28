/* eslint-env browser */

const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('questionUpdated', (event, data) => {
	const question = document.querySelector('.ip--question');
	const id = document.querySelector('.ip--id');
	const answer = document.querySelector('.ip--answer');
	question.innerHTML = data.question;
	id.innerHTML = data.id;
	answer.innerHTML = data.answer;

});

ipcRenderer.on('time', (event, data) => {
	const timer = document.querySelector('.ip--timer'); 
	timer.innerHTML = data;
});