(function () {
  function boot() {
    const container = document.getElementById("app");
    const progress = new window.ProgressModel();
    const questions = new window.QuestionModel();
    const badges = new window.BadgeManager(progress);
    const renderer = new window.PageRenderer();
    const controller = new window.AdventureController(container, progress, questions, badges, renderer);

    controller.init();

    window.addEventListener("beforeunload", () => {
      progress.save();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();