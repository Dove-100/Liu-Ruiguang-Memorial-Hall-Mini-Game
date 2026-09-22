const SAVE_KEY = 'nongran-dialogue-game-v2';

const evidenceCatalog = [
  { id: 'origin', type: '史料转述', title: '1901｜今镇宁一带', text: '陆瑞光生于今贵州镇宁一带的布依族家庭；公开材料对具体寨名写法不一。' },
  { id: 'burden', type: '时代背景', title: '乡里的负担', text: '军阀混战、粮款、兵役与各种摊派，是理解地方反抗的重要背景。' },
  { id: 'family', type: '采访记载', title: '家庭遭遇', text: '地方采访称其父亲陆品山和兄长陆吉光参加当地农民武装后遇难。' },
  { id: 'leader', type: '地方党史', title: '农民武装首领', text: '他参加并组织地方武装，在镇宁、关岭、紫云一带逐渐形成影响。' },
  { id: 'office', type: '年份存异', title: '地方保安职务', text: '他曾被地方当局收编任职；不同资料对具体职衔和任命年份写法不一。' },
  { id: 'routes', type: '路线示意', title: '两条路线在弄染相遇', text: '红三军团准备渡过北盘江，进入陆瑞光及其地方武装活动的六马地区。' },
  { id: 'caution', type: '后来的叙述', title: '最初的戒备', text: '双方最初缺少了解；具体试探过程主要来自后来的叙述。' },
  { id: 'discipline', type: '党史叙述', title: '部队纪律', text: '公开报道反复提到红军进寨后保持秩序、没有随意进入民房。' },
  { id: 'equality', type: '政策背景', title: '民族平等', text: '红军相关文件要求尊重少数民族群众及其风俗，不得骚扰。' },
  { id: 'common', type: '协定核心', title: '共同主张', text: '双方在反对军阀势力与苛捐杂税上找到共同基础。' },
  { id: 'telegram', type: '档案转述', title: '4月16日17时30分电报', text: '彭德怀、杨尚昆向中央军委报告已与陆瑞光订立协定。' },
  { id: 'aid', type: '数量待核', title: '留下人员与赠送枪支', text: '电报可确认留下伤病员、工作人员并赠送枪支，公开资料对具体数量存在异文。' },
  { id: 'stay', type: '行动起点', title: '留在当地', text: '陆瑞光没有随红军主力继续长征，而是留在当地履行结盟后的责任。' },
  { id: 'care', type: '盟约落实', title: '补给、护送与照料', text: '陆瑞光组织补给、护送红军，并承担照料留下人员的责任。' },
  { id: 'fang', type: '后续行动', title: '与方武先等共同活动', text: '陆瑞光与留下的红军人员继续宣传主张、开展地方斗争。' },
  { id: 'contact', type: '采访与军报', title: '寻找组织', text: '寻找右江革命力量受阻后，他们又派人前往安顺联系中共地下组织。' },
  { id: 'villages', type: '地方党史', title: '联合村寨', text: '他们计划并着手联合镇宁、关岭、紫云交界地区的村寨开展游击斗争。' },
  { id: 'arrest', type: '多源互证', title: '1936年12月26日被捕', text: '陆瑞光在弄染被捕，随后被押往贵阳。' },
  { id: 'death', type: '多源互证', title: '1937年春牺牲', text: '陆瑞光在贵阳八角岩遇害，年仅36岁。' },
  { id: 'recognition', type: '追认文件', title: '1989年追认', text: '贵州省人民政府追认陆瑞光为革命烈士。' }
];

const timeline = [
  ['1901', '生于今贵州镇宁一带的布依族家庭。'],
  ['1920年代', '参加并组织地方农民武装，也曾接受地方保安职务。'],
  ['1935.04.16', '在弄染与红三军团领导人订立协定。'],
  ['1935—1936', '照料留下人员，联系地下组织，继续开展地方斗争。'],
  ['1936.12.26', '在弄染被捕。'],
  ['1937年春', '在贵阳八角岩遇害。'],
  ['1989', '被追认为革命烈士。']
];

const sources = [
  ['中国共产党新闻网｜长征途中的贵州统战故事', 'https://cpc.people.com.cn/BIG5/n1/2025/0204/c443712-40412219.html'],
  ['央视专题片相关报道｜中央档案馆电报', 'https://www.tongren.gov.cn/2023/0131/295414.shtml'],
  ['中共贵州省委党史研究室｜弄染结盟', 'https://movement.gzstv.com/news/detail/HMxg1X/'],
  ['《解放军报》｜布依英豪陆瑞光', 'https://mil.news.sina.com.cn/2011-01-24/0657629545.html'],
  ['贵州日报天眼新闻采访｜一张证明书背后的故事', 'https://www.sohu.com/a/503681273_121106687']
];

const Q = (title, detail, progress) => ({ title, detail, progress });
const N = (id, chapter, speaker, role, text, next, extra = {}) => ({ id, chapter, speaker, role, text, next, ...extra });

const sceneImages = {
  '弄染村口': 'assets/scene-village-gate.webp',
  '寨口路牌': 'assets/scene-village-gate.webp',
  '老屋外 · 晒谷场': 'assets/scene-old-yard.webp',
  '老屋旁 · 公共院落': 'assets/scene-archive-courtyard.webp',
  '村广场 · 时间绳': 'assets/scene-village-square.webp',
  '村口研学板': 'assets/scene-village-gate.webp'
};

const characterImages = {
  '石伯': { src: 'assets/character-shibo.webp', side: 'left' },
  '兰婆': { src: 'assets/character-lanpo.webp', side: 'right' },
  '周伯': { src: 'assets/character-zhoubo.webp', side: 'left' }
};

