window.MapEngine = (function () {
  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  class MapEngine {
    constructor(canvas, options) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.map = options.mapData || window.GAME_MAP;
      this.getNodeStatus = options.getNodeStatus || function () { return { completed: false, available: false }; };
      this.onNodeInteract = options.onNodeInteract || function () {};
      this.onKnowledgeInteract = options.onKnowledgeInteract || function () {};
      this.getPlayerPosition = options.getPlayerPosition || function () { return { x: 330, y: 1100 }; };
      this.setPlayerPosition = options.setPlayerPosition || function () {};
      this.getProgressMeta = options.getProgressMeta || function () { return { collected: 0, total: 0 }; };

      this.player = Object.assign({}, this.getPlayerPosition());
      this.viewport = { x: 0, y: 0 };
      this.target = null;
      this.keys = {};
      this.animationId = null;
      this.width = 0;
      this.height = 0;
      this.nearest = null;
      this.lastSaveAt = 0;
      this.boundHandlers = {
        keydown: (event) => this.handleKeyDown(event),
        keyup: (event) => this.handleKeyUp(event),
        pointerdown: (event) => this.handlePointerDown(event),
        resize: () => this.resize()
      };
    }

    start() {
      this.resize();
      this.player = Object.assign({}, this.getPlayerPosition());
      this.target = null;
      this.nearest = null;
      window.addEventListener("keydown", this.boundHandlers.keydown);
      window.addEventListener("keyup", this.boundHandlers.keyup);
      this.canvas.addEventListener("pointerdown", this.boundHandlers.pointerdown);
      window.addEventListener("resize", this.boundHandlers.resize);
      this.lastTime = performance.now();
      this.animationId = requestAnimationFrame((time) => this.loop(time));
    }

    stop() {
      window.removeEventListener("keydown", this.boundHandlers.keydown);
      window.removeEventListener("keyup", this.boundHandlers.keyup);
      this.canvas.removeEventListener("pointerdown", this.boundHandlers.pointerdown);
      window.removeEventListener("resize", this.boundHandlers.resize);
      if (this.animationId) {
        cancelAnimationFrame(this.animationId);
        this.animationId = null;
      }
    }

    resize() {
      const rect = this.canvas.getBoundingClientRect();
      this.width = Math.max(320, rect.width);
      this.height = Math.max(420, rect.height);
      this.canvas.width = this.width;
      this.canvas.height = this.height;
      this.updateViewport();
    }

    loop(time) {
      if (!this.animationId) return;
      const dt = Math.min((time - this.lastTime) / 1000, 0.05);
      this.lastTime = time;
      this.update(dt);
      this.render();
      this.animationId = requestAnimationFrame((nextTime) => this.loop(nextTime));
    }

    update(dt) {
      const speed = 260;
      let dx = 0;
      let dy = 0;

      if (this.keys.ArrowUp || this.keys.KeyW) dy -= 1;
      if (this.keys.ArrowDown || this.keys.KeyS) dy += 1;
      if (this.keys.ArrowLeft || this.keys.KeyA) dx -= 1;
      if (this.keys.ArrowRight || this.keys.KeyD) dx += 1;

      if (dx !== 0 || dy !== 0) {
        this.target = null;
        const length = Math.sqrt(dx * dx + dy * dy);
        this.move(dx / length * speed * dt, dy / length * speed * dt);
      } else if (this.target) {
        const deltaX = this.target.x - this.player.x;
        const deltaY = this.target.y - this.player.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        if (distance < 8) {
          this.target = null;
        } else {
          const step = Math.min(speed * dt, distance);
          this.move(deltaX / distance * step, deltaY / distance * step);
        }
      }

      this.detectNearest();
      this.updateViewport();

      const now = performance.now();
      if (now - this.lastSaveAt > 600) {
        this.setPlayerPosition(Math.round(this.player.x), Math.round(this.player.y));
        this.lastSaveAt = now;
      }
    }

    move(dx, dy) {
      const radius = 18;
      const nextX = this.player.x + dx;
      const nextY = this.player.y + dy;

      if (!this.isBlocked(nextX, nextY, radius)) {
        this.player.x = nextX;
        this.player.y = nextY;
        return;
      }

      if (!this.isBlocked(nextX, this.player.y, radius)) {
        this.player.x = nextX;
      }

      if (!this.isBlocked(this.player.x, nextY, radius)) {
        this.player.y = nextY;
      }

      this.player.x = clamp(this.player.x, radius, this.map.width - radius);
      this.player.y = clamp(this.player.y, radius, this.map.height - radius);
    }

    isBlocked(x, y, radius) {
      if (x < radius || x > this.map.width - radius || y < radius || y > this.map.height - radius) {
        return true;
      }

      return (this.map.obstacles || []).some((obstacle) => {
        return x + radius > obstacle.x &&
          x - radius < obstacle.x + obstacle.width &&
          y + radius > obstacle.y &&
          y - radius < obstacle.y + obstacle.height;
      });
    }

    updateViewport() {
      this.viewport.x = clamp(this.player.x - this.width / 2, 0, Math.max(0, this.map.width - this.width));
      this.viewport.y = clamp(this.player.y - this.height / 2, 0, Math.max(0, this.map.height - this.height));
    }

    detectNearest() {
      let best = null;
      let bestDistance = 68;
      const items = this.getInteractables();

      items.forEach((item) => {
        const distance = Math.hypot(item.x - this.player.x, item.y - this.player.y);
        if (distance < bestDistance) {
          best = item;
          bestDistance = distance;
        }
      });

      this.nearest = best;
    }

    getInteractables() {
      return (this.map.nodes || []).concat(this.map.knowledge || []);
    }

    handleKeyDown(event) {
      this.keys[event.code] = true;
      if (event.code === "Space" || event.code === "Enter") {
        event.preventDefault();
        if (this.nearest) {
          this.interact(this.nearest);
        }
      }
    }

    handleKeyUp(event) {
      this.keys[event.code] = false;
    }

    handlePointerDown(event) {
      const rect = this.canvas.getBoundingClientRect();
      const screenX = event.clientX - rect.left;
      const screenY = event.clientY - rect.top;
      const worldX = screenX + this.viewport.x;
      const worldY = screenY + this.viewport.y;

      const clicked = this.findInteractableAt(worldX, worldY, 54);
      if (clicked) {
        this.interact(clicked);
        return;
      }

      this.target = { x: worldX, y: worldY };
    }

    findInteractableAt(x, y, radius) {
      return this.getInteractables().find((item) => {
        return Math.hypot(item.x - x, item.y - y) <= radius;
      }) || null;
    }

    interact(item) {
      if (!item) return;
      if (item.chapterId != null) {
        this.onNodeInteract(item);
      } else {
        this.onKnowledgeInteract(item);
      }
    }

    render() {
      const ctx = this.ctx;
      ctx.clearRect(0, 0, this.width, this.height);

      ctx.save();
      ctx.translate(-this.viewport.x, -this.viewport.y);

      this.drawGround(ctx);
      this.drawPaths(ctx);
      this.drawObstacles(ctx);
      this.drawKnowledge(ctx);
      this.drawNodes(ctx);
      this.drawPlayer(ctx);

      ctx.restore();

      this.drawScreenUI(ctx);
    }

    drawGround(ctx) {
      const gradient = ctx.createLinearGradient(0, 0, this.map.width, this.map.height);
      gradient.addColorStop(0, "#d9d2b8");
      gradient.addColorStop(0.5, "#b7a884");
      gradient.addColorStop(1, "#8f8a6f");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.map.width, this.map.height);

      ctx.strokeStyle = "rgba(70, 60, 42, 0.10)";
      ctx.lineWidth = 1;
      const grid = 80;
      for (let x = 0; x <= this.map.width; x += grid) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.map.height);
        ctx.stroke();
      }
      for (let y = 0; y <= this.map.height; y += grid) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(this.map.width, y);
        ctx.stroke();
      }
    }

    drawPaths(ctx) {
      const points = this.map.pathPoints || [];
      if (points.length < 2) return;
      ctx.save();
      ctx.strokeStyle = "rgba(245, 240, 235, 0.62)";
      ctx.lineWidth = 16;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.beginPath();
      points.forEach((point, index) => {
        if (index === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();

      ctx.strokeStyle = "rgba(142, 16, 16, 0.18)";
      ctx.lineWidth = 3;
      ctx.stroke();
      ctx.restore();
    }

    drawObstacles(ctx) {
      ctx.save();
      (this.map.obstacles || []).forEach((obstacle) => {
        ctx.fillStyle = "rgba(54, 71, 48, 0.82)";
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        ctx.strokeStyle = "rgba(33, 43, 30, 0.48)";
        ctx.lineWidth = 3;
        ctx.strokeRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
      });
      ctx.restore();
    }

    drawKnowledge(ctx) {
      ctx.save();
      (this.map.knowledge || []).forEach((item) => {
        const x = item.x;
        const y = item.y;
        ctx.beginPath();
        ctx.arc(x, y, 22, 0, Math.PI * 2);
        ctx.fillStyle = "#C9A96E";
        ctx.fill();
        ctx.strokeStyle = "#5E4837";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = "#2F221B";
        ctx.font = "bold 20px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("史", x, y + 1);
        ctx.fillStyle = "rgba(47, 34, 27, 0.78)";
        ctx.font = "14px sans-serif";
        ctx.fillText(item.label, x, y + 40);
      });
      ctx.restore();
    }

    drawNodes(ctx) {
      ctx.save();
      (this.map.nodes || []).forEach((node) => {
        const status = this.getNodeStatus(node);
        const x = node.x;
        const y = node.y;
        const isNearest = this.nearest && this.nearest.id === node.id;

        ctx.shadowColor = status.completed ? "rgba(46, 125, 79, 0.45)" : "rgba(196, 26, 26, 0.45)";
        ctx.shadowBlur = status.available || status.completed ? 18 : 6;
        ctx.beginPath();
        ctx.arc(x, y, 34, 0, Math.PI * 2);
        ctx.fillStyle = status.completed ? "#2E7D4F" : status.available ? "#C41A1A" : "#7D7466";
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.strokeStyle = status.completed ? "#E7D7B7" : status.available ? "#F1D38B" : "#D8CFC2";
        ctx.lineWidth = 4;
        ctx.stroke();

        if (isNearest && !status.completed) {
          ctx.beginPath();
          ctx.arc(x, y, 46, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(241, 211, 139, 0.78)";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        ctx.fillStyle = "#FFFCF7";
        ctx.font = "bold 18px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(String(node.chapterId + 1), x, y + 1);

        ctx.fillStyle = "rgba(47, 34, 27, 0.86)";
        ctx.font = "bold 15px sans-serif";
        ctx.fillText(node.label, x, y - 52);

        if (status.completed) {
          ctx.fillStyle = "rgba(46, 125, 79, 0.82)";
          ctx.font = "12px sans-serif";
          ctx.fillText("已通关", x, y + 54);
        } else if (!status.available) {
          ctx.fillStyle = "rgba(47, 34, 27, 0.56)";
          ctx.font = "12px sans-serif";
          ctx.fillText("未解锁", x, y + 54);
        } else {
          ctx.fillStyle = "rgba(196, 26, 26, 0.86)";
          ctx.font = "12px sans-serif";
          ctx.fillText("可进入", x, y + 54);
        }
      });
      ctx.restore();
    }

    drawPlayer(ctx) {
      const x = this.player.x;
      const y = this.player.y;
      ctx.save();
      ctx.shadowColor = "rgba(0, 0, 0, 0.28)";
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, y + 6, 20, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(0, 0, 0, 0.18)";
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.beginPath();
      ctx.arc(x, y, 17, 0, Math.PI * 2);
      ctx.fillStyle = "#C41A1A";
      ctx.fill();
      ctx.strokeStyle = "#F1D38B";
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = "#FFFCF7";
      ctx.font = "bold 14px serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("寻", x, y + 1);

      ctx.fillStyle = "rgba(47, 34, 27, 0.72)";
      ctx.font = "bold 12px sans-serif";
      ctx.fillText("研学记者", x, y - 30);
      ctx.restore();
    }

    drawScreenUI(ctx) {
      const meta = this.getProgressMeta();
      ctx.save();
      ctx.fillStyle = "rgba(47, 34, 27, 0.72)";
      ctx.fillRect(14, 14, 164, 44);
      ctx.fillStyle = "#F5F0EB";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText("徽章 " + meta.collected + " / " + meta.total, 28, 36);

      ctx.fillStyle = "rgba(47, 34, 27, 0.58)";
      ctx.fillRect(this.width - 218, 14, 204, 34);
      ctx.fillStyle = "#F5F0EB";
      ctx.font = "13px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("方向键/点击移动 · 空格互动", this.width - 116, 31);
      ctx.restore();
    }
  }

  return MapEngine;
})();