# 《弄染寻踪·火种永续》技术设计文档

**项目名称**：弄染寻踪·火种永续——陆瑞光革命历史研学闯关网页H5  
**文档版本**：V1.0  
**文档性质**：技术设计文档（对接开发团队）  
**编制日期**：2026年8月

## 一、文档概述

### 1.1 文档目的

本文档基于《项目开发文档》与《完整闯关内容文档》，从技术实现角度描述系统的架构设计、数据模型、接口规范、UI交互方案及部署策略，供前端开发人员直接使用。

### 1.2 技术定位

本游戏为**纯前端H5轻量化应用**，无需服务端复杂接口，采用HTML5 + CSS3 + JavaScript（ES6+）技术栈，所有数据存储于浏览器本地，即开即用。

## 二、整体技术架构

### 2.1 架构图（逻辑分层）

```
┌─────────────────────────────────────────────────────────────┐
│                         展示层                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │ 首页启动  │ │ 剧情展示  │ │ 答题组件  │ │ 证书生成  │      │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘      │
├─────────────────────────────────────────────────────────────┤
│                         业务逻辑层                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │
│  │  闯关引擎     │ │  答题判定器   │ │  徽章管理器  │       │
│  │ (进度控制)    │ │ (含关键词匹配)│ │ (状态追踪)   │       │
│  └──────────────┘ └──────────────┘ └──────────────┘       │
│  ┌──────────────┐ ┌──────────────┐                        │
│  │  二维码解析   │ │  证书合成器   │                        │
│  │ (彩蛋解锁)    │ │ (Canvas生成)  │                        │
│  └──────────────┘ └──────────────┘                        │
├─────────────────────────────────────────────────────────────┤
│                         数据层                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           题库数据 (JS对象数组，只读)                │   │
│  ├──────────────────────────────────────────────────────┤   │
│  │         LocalStorage (进度/徽章/通关状态)            │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 MVC模式应用

借鉴游戏开发的经典MVC模式：

- **Model（数据层）**：管理题库数据、玩家进度、徽章状态，独立于UI
- **View（展示层）**：各页面DOM渲染，响应Model变化
- **Controller（控制层）**：处理用户交互（点击选项、提交答案、页面切换），驱动Model更新和View刷新

## 三、数据结构设计

### 3.1 题库数据结构（JavaScript）

采用对象数组存储全部题目，每道题包含完整字段：

```javascript
// 题型常量
const QUESTION_TYPES = {
  SINGLE: 'single',       // 单选
  MULTIPLE: 'multiple',   // 多选
  FILL: 'fill',           // 填空
  SORT: 'sort',           // 时间排序
  IMAGE: 'image',         // 识图选择
  SCENE: 'scene',         // 情景思辨
  ESSAY: 'essay',         // 简答感悟
  PUZZLE: 'puzzle'        // 拼图
};

