window.AnswerValidator = (function () {
  function validateAnswer(question, userAnswer) {
    if (!question) return false;

    switch (question.type) {
      case "single":
      case "image":
      case "scene":
        return Number(userAnswer) === Number(question.answer);

      case "multiple":
        return window.ValidatorUtils.arraysEqual(userAnswer, question.answer);

      case "fill":
        return validateFill(question, userAnswer);

      case "sort":
        return window.ValidatorUtils.arraysEqual(userAnswer, question.answer);

      case "essay":
        return window.ValidatorUtils.matchesKeywords(userAnswer, question.keywords);

      case "puzzle":
        return Boolean(userAnswer && userAnswer.completed === true);

      default:
        return false;
    }
  }

  function validateFill(question, userAnswer) {
    const input = window.ValidatorUtils.normalizeText(userAnswer);
    const answers = Array.isArray(question.acceptableAnswers)
      ? question.acceptableAnswers
      : [question.answer];

    return answers.some((answer) => window.ValidatorUtils.normalizeText(answer) === input);
  }

  return { validateAnswer };
})();