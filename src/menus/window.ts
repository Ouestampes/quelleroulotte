import { createPublicWindow } from '../electron';
import { MenuItemBuilderFunction } from '../types/electron';

const builder: MenuItemBuilderFunction = () => {
	return {
		label: '&Fenêtre',
		submenu: [
			{ label: '&Minimiser', role: 'minimize' },
			{ label: '&Afficher la fenêtre publique', 
				click: () => {
					createPublicWindow();
				}},
		],
	};
};

export default builder;