const story = [
  N('p1', 0, '研学者 · 你', '当代来访者', '来到弄染的人，常先听见一个日期：1935年4月16日。', 'p2', { scene: '弄染村口', time: '今天 · 清晨', source: '游戏叙事', quest: Q('来到村口', '查看研学板上的三个问题', 4) }),
  N('p2', 0, '研学者 · 你', '当代来访者', '可一个日期之前，是怎样的一生？这个选择后来又通向哪里？', 'p3', { source: '游戏叙事' }),
  N('p3', 0, '石伯', '村中长者 · 虚构讲述者', '要问陆瑞光？先别急着走到1935年。一个人的选择，不会凭空从某一天开始。', 'p4', { source: '当代讲述', quest: Q('三个问题', '听石伯说明走访任务', 8) }),
  N('p4', 0, '石伯', '村中长者 · 虚构讲述者', '你要找三个答案：他从怎样的地方与时代走来？他为何选择结盟？结盟以后，他又做了什么、付出了什么？', 'c1intro', { source: '当代讲述' }),

  { id: 'c1intro', type: 'chapter', chapter: 1, index: '第一章', title: '两个身份，同一个人', copy: '走访村口与老屋，收集乡里负担、地方武装和保安职务三类线索。', next: 'c1_1' },
  N('c1_1', 1, '石伯', '村中长者 · 虚构讲述者', '你是来看“弄染结盟”的吧？', 'c1_2', { scene: '寨口路牌', time: '今天 · 上午', source: '当代讲述', quest: Q('他从哪里来？', '先确认地点与时代', 12) }),
  N('c1_2', 1, '研学者 · 你', '当代来访者', '是。我知道那件事发生在1935年4月16日，但对陆瑞光本人了解得不多。', 'c1_3', { source: '游戏叙事' }),
  N('c1_3', 1, '石伯', '村中长者 · 虚构讲述者', '那就先看看地图上的1901。资料只写“今镇宁一带”，你知道为什么没有直接填某个寨子吗？', null, {
    source: '史料提示', evidence: 'origin',
    choices: [
      { text: '因为公开材料对具体出生寨名的写法不完全相同。', next: 'c1_4' },
      { text: '因为具体地点并不重要，可以随意省略。', next: 'c1_wrong_place' }
    ]
  }),
  N('c1_wrong_place', 1, '石伯', '村中长者 · 虚构讲述者', '地点当然重要。正因为重要，才不能替史料选一个尚未核准的答案。主线写“今镇宁一带”更稳妥。', 'c1_4', { source: '史料辨析' }),
  N('c1_4', 1, '研学者 · 你', '当代来访者', '那我应该从哪里认识他？', 'c1_5', { source: '游戏叙事' }),
  N('c1_5', 1, '石伯', '村中长者 · 虚构讲述者', '从他生活的年代开始。找齐“乡里的负担”“武装的形成”“地方的职务”，你会看见两个看起来不太一样的陆瑞光。', 'c1_6', { source: '当代讲述', quest: Q('收集三类线索', '先查看乡里的负担', 18) }),
  N('c1_6', 1, '研学者 · 你', '当代来访者', '军阀混战、粮款、兵役、各种摊派……这些木牌都在说，当时普通人的日子并不安稳。', 'c1_7', { scene: '老屋外 · 晒谷场', source: '时代背景', evidence: 'burden' }),
  N('c1_7', 1, '石伯', '村中长者 · 虚构讲述者', '对乡里的人来说，“谁在台上”也许离得很远，粮款、兵役和摊派却就在眼前。', 'c1_8', { source: '时代背景' }),
  N('c1_8', 1, '研学者 · 你', '当代来访者', '所以陆瑞光后来组织武装，就是因为这些负担？', 'c1_9', { source: '游戏叙事' }),
  N('c1_9', 1, '石伯', '村中长者 · 虚构讲述者', '这是重要背景，但别把复杂的一生压成一句简单因果。能确认的是，他参加和组织的地方武装长期反对苛捐杂税、反抗官府压迫。', null, {
    source: '史料说明',
    choices: [
      { text: '他的家人也经历过这样的冲突吗？', next: 'c1_family' },
      { text: '苛捐杂税具体是多少？', next: 'c1_tax' }
    ]
  }),
  N('c1_family', 1, '石伯', '村中长者 · 虚构讲述者', '地方采访称，他的父亲陆品山和兄长陆吉光参加当地农民武装后遇难。记住：这是后来的采访材料，不是当年的现场记录。', 'c1_10', { source: '采访记载', evidence: 'family' }),
  N('c1_tax', 1, '石伯', '村中长者 · 虚构讲述者', '不同年份、不同地方并不一样。与其背一个来历不清的数字，不如看清“苛捐杂税”怎样贯穿早年反抗与后来协定。', 'c1_10', { source: '史料说明' }),
  N('c1_10', 1, '研学者 · 你', '当代来访者', '区域图上还有1923和1929两个年份。', 'c1_11', { quest: Q('收集三类线索', '查看地方武装活动', 26), source: '游戏叙事' }),
  N('c1_11', 1, '石伯', '村中长者 · 虚构讲述者', '地方党史材料记载，1923年他曾率数百人围攻紫云县城，迫使扰民的军阀部队离开。', 'c1_12', { source: '地方党史' }),
  N('c1_12', 1, '石伯', '村中长者 · 虚构讲述者', '1929年，他率三县边区农民武装袭击镇宁县城，并将部分粮食和衣物用于救济贫苦群众，影响进一步扩大。', 'c1_13', { source: '地方党史', evidence: 'leader' }),
  N('c1_13', 1, '研学者 · 你', '当代来访者', '这说明他的力量不只来自枪，也来自地方关系和群众影响。', 'c1_14', { source: '调查理解' }),
  N('c1_14', 1, '石伯', '村中长者 · 虚构讲述者', '正因为如此，红军后来经过这片区域，不能忽视这样一位首领。可木盒里还有身份牌的另一面。', 'c1_15', { source: '当代讲述', quest: Q('收集三类线索', '翻开双面身份牌', 34) }),
  N('c1_15', 1, '研学者 · 你', '当代来访者', '“地方保安职务”？这和前面的反抗好像矛盾。', 'c1_16', { source: '游戏叙事', evidence: 'office' }),
  N('c1_16', 1, '石伯', '村中长者 · 虚构讲述者', '地方当局面对有影响力的武装，不只会进剿，也会用任命和收编来控制。公开资料记载，陆瑞光曾接受保安职务。', 'c1_17', { source: '史料转述' }),
  N('c1_17', 1, '研学者 · 你', '当代来访者', '那是不是说明他已经站到了军阀一边？', 'c1_18', { source: '游戏叙事' }),
  N('c1_18', 1, '石伯', '村中长者 · 虚构讲述者', '只凭一个头衔，不能这样下结论；也不能反过来替他补出一个“秘密卧底计划”。要把头衔和实际行动放在同一条时间线上。', 'c1_19', { source: '史料辨析' }),
  N('c1_19', 1, '石伯', '村中长者 · 虚构讲述者', '1924年担任紫云保安营长的记载较常见；“三县保安司令”的任命，有材料写1933，也有材料写1934。这个年份不能做唯一答案。', 'c1_choice', { source: '年份异文', quest: Q('整理第一问', '选择最有依据的总结', 42) }),
  N('c1_choice', 1, '研学者 · 你', '当代来访者', '该怎样把这两面放回同一个人身上？', null, {
    source: '调查判断',
    choices: [
      { text: '陆瑞光始终只是地方官府的一员。', next: 'c1_wrong_a' },
      { text: '陆瑞光从未与地方当局发生任职关系。', next: 'c1_wrong_b' },
      { text: '他既是地方武装首领，也曾被收编任职；应结合具体行动理解。', next: 'c1_correct' }
    ]
  }),
  N('c1_wrong_a', 1, '石伯', '村中长者 · 虚构讲述者', '一个职务不能概括他此前和此后的全部经历。再看看“乡里负担”和“农民武装”两张卡。', 'c1_choice', { source: '理解修正' }),
  N('c1_wrong_b', 1, '石伯', '村中长者 · 虚构讲述者', '也不准确。史料明确记载他接受过地方保安职务；为了简单而删掉这一面，同样会离开史实。', 'c1_choice', { source: '理解修正' }),
  N('c1_correct', 1, '石伯', '村中长者 · 虚构讲述者', '这才把两面放回同一个人身上。历史人物不是资料卡上的单一称号，他是在具体处境里行动的人。', 'c1_end', { source: '章节结论', quest: Q('第一问已核对', '前往老屋旁院落', 48) }),
  N('c1_end', 1, '研学者 · 你', '当代来访者', '一个经历过收编与地方冲突的人，为什么会相信一支刚来到这里的外来队伍？', 'c2intro', { source: '游戏叙事' }),

  { id: 'c2intro', type: 'chapter', chapter: 2, index: '第二章', title: '17时30分的电报', copy: '叠合路线、观察纪律、寻找共同主张，并用一封电报核验弄染结盟。', next: 'c2_1' },
  N('c2_1', 2, '兰婆', '村中长者 · 虚构讲述者', '石伯让你带什么来了？', 'c2_2', { scene: '老屋旁 · 公共院落', time: '今天 · 午后', atmosphere: 'archive', source: '当代讲述', quest: Q('他为何选择结盟？', '叠合两张路线图', 52) }),
  N('c2_2', 2, '研学者 · 你', '当代来访者', '一张双面身份牌：农民武装首领，也是曾被收编任职的人。', 'c2_3', { source: '游戏叙事' }),
  N('c2_3', 2, '兰婆', '村中长者 · 虚构讲述者', '那就把红三军团的行军路线，与陆瑞光活动的六马地区叠起来。', 'c2_4', { source: '游戏引导' }),
  N('c2_4', 2, '研学者 · 你', '当代来访者', '两条路线在弄染相遇。红三军团准备渡过北盘江，而这里有陆瑞光的地方武装。', 'c2_5', { source: '路线示意', evidence: 'routes' }),
  N('c2_5', 2, '兰婆', '村中长者 · 虚构讲述者', '双方是否冲突、能否建立联系，都会影响接下来的行程。', null, {
    source: '史料说明',
    choices: [
      { text: '所以红军找陆瑞光，只是为了借路？', next: 'c2_borrow' },
      { text: '除了安全通行，双方还可能寻找共同立场。', next: 'c2_common_hint' }
    ]
  }),
  N('c2_borrow', 2, '兰婆', '村中长者 · 虚构讲述者', '安全通行是现实需要，但不是全部。只说“借路”，解释不了为何留下工作人员，也解释不了后来持续的地方斗争。', 'c2_6', { source: '理解修正' }),
  N('c2_common_hint', 2, '兰婆', '村中长者 · 虚构讲述者', '正是。红军也在争取少数民族群众和地方力量，宣传民族平等与共同反抗压迫的主张。', 'c2_6', { source: '政策背景' }),
  N('c2_6', 2, '研学者 · 你', '当代来访者', '后来的报道说，陆瑞光起初没有立即露面，对红军抱有戒心。', 'c2_7', { source: '后来的叙述', evidence: 'caution', quest: Q('理解接触过程', '区分叙述与档案', 57) }),
  N('c2_7', 2, '兰婆', '村中长者 · 虚构讲述者', '“几次试探”“藏在山中”等具体过程，主要来自后来的叙述，不是逐时现场记录。游戏可以表现联系并不立即顺利，但不做追踪搜山。', 'c2_8', { source: '史料边界' }),
  N('c2_8', 2, '研学者 · 你', '当代来访者', '那会面标记需要哪些依据才能打开？', 'c2_9', { source: '游戏叙事' }),
  N('c2_9', 2, '兰婆', '村中长者 · 虚构讲述者', '政策、纪律、共同主张。先看红军怎样对待当地群众。', 'c2_10', { source: '游戏引导' }),
  N('c2_10', 2, '研学者 · 你', '当代来访者', '公开报道反复提到，红军进寨后保持秩序，没有随意进入民房。', 'c2_11', { source: '党史叙述', evidence: 'discipline' }),
  N('c2_11', 2, '兰婆', '村中长者 · 虚构讲述者', '对长期见过军阀部队侵扰乡里的人来说，一支部队怎样对待普通人，本身就是一种可以观察的立场。', 'c2_12', { source: '调查理解' }),
  N('c2_12', 2, '研学者 · 你', '当代来访者', '所以陆瑞光看到纪律严明，就立刻决定结盟？', 'c2_13', { source: '游戏叙事' }),
  N('c2_13', 2, '兰婆', '村中长者 · 虚构讲述者', '不能写成“看到一个场面，立刻改变一切”。纪律帮助消除疑虑，民族政策说明红军怎样看待各族群众，共同主张则提供现实基础。', 'c2_14', { source: '史料辨析' }),
  N('c2_14', 2, '兰婆', '村中长者 · 虚构讲述者', '红军相关文件要求尊重少数民族群众及其风俗，不得骚扰。弄染的接触也发生在这样的政策背景中。', 'c2_15', { source: '政策背景', evidence: 'equality', quest: Q('寻找共同主张', '连接第一章的背景线索', 63) }),
  N('c2_15', 2, '研学者 · 你', '当代来访者', '第一章里的苛捐杂税，在这里又出现了。', 'c2_16', { source: '调查理解' }),
  N('c2_16', 2, '兰婆', '村中长者 · 虚构讲述者', '陆瑞光过去的地方武装活动，本来就包含反捐税、反官府压迫。红军的主张与这段经历发生了联系。', 'c2_17', { source: '史料说明', evidence: 'common' }),
  N('c2_17', 2, '研学者 · 你', '当代来访者', '少了行军需要，故事会变得抽象；少了共同主张，结盟又只剩临时交易。', 'c2_year', { source: '调查结论', quest: Q('开启档案盒', '校准电报日期与时间', 69) }),
  N('c2_year', 2, '兰婆', '村中长者 · 虚构讲述者', '先选择电报年份。', null, {
    source: '档案机关',
    choices: [
      { text: '1934年', next: 'c2_wrong_date' },
      { text: '1935年', next: 'c2_day' },
      { text: '1936年', next: 'c2_wrong_date' }
    ]
  }),
  N('c2_wrong_date', 2, '兰婆', '村中长者 · 虚构讲述者', '路线图只能说明红军何时经过镇宁，不能单独证明结盟日期。再看电报卡上的年份。', 'c2_year', { source: '日期修正' }),
  N('c2_day', 2, '兰婆', '村中长者 · 虚构讲述者', '再选择月日。', null, {
    source: '档案机关',
    choices: [
      { text: '4月15日', next: 'c2_wrong_day' },
      { text: '4月16日', next: 'c2_time' },
      { text: '4月17日', next: 'c2_wrong_day' }
    ]
  }),
  N('c2_wrong_day', 2, '兰婆', '村中长者 · 虚构讲述者', '4月17日常与红军离开、继续行进相连；结盟电报标注的是4月16日。', 'c2_day', { source: '日期修正' }),
  N('c2_time', 2, '兰婆', '村中长者 · 虚构讲述者', '最后选择电报标注的时间。', null, {
    source: '档案机关',
    choices: [
      { text: '16时整', next: 'c2_wrong_time' },
      { text: '17时30分', next: 'c2_18' },
      { text: '19时35分', next: 'c2_wrong_time' }
    ]
  }),
  N('c2_wrong_time', 2, '兰婆', '村中长者 · 虚构讲述者', '17时30分是报告电报标注的发电时间，不是协定开始或结束的准确时刻。', 'c2_time', { source: '时间修正' }),
  N('c2_18', 2, '兰婆', '村中长者 · 虚构讲述者', '档案盒打开了：1935年4月16日17时30分，彭德怀、杨尚昆向中央军委报告已与陆瑞光订立协定。', 'c2_19', { source: '档案转述', evidence: 'telegram' }),
  N('c2_19', 2, '兰婆', '村中长者 · 虚构讲述者', '电报确认了人物、日期、共同主张，还提到留下伤病员、工作人员并赠送枪支。', 'c2_20', { source: '档案转述', evidence: 'aid' }),
  N('c2_20', 2, '研学者 · 你', '当代来访者', '可不同资料又写26支或36支，一批伤病员或12名伤病员。该怎么处理？', 'c2_choice', { source: '游戏叙事', quest: Q('比对史料异文', '选择稳妥的主线摘要', 75) }),
  N('c2_choice', 2, '兰婆', '村中长者 · 虚构讲述者', '选择最适合写进主线的版本。', null, {
    source: '史料辨析',
    choices: [
      { text: '红军留下12名伤病员，并赠枪36支。', next: 'c2_wrong_number' },
      { text: '红军留下伤病员和工作人员，并向陆瑞光的队伍赠送枪支。', next: 'c2_correct_number' },
      { text: '数字不同，因此无法确认曾留下人员或赠送枪支。', next: 'c2_wrong_all' }
    ]
  }),
  N('c2_wrong_number', 2, '兰婆', '村中长者 · 虚构讲述者', '这个写法把存在异文的数字写成了唯一答案。若未核准档案影印件，主线应避免这样处理。', 'c2_choice', { source: '理解修正' }),
  N('c2_wrong_all', 2, '兰婆', '村中长者 · 虚构讲述者', '数字有异文，不等于整个事件无法确认。多份材料共同支持留下人员、赠送枪支，分歧集中在数量。', 'c2_choice', { source: '理解修正' }),
  N('c2_correct_number', 2, '兰婆', '村中长者 · 虚构讲述者', '这个写法保留了电报可以确认的核心事实，也没有掩盖数字仍需核验的问题。', 'c2_21', { source: '史料结论' }),
  N('c2_21', 2, '研学者 · 你', '当代来访者', '那陆瑞光在结盟时具体说过什么？', 'c2_22', { source: '游戏叙事' }),
  N('c2_22', 2, '兰婆', '村中长者 · 虚构讲述者', '现有公开材料没有可供逐字复原的完整会谈记录。游戏可以说明双方讨论了群众处境和革命主张，但不能编一段历史人物对白。', 'c2_23', { source: '史实边界' }),
  N('c2_23', 2, '研学者 · 你', '当代来访者', '电报确认结盟以后，故事是不是就结束了？', 'c2_24', { source: '游戏叙事' }),
  N('c2_24', 2, '兰婆', '村中长者 · 虚构讲述者', '恰恰相反。红军主力继续向北盘江行进，伤病员、工作人员和陆瑞光的队伍仍留在当地。下一章要查的是：盟约怎样成为行动。', 'c3intro', { source: '章节结论', quest: Q('第二问已核对', '前往村广场', 79) }),

  { id: 'c3intro', type: 'chapter', chapter: 3, index: '第三章', title: '盟约之后', copy: '红军主力离开以后，照料、联络和继续斗争如何延续这份选择？', next: 'c3_1' },
  N('c3_1', 3, '周伯', '村中长者 · 虚构讲述者', '兰婆让你带来的三张空卡，还在吗？', 'c3_2', { scene: '村广场 · 时间绳', time: '今天 · 傍晚', atmosphere: 'dusk', source: '当代讲述', quest: Q('选择通向哪里？', '辨认红军离开后的两条路线', 82) }),
  N('c3_2', 3, '研学者 · 你', '当代来访者', '“照料”“联络”“继续斗争”。可我还不知道该把它们放到哪些年份。', 'c3_route', { source: '游戏叙事' }),
  N('c3_route', 3, '周伯', '村中长者 · 虚构讲述者', '时间绳在4月17日分成两条。哪一条属于陆瑞光？', null, {
    source: '路线判断',
    choices: [
      { text: '跟随红军主力继续向西。', next: 'c3_wrong_route' },
      { text: '留在弄染及周边地区。', next: 'c3_3' }
    ]
  }),
  N('c3_wrong_route', 3, '周伯', '村中长者 · 虚构讲述者', '公开材料没有记载陆瑞光随红军主力继续长征。结盟以后，他首先留在当地。', 'c3_3', { source: '理解修正' }),
  N('c3_3', 3, '研学者 · 你', '当代来访者', '所以“支持红军”和“参加红军长征”不是一回事。', 'c3_4', { source: '调查理解', evidence: 'stay' }),
  N('c3_4', 3, '周伯', '村中长者 · 虚构讲述者', '要分清。这里还有红军留下的伤病员、工作人员，也还有他已经作出的承诺。', 'c3_5', { source: '史料说明', quest: Q('让盟约成为行动', '查看补给、护送与照料', 85) }),
  N('c3_5', 3, '研学者 · 你', '当代来访者', '后来的报道列出大米、布匹、盐、鸡蛋、草药等物资。都能写进主线吗？', 'c3_6', { source: '后来的报道' }),
  N('c3_6', 3, '周伯', '村中长者 · 虚构讲述者', '可以作为报道细节展示，主线写“组织群众提供补给”更稳妥。不能把后来叙述伪装成当年的物资清单。', 'c3_7', { source: '史料边界' }),
  N('c3_7', 3, '研学者 · 你', '当代来访者', '护送地点也有乐纪坡顶、坝草渡口等不同写法。', 'c3_8', { source: '地点异文' }),
  N('c3_8', 3, '周伯', '村中长者 · 虚构讲述者', '因此地图只表现“向北盘江方向护送”。能确认的重点，是支持没有停留在签订协定。', 'c3_9', { source: '史料结论' }),
  N('c3_9', 3, '周伯', '村中长者 · 虚构讲述者', '电报确认有人留下；求医买药和具体人数来自后来的军报、采访。合在一起，可以写陆瑞光承担了照料责任。', 'c3_10', { source: '分层取证', evidence: 'care' }),
  N('c3_10', 3, '研学者 · 你', '当代来访者', '方武先在后面的故事里是什么角色？', 'c3_11', { source: '游戏叙事', quest: Q('追踪留下的人', '了解共同开展的地方行动', 89) }),
  N('c3_11', 3, '周伯', '村中长者 · 虚构讲述者', '报道把他写作红军营长或副营长，具体职务仍需馆方核准。主线可以称“红军工作人员方武先等人”。', 'c3_12', { source: '职务待核' }),
  N('c3_12', 3, '周伯', '村中长者 · 虚构讲述者', '后来材料记载，他们继续宣传共产党的主张，在镇宁、关岭、紫云交界地区开展反军阀、反苛捐杂税的活动。', 'c3_13', { source: '军报与地方党史', evidence: 'fang' }),
  N('c3_13', 3, '研学者 · 你', '当代来访者', '能不能让他们在游戏里商量下一步，让玩家旁听？', 'c3_14', { source: '游戏叙事' }),
  N('c3_14', 3, '周伯', '村中长者 · 虚构讲述者', '没有完整会谈记录，就不能把编写的对白包装成历史现场。我们只用行动路线和资料卡说明他们共同活动。', 'c3_15', { source: '史实边界' }),
  N('c3_15', 3, '研学者 · 你', '当代来访者', '一条虚线从弄染指向广西右江，却在中途断了。', 'c3_16', { source: '路线示意', quest: Q('寻找组织', '检查受阻后的新联络线', 92) }),
  N('c3_16', 3, '周伯', '村中长者 · 虚构讲述者', '地方采访称，陆瑞光和方武先曾试图前往右江寻找红军或革命力量，途中受阻后返回。这段可作扩展剧情，不应冒充精确行军地图。', 'c3_choice_contact', { source: '采访记载' }),
  N('c3_choice_contact', 3, '研学者 · 你', '当代来访者', '这次受阻意味着什么？', null, {
    source: '调查判断',
    choices: [
      { text: '说明结盟关系已经中断。', next: 'c3_wrong_contact' },
      { text: '他们随后改为寻找安顺的中共地下组织。', next: 'c3_17' }
    ]
  }),
  N('c3_wrong_contact', 3, '周伯', '村中长者 · 虚构讲述者', '再看安顺方向的线。一次受阻没有结束行动，他们换了寻找组织的方式。', 'c3_choice_contact', { source: '理解修正' }),
  N('c3_17', 3, '周伯', '村中长者 · 虚构讲述者', '公开报道记载，陆瑞光根据方武先的建议，派罗诗虎前往安顺联系中共地下党组织。', 'c3_18', { source: '军报与采访', evidence: 'contact' }),
  N('c3_18', 3, '研学者 · 你', '当代来访者', '主线不必把所有人名变成记忆题，重要的是：寻找红军受阻后，联络没有停止。', 'c3_19', { source: '调查结论' }),
  N('c3_19', 3, '研学者 · 你', '当代来访者', '资料里为什么反复提到“四十八个村寨”？', 'c3_20', { source: '游戏叙事', quest: Q('联合地方力量', '连接三类行动节点', 95) }),
  N('c3_20', 3, '周伯', '村中长者 · 虚构讲述者', '地方材料记载，他们计划联合三县交界地区的少数民族村寨，组织游击力量、建立根据地。', 'c3_21', { source: '地方党史' }),
  N('c3_21', 3, '周伯', '村中长者 · 虚构讲述者', '但主线不要写得过满。更稳妥的是：“计划并着手联合当地村寨、组织游击斗争”。', 'c3_22', { source: '史料辨析', evidence: 'villages' }),
  N('c3_22', 3, '研学者 · 你', '当代来访者', '地方关系、留下的红军人员、地下组织，终于连成一张行动网络。', 'c3_23', { source: '调查结论' }),
  N('c3_23', 3, '周伯', '村中长者 · 虚构讲述者', '所以第三章不是结盟的余音，而是新的行动。时间绳接下来却停在1936年12月26日。', 'c3_24', { source: '转场', atmosphere: 'night', quest: Q('1936年12月26日', '确认被捕前的行动顺序', 97) }),
  N('c3_24', 3, '研学者 · 你', '当代来访者', '多份报道记载，陆瑞光在这一天被捕，随后被押往贵阳。', 'c3_25', { source: '多源互证', evidence: 'arrest' }),
  N('c3_25', 3, '周伯', '村中长者 · 虚构讲述者', '具体抓捕动作和现场对白主要来自后来的叙述，游戏不重演。', null, {
    source: '史实边界',
    choices: [
      { text: '做成潜行营救，让玩家改变结局。', next: 'c3_wrong_rescue' },
      { text: '停止胜负玩法，整理他被捕前已经完成的行动。', next: 'c3_26' }
    ]
  }),
  N('c3_wrong_rescue', 3, '周伯', '村中长者 · 虚构讲述者', '那会把已经发生的牺牲变成可以“打赢”的关卡。这里应停止解谜，不让历史结局取决于操作技巧。', 'c3_26', { source: '叙事边界' }),
  N('c3_26', 3, '研学者 · 你', '当代来访者', '弄染结盟，照料与共同活动，寻找组织、联合村寨，最后才是被捕。中间有一年多的行动。', 'c3_27', { source: '时间线核对' }),
  N('c3_27', 3, '周伯', '村中长者 · 虚构讲述者', '若只写“结盟后被捕”，真正履行盟约的过程就消失了。', 'c3_28', { source: '章节重点' }),
  N('c3_28', 3, '研学者 · 你', '当代来访者', '1937年春，陆瑞光在贵阳八角岩被杀害，年仅36岁。', 'c3_29', { source: '多源互证', evidence: 'death', quest: Q('没有虚构遗言的春天', '阅读牺牲与纪念', 99) }),
  N('c3_29', 3, '周伯', '村中长者 · 虚构讲述者', '这里不用行刑画面，也不用虚构遗言。他在结盟后的持续行动，本身已经说明了他的选择。', 'c3_30', { source: '史实边界' }),
  N('c3_30', 3, '研学者 · 你', '当代来访者', '时间绳却没有停在1937年。这里还有一张1989年的卡。', 'c3_31', { source: '游戏叙事' }),
  N('c3_31', 3, '周伯', '村中长者 · 虚构讲述者', '1989年3月31日，贵州省人民政府追认陆瑞光为革命烈士。地方采访还记载，同年国家民政部向遗属颁发革命烈士证明书。', 'c3_32', { source: '追认与采访', evidence: 'recognition' }),
  N('c3_32', 3, '研学者 · 你', '当代来访者', '所以“后人怎样记住他”，也需要像结盟日期一样核对文件。', 'c3_33', { source: '调查理解' }),
  N('c3_33', 3, '周伯', '村中长者 · 虚构讲述者', '纪念不是给故事加一个光亮结尾，而是后人用档案、遗址和讲述重新确认一个人的经历。', 'c3_end', { source: '章节结论', quest: Q('三个问题已回答', '回到村口整理走访手册', 100) }),
  N('c3_end', 3, '研学者 · 你', '当代来访者', '我起初只记得1935年4月16日。现在知道，这个日期之前和之后，连着陆瑞光的一生。', 'end', { scene: '村口研学板', time: '今天 · 入夜', source: '游戏叙事' }),
  { id: 'end', type: 'end' }
];

