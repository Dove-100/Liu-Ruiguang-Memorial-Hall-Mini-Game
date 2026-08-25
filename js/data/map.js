// 游戏地图系统
window.GAME_MAP = {
  width: 2400,
  height: 1600,
  playerStart: { x: 330, y: 1100 },
  nodes: [
    { id: "node_prologue", chapterId: 0, x: 420, y: 1080, label: "序章 · 档案馆", area: "起点" },
    { id: "node_ch1", chapterId: 1, x: 800, y: 930, label: "第一章 · 四十八寨", area: "早年抗争展区" },
    { id: "node_ch2", chapterId: 2, x: 1240, y: 780, label: "第二章 · 弄染寨", area: "弄染结盟核心展区" },
    { id: "node_ch3", chapterId: 3, x: 1650, y: 670, label: "第三章 · 红军驻地", area: "支援红军展区" },
    { id: "node_ch4", chapterId: 4, x: 1980, y: 830, label: "第四章 · 贵阳八角岩", area: "英雄遇难展区" },
    { id: "node_ch5", chapterId: 5, x: 1840, y: 1200, label: "第五章 · 纪念馆", area: "尾厅 · 精神传承展区" }
  ],
  knowledge: [
    {
      id: "knowledge_01",
      x: 620,
      y: 640,
      label: "史料碎片",
      title: "布依族与弄染寨",
      text: "弄染寨位于贵州省镇宁县，是陆瑞光的故乡，也是1935年弄染结盟的发生地。"
    },
    {
      id: "knowledge_02",
      x: 1480,
      y: 1030,
      label: "史料碎片",
      title: "弄染反蒋作战协定",
      text: "1935年4月，红军与陆瑞光在弄染寨签订反蒋作战协定，这是红军长征途经贵州时开展统战工作的重要见证。"
    },
    {
      id: "knowledge_03",
      x: 1100,
      y: 450,
      label: "史料碎片",
      title: "十二名红军伤员",
      text: "红军主力离开镇宁后，陆瑞光妥善安置12名红军伤病员，安排乡亲照料。"
    }
  ],
  obstacles: [
    { x: 0, y: 0, width: 2400, height: 120 },
    { x: 0, y: 1480, width: 2400, height: 120 },
    { x: 0, y: 120, width: 120, height: 1360 },
    { x: 2280, y: 120, width: 120, height: 1360 },
    { x: 980, y: 540, width: 140, height: 90 },
    { x: 1560, y: 500, width: 120, height: 90 },
    { x: 640, y: 1220, width: 150, height: 90 },
    { x: 2080, y: 1080, width: 120, height: 90 }
  ],
  pathPoints: [
    { x: 420, y: 1080 }, { x: 800, y: 930 }, { x: 1240, y: 780 },
    { x: 1650, y: 670 }, { x: 1980, y: 830 }, { x: 1840, y: 1200 }
  ]
};