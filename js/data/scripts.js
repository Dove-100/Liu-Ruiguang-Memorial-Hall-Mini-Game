// 章节剧本系统
window.GAME_SCRIPTS = [
  {
    chapterId: 0,
    title: "序章 · 寻访启程",
    badgeId: "badge_shanye",
    evidence: "山野布衣 · 寻访档案",
    background: "assets/images/backgrounds/prologue.jpg",
    steps: [
      {
        id: "prologue_01",
        type: "line",
        speaker: "旁白",
        text: "一张泛黄的史料档案静静铺开，记载着镇宁弄染寨布依族英雄陆瑞光的故事。"
      },
      {
        id: "prologue_02",
        type: "line",
        speaker: "旁白",
        text: "百年星火，照鉴初心。你将以历史寻访者身份，一步步解锁镇宁弄染红色记忆。",
        avatar: "assets/images/characters/narrator.svg",
        position: "right"
      },
      {
        id: "prologue_collect",
        type: "collect",
        collectionId: "collect_prologue"
      },
      {
        id: "prologue_craft",
        type: "craft",
        craftId: "craft_prologue"
      },
      {
        id: "prologue_03",
        type: "line",
        speaker: "陆瑞光",
        text: "你终于来了。我是陆瑞光，弄染寨的布依族头领。",
        avatar: "assets/images/characters/luriguang.jpg",
        position: "left"
      },
      {
        id: "prologue_choice",
        type: "choice",
        prompt: "陆瑞光：你可知，我是哪个民族的英雄？",
        options: [
          { text: "苗族", correct: false, feedback: "再想一想，陆瑞光的故乡在镇宁弄染寨。" },
          { text: "布依族", correct: true, feedback: "正确。陆瑞光是镇宁弄染寨布依族领袖。" },
          { text: "彝族", correct: false, feedback: "不对，他的民族身份与弄染寨的布依族群众紧密相连。" }
        ]
      },
      {
        id: "prologue_micro_archive",
        type: "microgame",
        microGameId: "archive_sort"
      },
      {
        id: "prologue_04",
        type: "line",
        speaker: "旁白",
        text: "弄染寨是陆瑞光的故乡，也是“弄染结盟”发生地。寻访之路，由此开始。"
      }
    ]
  },
  {
    chapterId: 1,
    title: "第一章 · 乱世奋起",
    badgeId: "badge_luanshi",
    evidence: "乱世英豪 · 四十八寨地契",
    background: "assets/images/backgrounds/chapter-1.jpg",
    steps: [
      {
        id: "ch1_01",
        type: "line",
        speaker: "旁白",
        text: "民国时期，苛捐杂税层层盘剥，百姓苦不堪言。你来到四十八寨，见到一位目光坚毅的布依族青年。"
      },
      {
        id: "ch1_collect",
        type: "collect",
        collectionId: "collect_ch1"
      },
      {
        id: "ch1_craft",
        type: "craft",
        craftId: "craft_ch1"
      },
      {
        id: "ch1_02",
        type: "line",
        speaker: "陆瑞光",
        text: "我生于乱世，见不得乡民受苦。你可知我生于哪一年？",
        avatar: "assets/images/characters/luriguang.jpg",
        position: "left"
      },
      {
        id: "ch1_micro_balance",
        type: "microgame",
        microGameId: "oppression_balance"
      },
      {
        id: "ch1_choice_1",
        type: "choice",
        prompt: "请选择陆瑞光的出生年份：",
        options: [
          { text: "1901年", correct: true, feedback: "正确。陆瑞光1901年生于镇宁县沙子乡弄染寨。" },
          { text: "1911年", correct: false, feedback: "1911年辛亥革命爆发，但这不是陆瑞光的出生年份。" },
          { text: "1921年", correct: false, feedback: "1921年中国共产党成立，这个时间需要再区分。" }
        ]
      },
      {
        id: "ch1_03",
        type: "line",
        speaker: "旁白",
        text: "当地民间将四位地方武装领袖称为“四大天王”，陆瑞光实力与威望最高。"
      },
      {
        id: "ch1_choice_2",
        type: "choice",
        prompt: "陆瑞光在“四大天王”中的身份是？",
        options: [
          { text: "四大天王之首", correct: true, feedback: "正确。陆瑞光被称为四大天王之首，统领四十八寨。" },
          { text: "排行第二", correct: false, feedback: "他的实力与威望最高，并非排行第二。" },
          { text: "不属于四大天王", correct: false, feedback: "陆瑞光正是四大天王之首。" }
        ]
      },
      {
        id: "ch1_micro_summon",
        type: "microgame",
        microGameId: "summon_villages"
      },
      {
        id: "ch1_04",
        type: "line",
        speaker: "旁白",
        text: "面对官府与军阀层层压榨，陆瑞光起兵自保，只为守护村寨百姓。"
      }
    ]
  },
  {
    chapterId: 2,
    title: "第二章 · 弄染相逢",
    badgeId: "badge_nongran",
    evidence: "弄染之盟 · 协定复制件",
    background: "assets/images/backgrounds/chapter-2.jpg",
    steps: [
      {
        id: "ch2_01",
        type: "line",
        speaker: "旁白",
        text: "1935年4月，中央红军长征途经镇宁。远处山路上，一支队伍蜿蜒而来。"
      },
      {
        id: "ch2_collect",
        type: "collect",
        collectionId: "collect_ch2"
      },
      {
        id: "ch2_craft",
        type: "craft",
        craftId: "craft_ch2"
      },
      {
        id: "ch2_02",
        type: "line",
        speaker: "陆瑞光",
        text: "你看那些人，和以前的官兵有什么不同？",
        avatar: "assets/images/characters/luriguang.jpg",
        position: "left"
      },
      {
        id: "ch2_micro_search",
        type: "microgame",
        microGameId: "search_red_army"
      },
      {
        id: "ch2_choice_1",
        type: "choice",
        prompt: "你观察后如何回答？",
        options: [
          { text: "队伍整齐，没有抢掠村庄", correct: true, feedback: "你看到了红军军纪严明、不侵扰百姓，这正是取得陆瑞光信任的关键。" },
          { text: "穿着破旧，没带多少粮草", correct: false, feedback: "红军确实条件艰苦，但更值得关注的是他们纪律严明。" },
          { text: "说不准，再观察观察", correct: false, feedback: "谨慎没有错，但陆瑞光更希望你能看出红军的与众不同。" }
        ]
      },
      {
        id: "ch2_03",
        type: "line",
        speaker: "旁白",
        text: "红军队伍走近，一位将领下马步行，向寨门方向走来。"
      },
      {
        id: "ch2_04",
        type: "line",
        speaker: "彭德怀",
        text: "请问这位可是陆瑞光陆首领？我们是红军，途经此地，绝不扰民。",
        avatar: "assets/images/characters/pengdehuai.jpg",
        position: "right"
      },
      {
        id: "ch2_choice_2",
        type: "choice",
        prompt: "陆瑞光看向你：“你觉得，我该怎么回应？”",
        options: [
          { text: "以礼相待，请入寨详谈", correct: true, feedback: "正确。正是这次主动沟通，才有了意义重大的弄染结盟。" },
          { text: "保持距离，问清来意", correct: false, feedback: "谨慎可取，但历史的选择是陆瑞光主动接触、了解红军主张。" },
          { text: "直接拒绝，让他们绕行", correct: false, feedback: "如果闭门拒绝，就不会有后来的弄染结盟。" }
        ]
      },
      {
        id: "ch2_micro_rhythm",
        type: "microgame",
        microGameId: "rhythm_heartbeat"
      },
      {
        id: "ch2_05",
        type: "line",
        speaker: "旁白",
        text: "寨内议事厅，众人落座。彭德怀与杨尚昆代表红军提出合作意向。"
      },
      {
        id: "ch2_choice_3",
        type: "choice",
        prompt: "彭德怀：“我们想与陆首领签订一份反蒋作战协定，共同抗日。你对此怎么看？”",
        options: [
          { text: "这是利国利民的好事，应全力支持", correct: true, feedback: "正确。这份协定符合当时抗日救国的需要。" },
          { text: "需要看具体条款，保障百姓利益", correct: false, feedback: "关注条款是合理的，彭德怀随后展示了协定内容。" },
          { text: "红军可信吗？会不会连累寨子？", correct: false, feedback: "陆瑞光最终基于红军军纪与救国主张，选择信任与合作。" }
        ]
      },
      {
        id: "ch2_micro_puzzle",
        type: "microgame",
        microGameId: "puzzle_agreement"
      },
      {
        id: "ch2_06",
        type: "line",
        speaker: "旁白",
        text: "1935年4月，弄染反蒋抗日作战协定正式签订。这是红军长征途中与地方武装签订的唯一一份正式协定。"
      }
    ]
  },
  {
    chapterId: 3,
    title: "第三章 · 信守盟约",
    badgeId: "badge_shouyue",
    evidence: "忠信守盟 · 红军信物",
    background: "assets/images/backgrounds/chapter-3.jpg",
    steps: [
      {
        id: "ch3_01",
        type: "line",
        speaker: "旁白",
        text: "红军主力继续长征、离开镇宁。陆瑞光坚守盟约，冒着巨大风险守护红军伤员。"
      },
      {
        id: "ch3_collect",
        type: "collect",
        collectionId: "collect_ch3"
      },
      {
        id: "ch3_craft",
        type: "craft",
        craftId: "craft_ch3"
      },
      {
        id: "ch3_02",
        type: "line",
        speaker: "陆瑞光",
        text: "那些负伤的战士，不能丢下。乡亲们会像待自家孩子一样照料他们。",
        avatar: "assets/images/characters/luriguang.jpg",
        position: "left"
      },
      {
        id: "ch3_micro_hide",
        type: "microgame",
        microGameId: "hide_wounded"
      },
      {
        id: "ch3_choice_1",
        type: "choice",
        prompt: "陆瑞光前后收留了多少名红军伤病员？",
        options: [
          { text: "10名", correct: false, feedback: "人数还要再多一些。" },
          { text: "12名", correct: true, feedback: "正确。陆瑞光妥善安置12名红军伤员，安排乡亲照料。" },
          { text: "15名", correct: false, feedback: "史料记载为12名红军伤病员。" }
        ]
      },
      {
        id: "ch3_03",
        type: "line",
        speaker: "旁白",
        text: "陆瑞光还筹措粮食物资、安排向导引路，为红军继续长征提供重要支持。"
      },
      {
        id: "ch3_choice_2",
        type: "choice",
        prompt: "下列哪一项不是陆瑞光为红军提供的帮助？",
        options: [
          { text: "提供粮食物资", correct: false, feedback: "这确实是陆瑞光的支援行动之一。" },
          { text: "安排向导引路", correct: false, feedback: "陆瑞光为红军安排了熟悉山路的向导。" },
          { text: "掩护红军伤员", correct: false, feedback: "掩护伤员正是他信守盟约的重要表现。" },
          { text: "出兵跟随红军长征", correct: true, feedback: "正确。陆瑞光没有率部随红军长征，而是留在当地继续坚守。" }
        ]
      },
      {
        id: "ch3_micro_supply",
        type: "microgame",
        microGameId: "supply_strategy"
      },
      {
        id: "ch3_04",
        type: "line",
        speaker: "旁白",
        text: "一句承诺，用生命去守护。革命信物见证了红军与陆瑞光之间生死相托的情谊。"
      }
    ]
  },
  {
    chapterId: 4,
    title: "第四章 · 烈火忠魂",
    badgeId: "badge_liehuo",
    evidence: "烈火忠魂 · 墓园影像",
    background: "assets/images/backgrounds/chapter-4.jpg",
    steps: [
      {
        id: "ch4_01",
        type: "line",
        speaker: "旁白",
        text: "反动派忌惮陆瑞光与红军的联系，设下圈套将其抓捕。面对严刑审讯，他守口如瓶。"
      },
      {
        id: "ch4_collect",
        type: "collect",
        collectionId: "collect_ch4"
      },
      {
        id: "ch4_craft",
        type: "craft",
        craftId: "craft_ch4"
      },
      {
        id: "ch4_choice_1",
        type: "choice",
        prompt: "陆瑞光最终在何处英勇就义？",
        options: [
          { text: "镇宁弄染寨", correct: false, feedback: "他的牺牲地点在贵阳八角岩。" },
          { text: "贵阳八角岩", correct: true, feedback: "正确。1937年，陆瑞光在贵阳八角岩英勇就义。" },
          { text: "安顺", correct: false, feedback: "不是安顺，而是在贵阳八角岩。" }
        ]
      },
      {
        id: "ch4_choice_2",
        type: "choice",
        prompt: "陆瑞光牺牲于哪一年？",
        options: [
          { text: "1935年", correct: false, feedback: "1935年是弄染结盟的时间。" },
          { text: "1937年", correct: true, feedback: "正确。陆瑞光于1937年被捕牺牲。" },
          { text: "1940年", correct: false, feedback: "时间不对，牺牲年份应为1937年。" }
        ]
      },
      {
        id: "ch4_micro_hold",
        type: "microgame",
        microGameId: "hold_faith"
      },
      {
        id: "ch4_02",
        type: "line",
        speaker: "旁白",
        text: "面对生死考验，陆瑞光始终没有供出红军伤员，体现了重信守诺、坚贞不屈、不怕牺牲的崇高品质。"
      },
      {
        id: "ch4_03",
        type: "line",
        speaker: "旁白",
        text: "1989年，陆瑞光被追认为革命烈士。烈火灼身，忠魂不灭。"
      }
    ]
  },
  {
    chapterId: 5,
    title: "第五章 · 火种千秋",
    badgeId: "badge_huozhong",
    evidence: "火种千秋 · 纪念馆馆名题字",
    background: "assets/images/backgrounds/chapter-5.jpg",
    steps: [
      {
        id: "ch5_01",
        type: "line",
        speaker: "旁白",
        text: "英雄壮烈牺牲，但革命火种生生不息。多年之后，陆瑞光纪念馆在镇宁建成。"
      },
      {
        id: "ch5_collect",
        type: "collect",
        collectionId: "collect_ch5"
      },
      {
        id: "ch5_craft",
        type: "craft",
        craftId: "craft_ch5"
      },
      {
        id: "ch5_choice_1",
        type: "choice",
        prompt: "陆瑞光在哪一年被追认为革命烈士？",
        options: [
          { text: "1979年", correct: false, feedback: "时间还要再往后十年。" },
          { text: "1989年", correct: true, feedback: "正确。1989年，陆瑞光被追认为革命烈士。" },
          { text: "1999年", correct: false, feedback: "不是1999年，而是1989年。" }
        ]
      },
      {
        id: "ch5_choice_2",
        type: "choice",
        prompt: "是谁为陆瑞光纪念馆题写馆名？",
        options: [
          { text: "杨尚昆", correct: true, feedback: "正确。陆瑞光纪念馆馆名由杨尚昆同志亲笔题写。" },
          { text: "邓小平", correct: false, feedback: "题写馆名的是杨尚昆同志。" },
          { text: "彭德怀", correct: false, feedback: "彭德怀是当年与陆瑞光会谈的红军领导人，题写馆名的是杨尚昆。" }
        ]
      },
      {
        id: "ch5_micro_fire",
        type: "microgame",
        microGameId: "fire_spread"
      },
      {
        id: "ch5_02",
        type: "line",
        speaker: "旁白",
        text: "纪念馆铭记弄染结盟红色历史，缅怀布依族英雄陆瑞光，传承民族团结、不怕牺牲的革命精神。"
      },
      {
        id: "ch5_03",
        type: "line",
        speaker: "旁白",
        text: "英雄虽逝，火种永续。弄染结盟的佳话，永远留在黔中大地上。"
      }
    ]
  }
];
