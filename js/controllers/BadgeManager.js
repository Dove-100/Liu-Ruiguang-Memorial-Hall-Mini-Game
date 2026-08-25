window.BadgeManager = (function () {
  class BadgeManager {
    constructor(progressModel) {
      this.progress = progressModel;
    }

    getBadgeByChapter(chapterId) {
      return (window.GAME_BADGES || []).find((badge) => Number(badge.chapterId) === Number(chapterId)) || null;
    }

    unlockForChapter(chapterId) {
      const badge = this.getBadgeByChapter(chapterId);
      if (badge) {
        this.progress.unlockBadge(badge.id);
      }
      return badge;
    }

    isChapterBadgeUnlocked(chapterId) {
      const badge = this.getBadgeByChapter(chapterId);
      return Boolean(badge && this.progress.isBadgeUnlocked(badge.id));
    }

    getCollectedBadges() {
      return (window.GAME_BADGES || []).filter((badge) => this.progress.isBadgeUnlocked(badge.id));
    }

    getAllBadges() {
      return window.GAME_BADGES || [];
    }

    getProgressCount() {
      return this.getCollectedBadges().length;
    }
  }

  return BadgeManager;
})();