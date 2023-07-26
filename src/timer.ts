import { updateControls } from './roulotte';
import Timeout = NodeJS.Timeout;
import { emitAdmin } from './windows/admin';

let timer = 0;
let timerInterval: Timeout;

const timePasses = () => {
  timer += 1;
  emitAdmin('time', timer);
};

export const pauseTimer = () => {
  clearInterval(timerInterval);
  timerInterval = null;
  updateControls('paused');
};

export const startTimer = () => {
  timerInterval = setInterval(timePasses, 1000);
  updateControls('started');
};

export const resetTimer = () => {
  pauseTimer();
  timer = 0;
};