// 单题数据结构
{
  id: 'ch1_q1',           // 唯一标识：章节_题号
  chapter: 1,             // 所属章节 1-5（序章为0）
  type: 'single',         // 题型（见常量）
  question: '陆瑞光是哪个民族的英雄？',
  options: ['苗族', '布依族', '彝族'],  // 选项数组
  answer: 1,              // 正确答案索引（多选为数组，填空/简答为字符串）
  keywordHint: null,      // 简答题关键词数组，如['重信守诺','坚贞不屈']
  explanation: '陆瑞光，镇宁弄染寨布依族领袖...',
  image: null,            // 识图题配图URL
  isHidden: false         // 是否需扫码解锁（彩蛋题）
}
```

### 3.2 章节数据结构

```javascript
const CHAPTERS = [
  { id: 0, title: '序章·寻访启程', badge: '山野布衣' },
  { id: 1, title: '第一章·乱世奋起', badge: '乱世英豪' },
  { id: 2, title: '第二章·弄染相逢', badge: '弄染之盟' },
  { id: 3, title: '第三章·信守盟约', badge: '忠信守盟' },
  { id: 4, title: '第四章·烈火忠魂', badge: '烈火忠魂' },
  { id: 5, title: '第五章·火种千秋', badge: '火种千秋' }
];
```

### 3.3 进度数据模型（LocalStorage存储）

```javascript
// 存储键名：'luruiguang_progress'
{
  currentChapter: 0,          // 当前所在章节
  currentQuestionIndex: 0,    // 当前章节内题目索引
  completedChapters: [0],     // 已完成章节ID列表
  badges: ['山野布衣'],       // 已收集徽章名称列表
  isCompleted: false,         // 是否全部通关
  completedAt: null,          // 通关时间戳
  certificateName: null,      // 证书预留姓名
  hiddenUnlocked: []          // 已解锁彩蛋ID列表
}
```

### 3.4 徽章数据结构

```javascript
const BADGES = {
  '山野布衣': { 
    icon: 'badge1.png', 
    description: '开启寻访之旅' 
  },
  // ... 其余4枚
};
```

## 四、核心功能模块设计

### 4.1 闯关引擎（Progress Engine）

**职责**：控制玩家在章节间流转，维护当前进度。

**核心方法**：

| 方法名 | 功能说明 |
|--------|----------|
| `init()` | 启动时读取LocalStorage，恢复进度 |
| `getCurrentChapter()` | 获取当前章节数据 |
| `getCurrentQuestion()` | 获取当前题目 |
| `advanceToNext()` | 当前题答完且正确后推进到下一题/下一章 |
| `isChapterComplete(chapterId)` | 判断章节是否通关 |
| `save()` | 保存进度到LocalStorage |

**关键设计**：答错不重置进度、不扣分，支持无限次重答——答题判定器仅控制“答对时推进”，答错时仅展示解析弹窗。

### 4.2 答题判定器（Answer Validator）

支持多题型答案判定：

| 题型 | 判定逻辑 |
|------|----------|
| 单选/识图 | `selectedIndex === question.answer` |
| 多选 | 所选索引数组与答案数组完全匹配 |
| 填空 | 去除空格后字符串比对（不区分大小写） |
| 时间排序 | 用户排序数组 === 标准顺序数组 |
| 简答感悟题 | 关键词模糊匹配：用户输入文本命中至少1个关键词即通过 |
| 拼图 | 完成拼图事件触发判定通过 |

**简答题关键词配置示例**：

```javascript
// 第四章简答题
{
  type: 'essay',
  keywordHint: ['重信守诺', '坚贞不屈', '不怕牺牲', '守护革命']
}
```

### 4.3 徽章管理器（Badge Manager）

- 章节通关后自动解锁对应徽章
- 徽章状态存储在LocalStorage的`badges`数组中
- 终章页面展示全部5枚徽章合集

### 4.4 二维码扫码解锁（QR Scanner）

- 利用手机摄像头或微信扫一扫功能
- 二维码携带参数，如`?unlock=ch2_extra`
- 解析后解锁对应隐藏内容（拓展图文），不影响主线进度
- 解锁状态存入LocalStorage`hiddenUnlocked`数组

### 4.5 证书合成器（Certificate Generator）

**技术方案**：Canvas 2D绘制，支持一键保存为图片。

**功能流程**：

1. 用户在终章页输入姓名
2. 调用Canvas API绘制证书模板（标题、姓名、固定结业词、编号、日期、馆章）
3. 生成PNG图片，通过`<a>`标签的`download`属性实现一键保存
4. 支持长按/右键保存（移动端可引导截图分享）

**证书编号生成规则**：`LRG + 年月日 + 4位随机数`，如`LRG202608140032`

### 4.6 本地缓存与进度恢复（LocalStorage）

- 每次答题推进、徽章解锁时自动写入LocalStorage
- 页面加载时优先读取缓存恢复进度
- 支持`beforeunload`事件防丢失（用户关闭页面前自动保存）

## 五、页面交互与UI规范

### 5.1 视觉规范

| 规范项 | 要求 |
|--------|------|
| 主色调 | 中国红 (#C41A1A) + 暗金 (#C9A96E) + 素白 (#F5F0EB) |
| 背景 | 老照片肌理、宣纸纹理、暗纹党史元素 |
| 字体 | 标题：书法体（如华文行楷/思源宋体）；正文：无衬线黑体 |
| 禁止 | 卡通、Q版、幼稚元素 |

### 5.2 核心页面组件

#### 页面切换机制

- 采用SPA（单页应用）模式，通过`div`的`classList`控制显隐切换
- 页面ID：`#page-home`、`#page-prologue`、`#page-chapter`、`#page-final`

#### 答题交互流程

```
用户点击选项
    ↓
禁用所有选项按钮（防连点）
    ↓
判定正误
    ├─ 正确 → 高亮绿色 → 0.8s后推进下一题/章节
    └─ 错误 → 高亮红色 → 弹出史料解析弹窗 → 用户关闭 → 重新启用选项
```

#### 剧情过渡

- 每章入口展示篇章剧情文案 + 背景图
- 点击“进入闯关”按钮进入答题环节

### 5.3 响应式适配

- 采用CSS Grid + Flexbox布局
- 设计断点：手机（≤768px）、平板（769-1024px）、桌面（>1024px）
- 字体以`rem`为单位，适配不同屏幕

## 六、技术选型与依赖

### 6.1 技术栈总览

