window.QuestionModel = (function () {
  class QuestionModel {
    getChapters() {
      return window.GAME_CHAPTERS || [];
    }

    getChapter(chapterId) {
      return this.getChapters().find((chapter) => Number(chapter.id) === Number(chapterId)) || null;
    }

    getQuestions(chapterId) {
      return (window.GAME_QUESTIONS || []).filter((question) => Number(question.chapter) === Number(chapterId));
    }

    getQuestion(chapterId, questionIndex) {
      const questions = this.getQuestions(chapterId);
      return questions[questionIndex] || null;
    }

    getQuestionById(questionId) {
      return (window.GAME_QUESTIONS || []).find((question) => question.id === questionId) || null;
    }

    getQuestionCount(chapterId) {
      return this.getQuestions(chapterId).length;
    }

    getTotalQuestionCount() {
      return (window.GAME_QUESTIONS || []).length;
    }
  }

  return QuestionModel;
})();