// Node modules
import { merge } from "lodash";

import { State } from "../types/state";

// Etat initial :
let state: State = {
  waitingMessage: "On arrive bientôt !",
  game: {
    status: "stopped",
    questions: [],
  },
};

/** Get current app state object */
export function getState() {
  return { ...state };
}

/** Set one or more settings in app state */
export function setState(part: Partial<State>) {
  // lodash merges must not merge karas info.
  state = merge(state, part);
  // emit('stateUpdated', state);
  return getState();
}
