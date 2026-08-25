// 手工制作系统
window.GAME_CRAFTS = [
  {
    id: "craft_prologue",
    chapterId: 0,
    title: "装订红色档案",
    instruction: "按制作步骤，把正确的材料拖入中央制作区。",
    reward: "山野布衣 · 寻访档案",
    steps: [
      { id: "page", label: "第一步：理页", materialId: "page", materialLabel: "泛黄档案页", materialIcon: "📄", materialImage: "assets/images/p0/泛黄档案页.png", dropLabel: "整理档案内页" },
      { id: "brush", label: "第二步：誊录", materialId: "brush", materialLabel: "旧毛笔", materialIcon: "🖌️", materialImage: "assets/images/p0/旧毛笔.webp", dropLabel: "誊抄寻访名录" },
      { id: "ink", label: "第三步：研墨", materialId: "ink", materialLabel: "墨盒", materialIcon: "⚫", materialImage: "assets/images/p0/墨盒.png", dropLabel: "研磨墨汁" },
      { id: "weight", label: "第四步：装订", materialId: "weight", materialLabel: "镇纸", materialIcon: "🧱", materialImage: "assets/images/p0/镇纸.webp", dropLabel: "压平并装订成册" }
    ]
  },
  {
    id: "craft_ch1",
    chapterId: 1,
    title: "制作四十八寨令旗",
    instruction: "按步骤完成令旗制作，召集四十八寨乡民。",
    reward: "乱世英豪 · 四十八寨地契",
    steps: [
      { id: "pole", label: "第一步：立杆", materialId: "pole", materialLabel: "竹旗杆", materialIcon: "🎋", materialImage: "assets/images/p1/竹旗杆.png", dropLabel: "安插旗杆" },
      { id: "cloth", label: "第二步：绷面", materialId: "cloth", materialLabel: "土布旗面", materialIcon: "🧵", materialImage: "assets/images/p1/旗面.png", dropLabel: "绷紧旗面" },
      { id: "pattern", label: "第三步：饰纹", materialId: "pattern", materialLabel: "布依纹样", materialIcon: "🔷", materialImage: "assets/images/p1/布依纹样.png", dropLabel: "贴上布依纹样" },
      { id: "rope", label: "第四步：系绳", materialId: "rope", materialLabel: "麻绳", materialIcon: "🪢", materialImage: "assets/images/p1/麻绳.png", dropLabel: "系紧令旗" }
    ]
  },
  {
    id: "craft_ch2",
    chapterId: 2,
    title: "拟写弄染协定",
    instruction: "按历史场景完成协定书制作。",
    reward: "弄染之盟 · 协定复制件",
    steps: [
      { id: "paper", label: "第一步：铺纸", materialId: "paper", materialLabel: "宣纸", materialIcon: "📜", dropLabel: "铺开宣纸" },
      { id: "ink", label: "第二步：研墨", materialId: "ink", materialLabel: "松烟墨", materialIcon: "⬛", dropLabel: "研磨松烟墨" },
      { id: "brush", label: "第三步：誊写", materialId: "brush", materialLabel: "毛笔", materialIcon: "🖌️", dropLabel: "誊写协定条款" },
      { id: "seal", label: "第四步：钤印", materialId: "seal", materialLabel: "朱砂印", materialIcon: "🔴", dropLabel: "郑重钤印" }
    ]
  },
  {
    id: "craft_ch3",
    chapterId: 3,
    title: "包扎红军药包",
    instruction: "按步骤制作药包，掩护红军伤员。",
    reward: "信守盟约 · 红军药包",
    steps: [
      { id: "gauze", label: "第一步：铺纱布", materialId: "gauze", materialLabel: "纱布", materialIcon: "🧻", dropLabel: "铺开纱布" },
      { id: "herb", label: "第二步：敷药", materialId: "herb", materialLabel: "止血草", materialIcon: "🌿", dropLabel: "放入止血草" },
      { id: "bandage", label: "第三步：包扎", materialId: "bandage", materialLabel: "绷带", materialIcon: "🎗️", dropLabel: "卷紧绷带" },
      { id: "clamp", label: "第四步：固定", materialId: "clamp", materialLabel: "竹夹", materialIcon: "🥢", dropLabel: "夹紧竹夹" },
      { id: "bottle", label: "第五步：收药", materialId: "bottle", materialLabel: "药瓶", materialIcon: "🧴", dropLabel: "收好药瓶" }
    ]
  },
  {
    id: "craft_ch4",
    chapterId: 4,
    title: "点亮狱中长明灯",
    instruction: "用收集到的材料制作一盏信念之灯。",
    reward: "烈火忠魂 · 墓园影像",
    steps: [
      { id: "lamp", label: "第一步：擦灯", materialId: "lamp", materialLabel: "旧灯盏", materialIcon: "🏮", dropLabel: "擦拭灯盏" },
      { id: "wick", label: "第二步：穿芯", materialId: "wick", materialLabel: "灯芯", materialIcon: "🕯️", dropLabel: "穿入灯芯" },
      { id: "oil", label: "第三步：添油", materialId: "oil", materialLabel: "灯油", materialIcon: "🫗", dropLabel: "添入灯油" },
      { id: "cloth", label: "第四步：藏信", materialId: "cloth", materialLabel: "家书布片", materialIcon: "🧾", dropLabel: "藏好家书" }
    ]
  },
  {
    id: "craft_ch5",
    chapterId: 5,
    title: "点燃火种长明灯",
    instruction: "完成最后制作，让红色火种生生不息。",
    reward: "火种千秋 · 纪念馆馆名题字",
    steps: [
      { id: "stand", label: "第一步：立架", materialId: "stand", materialLabel: "灯架", materialIcon: "🏗️", dropLabel: "立起灯架" },
      { id: "ribbon", label: "第二步：缠绸", materialId: "ribbon", materialLabel: "红绸", materialIcon: "🎀", dropLabel: "缠上红绸" },
      { id: "wick", label: "第三步：穿芯", materialId: "wick", materialLabel: "灯芯", materialIcon: "🕯️", dropLabel: "穿入灯芯" },
      { id: "oil", label: "第四步：添油", materialId: "oil", materialLabel: "灯油", materialIcon: "🫗", dropLabel: "添入灯油" },
      { id: "spark", label: "第五步：引火", materialId: "spark", materialLabel: "星火", materialIcon: "✨", dropLabel: "引燃星火" }
    ]
  }
];
