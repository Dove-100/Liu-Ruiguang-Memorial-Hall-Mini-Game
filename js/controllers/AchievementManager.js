window.AchievementManager = (function () {
  class AchievementManager {
    constructor(progressModel) {
      this.progress = progressModel;
    }

    getAllAchievements() {
      return window.GAME_ACHIEVEMENTS || [];
    }

    isUnlocked(achievementId) {
      return this.progress.hasAchievement(achievementId);
    }

    getUnlockedAchievements() {
      return this.getAllAchievements().filter((achievement) => this.isUnlocked(achievement.id));
    }

    evaluate(event, payload) {
      if (event === "certificate") {
        this.unlock("spreader");
      }
      if (event === "timeline") {
        return;
      }
      if (event === "chapter_complete") {
        this.evaluateChapterAchievements(payload);
      }
      if (event === "microgame_complete") {
        this.evaluateMicroGameAchievements();
      }
    }

    evaluateChapterAchievements(payload) {
      const state = this.progress.getState();
      if (state.completedChapters.length >= window.GAME_CHAPTERS.length) {
        const allCorrect = state.stats.choices.total > 0 && state.stats.choices.correct === state.stats.choices.total;
        if (allCorrect) {
          this.unlock("all_correct");
        }

        if (state.artifacts.length >= (window.GAME_ARTIFACTS || []).length) {
          this.unlock("collector");
        }

        const playSeconds = this.progress.getPlayTimeSeconds();
        if (playSeconds <= 1800) {
          this.unlock("speed_pioneer");
        }
      }
    }

    evaluateMicroGameAchievements() {
      const state = this.progress.getState();
      const totalGames = (window.GAME_MICROGAMES || []).length;
      const hasFinishedAll = state.stats.microGames.total >= totalGames;
      const hasAllPerfect = state.stats.microGames.perfect >= totalGames;
      if (hasFinishedAll && hasAllPerfect) {
        this.unlock("microgame_master");
      }
    }

    unlock(achievementId) {
      const achievement = this.getAllAchievements().find((item) => item.id === achievementId);
      if (achievement) {
        this.progress.addAchievement(achievement.id);
      }
    }
  }

  return AchievementManager;
})();