const storyMap = new Map(story.map(node => [node.id, node]));
const els = {
  game: document.querySelector('#game'),
  start: document.querySelector('#start-screen'),
  story: document.querySelector('#story-screen'),
  end: document.querySelector('#end-screen'),
  continueButton: document.querySelector('#continue-button'),
  newButton: document.querySelector('#new-button'),
  chapterNumber: document.querySelector('#chapter-number'),
  chapterTitle: document.querySelector('#chapter-title'),
  locationTime: document.querySelector('#location-time'),
  locationName: document.querySelector('#location-name'),
  questTitle: document.querySelector('#quest-title'),
  questDetail: document.querySelector('#quest-detail'),
  questProgress: document.querySelector('#quest-progress-bar'),
  speakerInitial: document.querySelector('#speaker-initial'),
  speakerName: document.querySelector('#speaker-name'),
  speakerRole: document.querySelector('#speaker-role'),
  sourceTag: document.querySelector('#source-tag'),
  characterArt: document.querySelector('#character-art'),
  dialogueText: document.querySelector('#dialogue-text'),
  dialoguePanel: document.querySelector('#dialogue-panel'),
  advanceButton: document.querySelector('#advance-button'),
  choiceList: document.querySelector('#choice-list'),
  toast: document.querySelector('#evidence-toast'),
  toastTitle: document.querySelector('#evidence-toast-title'),
  chapterCard: document.querySelector('#chapter-card'),
  chapterCardIndex: document.querySelector('#chapter-card-index'),
  chapterCardTitle: document.querySelector('#chapter-card-title'),
  chapterCardCopy: document.querySelector('#chapter-card-copy'),
  chapterCardButton: document.querySelector('#chapter-card-button'),
  notebookButton: document.querySelector('#notebook-button'),
  autoButton: document.querySelector('#auto-button'),
  homeButton: document.querySelector('#home-button'),
  notebook: document.querySelector('#notebook-dialog'),
  notebookClose: document.querySelector('#notebook-close'),
  notebookContent: document.querySelector('#notebook-content'),
  reviewButton: document.querySelector('#review-button'),
  replayButton: document.querySelector('#replay-button')
};

