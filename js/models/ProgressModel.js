window.ProgressModel = (function () {
  const STORAGE_KEY = "progress";

  function createDefaultState() {
    const map = window.GAME_MAP || {};
    return {
      currentChapter: 0,
      currentQuestionIndex: 0,
      completedChapters: [],
      badges: [],
      evidence: [],
      artifacts: [],
      achievements: [],
      insightScore: 0,
      totalScore: 0,
      choiceHistory: [],
      wrongQuestions: [],
      microGameResults: {},
      timelineCompleted: false,
      isCompleted: false,
      completedAt: null,
      certificateName: "",
      hiddenUnlocked: [],
      playerPosition: map.playerStart || { x: 330, y: 1100 },
      startTime: Date.now(),
      endTime: null,
      playTime: 0,
      settings: {
        soundEnabled: true,
        autoMode: false,
        vibrationEnabled: true
      },
      stats: {
        choices: { total: 0, correct: 0 },
        microGames: { total: 0, perfect: 0, passed: 0 },
        totalVisits: 0
      }
    };
  }

  class ProgressModel {
    constructor() {
      this.state = this.load();
    }

    load() {
      const saved = window.StorageUtils.get(STORAGE_KEY, null);
      const defaults = createDefaultState();
      if (!saved || typeof saved !== "object") {
        return defaults;
      }

      return Object.assign({}, defaults, saved, {
        completedChapters: Array.isArray(saved.completedChapters) ? saved.completedChapters : [],
        badges: Array.isArray(saved.badges) ? saved.badges : [],
        evidence: Array.isArray(saved.evidence) ? saved.evidence : [],
        artifacts: Array.isArray(saved.artifacts) ? saved.artifacts : [],
        achievements: Array.isArray(saved.achievements) ? saved.achievements : [],
        choiceHistory: Array.isArray(saved.choiceHistory) ? saved.choiceHistory : [],
        wrongQuestions: Array.isArray(saved.wrongQuestions) ? saved.wrongQuestions : [],
        hiddenUnlocked: Array.isArray(saved.hiddenUnlocked) ? saved.hiddenUnlocked : [],
        insightScore: Number(saved.insightScore) || 0,
        totalScore: Number(saved.totalScore) || 0,
        microGameResults: saved.microGameResults && typeof saved.microGameResults === "object" ? saved.microGameResults : {},
        settings: Object.assign({}, defaults.settings, saved.settings || {}),
        stats: Object.assign({}, defaults.stats, saved.stats || {}, {
          choices: Object.assign({}, defaults.stats.choices, (saved.stats && saved.stats.choices) || {}),
          microGames: Object.assign({}, defaults.stats.microGames, (saved.stats && saved.stats.microGames) || {})
        }),
        playerPosition: saved.playerPosition || defaults.playerPosition,
        startTime: saved.startTime || defaults.startTime,
        playTime: Number(saved.playTime) || 0
      });
    }

    save() {
      window.StorageUtils.set(STORAGE_KEY, this.state);
    }

    getState() {
      return this.state;
    }

    reset() {
      this.state = createDefaultState();
      this.save();
    }

    getCurrentChapterId() {
      return this.state.currentChapter;
    }

    getCurrentQuestionIndex() {
      return this.state.currentQuestionIndex;
    }

    setCurrentPosition(chapterId, questionIndex) {
      this.state.currentChapter = Number(chapterId);
      this.state.currentQuestionIndex = Number(questionIndex) || 0;
      this.save();
    }

    isChapterCompleted(chapterId) {
      return this.state.completedChapters.includes(Number(chapterId));
    }

    isBadgeUnlocked(badgeId) {
      return this.state.badges.includes(badgeId);
    }

    unlockBadge(badgeId) {
      if (badgeId && !this.state.badges.includes(badgeId)) {
        this.state.badges.push(badgeId);
        this.save();
      }
    }

    markChapterCompleted(chapterId, badgeId) {
      const id = Number(chapterId);
      if (!this.state.completedChapters.includes(id)) {
        this.state.completedChapters.push(id);
      }
      this.unlockBadge(badgeId);
      this.state.isCompleted = this.state.completedChapters.length >= window.GAME_CHAPTERS.length;
      if (this.state.isCompleted) {
        if (!this.state.completedAt) this.state.completedAt = Date.now();
        if (!this.state.endTime) this.state.endTime = Date.now();
      }
      this.save();
    }

    markAllCompleted() {
      this.state.completedChapters = window.GAME_CHAPTERS.map((chapter) => chapter.id);
      this.state.badges = window.GAME_BADGES.map((badge) => badge.id);
      this.state.isCompleted = true;
      if (!this.state.completedAt) this.state.completedAt = Date.now();
      if (!this.state.endTime) this.state.endTime = Date.now();
      this.save();
    }

    getNextPendingChapter() {
      for (let i = 0; i < window.GAME_CHAPTERS.length; i += 1) {
        if (!this.isChapterCompleted(window.GAME_CHAPTERS[i].id)) {
          return window.GAME_CHAPTERS[i];
        }
      }
      return null;
    }

    setCertificateName(name) {
      this.state.certificateName = String(name || "").trim();
      this.save();
    }

    unlockHidden(id) {
      if (!id) return false;
      if (!this.state.hiddenUnlocked.includes(id)) {
        this.state.hiddenUnlocked.push(id);
        this.save();
        return true;
      }
      return false;
    }

    isHiddenUnlocked(id) {
      return this.state.hiddenUnlocked.includes(id);
    }

    getPlayerPosition() {
      return this.state.playerPosition || { x: 330, y: 1100 };
    }

    setPlayerPosition(x, y) {
      this.state.playerPosition = { x: Number(x), y: Number(y) };
      this.save();
    }

    addEvidence(item) {
      if (item && !this.state.evidence.includes(item)) {
        this.state.evidence.push(item);
        this.save();
      }
    }

    hasEvidence(item) {
      return this.state.evidence.includes(item);
    }

    addArtifact(artifactId) {
      if (artifactId && !this.state.artifacts.includes(artifactId)) {
        this.state.artifacts.push(artifactId);
        this.save();
        return true;
      }
      return false;
    }

    hasArtifact(artifactId) {
      return this.state.artifacts.includes(artifactId);
    }

    addAchievement(achievementId) {
      if (achievementId && !this.state.achievements.includes(achievementId)) {
        this.state.achievements.push(achievementId);
        this.save();
        return true;
      }
      return false;
    }

    hasAchievement(achievementId) {
      return this.state.achievements.includes(achievementId);
    }

    addInsight(points) {
      this.addScore(points);
    }

    addScore(points) {
      this.state.insightScore += Number(points) || 0;
      this.state.totalScore += Number(points) || 0;
      this.save();
    }

    recordChoice(chapterId, stepId, choiceText, isCorrect) {
      this.state.choiceHistory.push({
        chapterId,
        stepId,
        choiceText,
        isCorrect: Boolean(isCorrect),
        at: Date.now()
      });
      this.state.stats.choices.total += 1;
      if (isCorrect) {
        this.state.stats.choices.correct += 1;
      } else {
        this.state.wrongQuestions.push({
          chapterId,
          stepId,
          choiceText,
          at: Date.now()
        });
      }
      this.save();
    }

    recordMicroGameResult(gameId, result) {
      const status = result && result.status ? result.status : "passed";
      this.state.microGameResults[gameId] = status;
      this.state.stats.microGames.total += 1;
      if (status === "perfect") {
        this.state.stats.microGames.perfect += 1;
        this.state.stats.microGames.passed += 1;
      } else if (status === "passed") {
        this.state.stats.microGames.passed += 1;
      }
      this.save();
    }

    markTimelineCompleted() {
      this.state.timelineCompleted = true;
      this.save();
    }

    isTimelineCompleted() {
      return Boolean(this.state.timelineCompleted);
    }

    syncArtifactsFromCompletedChapters() {
      if (!window.GAME_ARTIFACTS || !Array.isArray(window.GAME_ARTIFACTS)) return;
      let changed = false;
      window.GAME_ARTIFACTS.forEach((artifact) => {
        const isChapterComplete = this.state.completedChapters.includes(Number(artifact.chapterId));
        if (isChapterComplete && !this.state.artifacts.includes(artifact.id)) {
          this.state.artifacts.push(artifact.id);
          changed = true;
        }
      });
      if (changed) this.save();
    }

    touchVisit() {
      this.state.stats.totalVisits += 1;
      this.save();
    }

    getPlayTimeSeconds() {
      const end = this.state.endTime || Date.now();
      return Math.max(0, Math.floor((end - this.state.startTime) / 1000));
    }
  }

  return ProgressModel;
})();