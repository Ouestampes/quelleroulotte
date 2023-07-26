import { emitQuestion, getQuestions } from '../roulotte';
import { getState, setState } from '../util/state';

export const nextQuestion = () => {
  const game = getState().game;
  let id = null;

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
      if (counter >= questions.length) return null;
    }

    game.questions.push(questions.find(q => q.id === id));
    game.questionsAsked += 1;
  }

  game.pos += 1;
  setState({ game });
  emitQuestion(game.questions[game.pos]);
};