const chapterNames = [
  ['序章', '村口的三个问题'],
  ['第一章', '两个身份，同一个人'],
  ['第二章', '17时30分的电报'],
  ['第三章', '盟约之后']
];

let state = loadState();
let currentNode = null;
let typingTimer = null;
let autoTimer = null;
let typingDone = true;
let chapterNext = null;

function freshState() {
  return { currentId: 'p1', evidence: [], history: [], auto: false, completed: false, sceneName: '弄染村口', sceneTime: '今天 · 清晨', atmosphere: 'day' };
}

function loadState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(SAVE_KEY));
    return parsed && storyMap.has(parsed.currentId) ? { ...freshState(), ...parsed } : freshState();
  } catch {
    return freshState();
  }
}

function saveState() {
  localStorage.setItem(SAVE_KEY, JSON.stringify(state));
}

function setScreen(name) {
  [els.start, els.story, els.end].forEach(el => el.classList.remove('is-active'));
  els[name].classList.add('is-active');
}

function showStart() {
  clearTimers();
  setScreen('start');
  const hasProgress = state.history.length > 0 && !state.completed;
  els.continueButton.hidden = !hasProgress;
  els.newButton.textContent = state.completed ? '再次走访' : hasProgress ? '重新开始' : '开始故事';
}

function startNew() {
  if (state.history.length && !state.completed && !window.confirm('重新开始会覆盖当前走访进度，是否继续？')) return;
  state = freshState();
  saveState();
  renderNode('p1');
}