| 层 | 选型 | 说明 |
|----|------|------|
| 结构 | HTML5 | 语义化标签 |
| 样式 | CSS3 | 原生CSS + 动画 |
| 逻辑 | JavaScript ES6+ | 原生JS，无框架依赖 |
| 存储 | LocalStorage | 进度持久化 |
| 图形 | Canvas 2D | 证书生成 |
| 部署 | 静态资源服务 | 任意Web服务器 |

### 6.2 外部依赖

原则上**零依赖**，所有功能原生实现：

- 二维码识别：使用微信内置扫一扫（通过链接参数传递），或集成`html5-qrcode`轻量库（可选）
- 图片素材：由纪念馆提供原图，开发时做WebP/JPEG压缩优化

## 七、目录结构

```
lurui-guang-game/
├── index.html                    # 主入口（含所有页面模板）
├── css/
│   ├── style.css                 # 全局样式
│   ├── pages.css                 # 各页面独有样式
│   └── responsive.css            # 响应式适配
├── js/
│   ├── data/
│   │   ├── questions.js          # 完整题库数据
│   │   ├── chapters.js           # 章节配置
│   │   └── badges.js             # 徽章配置
│   ├── models/
│   │   ├── ProgressModel.js      # 进度数据模型
│   │   └── QuestionModel.js      # 题目数据模型
│   ├── controllers/
│   │   ├── GameController.js     # 闯关主控制器
│   │   ├── AnswerValidator.js    # 答题判定器
│   │   └── BadgeManager.js       # 徽章管理
│   ├── views/
│   │   ├── PageRenderer.js       # 页面渲染器
│   │   └── CertificateRenderer.js # 证书Canvas绘制
│   ├── utils/
│   │   ├── storage.js            # LocalStorage封装
│   │   ├── qr-parser.js          # 二维码参数解析
│   │   └── validator.js          # 通用校验工具
│   └── app.js                    # 应用入口，初始化
├── assets/
│   ├── images/
│   │   ├── backgrounds/          # 章节背景图
│   │   ├── badges/               # 5枚徽章图标
│   │   ├── props/                # 识图题配图
│   │   └── textures/             # 老照片肌理、宣纸纹理
│   └── fonts/
│       └── calligraphy.woff2     # 书法字体文件
└── README.md                      # 项目说明
```

## 八、部署方案

### 8.1 部署方式

1. **独立域名部署**：将静态文件上传至Web服务器或对象存储（如OSS）
2. **嵌入纪念馆官网**：通过iframe嵌入或直接作为官网子页面
3. **微信公众号菜单**：配置为菜单链接，在微信内置浏览器中打开

### 8.2 性能优化

- 图片使用WebP格式（兼容JPEG备用），压缩至适合移动端的大小
- 字体文件使用woff2格式，通过`font-display:swap`优化加载
- 首次加载时仅渲染首页，章节内容按需加载

### 8.3 兼容性

- 目标浏览器：Chrome 60+、Safari 12+、微信内置浏览器（X5内核）
- 使用`babel`（可选）进行语法降级

## 九、开发清单与优先级

| 优先级 | 模块 | 预估工时 |
|--------|------|----------|
| P0 | 首页启动页 + 游玩说明 | 0.5天 |
| P0 | 题库数据结构 + 数据填充（全部题目） | 0.5天 |
| P0 | 闯关引擎 + 答题判定器 | 1天 |
| P0 | 5大章节页面渲染 + 剧情展示 | 2天 |
| P0 | 本地存储 + 进度恢复 | 0.5天 |
| P1 | 徽章系统 + 合集展示 | 0.5天 |
| P1 | 终章 + Canvas证书生成 | 1天 |
| P1 | 响应式适配 | 0.5天 |
| P2 | 二维码扫码彩蛋 | 0.5天 |
| P2 | 视觉细节打磨 + 动效 | 1天 |
| **合计** | | **约8天** |

## 十、附录：关键代码示例

### A. LocalStorage读写封装

```javascript
const Storage = {
  get(key, defaultVal) {
    try {
      const data = localStorage.getItem('lrg_' + key);
      return data ? JSON.parse(data) : defaultVal;
    } catch { return defaultVal; }
  },
  set(key, val) {
    localStorage.setItem('lrg_' + key, JSON.stringify(val));
  }
};
```

### B. 答题判定核心逻辑（示意）

```javascript
function validateAnswer(question, userAnswer) {
  switch(question.type) {
    case 'single':
    case 'image':
      return userAnswer === question.answer;
    case 'multiple':
      return arraysEqual(userAnswer.sort(), question.answer.sort());
    case 'fill':
      return userAnswer.trim().toLowerCase() === question.answer.toLowerCase();
    case 'essay':
      return question.keywordHint.some(kw => 
        userAnswer.includes(kw)
      );
    default:
      return false;
  }
}
```

---
