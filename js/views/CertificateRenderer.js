window.CertificateRenderer = (function () {
  function pad(value, length) {
    return String(value).padStart(length, "0");
  }

  function generateCertificateNumber() {
    const now = new Date();
    const date = [
      now.getFullYear(),
      pad(now.getMonth() + 1, 2),
      pad(now.getDate(), 2)
    ].join("");
    const random = pad(Math.floor(Math.random() * 10000), 4);
    return "LRG" + date + random;
  }

  function formatDate(now) {
    return now.getFullYear() + "年" + (now.getMonth() + 1) + "月" + now.getDate() + "日";
  }

  function formatDuration(seconds) {
    const totalSeconds = Math.max(0, Number(seconds) || 0);
    const minutes = Math.floor(totalSeconds / 60);
    const restSeconds = totalSeconds % 60;
    if (minutes > 0) return minutes + "分" + restSeconds + "秒";
    return restSeconds + "秒";
  }

  function renderCertificate(name, state) {
    try {
      const canvas = document.createElement("canvas");
      canvas.width = 1600;
      canvas.height = 1131;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#F5F0EB";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const border = 32;
      ctx.strokeStyle = "#C41A1A";
      ctx.lineWidth = 8;
      ctx.strokeRect(border, border, canvas.width - border * 2, canvas.height - border * 2);

      ctx.strokeStyle = "#C9A96E";
      ctx.lineWidth = 3;
      ctx.strokeRect(border + 18, border + 18, canvas.width - (border + 18) * 2, canvas.height - (border + 18) * 2);

      ctx.textAlign = "center";
      ctx.fillStyle = "#C9A96E";
      ctx.font = "36px serif";
      ctx.fillText("陆瑞光纪念馆研学中心", canvas.width / 2, 150);

      ctx.fillStyle = "#C41A1A";
      ctx.font = "bold 92px serif";
      ctx.fillText("陆瑞光红色历史研学通关证书", canvas.width / 2, 300);

      ctx.fillStyle = "#3A2A20";
      ctx.font = "44px serif";
      ctx.fillText(String(name || "研学访客"), canvas.width / 2, 470);

      const content = "已完整完成《弄染寻踪·火种永续》历史研学闯关学习，系统掌握陆瑞光革命事迹与弄染结盟红色历史，顺利结业。";
      ctx.font = "38px serif";
      wrapText(ctx, content, canvas.width / 2, 590, canvas.width - 280, 58);

      if (state) {
        const totalScore = Number(state.totalScore) || 0;
        const playSeconds = state.startTime ? Math.max(0, Math.floor(((state.endTime || Date.now()) - state.startTime) / 1000)) : 0;
        ctx.fillStyle = "#6B5744";
        ctx.font = "32px serif";
        ctx.textAlign = "left";
        ctx.fillText("研学总分：" + totalScore + " 分    研学用时：" + formatDuration(playSeconds), 220, 790);
      }

      ctx.font = "30px serif";
      ctx.fillStyle = "#6B5744";
      const now = new Date();
      ctx.textAlign = "left";
      ctx.fillText("通关编号：" + generateCertificateNumber(), 220, 850);
      ctx.fillText("通关日期：" + formatDate(now), 220, 910);

      ctx.textAlign = "right";
      ctx.fillText("陆瑞光纪念馆研学中心", canvas.width - 220, 900);
      ctx.font = "bold 34px serif";
      ctx.fillText("2026", canvas.width - 220, 960);

      drawSeal(ctx, canvas.width - 260, 740);

      return canvas;
    } catch (error) {
      return null;
    }
  }

  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const chars = String(text || "").split("");
    let line = "";
    let lineIndex = 0;

    chars.forEach((char) => {
      const testLine = line + char;
      if (ctx.measureText(testLine).width > maxWidth && line) {
        ctx.fillText(line, x, y + lineIndex * lineHeight);
        line = char;
        lineIndex += 1;
      } else {
        line = testLine;
      }
    });

    if (line) {
      ctx.fillText(line, x, y + lineIndex * lineHeight);
    }
  }

  function drawSeal(ctx, x, y) {
    ctx.save();
    ctx.strokeStyle = "#C41A1A";
    ctx.fillStyle = "#C41A1A";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.arc(x, y, 78, 0, Math.PI * 2);
    ctx.stroke();

    ctx.font = "bold 28px serif";
    ctx.textAlign = "center";
    ctx.fillText("研学", x, y - 12);
    ctx.fillText("通关", x, y + 24);
    ctx.restore();
  }

  function saveCertificate(canvas, name) {
    try {
      const link = document.createElement("a");
      link.download = "陆瑞光研学证书-" + (name || "通关") + ".png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (error) {
      return false;
    }
    return true;
  }

  return { renderCertificate, saveCertificate };
})();