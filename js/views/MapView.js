window.MapView = (function () {
  class MapView {
    constructor(container, controller) {
      this.container = container;
      this.controller = controller;
      this.engine = null;
    }

    show() {
      const state = this.controller.getState();
      this.container.innerHTML = `
        <section class="map-page">
          <header class="map-hud">
            <button class="map-hud__button" data-action="home">首页</button>
            <div class="map-hud__title">弄染寻踪 · 探索地图</div>
            <button class="map-hud__button ${state.isCompleted ? "" : "is-hidden"}" data-action="certificate">证书</button>
          </header>
          <div class="map-stage">
            <canvas id="map-canvas" aria-label="2D探索地图"></canvas>
            <div class="map-stage__tip">方向键 / WASD / 点击地面移动，靠近光点后按空格或点击进入。</div>
          </div>
          <div class="map-legend">
            <span><i class="legend-dot legend-dot--locked"></i>未解锁</span>
            <span><i class="legend-dot legend-dot--available"></i>可进入</span>
            <span><i class="legend-dot legend-dot--done"></i>已通关</span>
            <span><i class="legend-dot legend-dot--book"></i>史料碎片</span>
          </div>
        </section>
      `;

      const canvas = this.container.querySelector("#map-canvas");
      this.engine = new window.MapEngine(canvas, {
        mapData: window.GAME_MAP,
        getNodeStatus: (node) => this.controller.getNodeStatus(node),
        onNodeInteract: (node) => this.controller.enterMapNode(node),
        onKnowledgeInteract: (item) => this.controller.showKnowledge(item),
        getPlayerPosition: () => this.controller.getPlayerPosition(),
        setPlayerPosition: (x, y) => this.controller.setPlayerPosition(x, y),
        getProgressMeta: () => this.controller.getProgressMeta()
      });
      this.engine.start();
      this.bindHud();
    }

    bindHud() {
      this.container.querySelector('[data-action="home"]').addEventListener("click", () => this.controller.showHome());
      const certificateBtn = this.container.querySelector('[data-action="certificate"]');
      if (certificateBtn && !certificateBtn.classList.contains("is-hidden")) {
        certificateBtn.addEventListener("click", () => this.controller.renderFinal());
      }
    }

    destroy() {
      if (this.engine) {
        this.engine.stop();
        this.engine = null;
      }
    }
  }

  return MapView;
})();