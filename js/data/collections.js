// 游戏物品收集
window.GAME_COLLECTIONS = [
  {
    id: "collect_prologue",
    chapterId: 0,
    title: "档案室寻迹",
    instruction: "在档案室场景中找出 4 件整理档案所需的材料。",
    background: "assets/images/backgrounds/prologue.jpg",
    required: 4,
    items: [
      { id: "page", label: "泛黄档案页", icon: "📄", image: "assets/images/p0/泛黄档案页.png", x: 20, y: 38 },
      { id: "brush", label: "旧毛笔", icon: "🖌️", image: "assets/images/p0/旧毛笔.webp", x: 72, y: 22 },
      { id: "ink", label: "墨盒", icon: "⚫", image: "assets/images/p0/墨盒.png", x: 38, y: 68 },
      { id: "weight", label: "镇纸", icon: "🧱", image: "assets/images/p0/镇纸.webp", x: 82, y: 74 },
      { id: "lamp", label: "煤油灯", icon: "🏮", image: "assets/images/p0/煤油灯.png", x: 56, y: 32, decoy: true },
      { id: "badge", label: "旧徽章", icon: "⭐", image: "assets/images/p0/旧徽章.png", x: 12, y: 16, decoy: true }
    ]
  },
  {
    id: "collect_ch1",
    chapterId: 1,
    title: "四十八寨寻物",
    instruction: "找出制作四十八寨令旗所需的 4 件材料。",
    background: "assets/images/backgrounds/chapter-1.jpg",
    required: 4,
    items: [
      { id: "pole", label: "竹旗杆", icon: "🎋", image: "assets/images/p1/竹旗杆.png", x: 22, y: 62 },
      { id: "cloth", label: "土布旗面", icon: "🧵", image: "assets/images/p1/旗面.png", x: 74, y: 30 },
      { id: "pattern", label: "布依纹样", icon: "🔷", image: "assets/images/p1/布依纹样.png", x: 44, y: 18 },
      { id: "rope", label: "麻绳", icon: "🪢", image: "assets/images/p1/麻绳.png", x: 82, y: 72 },
      { id: "pot", label: "陶罐", icon: "🏺", image: "assets/images/p1/陶罐.png", x: 62, y: 55, decoy: true }
    ]
  },
  {
    id: "collect_ch2",
    chapterId: 2,
    title: "议事厅寻物",
    instruction: "找出拟写《弄染反蒋抗日作战协定》所需的 4 件材料。",
    background: "assets/images/backgrounds/chapter-2.jpg",
    required: 4,
    items: [
      { id: "paper", label: "宣纸", icon: "📜", x: 20, y: 34 },
      { id: "brush", label: "毛笔", icon: "🖌️", x: 74, y: 20 },
      { id: "ink", label: "松烟墨", icon: "⬛", x: 42, y: 70 },
      { id: "seal", label: "朱砂印", icon: "🔴", x: 80, y: 74 },
      { id: "gun", label: "旧枪械", icon: "🔫", x: 58, y: 40, decoy: true }
    ]
  },
  {
    id: "collect_ch3",
    chapterId: 3,
    title: "红军驻地寻物",
    instruction: "找出包扎红军伤员所需的 5 件材料。",
    background: "assets/images/backgrounds/chapter-3.jpg",
    required: 5,
    items: [
      { id: "gauze", label: "纱布", icon: "🧻", x: 16, y: 34 },
      { id: "herb", label: "止血草", icon: "🌿", x: 74, y: 26 },
      { id: "bandage", label: "绷带", icon: "🎗️", x: 46, y: 62 },
      { id: "clamp", label: "竹夹", icon: "🥢", x: 84, y: 62 },
      { id: "bottle", label: "药瓶", icon: "🧴", x: 30, y: 76 },
      { id: "watch", label: "旧怀表", icon: "⌚", x: 62, y: 18, decoy: true }
    ]
  },
  {
    id: "collect_ch4",
    chapterId: 4,
    title: "狱中寻物",
    instruction: "在昏暗牢房中找出 4 件制作长明灯的材料。",
    background: "assets/images/backgrounds/chapter-4.jpg",
    required: 4,
    items: [
      { id: "lamp", label: "旧灯盏", icon: "🏮", x: 22, y: 40 },
      { id: "wick", label: "灯芯", icon: "🕯️", x: 76, y: 26 },
      { id: "oil", label: "灯油", icon: "🫗", x: 44, y: 68 },
      { id: "cloth", label: "家书布片", icon: "🧾", x: 82, y: 70 },
      { id: "chain", label: "铁链", icon: "⛓️", x: 58, y: 52, decoy: true }
    ]
  },
  {
    id: "collect_ch5",
    chapterId: 5,
    title: "纪念馆寻物",
    instruction: "找出制作“火种长明灯”所需的 5 件材料。",
    background: "assets/images/backgrounds/chapter-5.jpg",
    required: 5,
    items: [
      { id: "stand", label: "灯架", icon: "🏗️", x: 16, y: 64 },
      { id: "ribbon", label: "红绸", icon: "🎀", x: 72, y: 24 },
      { id: "wick", label: "灯芯", icon: "🕯️", x: 42, y: 20 },
      { id: "oil", label: "灯油", icon: "🫗", x: 84, y: 66 },
      { id: "spark", label: "星火", icon: "✨", x: 56, y: 48 },
      { id: "frame", label: "旧相框", icon: "🖼️", x: 26, y: 16, decoy: true }
    ]
  }
];
