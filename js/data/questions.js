// 游戏问答系统
window.GAME_QUESTIONS = [
  {
    id: "prologue_q1",
    chapter: 0,
    type: "single",
    question: "陆瑞光是哪个民族的英雄？",
    options: ["苗族", "布依族", "彝族"],
    answer: 1,
    explanation: "陆瑞光，镇宁弄染寨布依族领袖，带领当地各族群众反抗压迫。"
  },
  {
    id: "prologue_q2",
    chapter: 0,
    type: "image",
    question: "下图地点是？",
    options: ["弄染寨", "黄果树", "贵阳八角岩"],
    answer: 0,
    image: "assets/images/props/nongran-zhai.jpg",
    explanation: "弄染寨是陆瑞光的故乡，也是“弄染结盟”发生地。"
  },
  {
    id: "ch1_q1",
    chapter: 1,
    type: "single",
    question: "陆瑞光出生于哪一年？",
    options: ["1901年", "1911年", "1921年"],
    answer: 0,
    explanation: "陆瑞光1901年生于镇宁县沙子乡弄染寨。"
  },
  {
    id: "ch1_q2",
    chapter: 1,
    type: "single",
    question: "当地民间将四位地方武装领袖称为“四大天王”，陆瑞光的身份是？",
    options: ["四大天王之首", "排行第二", "不属于四大天王"],
    answer: 0,
    explanation: "陆瑞光实力与威望最高，被称为四大天王之首，统领四十八寨。"
  },
  {
    id: "ch1_q3",
    chapter: 1,
    type: "single",
    question: "陆瑞光组织武装最初的主要目的是？",
    options: ["称王占地", "反抗军阀、苛捐杂税，保护乡民", "外出劫掠"],
    answer: 1,
    explanation: "面对官府与军阀层层压榨，陆瑞光起兵，守护村寨百姓。"
  },
  {
    id: "ch2_q1",
    chapter: 2,
    type: "single",
    question: "弄染结盟发生在哪一年？",
    options: ["1933年", "1935年", "1937年"],
    answer: 1,
    explanation: "1935年，中央红军长征途经镇宁，与陆瑞光缔结弄染结盟。"
  },
  {
    id: "ch2_q2",
    chapter: 2,
    type: "single",
    question: "与陆瑞光谈判缔结协定的红军领导人是？",
    options: ["彭德怀、杨尚昆", "毛泽东、周恩来", "贺龙、任弼时"],
    answer: 0,
    explanation: "1935年4月，彭德怀、杨尚昆率领红军进驻镇宁弄染寨，与陆瑞光会谈。"
  },
  {
    id: "ch2_q3",
    chapter: 2,
    type: "sort",
    question: "请按历史先后顺序排列下列事件：",
    options: ["红军抵达弄染寨", "双方签订反蒋作战协定", "陆瑞光与红军领导人会面"],
    answer: [0, 2, 1],
    explanation: "正确顺序为：红军抵达弄染寨 → 陆瑞光与红军领导人会面 → 双方签订反蒋作战协定。"
  },
  {
    id: "ch2_q4",
    chapter: 2,
    type: "scene",
    question: "陆瑞光看到红军不扰民、救济穷苦百姓，此时他最合适的选择是？",
    options: ["紧闭寨门，防范陌生人", "主动接触，了解红军主张", "直接调集武装驱赶"],
    answer: 1,
    explanation: "正是陆瑞光主动沟通，才有意义重大的弄染结盟。"
  },
  {
    id: "ch3_q1",
    chapter: 3,
    type: "fill",
    question: "陆瑞光前后收留____名红军伤病员。",
    answer: "12",
    acceptableAnswers: ["12", "十二"],
    explanation: "陆瑞光妥善安置12名红军伤员，安排乡亲照料。"
  },
  {
    id: "ch3_q2",
    chapter: 3,
    type: "multiple",
    question: "陆瑞光为红军提供了哪些帮助？",
    options: ["提供粮食物资", "安排向导引路", "掩护红军伤员", "出兵跟随红军长征"],
    answer: [0, 1, 2],
    explanation: "陆瑞光坚守盟约，为红军提供粮食物资、安排向导并掩护伤员，但没有率部随红军长征。"
  },
  {
    id: "ch3_q3",
    chapter: 3,
    type: "puzzle",
    question: "完成拼图：红军赠予陆瑞光革命信物场景。",
    puzzleSize: 3,
    explanation: "革命信物见证了红军与陆瑞光之间生死相托、信守盟约的情谊。"
  },
  {
    id: "ch4_q1",
    chapter: 4,
    type: "single",
    question: "陆瑞光牺牲地点为？",
    options: ["镇宁弄染寨", "贵阳八角岩", "安顺"],
    answer: 1,
    explanation: "1937年，陆瑞光在贵阳八角岩英勇就义。"
  },
  {
    id: "ch4_q2",
    chapter: 4,
    type: "single",
    question: "陆瑞光牺牲年份是？",
    options: ["1935年", "1937年", "1940年"],
    answer: 1,
    explanation: "陆瑞光于1937年被捕牺牲，年仅36岁。"
  },
  {
    id: "ch4_q3",
    chapter: 4,
    type: "essay",
    question: "陆瑞光遭受严刑拷打，始终没有供出红军伤员，体现了什么样的品质？",
    reference: "可围绕“重信守诺、坚贞不屈、不怕牺牲、守护革命力量”作答。",
    keywords: ["重信守诺", "坚贞不屈", "不怕牺牲", "守护革命"],
    explanation: "陆瑞光面对生死考验守口如瓶，体现了重信守诺、坚贞不屈、不怕牺牲、守护革命力量的崇高品质。"
  },
  {
    id: "ch5_q1",
    chapter: 5,
    type: "single",
    question: "陆瑞光在哪一年被追认为革命烈士？",
    options: ["1979年", "1989年", "1999年"],
    answer: 1,
    explanation: "1989年，陆瑞光被追认为革命烈士。"
  },
  {
    id: "ch5_q2",
    chapter: 5,
    type: "single",
    question: "是谁为陆瑞光纪念馆题写馆名？",
    options: ["杨尚昆", "邓小平", "彭德怀"],
    answer: 0,
    explanation: "陆瑞光纪念馆馆名由杨尚昆同志亲笔题写。"
  },
  {
    id: "ch5_q3",
    chapter: 5,
    type: "multiple",
    question: "建立陆瑞光纪念馆的意义有哪些？",
    options: ["铭记弄染结盟红色历史", "缅怀布依族英雄陆瑞光", "传承民族团结、不怕牺牲的革命精神"],
    answer: [0, 1, 2],
    explanation: "纪念馆承载弄染结盟红色记忆，缅怀英雄，并传承民族团结与不怕牺牲的革命精神。"
  }
];
