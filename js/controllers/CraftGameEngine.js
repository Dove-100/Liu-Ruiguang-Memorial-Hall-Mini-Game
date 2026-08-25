window.CraftGameEngine = (function () {
  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  class CraftGameEngine {
    constructor(config, root, options) {
      this.config = config;
      this.root = root;
      this.onComplete = options.onComplete || function () {};
      this.onExit = options.onExit || function () {};
      this.stepIndex = 0;
      this.used = new Set();
      this.selected = null;
      this.dragging = null;
      this.failedOnce = false;
      this.timers = [];
      this.completed = false;
      this.boundMove = (event) => this.handleMove(event);
      this.boundUp = (event) => this.handleUp(event);
    }

    start() {
      this.render();
    }

    getCurrentStep() {
      return this.config.steps[this.stepIndex] || null;
    }

    render() {
      const config = this.config;
      const current = this.getCurrentStep();

      this.root.innerHTML = `
        <div class="craft">
          <div class="craft__header">
            <div class="collect__title">${escapeHtml(config.title)}</div>
            <div class="collect__count">${escapeHtml(config.instruction)}</div>
          </div>
          <div class="craft__progress">
            ${config.steps.map((step, index) => `
              <div class="craft__step ${index < this.stepIndex ? "is-done" : index === this.stepIndex ? "is-current" : ""}">
                ${index + 1}
              </div>
            `).join("")}
          </div>
          <div class="craft__current" data-craft-current>${escapeHtml(current ? current.label : "")}</div>
          <div class="craft__drop" data-craft-drop>
            <span class="craft__drop-icon">＋</span>
            <span data-craft-drop-text>${escapeHtml(current ? current.dropLabel : "")}</span>
          </div>
          <div class="craft__materials">
            ${config.steps.map((step) => `
              <button
                class="craft__material ${this.used.has(step.materialId) ? "is-used" : this.selected && this.selected.materialId === step.materialId ? "is-selected" : ""}"
                data-material-id="${escapeHtml(step.materialId)}"
              >
                ${step.materialImage ? `<img class="craft__material-icon-img" src="${escapeHtml(step.materialImage)}" alt="${escapeHtml(step.materialLabel)}">` : `<span class="craft__material-icon">${step.materialIcon}</span>`}
                <span>${escapeHtml(step.materialLabel)}</span>
              </button>
            `).join("")}
          </div>
          <p class="collect__hint" data-craft-hint>把正确材料拖入上方制作区，也可点击材料后再点击制作区。</p>
        </div>
      `;

      this.drop = this.root.querySelector("[data-craft-drop]");
      this.hint = this.root.querySelector("[data-craft-hint]");

      this.root.querySelectorAll("[data-material-id]").forEach((button) => {
        const step = config.steps.find((item) => item.materialId === button.dataset.materialId);
        if (!step) return;
        button.addEventListener("pointerdown", (event) => this.startDrag(step, button, event));
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          this.selectMaterial(step);
        });
      });

      this.drop.addEventListener("click", (event) => {
        event.stopPropagation();
        if (this.selected) this.tryDrop(this.selected);
      });
    }

    selectMaterial(step) {
      if (this.used.has(step.materialId)) return;
      this.selected = step;
      this.root.querySelectorAll("[data-material-id]").forEach((button) => {
        const isSelected = button.dataset.materialId === step.materialId;
        button.classList.toggle("is-selected", isSelected);
      });
    }

    startDrag(step, button, event) {
      if (this.used.has(step.materialId)) return;
      event.preventDefault();
      this.selectMaterial(step);

      const ghost = document.createElement("div");
      ghost.className = "craft__ghost";
      ghost.innerHTML = step.materialImage
        ? `<img class="craft__ghost-img" src="${escapeHtml(step.materialImage)}" alt="${escapeHtml(step.materialLabel)}">`
        : escapeHtml(step.materialIcon);
      ghost.style.left = event.clientX + "px";
      ghost.style.top = event.clientY + "px";
      document.body.appendChild(ghost);

      this.dragging = {
        step: step,
        ghost: ghost,
        startX: event.clientX,
        startY: event.clientY,
        moved: false
      };

      document.addEventListener("pointermove", this.boundMove);
      document.addEventListener("pointerup", this.boundUp);
    }

    handleMove(event) {
      if (!this.dragging) return;
      const drag = this.dragging;
      const dx = event.clientX - drag.startX;
      const dy = event.clientY - drag.startY;
      if (Math.abs(dx) > 5 || Math.abs(dy) > 5) drag.moved = true;
      drag.ghost.style.left = event.clientX + "px";
      drag.ghost.style.top = event.clientY + "px";
    }

    handleUp(event) {
      if (!this.dragging) return;
      const drag = this.dragging;
      this.dragging = null;
      document.removeEventListener("pointermove", this.boundMove);
      document.removeEventListener("pointerup", this.boundUp);
      if (drag.ghost && drag.ghost.parentNode) drag.ghost.parentNode.removeChild(drag.ghost);

      if (drag.moved) {
        const dropRect = this.drop && this.drop.getBoundingClientRect();
        const overDrop = dropRect &&
          event.clientX >= dropRect.left &&
          event.clientX <= dropRect.right &&
          event.clientY >= dropRect.top &&
          event.clientY <= dropRect.bottom;
        if (overDrop) this.tryDrop(drag.step);
      }
    }

    tryDrop(step) {
      if (this.completed || this.used.has(step.materialId)) return;
      const current = this.getCurrentStep();
      if (!current || step.materialId !== current.materialId) {
        this.failedOnce = true;
        this.drop.classList.add("is-wrong");
        if (this.hint) this.hint.textContent = "材料顺序不对，先完成当前步骤。";
        const timer = setTimeout(() => {
          if (this.drop) this.drop.classList.remove("is-wrong");
          if (this.hint) this.hint.textContent = "把正确材料拖入上方制作区，也可点击材料后再点击制作区。";
        }, 750);
        this.timers.push(timer);
        return;
      }

      this.used.add(step.materialId);
      this.selected = null;
      this.drop.classList.add("is-success");
      if (this.hint) this.hint.textContent = "完成：" + current.label;

      const timer = setTimeout(() => {
        if (this.stepIndex >= this.config.steps.length - 1) {
          this.complete();
        } else {
          this.stepIndex += 1;
          this.render();
        }
      }, 480);
      this.timers.push(timer);
    }

    complete() {
      this.cleanup();
      this.onComplete({
        success: true,
        type: "craft",
        status: this.failedOnce ? "passed" : "perfect",
        reward: this.config.reward
      });
    }

    cleanup() {
      this.timers.forEach((timer) => clearTimeout(timer));
      this.timers = [];
      if (this.dragging) {
        document.removeEventListener("pointermove", this.boundMove);
        document.removeEventListener("pointerup", this.boundUp);
        if (this.dragging.ghost && this.dragging.ghost.parentNode) {
          this.dragging.ghost.parentNode.removeChild(this.dragging.ghost);
        }
        this.dragging = null;
      }
    }

    destroy() {
      this.cleanup();
    }
  }

  return CraftGameEngine;
})();
