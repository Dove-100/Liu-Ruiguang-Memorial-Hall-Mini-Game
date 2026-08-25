// 小游戏系统
window.GAME_MICROGAMES = [
  {
    id: "archive_sort",
    type: "sort",
    title: "档案翻阅",
    instruction: "把散落的档案碎片放回正确位置。",
    slots: [
      { id: "name", label: "姓名", answer: "陆瑞光" },
      { id: "ethnicity", label: "民族", answer: "布依族" },
      { id: "birth", label: "出生", answer: "1901年" },
      { id: "hometown", label: "籍贯", answer: "镇宁" }
    ],
    items: ["陆瑞光", "布依族", "1901年", "镇宁"]
  },
  {
    id: "oppression_balance",
    type: "balance",
    title: "压迫天平",
    instruction: "反复点击“反抗”，让被压迫的百姓重新看到希望。",
    leftLabel: "官府压迫",
    rightLabel: "百姓生计",
    targetClicks: 6,
    completeText: "天平回正，陆瑞光下定决心守护乡民。"
  },
  {
    id: "summon_villages",
    type: "match",
    title: "召集四十八寨",
    instruction: "把寨名放到地图上的正确位置。",
    slots: [
      { id: "slot_a", label: "位置一 · 近山", answer: "寨A" },
      { id: "slot_b", label: "位置二 · 河谷", answer: "寨B" },
      { id: "slot_c", label: "位置三 · 南坡", answer: "寨C" }
    ],
    items: ["寨A", "寨B", "寨C"],
    completeText: "四十八寨响应号召，联盟之势渐成。"
  },
  {
    id: "search_red_army",
    type: "search",
    title: "远望红军",
    instruction: "在20秒内找出所有红军特征，不要点到军阀军队特征。",
    timeLimit: 20,
    targets: ["红旗", "整齐队列", "农民送水", "枪口朝下", "吹号"],
    distractors: ["军阀徽", "抢掠物品"],
    hint: "红军纪律严明，不扰百姓。"
  },
  {
    id: "rhythm_heartbeat",
    type: "rhythm",
    title: "历史心跳",
    instruction: "当光点移动到圆圈中心时点击，连续命中3次。",
    requiredHits: 3,
    completeText: "军民同心，历史性握手。"
  },
  {
    id: "puzzle_agreement",
    type: "puzzle",
    title: "协定签署",
    instruction: "拼合破损的《弄染反蒋抗日作战协定》。",
    puzzleSize: 3,
    completeText: "协定拼合完整，陆瑞光与彭德怀郑重签署。"
  },
  {
    id: "hide_wounded",
    type: "reaction",
    title: "掩护伤员",
    instruction: "敌人正在搜查，请把12名红军伤员藏到不同位置。",
    woundedCount: 12,
    timeLimit: 30,
    completeText: "伤员全部安全转移，敌人搜查无果撤退。"
  },
  {
    id: "supply_strategy",
    type: "match",
    title: "支援抉择",
    instruction: "把各项行动归入“应当支援”或“不应采取”。",
    slots: [
      { id: "support", label: "应当支援", answer: "supply_support" },
      { id: "avoid", label: "不应采取", answer: "supply_avoid" }
    ],
    items: [
      { id: "food", label: "提供粮食物资", slot: "support" },
      { id: "guide", label: "安排向导引路", slot: "support" },
      { id: "wounded", label: "掩护红军伤员", slot: "support" },
      { id: "follow", label: "出兵跟随红军长征", slot: "avoid" }
    ],
    completeText: "支援方案完成，既尽力帮助红军，也守住弄染寨的安全。"
  },
  {
    id: "hold_faith",
    type: "hold",
    title: "狱中坚守",
    instruction: "按住按钮不放，坚持10秒，体验陆瑞光的坚毅。",
    holdSeconds: 10,
    completeText: "他始终没有供出红军伤员，宁死不屈。"
  },
  {
    id: "fire_spread",
    type: "spread",
    title: "薪火相传",
    instruction: "完成引火、护火、燎原三个阶段，让火种传遍大地。",
    kindleClicks: 5,
    holdSeconds: 3,
    spreadCount: 9,
    completeText: "星星之火，可以燎原。英雄不朽，火种永续。"
  }
];