/* eslint-env browser */

const ipcRenderer = require("electron").ipcRenderer;

ipcRenderer.on("questionsLoaded", (_, data) => {
  const nbLoaded = document.querySelector(".ip--nbLoaded");
  nbLoaded.innerHTML = data;
});

ipcRenderer.on("questionUpdated", (_, data) => {
  const question = document.querySelector(".ip--question");
  const id = document.querySelector(".ip--id");
  const answer = document.querySelector(".ip--answer");
  question.innerHTML = data.question;
  id.innerHTML = data.id;
  answer.innerHTML = data.answer;
});

ipcRenderer.on("time", (_, data) => {
  const timer = document.querySelector(".ip--timer");
  timer.innerHTML = data;
});

ipcRenderer.on("status", (_, state) => {
  document
    .querySelectorAll(".started, .paused, .stopped")
    .forEach(
      (e) => (e.style.display = e.classList.contains(state) ? "flex" : "none")
    );
});

const startButton = document.getElementById("start");
startButton.addEventListener("click", async () => {
  await ipcRenderer.invoke("roulotte:start");
});

const pauseButton = document.getElementById("pause");
pauseButton.addEventListener("click", async () => {
  await ipcRenderer.invoke("roulotte:pause");
});

const stopButton = document.getElementById("stop");
stopButton.addEventListener("click", async () => {
  await ipcRenderer.invoke("roulotte:stop");
});

const dlAgainButton = document.getElementById("dl-again");
dlAgainButton.addEventListener("click", async () => {
  await ipcRenderer.invoke("gsheet:download");
});

const gotoLastButton = document.getElementById("goto-last");
gotoLastButton.addEventListener("click", async () => {
  await ipcRenderer.invoke("roulotte:gotoLast");
});

const previousButton = document.getElementById("previous");
previousButton.addEventListener("click", async () => {
  await ipcRenderer.invoke("roulotte:previous");
});

const nextButton = document.getElementById("next");
nextButton.addEventListener("click", async () => {
  await ipcRenderer.invoke("roulotte:next");
});

const revealButton = document.getElementById("reveal");
revealButton.addEventListener("click", async () => {
  await ipcRenderer.invoke("roulotte:reveal");
});

document.addEventListener("keydown", async (e) => {
  switch (e.key) {
    case "ArrowLeft":
      await ipcRenderer.invoke("roulotte:previous");
      break;
    case "ArrowRight":
      await ipcRenderer.invoke("roulotte:next");
      break;
    case "ArrowUp":
    case "ArrowDown":
      await ipcRenderer.invoke("roulotte:reveal");
      break;
    default:
      break;
  }
});
