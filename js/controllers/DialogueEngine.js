window.DialogueEngine = (function () {
  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  class DialogueEngine {
    constructor(container, options) {
      this.container = container;
      this.script = null;
      this.step = null;
      this.stepIndex = 0;
      this.history = [];
      this.autoMode = false;
      this.isTyping = false;
      this.typeTimer = null;
      this.autoTimer = null;
      this.fullText = "";
      this.charIndex = 0;
      this.microGame = null;
      this.activity = null;
      this.onComplete = options.onComplete || function () {};
      this.onReturn = options.onReturn || function () {};
      this.onChoice = options.onChoice || function () {};
      this.onLine = options.onLine || function () {};
      this.onMicroGameResult = options.onMicroGameResult || function () {};
      this.onActivityResult = options.onActivityResult || options.onMicroGameResult || function () {};
    }

    start(script) {
      this.stopTimers();
      this.destroyMicroGame();
      this.script = script;
      this.stepIndex = 0;
      this.history = [];
      this.autoMode = false;
      this.renderFrame();
    }

    destroy() {
      this.stopTimers();
      this.destroyMicroGame();
    }

    stopTimers() {
      if (this.typeTimer) {
        clearInterval(this.typeTimer);
        this.typeTimer = null;
      }
      if (this.autoTimer) {
        clearTimeout(this.autoTimer);
        this.autoTimer = null;
      }
    }

    getCurrentStep() {
      return this.script && this.script.steps ? this.script.steps[this.stepIndex] : null;
    }

    findStepIndex(id) {
      if (!this.script || !this.script.steps) return -1;
      for (let i = 0; i < this.script.steps.length; i += 1) {
        if (this.script.steps[i].id === id) return i;
      }
      return -1;
    }

    renderFrame() {
      this.stopTimers();
      this.step = this.getCurrentStep();
      if (!this.step) {
        this.complete();
        return;
      }

      const background = this.step.background || this.script.background;
      const isChoice = this.step.type === "choice";
      const isMicroGame = this.step.type === "microgame" || Boolean(this.step.microGameId);
      const isCollection = this.step.type === "collect";
      const isCraft = this.step.type === "craft";

      this.container.innerHTML = `
        <section class="dialogue">
          <div class="dialogue__scene" style="background-image:url('${background}')">
            <div class="dialogue__grain"></div>
            <div class="dialogue__topbar">
              <button class="dialogue__top-action ${(isMicroGame || isCollection || isCraft) ? "is-hidden" : ""}" data-action="auto">${this.autoMode ? "自动：开" : "自动：关"}</button>
              <button class="dialogue__top-action" data-action="history">历史</button>
              <button class="dialogue__top-action" data-action="skip">跳过</button>
              <button class="dialogue__top-action" data-action="exit">退出</button>
            </div>
            ${isChoice ? this.renderChoiceLayer() : isMicroGame ? this.renderMicroGameLayer() : isCollection ? this.renderActivityLayer("collection") : isCraft ? this.renderActivityLayer("craft") : this.renderLineLayer()}
          </div>
        </section>
      `;

      this.bindFrame(isChoice, isMicroGame, isCollection, isCraft);
      if (!isChoice && !isMicroGame && !isCollection && !isCraft) {
        this.startTyping(this.step.text || "");
        this.recordHistory(this.step.speaker, this.step.text);
        this.onLine(this.step);
      }
    }

    renderLineLayer() {
      const step = this.step;
      const avatar = step.avatar
        ? `<img class="dialogue__avatar dialogue__avatar--${escapeHtml(step.position || "left")}" src="${step.avatar}" alt="">`
        : "";
      return `
        ${avatar}
        <div class="dialogue__box">
          <div class="dialogue__speaker">${escapeHtml(step.speaker || "旁白")}</div>
          <div class="dialogue__text" data-dialogue-text></div>
          <div class="dialogue__controls">
            <span class="dialogue__hint">点击继续</span>
            <button class="btn btn-primary" data-action="continue">继续</button>
          </div>
        </div>
      `;
    }

    renderChoiceLayer() {
      const step = this.step;
      return `
        <div class="dialogue__choice-layer">
          <div class="dialogue__choice-prompt">${escapeHtml(step.prompt || "请选择你的回应")}</div>
          <div class="dialogue__choices">
            ${(step.options || []).map((option, index) => `
              <button class="dialogue__choice" data-choice-index="${index}">
                <span class="dialogue__choice-index">${index + 1}</span>
                <span>${escapeHtml(option.text)}</span>
              </button>
            `).join("")}
          </div>
          <div class="dialogue__choice-tip">不同选择将获得不同的历史洞察，但历史结局不变。</div>
        </div>
      `;
    }

    renderMicroGameLayer() {
      return `
        <div class="dialogue__microgame" data-microgame-root></div>
      `;
    }

    renderActivityLayer() {
      return `
        <div class="dialogue__microgame" data-activity-root></div>
      `;
    }

    bindFrame(isChoice, isMicroGame, isCollection, isCraft) {
      this.container.querySelectorAll("[data-action]").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          const action = button.dataset.action;
          if (action === "continue") this.advance();
          if (action === "auto") this.toggleAuto();
          if (action === "history") this.showHistory();
          if (action === "skip") this.skip();
          if (action === "exit") this.exit();
        });
      });

      if (isMicroGame) {
        this.startMicroGame(this.step);
      } else if (isCollection) {
        this.startCollection(this.step);
      } else if (isCraft) {
        this.startCraft(this.step);
      } else if (isChoice) {
        this.container.querySelectorAll("[data-choice-index]").forEach((button) => {
          button.addEventListener("click", (event) => {
            event.stopPropagation();
            this.selectChoice(Number(button.dataset.choiceIndex));
          });
        });
      } else {
        const box = this.container.querySelector(".dialogue__box");
        if (box) {
          box.addEventListener("click", (event) => {
            if (event.target.closest("[data-action]")) return;
            this.advance();
          });
        }
      }
    }

    startMicroGame(step) {
      this.stopTimers();
      this.destroyMicroGame();

      const microGameId = step.microGameId || step.microGame;
      const config = (window.GAME_MICROGAMES || []).find((item) => item.id === microGameId);
      const root = this.container.querySelector("[data-microgame-root]");
      if (!config || !root) {
        this.goNext();
        return;
      }

      this.microGame = new window.MicroGameEngine(config, root, {
        onComplete: (result) => {
          this.onMicroGameResult(step, result);
          this.destroyMicroGame();
          this.goNext();
        },
        onExit: () => {
          this.destroyMicroGame();
          this.onReturn();
        }
      });
      this.microGame.start();
    }

    startCollection(step) {
      this.stopTimers();
      this.destroyMicroGame();

      const collectionId = step.collectionId || step.collectionGameId;
      const config = (window.GAME_COLLECTIONS || []).find((item) => item.id === collectionId);
      const root = this.container.querySelector("[data-activity-root]");
      if (!config || !root) {
        this.goNext();
        return;
      }

      this.activity = new window.CollectionGameEngine(config, root, {
        onComplete: (result) => {
          this.onActivityResult(step, result);
          this.destroyMicroGame();
          this.goNext();
        },
        onExit: () => {
          this.destroyMicroGame();
          this.onReturn();
        }
      });
      this.activity.start();
    }

    startCraft(step) {
      this.stopTimers();
      this.destroyMicroGame();

      const craftId = step.craftId || step.craftGameId;
      const config = (window.GAME_CRAFTS || []).find((item) => item.id === craftId);
      const root = this.container.querySelector("[data-activity-root]");
      if (!config || !root) {
        this.goNext();
        return;
      }

      this.activity = new window.CraftGameEngine(config, root, {
        onComplete: (result) => {
          this.onActivityResult(step, result);
          this.destroyMicroGame();
          this.goNext();
        },
        onExit: () => {
          this.destroyMicroGame();
          this.onReturn();
        }
      });
      this.activity.start();
    }

    destroyMicroGame() {
      if (this.microGame) {
        this.microGame.destroy();
        this.microGame = null;
      }
      if (this.activity) {
        this.activity.destroy();
        this.activity = null;
      }
    }

    startTyping(text) {
      this.stopTimers();
      this.fullText = String(text || "");
      this.charIndex = 0;
      this.isTyping = true;
      const target = this.container.querySelector("[data-dialogue-text]");
      if (!target) {
        this.isTyping = false;
        return;
      }

      target.textContent = "";
      this.typeTimer = setInterval(() => {
        this.charIndex += 1;
        target.textContent = this.fullText.slice(0, this.charIndex);
        if (this.charIndex >= this.fullText.length) {
          this.isTyping = false;
          clearInterval(this.typeTimer);
          this.typeTimer = null;
          if (this.autoMode) {
            this.scheduleAutoAdvance();
          }
        }
      }, 34);
    }

    completeTyping() {
      if (!this.isTyping) return;
      this.stopTimers();
      this.isTyping = false;
      const target = this.container.querySelector("[data-dialogue-text]");
      if (target) {
        target.textContent = this.fullText;
      }
      if (this.autoMode) {
        this.scheduleAutoAdvance();
      }
    }

    scheduleAutoAdvance() {
      this.autoTimer = setTimeout(() => {
        if (this.autoMode && !this.isTyping) {
          this.advance();
        }
      }, 1500);
    }

    advance() {
      if (this.isTyping) {
        this.completeTyping();
        return;
      }
      this.goNext();
    }

    goNext() {
      if (!this.step) return;
      this.destroyMicroGame();
      if (this.step.next) {
        const nextIndex = this.findStepIndex(this.step.next);
        if (nextIndex >= 0) {
          this.stepIndex = nextIndex;
          this.renderFrame();
          return;
        }
      }

      if (this.stepIndex < (this.script.steps || []).length - 1) {
        this.stepIndex += 1;
        this.renderFrame();
      } else {
        this.complete();
      }
    }

    goToStep(id) {
      this.destroyMicroGame();
      const index = this.findStepIndex(id);
      if (index >= 0) {
        this.stepIndex = index;
        this.renderFrame();
      } else {
        this.complete();
      }
    }

    selectChoice(choiceIndex) {
      const step = this.step;
      const option = step && step.options ? step.options[choiceIndex] : null;
      if (!option) return;

      this.onChoice(this.script, step, option);
      this.renderFeedback(option.feedback || "已记录你的选择。", () => {
        if (option.next) {
          this.goToStep(option.next);
        } else if (option.correct) {
          this.goNext();
        } else {
          this.renderFrame();
        }
      });
    }

    renderFeedback(text, onDone) {
      this.stopTimers();
      this.container.innerHTML = `
        <section class="dialogue">
          <div class="dialogue__scene" style="background-image:url('${this.script.background}')">
            <div class="dialogue__grain"></div>
            <div class="dialogue__box dialogue__box--feedback">
              <div class="dialogue__speaker">史料解析</div>
              <div class="dialogue__text dialogue__text--static">${escapeHtml(text)}</div>
              <div class="dialogue__controls">
                <span class="dialogue__hint">点击继续</span>
                <button class="btn btn-primary" data-action="continue-feedback">继续</button>
              </div>
            </div>
          </div>
        </section>
      `;

      const next = () => {
        if (typeof onDone === "function") onDone();
      };
      this.container.querySelector('[data-action="continue-feedback"]').addEventListener("click", (event) => {
        event.stopPropagation();
        next();
      });
      this.container.querySelector(".dialogue__box").addEventListener("click", (event) => {
        if (event.target.closest("[data-action]")) return;
        next();
      });
    }

    toggleAuto() {
      this.autoMode = !this.autoMode;
      this.stopTimers();
      if (this.autoMode && !this.isTyping && this.step && this.step.type !== "choice") {
        this.scheduleAutoAdvance();
      }
      this.renderFrame();
      if (!this.isTyping && this.step && this.step.type !== "choice") {
        const target = this.container.querySelector("[data-dialogue-text]");
        if (target) target.textContent = this.fullText;
      }
    }

    recordHistory(speaker, text) {
      this.history.push({ speaker: speaker || "旁白", text: String(text || "") });
    }

    showHistory() {
      const existing = document.querySelector(".dialogue-history-modal");
      if (existing) existing.remove();

      const modal = document.createElement("div");
      modal.className = "dialogue-history-modal";
      modal.innerHTML = `
        <div class="dialogue-history-modal__panel">
          <h3 class="dialogue-history-modal__title">对话历史</h3>
          <div class="dialogue-history-modal__list">
            ${this.history.length ? this.history.map((item) => `
              <p class="dialogue-history-modal__item"><strong>${escapeHtml(item.speaker)}：</strong>${escapeHtml(item.text)}</p>
            `).join("") : "<p>暂无对话记录。</p>"}
          </div>
          <button class="btn btn-primary" data-action="close-history">关闭</button>
        </div>
      `;
      document.body.appendChild(modal);
      modal.querySelector('[data-action="close-history"]').addEventListener("click", () => modal.remove());
    }

    skip() {
      this.stopTimers();
      this.destroyMicroGame();
      this.onReturn();
    }

    exit() {
      this.stopTimers();
      this.destroyMicroGame();
      this.onReturn();
    }

    complete() {
      this.stopTimers();
      this.destroyMicroGame();
      this.onComplete(this.script);
    }
  }

  return DialogueEngine;
})();