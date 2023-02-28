/* eslint-env browser */

const ipcRenderer = require('electron').ipcRenderer;

ipcRenderer.on('questionUpdated', (event, data) => {
	const question = document.querySelector('.ip--question');
	const id = document.querySelector('.ip--id');

	question.innerHTML = data.question;
	id.innerHTML = data.id;

});