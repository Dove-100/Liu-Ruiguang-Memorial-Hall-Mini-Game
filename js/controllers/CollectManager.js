window.CollectManager = (function () {
  class CollectManager {
    constructor(progressModel) {
      this.progress = progressModel;
    }

    getAllArtifacts() {
      return window.GAME_ARTIFACTS || [];
    }

    getArtifactByChapter(chapterId) {
      return this.getAllArtifacts().find((artifact) => Number(artifact.chapterId) === Number(chapterId)) || null;
    }

    getCollectedArtifacts() {
      return this.getAllArtifacts().filter((artifact) => this.progress.hasArtifact(artifact.id));
    }

    collectForChapter(chapterId) {
      const artifact = this.getArtifactByChapter(chapterId);
      if (!artifact) return null;
      this.progress.addArtifact(artifact.id);
      this.progress.addEvidence(artifact.name);
      return artifact;
    }

    isCollected(artifactId) {
      return this.progress.hasArtifact(artifactId);
    }
  }

  return CollectManager;
})();