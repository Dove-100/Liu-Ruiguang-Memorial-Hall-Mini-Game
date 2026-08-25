window.AdventureController = (function () {
  class AdventureController {
    constructor(container, progressModel, questionModel, badgeManager, pageRenderer) {
      this.container = container;
      this.progress = progressModel;
      this.questions = questionModel;
      this.badges = badgeManager;
      this.collects = new window.CollectManager(progressModel);
      this.achievements = new window.AchievementManager(progressModel);
      this.pageRenderer = pageRenderer;
      this.pageRenderer.setController(this);
      this.mapView = new window.MapView(container, this);
      this.dialogueEngine = new window.DialogueEngine(container, {
        onComplete: (script) => this.onDialogueComplete(script),
        onReturn: () => this.onDialogueReturn(),
        onChoice: (script, step, option) => this.onDialogueChoice(script, step, option),
        onMicroGameResult: (step, result) => this.onMicroGameResult(step, result),
        onActivityResult: (step, result) => this.onActivityResult(step, result)
      });
    }

    init() {
      const unlocks = window.QrParser.parseHiddenUnlocks();
      unlocks.forEach((id) => this.progress.unlockHidden(id));
      this.progress.touchVisit();
      this.progress.syncArtifactsFromCompletedChapters();
      if (this.progress.getState().isCompleted) {
        const lastChapter = window.GAME_CHAPTERS[window.GAME_CHAPTERS.length - 1];
        this.achievements.evaluate("chapter_complete", { chapterId: lastChapter.id });
      }
      this.showHome();
    }

    getState() {
      return this.progress.getState();
    }

    showHome() {
      this.mapView.destroy();
      this.dialogueEngine.destroy();
      this.pageRenderer.renderHome();
    }

    showGuide() {
      this.mapView.destroy();
      this.dialogueEngine.destroy();
      this.pageRenderer.renderGuide();
    }

    startJourney() {
      this.mapView.show();
    }

    renderFinal() {
      this.mapView.destroy();
      this.dialogueEngine.destroy();
      this.pageRenderer.renderFinal();
    }

    getNodeStatus(node) {
      const chapterId = Number(node.chapterId);
      const completed = this.progress.isChapterCompleted(chapterId);
      const available = completed || this.isChapterAvailable(chapterId);
      return { completed, available };
    }

    isChapterAvailable(chapterId) {
      if (chapterId === 0) return true;
      return this.progress.isChapterCompleted(chapterId - 1);
    }

    enterMapNode(node) {
      const status = this.getNodeStatus(node);
      if (!status.available) {
        this.pageRenderer.showToast("请先完成上一篇章");
        return;
      }
      this.startDialogue(Number(node.chapterId));
    }

    startDialogue(chapterId) {
      const script = (window.GAME_SCRIPTS || []).find((item) => Number(item.chapterId) === Number(chapterId));
      if (!script) {
        this.mapView.show();
        return;
      }

      this.progress.setCurrentPosition(chapterId, 0);
      this.mapView.destroy();
      this.dialogueEngine.start(script);
    }

    onDialogueComplete(script) {
      this.progress.markChapterCompleted(script.chapterId, script.badgeId);
      const artifact = this.collects.collectForChapter(script.chapterId);
      if (artifact) {
        this.progress.addEvidence(artifact.name);
      } else if (script.evidence) {
        this.progress.addEvidence(script.evidence);
      }
      this.progress.addScore(100);
      this.achievements.evaluate("chapter_complete", { chapterId: script.chapterId });
      this.pageRenderer.renderChapterComplete(script.chapterId);
    }

    onDialogueReturn() {
      this.mapView.show();
    }

    onDialogueChoice(script, step, option) {
      this.progress.recordChoice(script.chapterId, step.id, option.text, Boolean(option.correct));
      if (option.correct) {
        this.progress.addScore(10);
      }
    }

    onMicroGameResult(step, result) {
      const gameId = step.microGameId || step.microGame;
      const status = result && result.status ? result.status : "passed";
      this.progress.recordMicroGameResult(gameId, status);
      if (status === "perfect") {
        this.progress.addScore(30);
      } else {
        this.progress.addScore(20);
      }
      this.achievements.evaluate("microgame_complete", { gameId, status });
    }

    onActivityResult(step, result) {
      const gameId = step.collectionId || step.craftId || step.id;
      const status = result && result.status ? result.status : "passed";
      this.progress.addScore(status === "perfect" ? 30 : 20);
      if (result && result.reward) {
        this.progress.addEvidence(result.reward);
      }
    }

    goToNextChapter(currentChapterId) {
      const lastChapterId = window.GAME_CHAPTERS[window.GAME_CHAPTERS.length - 1].id;
      if (Number(currentChapterId) >= Number(lastChapterId)) {
        this.renderFinal();
      } else {
        this.mapView.show();
      }
    }

    showKnowledge(item) {
      if (!item) return;
      this.pageRenderer.showExplanation((item.title ? item.title + "：" : "") + item.text);
    }

    getPlayerPosition() {
      return this.progress.getPlayerPosition();
    }

    setPlayerPosition(x, y) {
      this.progress.setPlayerPosition(x, y);
    }

    getProgressMeta() {
      return {
        collected: this.badges.getCollectedBadges().length,
        total: this.badges.getAllBadges().length
      };
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

    markTimelineCompleted() {
      this.progress.markTimelineCompleted();
    }

    certificateGenerated() {
      this.achievements.evaluate("certificate", {});
    }

    resetProgress() {
      this.progress.reset();
      this.showHome();
    }
  }

  return AdventureController;
})();