import { Game } from './roulotte';

export interface State {
	appPath?: string;
	dataPath?: string;
	resourcePath?: string;
	publicFullscreen?: boolean;
	lastUpdate?: Date;
	game?: Game;
}
