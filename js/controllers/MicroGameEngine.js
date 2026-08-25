window.MicroGameEngine = (function () {
  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function shuffle(items) {
    const copy = items.slice();
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = copy[i];
      copy[i] = copy[j];
      copy[j] = temp;
    }
    return copy;
  }

  class MicroGameEngine {
    constructor(config, root, options) {
      this.config = config;
      this.root = root;
      this.onComplete = options.onComplete || function () {};
      this.onExit = options.onExit || function () {};
      this.timers = [];
      this.rafId = null;
      this.state = {};
      this.items = [];
      this.slots = [];
      this.failedOnce = false;
    }

    start() {
      this.renderShell();
      this.run();
    }

    renderShell() {
      this.root.innerHTML = `
        <div class="microgame">
          <div class="microgame__header">
            <h3 class="microgame__title">${escapeHtml(this.config.title || "微玩法")}</h3>
            <p class="microgame__instruction">${escapeHtml(this.config.instruction || "")}</p>
          </div>
          <div class="microgame__stage" data-microgame-stage></div>
        </div>
      `;
      this.stage = this.root.querySelector("[data-microgame-stage]");
    }

    run() {
      switch (this.config.type) {
        case "sort":
        case "match":
          this.runAssignment();
          break;
        case "balance":
          this.runBalance();
          break;
        case "search":
          this.runSearch();
          break;
        case "rhythm":
          this.runRhythm();
          break;
        case "puzzle":
          this.runPuzzle();
          break;
        case "reaction":
          this.runReaction();
          break;
        case "hold":
          this.runHold();
          break;
        case "spread":
          this.runSpread();
          break;
        default:
          this.complete({ success: true, type: this.config.type });
      }
    }

    addTimer(fn, delay) {
      const timer = setTimeout(fn, delay);
      this.timers.push(timer);
      return timer;
    }

    addInterval(fn, interval) {
      const timer = setInterval(fn, interval);
      this.timers.push(timer);
      return timer;
    }

    cleanup() {
      this.timers.forEach((timer) => {
        clearTimeout(timer);
        clearInterval(timer);
      });
      this.timers = [];
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    }

    destroy() {
      this.cleanup();
    }

    complete(result) {
      this.cleanup();
      const status = this.failedOnce ? "passed" : "perfect";
      this.onComplete(Object.assign({ success: true, type: this.config.type, status: status }, result || {}));
    }

    fail(message) {
      this.failedOnce = true;
      this.cleanup();
      this.stage.innerHTML = `
        <div class="microgame-result microgame-result--fail">
          <p>${escapeHtml(message || "再试一次。")}</p>
          <button class="btn btn-primary" data-action="micro-retry">重新挑战</button>
        </div>
      `;
      this.stage.querySelector('[data-action="micro-retry"]').addEventListener("click", () => this.start());
    }

    runAssignment() {
      const config = this.config;
      this.items = config.items.map((item) => {
        if (typeof item === "string") {
          const slot = (config.slots || []).find((entry) => entry.answer === item);
          return { id: item, label: item, slot: slot ? slot.id : null };
        }
        return { id: item.id || item.label, label: item.label, slot: item.slot };
      });
      this.slots = (config.slots || []).map((slot) => {
        const capacity = this.items.filter((item) => item.slot === slot.id).length;
        return { id: slot.id, label: slot.label, capacity: capacity };
      });
      this.state.selectedItem = null;
      this.state.assigned = {};
      this.renderAssignment();
    }

    renderAssignment() {
      const config = this.config;
      const availableItems = shuffle(this.items.filter((item) => {
        const assignedIds = Object.values(this.state.assigned).reduce((all, ids) => all.concat(ids), []);
        return !assignedIds.includes(item.id);
      }));

      this.stage.innerHTML = `
        <div class="assignment">
          <div class="assignment__items">
            ${availableItems.map((item) => `
              <button class="assignment__item" data-item-id="${escapeHtml(item.id)}">${escapeHtml(item.label)}</button>
            `).join("")}
          </div>
          <div class="assignment__slots">
            ${this.slots.map((slot) => {
              const assignedIds = this.state.assigned[slot.id] || [];
              const assignedLabels = assignedIds.map((id) => {
                const item = this.items.find((entry) => entry.id === id);
                return item ? item.label : id;
              });
              return `
                <button class="assignment__slot ${assignedIds.length ? "is-filled" : ""}" data-slot-id="${escapeHtml(slot.id)}">
                  <span class="assignment__slot-label">${escapeHtml(slot.label)}</span>
                  <span class="assignment__slot-value">${escapeHtml(assignedIds.length ? assignedLabels.join("、") : "点击放入")}</span>
                </button>
              `;
            }).join("")}
          </div>
          <div class="assignment__hint">${escapeHtml(config.hint || "先选择碎片，再点击目标位置。")}</div>
        </div>
      `;

      this.stage.querySelectorAll("[data-item-id]").forEach((button) => {
        button.addEventListener("click", () => {
          this.stage.querySelectorAll("[data-item-id]").forEach((item) => item.classList.remove("is-selected"));
          button.classList.add("is-selected");
          this.state.selectedItem = button.dataset.itemId;
        });
      });

      this.stage.querySelectorAll("[data-slot-id]").forEach((button) => {
        button.addEventListener("click", () => {
          const slotId = button.dataset.slotId;
          const selected = this.state.selectedItem;
          if (!selected) return;

          const slot = this.slots.find((entry) => entry.id === slotId);
          const assignedIds = this.state.assigned[slotId] || [];
          if (slot && assignedIds.length >= slot.capacity) {
            const hint = this.stage.querySelector(".assignment__hint");
            if (hint) hint.textContent = "该位置已放满，请选择其他位置。";
            return;
          }

          assignedIds.push(selected);
          this.state.assigned[slotId] = assignedIds;
          this.state.selectedItem = null;

          const assignedCount = Object.values(this.state.assigned).reduce((total, ids) => total + ids.length, 0);
          if (assignedCount === this.items.length) {
            this.checkAssignment();
          } else {
            this.renderAssignment();
          }
        });
      });
    }

    checkAssignment() {
      const allCorrect = this.items.every((item) => {
        const slotIds = this.state.assigned[item.slot] || [];
        return slotIds.includes(item.id);
      });

      if (allCorrect) {
        this.stage.innerHTML = `<div class="microgame-result microgame-result--success">${escapeHtml(this.config.completeText || "整理完成。")}</div>`;
        this.addTimer(() => this.complete({ success: true, type: this.config.type }), 900);
      } else {
        this.stage.innerHTML = `<div class="microgame-result microgame-result--fail">位置有误，再整理一次。</div>`;
        this.addTimer(() => this.runAssignment(), 800);
      }
    }

    runBalance() {
      const config = this.config;
      this.state.clicks = 0;
      this.stage.innerHTML = `
        <div class="balance">
          <div class="balance__visual ${this.state.clicks >= config.targetClicks ? "is-balanced" : ""}">
            <div class="balance__beam"></div>
            <div class="balance__pillar"></div>
          </div>
          <div class="balance__labels">
            <span>${escapeHtml(config.leftLabel || "压迫")}</span>
            <span>${escapeHtml(config.rightLabel || "生计")}</span>
          </div>
          <div class="balance__progress"><div class="balance__progress-bar" data-balance-bar></div></div>
          <button class="btn btn-primary btn-block" data-action="balance-click">反抗压迫</button>
        </div>
      `;
      this.updateBalance();
      this.stage.querySelector('[data-action="balance-click"]').addEventListener("click", () => {
        this.state.clicks += 1;
        this.updateBalance();
        if (this.state.clicks >= config.targetClicks) {
          this.stage.innerHTML = `<div class="microgame-result microgame-result--success">${escapeHtml(config.completeText || "天平回正。")}</div>`;
          this.addTimer(() => this.complete({ success: true, type: "balance" }), 900);
        }
      });
    }

    updateBalance() {
      const bar = this.stage.querySelector("[data-balance-bar]");
      const visual = this.stage.querySelector(".balance__visual");
      if (bar) {
        const percent = Math.min(100, this.state.clicks / this.config.targetClicks * 100);
        bar.style.width = percent + "%";
      }
      if (visual) {
        visual.classList.toggle("is-balanced", this.state.clicks >= this.config.targetClicks);
      }
    }

    runSearch() {
      const config = this.config;
      this.state.found = [];
      this.state.timeLeft = config.timeLimit || 20;
      const mixed = shuffle(config.targets.concat(config.distractors || []));

      this.stage.innerHTML = `
        <div class="search">
          <div class="search__timer">剩余时间：<strong data-search-time>${this.state.timeLeft}</strong> 秒</div>
          <div class="search__grid">
            ${mixed.map((item) => `
              <button class="search__item" data-search-item="${escapeHtml(item)}">${escapeHtml(item)}</button>
            `).join("")}
          </div>
          <div class="search__hint">${escapeHtml(config.hint || "")}</div>
        </div>
      `;

      const tick = this.addInterval(() => {
        this.state.timeLeft -= 1;
        const timeNode = this.stage.querySelector("[data-search-time]");
        if (timeNode) timeNode.textContent = this.state.timeLeft;
        if (this.state.timeLeft <= 0) {
          this.fail("时间到了，再观察一次。");
        }
      }, 1000);

      this.stage.querySelectorAll("[data-search-item]").forEach((button) => {
        button.addEventListener("click", () => {
          const value = button.dataset.searchItem;
          if (this.state.found.includes(value)) return;
          if (config.targets.includes(value)) {
            this.state.found.push(value);
            button.classList.add("is-target");
            button.disabled = true;
            if (this.state.found.length === config.targets.length) {
              clearInterval(tick);
              this.stage.innerHTML = `<div class="microgame-result microgame-result--success">你发现了红军的纪律与初心。</div>`;
              this.addTimer(() => this.complete({ success: true, type: "search" }), 900);
            }
          } else {
            button.classList.add("is-distractor");
            button.disabled = true;
          }
        });
      });
    }

    runRhythm() {
      const config = this.config;
      this.state.hits = 0;
      this.state.dotX = 0;
      this.state.direction = 1;
      this.state.speed = 0.012;

      this.stage.innerHTML = `
        <div class="rhythm">
          <div class="rhythm__count">已命中：<strong>${this.state.hits}</strong> / ${config.requiredHits}</div>
          <div class="rhythm__track">
            <div class="rhythm__zone"></div>
            <div class="rhythm__dot" data-rhythm-dot></div>
          </div>
          <button class="btn btn-primary btn-block" data-action="rhythm-hit">敲击</button>
        </div>
      `;

      const dot = this.stage.querySelector("[data-rhythm-dot]");
      const countNode = this.stage.querySelector(".rhythm__count strong");

      const frame = () => {
        this.state.dotX += this.state.speed * this.state.direction;
        if (this.state.dotX >= 1) {
          this.state.dotX = 1;
          this.state.direction = -1;
        } else if (this.state.dotX <= 0) {
          this.state.dotX = 0;
          this.state.direction = 1;
        }
        dot.style.left = (this.state.dotX * 100) + "%";
        this.rafId = requestAnimationFrame(frame);
      };
      this.rafId = requestAnimationFrame(frame);

      this.stage.querySelector('[data-action="rhythm-hit"]').addEventListener("click", () => {
        const distance = Math.abs(this.state.dotX - 0.5);
        if (distance < 0.13) {
          this.state.hits += 1;
          countNode.textContent = this.state.hits;
          dot.classList.add("is-hit");
          this.addTimer(() => dot.classList.remove("is-hit"), 160);
          if (this.state.hits >= config.requiredHits) {
            this.cleanup();
            this.stage.innerHTML = `<div class="microgame-result microgame-result--success">${escapeHtml(config.completeText || "命中完成。")}</div>`;
            this.addTimer(() => this.complete({ success: true, type: "rhythm" }), 900);
          }
        }
      });
    }

    runPuzzle() {
      const size = this.config.puzzleSize || 3;
      const length = size * size;
      const state = Array.from({ length }, (_, index) => index + 1);
      state[length - 1] = null;
      let emptyIndex = length - 1;

      for (let move = 0; move < length * 30; move += 1) {
        const neighbors = this.getNeighbors(emptyIndex, size);
        const target = neighbors[Math.floor(Math.random() * neighbors.length)];
        if (target == null) continue;
        const temp = state[emptyIndex];
        state[emptyIndex] = state[target];
        state[target] = temp;
        emptyIndex = target;
      }

      this.state.puzzleState = state;
      this.state.puzzleSize = size;
      this.renderPuzzle();
    }

    renderPuzzle() {
      const size = this.state.puzzleSize;
      const state = this.state.puzzleState;
      this.stage.innerHTML = `
        <div class="micro-puzzle" style="grid-template-columns:repeat(${size},1fr)">
          ${state.map((value, index) => `
            <button class="micro-puzzle__tile ${value === null ? "is-empty" : ""}" data-puzzle-index="${index}">${value == null ? "" : value}</button>
          `).join("")}
        </div>
      `;

      this.stage.querySelectorAll("[data-puzzle-index]").forEach((button) => {
        button.addEventListener("click", () => {
          const index = Number(button.dataset.puzzleIndex);
          const emptyIndex = state.indexOf(null);
          if (!this.getNeighbors(emptyIndex, size).includes(index)) return;

          const temp = state[emptyIndex];
          state[emptyIndex] = state[index];
          state[index] = temp;

          if (this.isPuzzleSolved()) {
            this.stage.innerHTML = `<div class="microgame-result microgame-result--success">${escapeHtml(this.config.completeText || "拼图完成。")}</div>`;
            this.addTimer(() => this.complete({ success: true, type: "puzzle" }), 900);
          } else {
            this.renderPuzzle();
          }
        });
      });
    }

    getNeighbors(index, size) {
      const row = Math.floor(index / size);
      const col = index % size;
      const neighbors = [];
      if (row > 0) neighbors.push(index - size);
      if (row < size - 1) neighbors.push(index + size);
      if (col > 0) neighbors.push(index - 1);
      if (col < size - 1) neighbors.push(index + 1);
      return neighbors;
    }

    isPuzzleSolved() {
      const state = this.state.puzzleState;
      return state.every((value, index) => {
        if (index === state.length - 1) return value === null;
        return value === index + 1;
      });
    }

    runReaction() {
      const config = this.config;
      this.state.hidden = 0;
      this.state.used = [];
      this.state.timeLeft = config.timeLimit || 30;
      const slots = Array.from({ length: config.woundedCount || 12 }, (_, index) => index + 1);

      this.stage.innerHTML = `
        <div class="reaction">
          <div class="reaction__timer">剩余时间：<strong data-reaction-time>${this.state.timeLeft}</strong> 秒</div>
          <div class="reaction__count">已掩护：<strong data-reaction-count>${this.state.hidden}</strong> / ${config.woundedCount}</div>
          <div class="reaction__grid">
            ${slots.map((slot, index) => `
              <button class="reaction__slot" data-slot-index="${index}">
                <span class="reaction__slot-num">${slot}</span>
                <span class="reaction__slot-text">可藏匿</span>
              </button>
            `).join("")}
          </div>
        </div>
      `;

      const tick = this.addInterval(() => {
        this.state.timeLeft -= 1;
        const timeNode = this.stage.querySelector("[data-reaction-time]");
        if (timeNode) timeNode.textContent = this.state.timeLeft;
        if (this.state.timeLeft <= 0) {
          this.fail("敌人逼近，重新安排掩护。");
        }
      }, 1000);

      this.stage.querySelectorAll("[data-slot-index]").forEach((button) => {
        button.addEventListener("click", () => {
          const index = Number(button.dataset.slotIndex);
          if (this.state.used.includes(index)) return;
          this.state.used.push(index);
          this.state.hidden += 1;
          button.classList.add("is-used");
          button.querySelector(".reaction__slot-text").textContent = "已藏入";
          const countNode = this.stage.querySelector("[data-reaction-count]");
          if (countNode) countNode.textContent = this.state.hidden;

          if (this.state.hidden >= config.woundedCount) {
            clearInterval(tick);
            this.stage.innerHTML = `<div class="microgame-result microgame-result--success">${escapeHtml(config.completeText || "伤员已安全隐藏。")}</div>`;
            this.addTimer(() => this.complete({ success: true, type: "reaction" }), 900);
          }
        });
      });
    }

    runHold() {
      const config = this.config;
      this.state.holdProgress = 0;
      this.state.holding = false;

      this.stage.innerHTML = `
        <div class="hold-game">
          <div class="hold-game__progress"><div class="hold-game__bar" data-hold-bar></div></div>
          <button class="hold-game__button" data-hold-button>按住坚守</button>
          <p class="hold-game__tip">按住不放，坚持 ${config.holdSeconds} 秒</p>
        </div>
      `;

      const button = this.stage.querySelector("[data-hold-button]");
      const bar = this.stage.querySelector("[data-hold-bar]");
      let interval = null;

      const startHold = (event) => {
        event.preventDefault();
        if (this.state.holding) return;
        this.state.holding = true;
        button.classList.add("is-holding");
        interval = setInterval(() => {
          this.timers.push(interval);
          this.state.holdProgress += 0.1;
          bar.style.width = Math.min(100, this.state.holdProgress / config.holdSeconds * 100) + "%";
          if (this.state.holdProgress >= config.holdSeconds) {
            clearInterval(interval);
            this.stage.innerHTML = `<div class="microgame-result microgame-result--success">${escapeHtml(config.completeText || "坚守完成。")}</div>`;
            this.addTimer(() => this.complete({ success: true, type: "hold" }), 900);
          }
        }, 100);
      };

      const stopHold = () => {
        if (!this.state.holding) return;
        this.state.holding = false;
        this.state.holdProgress = 0;
        if (interval) clearInterval(interval);
        bar.style.width = "0%";
        button.classList.remove("is-holding");
      };

      button.addEventListener("pointerdown", startHold);
      button.addEventListener("pointerup", stopHold);
      button.addEventListener("pointerleave", stopHold);
      button.addEventListener("contextmenu", (event) => event.preventDefault());
    }

    runSpread() {
      const config = this.config;
      this.state.phase = 1;
      this.state.kindleClicks = 0;
      this.state.holdProgress = 0;
      this.state.spreadDone = 0;
      this.renderSpreadPhase();
    }

    renderSpreadPhase() {
      const config = this.config;
      if (this.state.phase === 1) {
        this.stage.innerHTML = `
          <div class="spread-game">
            <div class="spread-game__label">阶段① 引火</div>
            <div class="spread-game__progress"><div class="spread-game__bar" data-spread-bar></div></div>
            <button class="btn btn-primary btn-block" data-action="spread-kindle">钻木取火</button>
          </div>
        `;
        const bar = this.stage.querySelector("[data-spread-bar]");
        this.stage.querySelector('[data-action="spread-kindle"]').addEventListener("click", () => {
          this.state.kindleClicks += 1;
          bar.style.width = Math.min(100, this.state.kindleClicks / config.kindleClicks * 100) + "%";
          if (this.state.kindleClicks >= config.kindleClicks) {
            this.state.phase = 2;
            this.state.holdProgress = 0;
            this.renderSpreadPhase();
          }
        });
      } else if (this.state.phase === 2) {
        this.stage.innerHTML = `
          <div class="spread-game">
            <div class="spread-game__label">阶段② 护火</div>
            <div class="spread-game__progress"><div class="spread-game__bar" data-spread-bar></div></div>
            <button class="hold-game__button" data-spread-hold>按住护火</button>
          </div>
        `;
        const bar = this.stage.querySelector("[data-spread-bar]");
        const button = this.stage.querySelector("[data-spread-hold]");
        let interval = null;

        button.addEventListener("pointerdown", (event) => {
          event.preventDefault();
          this.state.holding = true;
          interval = setInterval(() => {
            this.state.holdProgress += 0.1;
            bar.style.width = Math.min(100, this.state.holdProgress / config.holdSeconds * 100) + "%";
            if (this.state.holdProgress >= config.holdSeconds) {
              clearInterval(interval);
              this.state.phase = 3;
              this.state.spreadDone = 0;
              this.renderSpreadPhase();
            }
          }, 100);
        });
        button.addEventListener("pointerup", () => {
          this.state.holding = false;
          if (interval) clearInterval(interval);
        });
        button.addEventListener("pointerleave", () => {
          this.state.holding = false;
          if (interval) clearInterval(interval);
        });
      } else {
        this.stage.innerHTML = `
          <div class="spread-game">
            <div class="spread-game__label">阶段③ 燎原</div>
            <div class="spread-game__grid">
              ${Array.from({ length: config.spreadCount }, (_, index) => `
                <button class="spread-game__spark" data-spark-index="${index}">${index + 1}</button>
              `).join("")}
            </div>
          </div>
        `;
        this.stage.querySelectorAll("[data-spark-index]").forEach((button) => {
          button.addEventListener("click", () => {
            if (button.classList.contains("is-lit")) return;
            button.classList.add("is-lit");
            button.textContent = "🔥";
            this.state.spreadDone += 1;
            if (this.state.spreadDone >= config.spreadCount) {
              this.stage.innerHTML = `<div class="microgame-result microgame-result--success">${escapeHtml(config.completeText || "星星之火，可以燎原。")}</div>`;
              this.addTimer(() => this.complete({ success: true, type: "spread" }), 900);
            }
          });
        });
      }
    }
  }

  return MicroGameEngine;
})();
