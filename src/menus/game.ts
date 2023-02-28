import { lastQuestion, nextQuestion, pauseGame, prevQuestion, startGame, stopGame, unpauseGame } from '../roulotte';
import { MenuItemBuilderFunction } from '../types/electron';
import { getState } from '../util/state';

const builder: MenuItemBuilderFunction = () => {
	return {
		label: '&Partie',
		submenu: [
			{ label: getState().game.status === 'stopped' ? '&Démarrer' : '&Arrêter', 
				click: () => {
					getState().game.status === 'stopped' ? startGame([]) : stopGame();
				}
			},
			{ label: getState().game.status === 'paused' ? '&Reprendre' : '&Pause', 
				click: () => {
					getState().game.status === 'paused' ? unpauseGame() : pauseGame();
				}},
			{ type: 'separator' },
			{ label: 'Question &Suivante', click: () => nextQuestion() },
			{ label: 'Question &Précédente', click: () => prevQuestion() },
			{ label: 'D&ernière Question', click: () => lastQuestion() },
			
		],
	};
};

export default builder;
