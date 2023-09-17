import { Game, State } from '../types/state';

// Etat initial :
let state: State = {
  appPath: '',
  dataPath: '',
  resourcePath: '',
  publicFullscreen: false,
};

let game: Game = {
  status: 'stopped',
  questions: [],
  questionsAsked: 0,
  categories: [],
  pos: -1,
};

/** Get current app state object */
export const getState = (): State => state;

/** Set one or more settings in app state */
export const setState = (part: Partial<State>): void => {
  state = { ...state, ...part };
};

/** Get current game state object */
export const getGame = (): Game => game;

/** Set one or more settings in game state */
export const setGame = (part: Partial<Game>): void => {
  game = { ...game, ...part };
};
