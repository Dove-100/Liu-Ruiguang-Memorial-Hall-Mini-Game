window.PageRenderer = (function () {
  const HIDDEN_EXTRAS = {
    ch1_extra: {
      title: "民国镇宁地方社会背景补充资料",
      content: "民国时期，镇宁地处黔中要道，地方官府与军阀层层盘剥，各族群众生活困苦。陆瑞光等地方武装正是在这一背景下起而自保。"
    },
    ch2_extra: {
      title: "《反蒋作战协定》复刻高清史料图片",
      content: "1935年4月，红军与陆瑞光在弄染寨签订反蒋作战协定。该协定是红军长征途经贵州时开展统战工作的重要见证。"
    },
    ch4_extra: {
      title: "陆瑞光墓园实景介绍",
      content: "陆瑞光英勇就义后，当地群众铭记其事迹。墓园现已成为后人缅怀英烈、开展爱国主义教育的重要场所。"
    }
  };

  const LETTERS = ["A", "B", "C", "D", "E", "F"];

  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  class PageRenderer {
    constructor() {
      this.app = document.getElementById("app");
      this.controller = null;
      this.rendererState = {};
    }

    setController(controller) {
      this.controller = controller;
    }

    render(html) {
      this.app.innerHTML = html;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    renderHome() {
      const state = this.controller.getState();
      const completedCount = state.completedChapters.length;
      const hasProgress = completedCount > 0 || state.currentQuestionIndex > 0;
      const isCompleted = state.isCompleted;

      this.render(`
        <section class="page page-home">
          <div class="home-paper">
            <div class="hero">
              <div class="hero__seal">陆瑞光纪念馆</div>
              <p class="hero__eyebrow">线上红色研学</p>
              <h1 class="hero__title">弄染寻踪 · 火种永续</h1>
              <p class="hero__subtitle">陆瑞光革命历史线上研学闯关</p>
              <p class="hero__desc">操控研学记者在弄染地图中自由探索，触发历史剧情，解锁陆瑞光与弄染结盟的红色记忆。</p>
              <div class="hero__actions">
                <button class="btn btn-primary" data-action="start">${isCompleted ? "查看通关证书" : hasProgress ? "继续寻访" : "开始寻访"}</button>
                <button class="btn btn-ghost" data-action="guide">游玩说明</button>
              </div>
            </div>
            <div class="home-progress">
              <div class="home-progress__label">已收集徽章</div>
              <div class="home-progress__count">${completedCount} / ${window.GAME_BADGES.length}</div>
              <div class="progress-track"><div class="progress-track__bar" style="width:${completedCount / window.GAME_BADGES.length * 100}%"></div></div>
            </div>
            ${hasProgress ? `<button class="text-button" data-action="reset">重新开始</button>` : ""}
            <footer class="page-footer">陆瑞光纪念馆 · 弄染结盟红色研学</footer>
          </div>
        </section>
      `);

      this.app.querySelector('[data-action="start"]').addEventListener("click", () => {
        if (this.controller.getState().isCompleted) {
          this.controller.renderFinal();
        } else {
          this.controller.startJourney();
        }
      });
      this.app.querySelector('[data-action="guide"]').addEventListener("click", () => this.renderGuide());
      const resetBtn = this.app.querySelector('[data-action="reset"]');
      if (resetBtn) {
        resetBtn.addEventListener("click", () => this.confirmReset());
      }
    }

    renderGuide() {
      this.render(`
        <section class="page page-guide">
          <div class="guide-card">
            <p class="section-kicker">游玩说明</p>
            <h2 class="section-title">寻访须知</h2>
            <ol class="guide-list">
              <li>使用方向键、WASD 或点击地面操控研学记者探索地图。</li>
              <li>靠近金色光点即可触发对应篇章的 Galgame 历史剧情。</li>
              <li>对话中会插入档案整理、画面搜索、节奏点击、拼图等微玩法。</li>
              <li>对话选择会带来不同历史洞察，但真实历史结局不变。</li>
              <li>选错时自动弹出史料解析，可继续选择，边玩边学。</li>
              <li>通关可集齐徽章、物证与官方研学证书。</li>
            </ol>
            <button class="btn btn-primary" data-action="back-home">返回首页</button>
          </div>
        </section>
      `);
      this.app.querySelector('[data-action="back-home"]').addEventListener("click", () => this.renderHome());
    }

    renderChapterIntro(chapterId) {
      const chapter = this.controller.questions.getChapter(chapterId);
      if (!chapter) {
        this.controller.renderFinal();
        return;
      }

      const completed = this.controller.progress.isChapterCompleted(chapterId);
      const questionCount = this.controller.questions.getQuestionCount(chapterId);
      const badge = this.controller.badges.getBadgeByChapter(chapterId);

      this.render(`
        <section class="page page-chapter-intro">
          <div class="topbar">
            <button class="topbar__back" data-action="home">返回首页</button>
            <span class="topbar__title">${escapeHtml(chapter.title)}</span>
          </div>
          <div class="chapter-intro" style="--accent:${chapter.color || "#C41A1A"}">
            <div class="chapter-intro__image" style="background-image:url('${chapter.background}')"></div>
            <div class="chapter-intro__body">
              <p class="section-kicker">${escapeHtml(chapter.area)}</p>
              <h2 class="section-title">${escapeHtml(chapter.title)}</h2>
              <p class="chapter-intro__subtitle">${escapeHtml(chapter.subtitle)}</p>
              <blockquote class="chapter-intro__quote">${escapeHtml(chapter.quote)}</blockquote>
              <p class="chapter-intro__story">${escapeHtml(chapter.story)}</p>
              <div class="chapter-intro__meta">
                <span>题目 ${questionCount} 道</span>
                <span>奖励徽章 · ${escapeHtml(badge ? badge.title : "待解锁")}</span>
              </div>
              <button class="btn btn-primary" data-action="enter">${completed ? "重新作答" : "进入闯关"}</button>
            </div>
          </div>
        </section>
      `);

      this.app.querySelector('[data-action="home"]').addEventListener("click", () => this.renderHome());
      this.app.querySelector('[data-action="enter"]').addEventListener("click", () => this.controller.enterChapterQuestions(chapterId));
    }

    renderQuestion(chapterId, questionIndex) {
      const chapter = this.controller.questions.getChapter(chapterId);
      const question = this.controller.questions.getQuestion(chapterId, questionIndex);
      if (!chapter || !question) {
        this.controller.completeChapter(chapterId);
        return;
      }

      const total = this.controller.questions.getQuestionCount(chapterId);
      const progress = ((questionIndex + 1) / total) * 100;
      this.rendererState = {
        chapterId,
        questionIndex,
        type: question.type,
        selected: new Set(),
        sortState: question.options ? question.options.map((_, index) => index) : [],
        puzzleState: question.type === "puzzle" ? this.createPuzzle(question.puzzleSize || 3) : []
      };

      this.render(`
        <section class="page page-question">
          <div class="topbar">
            <button class="topbar__back" data-action="home">返回首页</button>
            <span class="topbar__title">${escapeHtml(chapter.title)}</span>
          </div>
          <div class="question-shell">
            <div class="question-meta">
              <span>第 ${questionIndex + 1} / ${total} 题</span>
              <span>${escapeHtml(this.getTypeLabel(question.type))}</span>
            </div>
            <div class="progress-track"><div class="progress-track__bar" style="width:${progress}%"></div></div>
            <h2 class="question-title">${escapeHtml(question.question)}</h2>
            ${question.reference ? `<p class="question-reference">${escapeHtml(question.reference)}</p>` : ""}
            ${question.image ? `<img class="question-image" src="${question.image}" alt="史料图片">` : ""}
            <div id="question-stage" class="question-stage">${this.renderStage(question)}</div>
          </div>
        </section>
      `);

      this.app.querySelector('[data-action="home"]').addEventListener("click", () => this.renderHome());
      this.bindStage(question);
    }

    renderStage(question) {
      switch (question.type) {
        case "single":
        case "image":
        case "scene":
          return `
            <div class="options" data-options>
              ${question.options.map((option, index) => `
                <button class="option" data-option-index="${index}">
                  <span class="option__key">${LETTERS[index]}</span>
                  <span class="option__text">${escapeHtml(option)}</span>
                </button>
              `).join("")}
            </div>
          `;
        case "multiple":
          return `
            <div class="options options--check">
              ${question.options.map((option, index) => `
                <button class="option option-check" data-check-index="${index}">
                  <span class="option__check"></span>
                  <span class="option__key">${LETTERS[index]}</span>
                  <span class="option__text">${escapeHtml(option)}</span>
                </button>
              `).join("")}
            </div>
            <button class="btn btn-primary btn-block" data-action="submit-multiple">提交答案</button>
          `;
        case "fill":
          return `
            <input class="text-input" type="text" data-fill-input placeholder="请输入答案" autocomplete="off">
            <button class="btn btn-primary btn-block" data-action="submit-fill">提交答案</button>
          `;
        case "sort":
          return `
            <ol class="sort-list" data-sort-list></ol>
            <button class="btn btn-primary btn-block" data-action="submit-sort">提交排序</button>
          `;
        case "essay":
          return `
            <textarea class="text-area" data-essay-input rows="5" placeholder="请结合史料写下你的理解"></textarea>
            <button class="btn btn-primary btn-block" data-action="submit-essay">提交感悟</button>
          `;
        case "puzzle":
          return `
            <p class="puzzle-tip">点击空格相邻的数字，完成图片排序。</p>
            <div class="puzzle-board" data-puzzle-board></div>
          `;
        default:
          return "";
      }
    }

    bindStage(question) {
      switch (question.type) {
        case "single":
        case "image":
        case "scene":
          this.bindSingle();
          break;
        case "multiple":
          this.bindMultiple(question);
          break;
        case "fill":
          this.bindFill();
          break;
        case "sort":
          this.bindSort();
          break;
        case "essay":
          this.bindEssay();
          break;
        case "puzzle":
          this.bindPuzzle(question);
          break;
        default:
          break;
      }
    }

    bindSingle() {
      this.app.querySelectorAll("[data-option-index]").forEach((button) => {
        button.addEventListener("click", () => {
          const value = Number(button.dataset.optionIndex);
          const result = this.controller.submitAnswer(this.rendererState.chapterId, this.rendererState.questionIndex, value);
          this.handleChoiceResult(result, button);
        });
      });
    }

    handleChoiceResult(result, selectedButton) {
      if (result.locked) return;
      if (result.correct) {
        this.disableOptions();
        selectedButton.classList.add("is-correct");
      } else {
        this.disableOptions();
        selectedButton.classList.add("is-wrong");
        this.showExplanation(result.explanation, () => {
          this.renderQuestion(this.rendererState.chapterId, this.rendererState.questionIndex);
        });
      }
    }

    bindMultiple(question) {
      this.app.querySelectorAll("[data-check-index]").forEach((button) => {
        button.addEventListener("click", () => {
          const index = Number(button.dataset.checkIndex);
          if (this.rendererState.selected.has(index)) {
            this.rendererState.selected.delete(index);
            button.classList.remove("is-selected");
          } else {
            this.rendererState.selected.add(index);
            button.classList.add("is-selected");
          }
        });
      });

      this.app.querySelector('[data-action="submit-multiple"]').addEventListener("click", () => {
        const answer = Array.from(this.rendererState.selected).map(Number).sort((a, b) => a - b);
        if (answer.length === 0) {
          this.showToast("请至少选择一个选项");
          return;
        }
        const result = this.controller.submitAnswer(this.rendererState.chapterId, this.rendererState.questionIndex, answer);
        if (result.correct) {
          this.disableOptions();
          answer.forEach((index) => {
            const button = this.app.querySelector(`[data-check-index="${index}"]`);
            if (button) button.classList.add("is-correct");
          });
        } else {
          this.disableOptions();
          this.showExplanation(result.explanation, () => {
            this.renderQuestion(this.rendererState.chapterId, this.rendererState.questionIndex);
          });
        }
      });
    }

    bindFill() {
      const input = this.app.querySelector("[data-fill-input]");
      this.app.querySelector('[data-action="submit-fill"]').addEventListener("click", () => {
        const result = this.controller.submitAnswer(this.rendererState.chapterId, this.rendererState.questionIndex, input.value);
        if (result.correct) {
          input.disabled = true;
          input.classList.add("is-correct");
          const submitBtn = this.app.querySelector('[data-action="submit-fill"]');
          if (submitBtn) submitBtn.disabled = true;
        } else {
          this.showExplanation(result.explanation, () => {
            this.renderQuestion(this.rendererState.chapterId, this.rendererState.questionIndex);
          });
        }
      });
    }

    bindSort() {
      this.renderSortList();
      const list = this.app.querySelector("[data-sort-list]");
      list.addEventListener("click", (event) => {
        const upBtn = event.target.closest("[data-sort-up]");
        const downBtn = event.target.closest("[data-sort-down]");
        const control = upBtn || downBtn;
        if (!control) return;
        const index = Number(control.dataset.sortIndex);
        const direction = upBtn ? -1 : downBtn ? 1 : 0;
        if (!direction) return;

        const nextIndex = index + direction;
        if (nextIndex < 0 || nextIndex >= this.rendererState.sortState.length) return;
        const state = this.rendererState.sortState;
        [state[index], state[nextIndex]] = [state[nextIndex], state[index]];
        this.renderSortList();
      });

      this.app.querySelector('[data-action="submit-sort"]').addEventListener("click", () => {
        const answer = this.rendererState.sortState.slice();
        const result = this.controller.submitAnswer(this.rendererState.chapterId, this.rendererState.questionIndex, answer);
        if (result.correct) {
          this.app.querySelectorAll("[data-sort-item]").forEach((item) => item.classList.add("is-correct"));
          this.app.querySelector('[data-action="submit-sort"]').disabled = true;
        } else {
          this.showExplanation(result.explanation, () => {
            this.renderQuestion(this.rendererState.chapterId, this.rendererState.questionIndex);
          });
        }
      });
    }

    renderSortList() {
      const list = this.app.querySelector("[data-sort-list]");
      if (!list) return;
      const question = this.controller.questions.getQuestion(this.rendererState.chapterId, this.rendererState.questionIndex);
      list.innerHTML = this.rendererState.sortState.map((optionIndex, orderIndex) => `
        <li class="sort-item" data-sort-item>
          <span class="sort-item__order">${orderIndex + 1}</span>
          <span class="sort-item__text">${escapeHtml(question.options[optionIndex])}</span>
          <span class="sort-item__actions">
            <button class="sort-action" data-sort-up data-sort-index="${orderIndex}" aria-label="上移">▲</button>
            <button class="sort-action" data-sort-down data-sort-index="${orderIndex}" aria-label="下移">▼</button>
          </span>
        </li>
      `).join("");
    }

    bindEssay() {
      const input = this.app.querySelector("[data-essay-input]");
      this.app.querySelector('[data-action="submit-essay"]').addEventListener("click", () => {
        const result = this.controller.submitAnswer(this.rendererState.chapterId, this.rendererState.questionIndex, input.value);
        if (result.correct) {
          input.disabled = true;
          input.classList.add("is-correct");
          const submitBtn = this.app.querySelector('[data-action="submit-essay"]');
          if (submitBtn) submitBtn.disabled = true;
        } else {
          this.showExplanation(result.explanation, () => {
            this.renderQuestion(this.rendererState.chapterId, this.rendererState.questionIndex);
          });
        }
      });
    }

    bindPuzzle(question) {
      this.renderPuzzleBoard();
      this.app.querySelector("[data-puzzle-board]").addEventListener("click", (event) => {
        const tile = event.target.closest("[data-puzzle-index]");
        if (!tile) return;
        const index = Number(tile.dataset.puzzleIndex);
        const state = this.rendererState.puzzleState;
        const emptyIndex = state.indexOf(null);
        if (!this.areAdjacent(index, emptyIndex, question.puzzleSize || 3)) return;

        [state[index], state[emptyIndex]] = [state[emptyIndex], state[index]];
        this.renderPuzzleBoard();

        if (this.isPuzzleSolved(question.puzzleSize || 3)) {
          this.app.querySelectorAll("[data-puzzle-index]").forEach((item) => {
            item.classList.add("is-correct");
            item.disabled = true;
          });
          this.controller.submitAnswer(this.rendererState.chapterId, this.rendererState.questionIndex, { completed: true });
        }
      });
    }

    renderPuzzleBoard() {
      const board = this.app.querySelector("[data-puzzle-board]");
      if (!board) return;
      const size = this.rendererState.puzzleSize || 3;
      board.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
      board.innerHTML = this.rendererState.puzzleState.map((value, index) => `
        <button class="puzzle-tile ${value === null ? "is-empty" : ""}" data-puzzle-index="${index}">${value == null ? "" : value}</button>
      `).join("");
    }

    createPuzzle(size) {
      const length = size * size;
      const state = Array.from({ length }, (_, index) => index + 1);
      state[length - 1] = null;
      let emptyIndex = length - 1;

      for (let move = 0; move < length * 40; move += 1) {
        const neighbors = this.getAdjacentIndexes(emptyIndex, size);
        const target = neighbors[Math.floor(Math.random() * neighbors.length)];
        if (target == null) continue;
        [state[emptyIndex], state[target]] = [state[target], state[emptyIndex]];
        emptyIndex = target;
      }
      return state;
    }

    getAdjacentIndexes(index, size) {
      const row = Math.floor(index / size);
      const col = index % size;
      const neighbors = [];
      if (row > 0) neighbors.push(index - size);
      if (row < size - 1) neighbors.push(index + size);
      if (col > 0) neighbors.push(index - 1);
      if (col < size - 1) neighbors.push(index + 1);
      return neighbors;
    }

    areAdjacent(a, b, size) {
      return this.getAdjacentIndexes(a, size).includes(b);
    }

    isPuzzleSolved(size) {
      const length = size * size;
      return this.rendererState.puzzleState.every((value, index) => {
        if (index === length - 1) return value === null;
        return value === index + 1;
      });
    }

    renderChapterComplete(chapterId) {
      const chapter = this.controller.questions.getChapter(chapterId);
      const badge = this.controller.badges.getBadgeByChapter(chapterId);
      const isLast = Number(chapterId) >= window.GAME_CHAPTERS[window.GAME_CHAPTERS.length - 1].id;
      const hiddenId = "ch" + chapterId + "_extra";
      const hidden = HIDDEN_EXTRAS[hiddenId];
      const hiddenUnlocked = this.controller.isHiddenUnlocked(hiddenId);
      const evidence = (this.controller.getState().evidence || []).slice(-1)[0] || null;

      this.render(`
        <section class="page page-complete">
          <div class="complete-card">
            <div class="complete-card__top">
              <span class="section-kicker">${escapeHtml(chapter.title)}</span>
              <h2 class="section-title">篇章通关</h2>
            </div>
            <div class="badge-unlock">
              <img class="badge-unlock__icon" src="${badge ? badge.icon : ""}" alt="${escapeHtml(badge ? badge.title : "徽章")}">
              <div class="badge-unlock__name">获得徽章</div>
              <div class="badge-unlock__title">${escapeHtml(badge ? badge.title : "徽章")}</div>
              <div class="badge-unlock__desc">${escapeHtml(badge ? badge.description : "")}</div>
            </div>
            ${evidence ? `<div class="evidence-card"><div class="evidence-card__label">获得记忆物证</div><div class="evidence-card__title">${escapeHtml(evidence)}</div></div>` : ``}
            ${hidden ? `
              <div class="easter-card ${hiddenUnlocked ? "is-unlocked" : ""}">
                <div class="easter-card__label">线下展厅彩蛋</div>
                <div class="easter-card__title">${escapeHtml(hidden.title)}</div>
                ${hiddenUnlocked ? `<p class="easter-card__content">${escapeHtml(hidden.content)}</p>` : `<p class="easter-card__content">到馆扫描对应二维码可解锁拓展内容。线上游玩不强制。</p>`}
              </div>
            ` : ""}
            <button class="btn btn-primary btn-block" data-action="next">${isLast ? "进入终章 · 领取证书" : "前往下一篇章"}</button>
            <button class="text-button" data-action="home">返回首页</button>
          </div>
        </section>
      `);

      this.app.querySelector('[data-action="home"]').addEventListener("click", () => this.renderHome());
      this.app.querySelector('[data-action="next"]').addEventListener("click", () => this.controller.goToNextChapter(chapterId));
    }

    renderFinal() {
      const state = this.controller.getState();
      const badges = this.controller.badges.getAllBadges();
      const artifacts = this.controller.collects.getAllArtifacts();
      const achievements = this.controller.achievements.getAllAchievements();
      const certificateName = state.certificateName || "";
      const choices = state.stats && state.stats.choices ? state.stats.choices : { total: 0, correct: 0 };
      const microGames = state.stats && state.stats.microGames ? state.stats.microGames : { total: 0, perfect: 0, passed: 0 };
      const collectedArtifactCount = artifacts.filter((artifact) => this.controller.collects.isCollected(artifact.id)).length;
      const playSeconds = this.controller.progress.getPlayTimeSeconds();
      const timelineCompleted = Boolean(state.timelineCompleted);

      if (!timelineCompleted) {
        this.rendererState.timelineSlots = Array((window.GAME_TIMELINE_EVENTS || []).length).fill(null);
        this.rendererState.timelineRemaining = this.shuffleTimeline((window.GAME_TIMELINE_EVENTS || []).slice());
      } else {
        this.rendererState.timelineSlots = [];
        this.rendererState.timelineRemaining = [];
      }

      this.render(`
        <section class="page page-final">
          <div class="final-hero">
            <p class="section-kicker">终章</p>
            <h2 class="section-title">火种千秋</h2>
            <p class="final-hero__text">英雄虽逝，火种永续。弄染结盟的佳话、陆瑞光重信守义的革命精神，永远留在黔中大地上。</p>
          </div>

          <div class="final-stats">
            <h3 class="subsection-title">研学报告</h3>
            <div class="final-stats__grid">
              <div class="final-stat"><strong>${Number(state.totalScore) || 0}</strong><span>研学总分</span></div>
              <div class="final-stat"><strong>${collectedArtifactCount}/${artifacts.length}</strong><span>物证收集</span></div>
              <div class="final-stat"><strong>${choices.correct}/${choices.total}</strong><span>正确选择</span></div>
              <div class="final-stat"><strong>${microGames.perfect}</strong><span>完美微玩法</span></div>
              <div class="final-stat"><strong>${this.formatDuration(playSeconds)}</strong><span>通关用时</span></div>
            </div>
          </div>

          <div class="artifact-wall">
            <h3 class="subsection-title">物证陈列</h3>
            <div class="artifact-grid">
              ${artifacts.map((artifact) => {
                const unlocked = this.controller.collects.isCollected(artifact.id);
                return `
                  <div class="artifact-card ${unlocked ? "is-unlocked" : "is-locked"}">
                    <div class="artifact-card__icon"><img src="${escapeHtml(artifact.icon)}" alt="${escapeHtml(artifact.name)}"></div>
                    <div class="artifact-card__name">${escapeHtml(artifact.name)}</div>
                    <div class="artifact-card__back">${unlocked ? escapeHtml(artifact.backText) : "尚未收集"}</div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <div class="achievement-wall">
            <h3 class="subsection-title">成就墙</h3>
            <div class="achievement-grid">
              ${achievements.map((achievement) => {
                const unlocked = this.controller.achievements.isUnlocked(achievement.id);
                return `
                  <div class="achievement-card ${unlocked ? "is-unlocked" : "is-locked"}">
                    <img src="${escapeHtml(achievement.icon)}" alt="${escapeHtml(achievement.name)}">
                    <div class="achievement-card__name">${escapeHtml(achievement.name)}</div>
                    <div class="achievement-card__desc">${unlocked ? escapeHtml(achievement.description) : "尚未解锁"}</div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <div class="timeline-box">
            <h3 class="subsection-title">时间线终章拼图</h3>
            <p class="timeline-box__hint">${timelineCompleted ? "你已复原陆瑞光的人生时间线。" : "点击下方事件按先后顺序入列，点击已填序号可取出重排。"}</p>
            <div class="timeline-puzzle ${timelineCompleted ? "is-complete" : ""}" data-timeline-puzzle>
              ${this.renderTimelinePuzzleHtml(timelineCompleted)}
            </div>
          </div>

          <div class="badge-wall">
            <h3 class="subsection-title">徽章合集</h3>
            <div class="badge-grid">
              ${badges.map((badge) => {
                const unlocked = this.controller.progress.isBadgeUnlocked(badge.id);
                return `
                  <div class="badge-card ${unlocked ? "is-unlocked" : "is-locked"}">
                    <img src="${badge.icon}" alt="${escapeHtml(badge.title)}">
                    <div class="badge-card__name">${escapeHtml(badge.title)}</div>
                    <div class="badge-card__desc">${unlocked ? escapeHtml(badge.description) : "尚未解锁"}</div>
                  </div>
                `;
              }).join("")}
            </div>
          </div>

          <div class="certificate-box">
            <h3 class="subsection-title">研学电子证书</h3>
            <label class="field-label" for="certificate-name">请输入姓名</label>
            <input class="text-input" id="certificate-name" type="text" maxlength="20" placeholder="例如：张三" value="${escapeHtml(certificateName)}">
            <button class="btn btn-primary btn-block" data-action="generate-certificate">生成研学证书</button>
            <div class="certificate-preview" data-certificate-preview></div>
            <button class="btn btn-ghost btn-block is-hidden" data-action="save-certificate">保存证书图片</button>
          </div>
          <button class="text-button" data-action="home">返回首页</button>
          <button class="text-button" data-action="reset">重置进度，重新寻访</button>
        </section>
      `);

      this.bindTimelinePuzzle();

      this.app.querySelector('[data-action="generate-certificate"]').addEventListener("click", () => {
        const name = this.app.querySelector("#certificate-name").value.trim();
        if (!name) {
          this.showToast("请先输入姓名");
          return;
        }
        this.controller.setCertificateName(name);
        this.renderCertificate(name);
        this.controller.certificateGenerated();
      });

      this.app.querySelector('[data-action="save-certificate"]').addEventListener("click", () => {
        this.saveCertificate();
      });

      this.app.querySelector('[data-action="home"]').addEventListener("click", () => this.renderHome());
      this.app.querySelector('[data-action="reset"]').addEventListener("click", () => this.confirmReset());
    }

    renderTimelinePuzzleHtml(completed) {
      const events = (window.GAME_TIMELINE_EVENTS || []).slice().sort((a, b) => Number(a.order) - Number(b.order));
      if (completed) {
        return `
          <div class="timeline-success">时间线已复原，英雄足迹清晰呈现。</div>
          <ol class="timeline-list">
            ${events.map((event, index) => `<li><span>${index + 1}</span>${escapeHtml(event.label)}</li>`).join("")}
          </ol>
        `;
      }

      const slots = this.rendererState.timelineSlots || [];
      const remaining = this.rendererState.timelineRemaining || [];
      return `
        <div class="timeline-slots">
          ${slots.map((event, index) => `
            <button class="timeline-slot ${event ? "is-filled" : ""}" data-timeline-slot="${index}">
              <span class="timeline-slot__index">${index + 1}</span>
              ${event ? `<strong>${escapeHtml(event.label)}</strong>` : `<span class="timeline-slot__empty">点击置入</span>`}
            </button>
          `).join("")}
        </div>
        <div class="timeline-chips">
          ${remaining.length ? remaining.map((event) => `<button class="timeline-chip" data-timeline-item="${escapeHtml(event.id)}">${escapeHtml(event.label)}</button>`).join("") : `<div class="timeline-chips__empty">事件已全部入列，请校验顺序。</div>`}
        </div>
        <button class="btn btn-ghost btn-block" data-action="check-timeline">校验时间线</button>
      `;
    }

    bindTimelinePuzzle() {
      const puzzle = this.app.querySelector("[data-timeline-puzzle]");
      if (!puzzle || this.controller.getState().timelineCompleted) return;

      puzzle.querySelectorAll("[data-timeline-item]").forEach((button) => {
        button.addEventListener("click", () => this.placeTimelineItem(button.dataset.timelineItem));
      });
      puzzle.querySelectorAll("[data-timeline-slot]").forEach((slot) => {
        slot.addEventListener("click", () => this.clearTimelineSlot(Number(slot.dataset.timelineSlot)));
      });
      const check = puzzle.querySelector('[data-action="check-timeline"]');
      if (check) check.addEventListener("click", () => this.checkTimeline());
    }

    placeTimelineItem(itemId) {
      if (!this.rendererState.timelineSlots) return;
      const remaining = this.rendererState.timelineRemaining || [];
      const itemIndex = remaining.findIndex((event) => event.id === itemId);
      if (itemIndex < 0) return;

      const emptyIndex = this.rendererState.timelineSlots.findIndex((event) => !event);
      if (emptyIndex < 0) {
        this.showToast("请先取出一个已填序号");
        return;
      }

      this.rendererState.timelineSlots[emptyIndex] = remaining.splice(itemIndex, 1)[0];
      this.refreshTimelinePuzzle();
    }

    clearTimelineSlot(slotIndex) {
      const event = this.rendererState.timelineSlots[slotIndex];
      if (!event) return;
      this.rendererState.timelineSlots[slotIndex] = null;
      this.rendererState.timelineRemaining.push(event);
      this.refreshTimelinePuzzle();
    }

    checkTimeline() {
      const slots = this.rendererState.timelineSlots || [];
      const events = (window.GAME_TIMELINE_EVENTS || []).slice().sort((a, b) => Number(a.order) - Number(b.order));
      if (slots.length !== events.length || slots.some((event) => !event)) {
        this.showToast("请先将全部事件按顺序入列");
        return;
      }
      const correct = events.every((event, index) => slots[index].id === event.id);
      if (!correct) {
        this.showToast("顺序还不正确，再想想历史时间线");
        return;
      }
      this.controller.markTimelineCompleted();
      this.showToast("时间线复原成功");
      this.refreshTimelinePuzzle(true);
    }

    refreshTimelinePuzzle(completed) {
      const puzzle = this.app.querySelector("[data-timeline-puzzle]");
      if (!puzzle) return;
      const isCompleted = completed === true || this.controller.getState().timelineCompleted;
      puzzle.classList.toggle("is-complete", isCompleted);
      puzzle.innerHTML = this.renderTimelinePuzzleHtml(isCompleted);
      this.bindTimelinePuzzle();
    }

    formatDuration(seconds) {
      const totalSeconds = Math.max(0, Number(seconds) || 0);
      const minutes = Math.floor(totalSeconds / 60);
      const restSeconds = totalSeconds % 60;
      if (minutes > 0) return minutes + "分" + restSeconds + "秒";
      return restSeconds + "秒";
    }

    shuffleTimeline(items) {
      const list = items.slice();
      for (let i = list.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [list[i], list[j]] = [list[j], list[i]];
      }
      return list;
    }

    renderCertificate(name) {
      const preview = this.app.querySelector("[data-certificate-preview]");
      if (!preview) return;
      preview.innerHTML = "";
      const canvas = window.CertificateRenderer.renderCertificate(name, this.controller.getState());
      if (!canvas) {
        this.showToast("当前浏览器不支持证书生成");
        return;
      }
      preview.appendChild(canvas);
      this.lastCertificateCanvas = canvas;
      const saveBtn = this.app.querySelector('[data-action="save-certificate"]');
      if (saveBtn) saveBtn.classList.remove("is-hidden");
    }

    saveCertificate() {
      if (!this.lastCertificateCanvas) return;
      window.CertificateRenderer.saveCertificate(this.lastCertificateCanvas, this.controller.getState().certificateName);
    }

    showExplanation(text, onClose) {
      this.renderModal(`
        <div class="modal">
          <div class="modal__panel">
            <p class="section-kicker">史料解析</p>
            <h3 class="modal__title">边玩边学</h3>
            <p class="modal__text">${escapeHtml(text)}</p>
            <button class="btn btn-primary" data-action="close-explanation">我知道了</button>
          </div>
        </div>
      `);
      document.querySelector('[data-action="close-explanation"]').addEventListener("click", () => {
        const modal = document.querySelector(".modal");
        if (modal) modal.remove();
        if (typeof onClose === "function") onClose();
      });
    }

    renderModal(html) {
      const existing = document.querySelector(".modal");
      if (existing) existing.remove();
      const wrapper = document.createElement("div");
      wrapper.innerHTML = html;
      document.body.appendChild(wrapper.firstElementChild);
    }

    confirmReset() {
      this.renderModal(`
        <div class="modal">
          <div class="modal__panel">
            <h3 class="modal__title">确认重新开始？</h3>
            <p class="modal__text">当前进度与已收集徽章将被清空。</p>
            <div class="modal__actions">
              <button class="btn btn-ghost" data-action="cancel-reset">取消</button>
              <button class="btn btn-primary" data-action="confirm-reset">确认重置</button>
            </div>
          </div>
        </div>
      `);
      document.querySelector('[data-action="cancel-reset"]').addEventListener("click", () => {
        const modal = document.querySelector(".modal");
        if (modal) modal.remove();
      });
      document.querySelector('[data-action="confirm-reset"]').addEventListener("click", () => {
        const modal = document.querySelector(".modal");
        if (modal) modal.remove();
        this.controller.resetProgress();
      });
    }

    showToast(message) {
      const existing = document.querySelector(".toast");
      if (existing) existing.remove();
      const toast = document.createElement("div");
      toast.className = "toast";
      toast.textContent = message;
      document.body.appendChild(toast);
      window.setTimeout(() => toast.remove(), 1800);
    }

    disableOptions() {
      this.app.querySelectorAll("[data-option-index], [data-check-index]").forEach((button) => {
        button.disabled = true;
      });
    }

    getTypeLabel(type) {
      const labels = {
        single: "单选题",
        multiple: "多选题",
        fill: "填空题",
        sort: "时间排序题",
        image: "史料识图题",
        scene: "情景思辨题",
        essay: "简答感悟题",
        puzzle: "场景拼图题"
      };
      return labels[type] || "闯关题";
    }
  }

  return PageRenderer;
})();