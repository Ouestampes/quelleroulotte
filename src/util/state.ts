import { State } from "../types/state";

// Etat initial :
let state: State = {
  game: {
    status: "stopped",
    questions: [],
  },
};

/** Get current app state object */
export function getState() {
  return { ...state };
}

function merge(target: State, source: Partial<State>) {
  if (typeof target !== "object" && typeof source !== "object") {
    return source;
  }

  for (const key of Object.keys(source)) {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = sourceValue;
    } else if (
      typeof targetValue === "object" &&
      typeof sourceValue === "object"
    ) {
      target[key] = merge({ ...targetValue }, sourceValue);
    } else {
      target[key] = sourceValue;
    }
  }

  return target;
}

/** Set one or more settings in app state */
export function setState(part: Partial<State>) {
  state = merge(state, part);
  // emit('stateUpdated', state);
  return getState();
}