function renderNode(id) {
  clearTimers();
  const node = storyMap.get(id) || storyMap.get('p1');
  currentNode = node;
  state.currentId = node.id;
  if (!state.history.includes(node.id)) state.history.push(node.id);
  if (node.scene) state.sceneName = node.scene;
  if (node.time) state.sceneTime = node.time;
  if (node.atmosphere) state.atmosphere = node.atmosphere;
  saveState();

  if (node.type === 'end') {
    updateCharacter();
    state.completed = true;
    saveState();
    setScreen('end');
    return;
  }

  setScreen('story');
  applyScene(state.sceneName);
  els.locationName.textContent = state.sceneName;
  els.locationTime.textContent = state.sceneTime;
  els.game.dataset.atmosphere = state.atmosphere;
  els.chapterCard.hidden = true;
  els.dialoguePanel.hidden = false;
  els.choiceList.innerHTML = '';
  els.story.classList.remove('has-choices');

  if (node.type === 'chapter') {
    updateCharacter();
    els.dialoguePanel.hidden = true;
    els.chapterCard.hidden = false;
    els.chapterCardIndex.textContent = node.index;
    els.chapterCardTitle.textContent = node.title;
    els.chapterCardCopy.textContent = node.copy;
    chapterNext = node.next;
    updateChapter(node.chapter);
    return;
  }

  const chapter = node.chapter ?? 0;
  updateChapter(chapter);
  if (node.quest) {
    els.questTitle.textContent = node.quest.title;
    els.questDetail.textContent = node.quest.detail;
    els.questProgress.style.width = `${node.quest.progress}%`;
  }

  els.speakerName.textContent = node.speaker;
  els.speakerRole.textContent = node.role;
  els.sourceTag.textContent = node.source || '游戏叙事';
  els.speakerInitial.textContent = speakerInitial(node.speaker);
  updateCharacter(node.speaker);
  if (node.evidence) collectEvidence(node.evidence);
  typeText(node.text, () => showChoices(node));
}

