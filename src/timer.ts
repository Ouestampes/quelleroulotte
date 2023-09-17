import { updateControls } from './roulotte';
import Timeout = NodeJS.Timeout;
import { emitAdmin } from './windows/admin';

let timer = 0;
let timerInterval: Timeout;

const timePasses = (): void => {
  timer += 1;
  emitAdmin('time', timer);
};

export const pauseTimer = (): void => {
  clearInterval(timerInterval);
  updateControls('paused');
};

export const startTimer = (): void => {
  timerInterval = setInterval(timePasses, 1000);
  updateControls('started');
};

export const resetTimer = (): void => {
  pauseTimer();
  timer = 0;
};
