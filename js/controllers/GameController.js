window.GameController = (function () {
  class GameController {
    constructor(progressModel, questionModel, badgeManager, renderer) {
      this.progress = progressModel;
      this.questions = questionModel;
      this.badges = badgeManager;
      this.renderer = renderer;
      this.answerLocks = {};
    }

    init() {
      const unlocks = window.QrParser.parseHiddenUnlocks();
      unlocks.forEach((id) => this.progress.unlockHidden(id));

      this.renderer.setController(this);
      this.renderer.renderHome();
    }

    getState() {
      return this.progress.getState();
    }

    getCurrentChapter() {
      return this.questions.getChapter(this.progress.getCurrentChapterId());
    }

    getCurrentQuestion() {
      return this.questions.getQuestion(
        this.progress.getCurrentChapterId(),
        this.progress.getCurrentQuestionIndex()
      );
    }

    getQuestionsFor(chapterId) {
      return this.questions.getQuestions(chapterId);
    }

    showHome() {
      this.renderer.renderHome();
    }

    showGuide() {
      this.renderer.renderGuide();
    }

    startJourney() {
      if (this.progress.getState().isCompleted) {
        this.renderer.renderFinal();
        return;
      }

      const pendingChapter = this.progress.getNextPendingChapter();
      if (!pendingChapter) {
        this.progress.markAllCompleted();
        this.renderer.renderFinal();
        return;
      }

      const savedChapterId = this.progress.getCurrentChapterId();
      const savedIndex = this.progress.getCurrentQuestionIndex();
      const chapter = this.questions.getChapter(savedChapterId);
      const questionCount = this.questions.getQuestionCount(savedChapterId);

      if (chapter && !this.progress.isChapterCompleted(savedChapterId)) {
        this.progress.setCurrentPosition(savedChapterId, Math.min(savedIndex, Math.max(questionCount - 1, 0)));
        this.renderer.renderChapterIntro(savedChapterId);
      } else {
        this.startChapter(pendingChapter.id);
      }
    }

    startChapter(chapterId) {
      const chapter = this.questions.getChapter(chapterId);
      if (!chapter) {
        this.renderer.renderFinal();
        return;
      }
      this.progress.setCurrentPosition(chapter.id, 0);
      this.renderer.renderChapterIntro(chapter.id);
    }

    enterChapterQuestions(chapterId) {
      const questionCount = this.questions.getQuestionCount(chapterId);
      if (questionCount === 0) {
        this.completeChapter(chapterId);
        return;
      }

      const index = Number(this.progress.getCurrentChapterId()) === Number(chapterId)
        ? this.progress.getCurrentQuestionIndex()
        : 0;

      this.progress.setCurrentPosition(chapterId, Math.min(index, questionCount - 1));
      this.renderer.renderQuestion(chapterId, this.progress.getCurrentQuestionIndex());
    }

    submitAnswer(chapterId, questionIndex, userAnswer) {
      const question = this.questions.getQuestion(chapterId, questionIndex);
      if (!question) return { success: false };

      const lockKey = chapterId + "_" + questionIndex;
      if (this.answerLocks[lockKey]) {
        return { success: false, locked: true };
      }

      const isCorrect = window.AnswerValidator.validateAnswer(question, userAnswer);
      if (!isCorrect) {
        return {
          success: false,
          correct: false,
          explanation: question.explanation
        };
      }

      this.answerLocks[lockKey] = true;
      const questionCount = this.questions.getQuestionCount(chapterId);

      window.setTimeout(() => {
        this.answerLocks[lockKey] = false;

        if (questionIndex < questionCount - 1) {
          this.progress.setCurrentPosition(chapterId, questionIndex + 1);
          this.renderer.renderQuestion(chapterId, questionIndex + 1);
        } else {
          this.completeChapter(chapterId);
        }
      }, 700);

      return { success: true, correct: true, explanation: question.explanation };
    }

    completeChapter(chapterId) {
      const chapter = this.questions.getChapter(chapterId);
      const badge = this.badges.getBadgeByChapter(chapterId);
      this.progress.markChapterCompleted(chapterId, badge ? badge.id : null);
      this.renderer.renderChapterComplete(chapterId);
    }

    goToNextChapter(currentChapterId) {
      const nextChapter = this.questions.getChapter(Number(currentChapterId) + 1);
      if (nextChapter) {
        this.startChapter(nextChapter.id);
      } else {
        this.renderer.renderFinal();
      }
    }

    renderFinal() {
      this.renderer.renderFinal();
    }

    resetProgress() {
      this.progress.reset();
      this.renderer.renderHome();
    }

    setCertificateName(name) {
      this.progress.setCertificateName(name);
    }

    unlockHidden(id) {
      return this.progress.unlockHidden(id);
    }

    isHiddenUnlocked(id) {
      return this.progress.isHiddenUnlocked(id);
    }
  }

  return GameController;
})();