function updateChapter(chapter) {
  const [index, title] = chapterNames[chapter] || chapterNames[0];
  els.chapterNumber.textContent = index;
  els.chapterTitle.textContent = title;
}

function speakerInitial(name = '') {
  if (name.startsWith('研学者')) return '访';
  return name.charAt(0) || '记';
}

function applyScene(sceneName) {
  const src = sceneImages[sceneName] || 'assets/nongran-mountains.webp';
  els.game.style.setProperty('--scene-image', `url("${src}")`);
}

function updateCharacter(speaker = '') {
  const character = characterImages[speaker];
  els.characterArt.classList.remove('is-visible', 'character-left', 'character-right');
  if (!character) {
    els.characterArt.hidden = true;
    els.characterArt.removeAttribute('src');
    els.characterArt.alt = '';
    return;
  }
  els.characterArt.src = character.src;
  els.characterArt.alt = `${speaker}人物立绘`;
  els.characterArt.hidden = false;
  els.characterArt.classList.add(`character-${character.side}`);
  window.requestAnimationFrame(() => els.characterArt.classList.add('is-visible'));
}

function typeText(text, onDone) {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  els.dialogueText.textContent = '';
  typingDone = false;
  let index = 0;
  const finish = () => {
    els.dialogueText.textContent = text;
    typingDone = true;
    onDone?.();
    scheduleAuto();
  };
  if (reduced) {
    finish();
    return;
  }
  typingTimer = window.setInterval(() => {
    index += 1;
    els.dialogueText.textContent = text.slice(0, index);
    if (index >= text.length) {
      window.clearInterval(typingTimer);
      typingTimer = null;
      finish();
    }
  }, 18);
}

