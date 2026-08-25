window.CollectionGameEngine = (function () {
  function escapeHtml(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  class CollectionGameEngine {
    constructor(config, root, options) {
      this.config = config;
      this.root = root;
      this.onComplete = options.onComplete || function () {};
      this.onExit = options.onExit || function () {};
      this.found = new Set();
      this.failedOnce = false;
      this.timers = [];
      this.completed = false;
    }

    start() {
      this.render();
    }

    render() {
      const config = this.config;
      const foundCount = this.found.size;

      this.root.innerHTML = `
        <div class="collect">
          <div class="collect__header">
            <div class="collect__title">${escapeHtml(config.title)}</div>
            <div class="collect__count" data-collect-count>已收集：${foundCount} / ${config.required}</div>
          </div>
          <div class="collect__scene" style="background-image:url('${escapeHtml(config.background)}')">
            <div class="collect__scene-mask"></div>
            ${config.items.map((item) => `
              <button
                class="collect__item ${this.found.has(item.id) ? "is-found" : ""} ${item.image ? "collect__item--image" : ""}"
                style="left:${item.x}%;top:${item.y}%"
                data-collect-item="${escapeHtml(item.id)}"
                title="${escapeHtml(item.label)}"
              >${item.image ? `<img class="collect__item-img" src="${escapeHtml(item.image)}" alt="${escapeHtml(item.label)}">` : item.icon}</button>
            `).join("")}
          </div>
          <p class="collect__hint" data-collect-hint>${escapeHtml(config.instruction)}</p>
        </div>
      `;

      this.root.querySelectorAll("[data-collect-item]").forEach((button) => {
        button.addEventListener("click", (event) => {
          event.stopPropagation();
          const item = config.items.find((entry) => entry.id === button.dataset.collectItem);
          if (item) this.pick(item, button);
        });
      });
    }

    pick(item, button) {
      if (this.completed || this.found.has(item.id)) return;

      const hint = this.root.querySelector("[data-collect-hint]");
      if (item.decoy) {
        this.failedOnce = true;
        button.classList.add("is-wrong");
        if (hint) hint.textContent = "这不是当前需要的材料，再找找看。";
        const timer = setTimeout(() => {
          button.classList.remove("is-wrong");
          if (hint) hint.textContent = this.config.instruction;
        }, 700);
        this.timers.push(timer);
        return;
      }

      this.found.add(item.id);
      button.classList.add("is-found");
      const count = this.root.querySelector("[data-collect-count]");
      if (count) count.textContent = "已收集：" + this.found.size + " / " + this.config.required;
      if (hint) hint.textContent = "找到了：" + item.label;

      if (this.found.size >= this.config.required) {
        this.completed = true;
        if (hint) hint.textContent = "材料收集完毕！";
        const timer = setTimeout(() => this.complete(), 700);
        this.timers.push(timer);
      }
    }

    complete() {
      this.cleanup();
      this.onComplete({
        success: true,
        type: "collect",
        status: this.failedOnce ? "passed" : "perfect",
        collected: this.found.size
      });
    }

    cleanup() {
      this.timers.forEach((timer) => clearTimeout(timer));
      this.timers = [];
    }

    destroy() {
      this.cleanup();
    }
  }

  return CollectionGameEngine;
})();
