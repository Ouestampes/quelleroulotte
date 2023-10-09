import { emitQuestion, getQuestions } from '../roulotte';
import { getGame, setGame } from '../util/state';

export const nextQuestion = (): void => {
  const game = getGame();
  let id: number | null = null;

  // Si on est pas à la toute dernière position on repioche une question
  // Sinon on augmente notre position et on reprend la question.
  if (game.pos === game.questions.length - 1) {
    let counter = 1;
    const questions = getQuestions(game.categories);

    while (id === null) {
      const randomQuestion =
        questions[Math.floor(Math.random() * questions.length)];
      const alreadyUsedQuestions = game.questions.map(q => q.id);

      if (!alreadyUsedQuestions.includes(randomQuestion.id)) {
        id = randomQuestion.id;
      }

      // Si c'est le cas on a plus de questions possibles
      counter += 1;
      if (counter >= questions.length) return;
    }

    const question = questions.find(q => q.id === id);

    if (question) {
      game.questions.push(question);
      game.questionsAsked += 1;
    }
  }

  game.pos += 1;
  setGame(game);
  emitQuestion(game.questions[game.pos], game.questionsAsked);
};