function completeTyping() {
  if (!currentNode || typingDone || currentNode.type) return false;
  if (typingTimer) window.clearInterval(typingTimer);
  typingTimer = null;
  els.dialogueText.textContent = currentNode.text;
  typingDone = true;
  showChoices(currentNode);
  scheduleAuto();
  return true;
}

function showChoices(node) {
  els.choiceList.innerHTML = '';
  els.story.classList.toggle('has-choices', Boolean(node.choices));
  if (!node.choices) return;
  node.choices.forEach((choice, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = choice.text;
    button.style.animationDelay = `${index * 70}ms`;
    button.addEventListener('click', () => renderNode(choice.next));
    els.choiceList.appendChild(button);
  });
}

function advance() {
  if (!currentNode || currentNode.type) return;
  if (completeTyping()) return;
  if (currentNode.choices) return;
  if (currentNode.next) renderNode(currentNode.next);
}

function collectEvidence(id) {
  if (state.evidence.includes(id)) return;
  state.evidence.push(id);
  saveState();
  const item = evidenceCatalog.find(entry => entry.id === id);
  if (!item) return;
  els.toastTitle.textContent = item.title;
  els.toast.classList.add('is-visible');
  window.setTimeout(() => els.toast.classList.remove('is-visible'), 2400);
}

