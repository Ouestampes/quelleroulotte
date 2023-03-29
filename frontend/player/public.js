/* eslint-env browser */

const ipcRenderer = require("electron").ipcRenderer;

ipcRenderer.on("waiting", (_, data) => {
  const waiting = document.querySelector(".ip--waiting");
  waiting.innerHTML = data;
});

ipcRenderer.on("status", (_, data) => {
  document
    .querySelectorAll(".started, .paused, .stopped")
    .forEach(
      (e) => (e.style.display = e.classList.contains(data) ? "block" : "none")
    );
});

ipcRenderer.on("questionUpdated", (_, data) => {
  const question = document.querySelector(".ip--question");
  question.innerHTML = data.question;

  const id = document.querySelector(".ip--id");
  id.innerHTML = data.id;

  // Réinitialiser l'affichage de la réponse
  const answer = document.querySelector(".ip--answer");
  answer.innerHTML = "";
});

ipcRenderer.on("answerUpdated", (_, data) => {
  const answer = document.querySelector(".ip--answer");
  answer.innerHTML = data;
});

window.addEventListener("keydown", async (e) => {
  if (e.key === "F11") {
    await ipcRenderer.invoke("roulotte:fullscreen");
  }
});

window.addEventListener("dblclick", async () => {
  await ipcRenderer.invoke("roulotte:fullscreen");
});
