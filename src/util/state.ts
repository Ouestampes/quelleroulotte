import deepmerge from 'deepmerge';

import { State } from '../types/state';

// Etat initial :
let state: State = {
  appPath: '',
  dataPath: '',
  resourcePath: '',
  publicFullscreen: false,
  game: {
    status: 'stopped',
    questions: [],
    questionsAsked: 0,
    categories: [],
    pos: -1,
  },
};

/** Get current app state object */
export const getState = () => state;

/** Set one or more settings in app state */
export const setState = (part: Partial<State>) => {
  state = deepmerge(state, part);
  return getState();
};