function clearTimers() {
  if (typingTimer) window.clearInterval(typingTimer);
  if (autoTimer) window.clearTimeout(autoTimer);
  typingTimer = null;
  autoTimer = null;
}

function scheduleAuto() {
  if (!state.auto || !typingDone || !currentNode || currentNode.choices || currentNode.type) return;
  autoTimer = window.setTimeout(advance, 2600 + Math.min(currentNode.text.length * 28, 2500));
}

function toggleAuto() {
  state.auto = !state.auto;
  els.autoButton.setAttribute('aria-pressed', String(state.auto));
  saveState();
  if (state.auto) scheduleAuto();
  else if (autoTimer) window.clearTimeout(autoTimer);
}

function openNotebook(tab = 'evidence') {
  renderNotebook(tab);
  els.notebook.showModal();
}

function renderNotebook(tab) {
  document.querySelectorAll('.notebook-tabs button').forEach(button => {
    button.classList.toggle('is-active', button.dataset.tab === tab);
  });
  if (tab === 'evidence') {
    els.notebookContent.innerHTML = `<div class="evidence-grid">${evidenceCatalog.map(item => {
      const unlocked = state.evidence.includes(item.id);
      return `<article class="note-card ${unlocked ? '' : 'is-locked'}"><span>${unlocked ? item.type : '尚未发现'}</span><h3>${unlocked ? item.title : '未解锁线索'}</h3><p>${unlocked ? item.text : '继续走访并核对资料。'}</p></article>`;
    }).join('')}</div>`;
    return;
  }
  if (tab === 'timeline') {
    els.notebookContent.innerHTML = `<div class="timeline-list">${timeline.map(([date, text]) => `<article class="timeline-item"><strong>${date}</strong><p>${text}</p></article>`).join('')}</div>`;
    return;
  }
  els.notebookContent.innerHTML = `<p class="source-note">游戏采用公开资料整理。历史人物不使用虚构对白；数字和职务存在异文时，主线使用较稳妥的概括，正式展陈仍需馆方依据原始档案终审。</p><div class="source-list">${sources.map(([title, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${title} ↗</a>`).join('')}</div>`;
}

els.newButton.addEventListener('click', startNew);
els.continueButton.addEventListener('click', () => renderNode(state.currentId));
els.advanceButton.addEventListener('click', advance);
els.dialoguePanel.addEventListener('click', event => {
  if (event.target.closest('button')) return;
  advance();
});
els.chapterCardButton.addEventListener('click', () => renderNode(chapterNext));
els.notebookButton.addEventListener('click', () => openNotebook('evidence'));
els.notebookClose.addEventListener('click', () => els.notebook.close());
els.autoButton.addEventListener('click', toggleAuto);
els.homeButton.addEventListener('click', showStart);
els.reviewButton.addEventListener('click', () => openNotebook('evidence'));
els.replayButton.addEventListener('click', () => {
  state = freshState();
  saveState();
  renderNode('p1');
});
document.querySelectorAll('.notebook-tabs button').forEach(button => button.addEventListener('click', () => renderNotebook(button.dataset.tab)));

document.addEventListener('keydown', event => {
  if (els.notebook.open) {
    if (event.key === 'Escape') els.notebook.close();
    return;
  }
  if ((event.key === ' ' || event.key === 'Enter') && els.story.classList.contains('is-active')) {
    event.preventDefault();
    if (currentNode?.type === 'chapter') renderNode(chapterNext);
    else advance();
  }
});

els.autoButton.setAttribute('aria-pressed', String(state.auto));
function preloadStoryAssets() {
  const sources = new Set(Object.values(sceneImages).concat(Object.values(characterImages).map(item => item.src)));
  sources.forEach(src => {
    const image = new Image();
    image.decoding = 'async';
    image.src = src;
  });
}

window.addEventListener('load', () => {
  if ('requestIdleCallback' in window) window.requestIdleCallback(preloadStoryAssets);
  else window.setTimeout(preloadStoryAssets, 300);
}, { once: true });
showStart();
