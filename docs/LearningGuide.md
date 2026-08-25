# 《弄染寻踪 · 火种永续》项目学习指南

本指南面向第一次接触本项目的学习者，帮助你从“能运行”到“能看懂”，再到“能动手修改”。建议按顺序完成，不必一次读完所有源码。

## 一、项目是什么

本项目是一个纯前端 H5 红色研学闯关游戏，主题为陆瑞光与弄染结盟历史。核心体验是：

1. 在 2D 地图中操控研学记者探索。
2. 进入章节后体验 Galgame 式历史剧情。
3. 在对话中完成知识选择、微玩法、收集与制作活动。
4. 通关后解锁徽章和记忆物证。
5. 全部完成后生成电子研学证书。

技术特点：

- 无框架、无构建工具，全部使用原生 HTML/CSS/JavaScript。
- 所有脚本通过 `<script>` 标签按顺序加载。
- 游戏数据以全局变量形式挂在 `window` 上。
- 玩家进度保存在浏览器 `LocalStorage` 中。
- 静态站点，可直接通过任意静态服务器运行。

## 二、建议的先备知识

不需要掌握框架，但以下基础会让学习更顺利：

- HTML：认识标签、CSS 类名、`<script>` 加载顺序。
- CSS：了解变量、Flexbox、响应式媒体查询。
- JavaScript：了解函数、类、对象、数组、事件监听、`localStorage`。
- Canvas：看懂基本绘制和动画循环即可，不要求熟练。

## 三、运行项目

在项目根目录执行以下任一命令：

```bash
python -m http.server 8080
```

或：

```bash
npx --yes serve .
```

然后浏览器打开：

```text
http://localhost:8080
```

第一次学习时，建议完整游玩一遍：

- 先进入首页，点击“开始寻访”。
- 在地图中移动，靠近金色光点并互动。
- 体验对话、选择题、微玩法、收集和制作。
- 通关后观察徽章、物证、终章页面和证书生成。
- 刷新页面，观察进度是否恢复。
- 在首页点击“重新开始”，观察 `LocalStorage` 如何被重置。

## 四、学习顺序总览

建议按照“运行体验 → 入口 → 数据 → 模型 → 控制器 → 视图 → 工具 → 样式与素材”的顺序学习。

| 阶段 | 目标 | 关键文件 |
| --- | --- | --- |
| 0 | 运行并体验游戏 | `index.html` |
| 1 | 理解入口和启动流程 | `js/app.js` |
| 2 | 理解数据如何组织 | `js/data/*.js` |
| 3 | 理解进度如何保存 | `js/models/*.js` |
| 4 | 理解游戏逻辑如何运行 | `js/controllers/*.js` |
| 5 | 理解页面如何渲染 | `js/views/*.js` |
| 6 | 理解通用工具 | `js/utils/*.js` |
| 7 | 理解视觉与响应式 | `css/*.css` |
| 8 | 阅读需求与技术文档 | `docs/*.md` |

## 五、阶段详解

### 阶段 0：先运行，再读代码

先不要急着读源码。打开 `index.html`，完成一轮完整游玩。注意观察：

- 页面如何从首页切换到地图。
- 对话如何逐字显示。
- 选择错误后如何给出史料解析。
- 微玩法如何嵌入对话。
- 章节完成后如何回到地图。
- 终章如何展示徽章和证书。

带着这些体验再读源码，会更容易理解每个模块存在的目的。

### 阶段 1：看懂入口

重点阅读：

- `index.html`
- `js/app.js`

需要弄懂的问题：

1. `index.html` 中 `<script>` 的加载顺序是什么？
2. 为什么脚本加载顺序不能随意调整？
3. `app.js` 创建了哪些对象？
4. `AdventureController` 在这里扮演什么角色？
5. `beforeunload` 事件在做什么？

### 阶段 2：看懂数据层

重点阅读 `js/data/` 下的文件。每个文件都定义了一类全局数据：

- `chapters.js`：章节信息。
- `map.js`：地图、节点、障碍物、史料碎片。
- `scripts.js`：对话剧本。
- `questions.js`：知识问答题库。
- `microgames.js`：微玩法配置。
- `collections.js`：收集玩法配置。
- `crafts.js`：制作玩法配置。
- `badges.js`：徽章配置。
- `artifacts.js`：物证、成就和时间轴配置。

建议方法：先打开 `chapters.js` 和 `map.js`，把六个章节和地图节点对应起来；再打开 `scripts.js`，对照刚才游玩过的剧情理解 `steps` 结构。

### 阶段 3：看懂进度模型

重点阅读：

- `js/models/ProgressModel.js`
- `js/models/QuestionModel.js`

需要弄懂的问题：

1. 默认进度状态有哪些字段？
2. 进度如何从 `LocalStorage` 恢复？
3. `save()` 和 `reset()` 分别做了什么？
4. 如何标记章节完成、解锁徽章、添加物证？
5. `QuestionModel` 为什么适合作为只读查询层？

### 阶段 4：看懂控制器

控制器是项目最难但最重要的部分。建议按依赖关系学习，而不是按字母顺序。

推荐顺序：

1. `AdventureController.js`：先看它如何调度整个游戏。
2. `MapEngine.js`：再看地图移动、碰撞和交互。
3. `DialogueEngine.js`：理解对话状态机和步骤切换。
4. `MicroGameEngine.js`：理解微玩法如何按类型分发。
5. `CollectionGameEngine.js` 和 `CraftGameEngine.js`：理解两类嵌入式活动。
6. `AnswerValidator.js`、`BadgeManager.js`、`CollectManager.js`、`AchievementManager.js`：理解判定与奖励。

学习建议：

- 先找到每个类的 `constructor` 和对外公开的方法。
- 再追踪一个完整流程：点击地图节点 → 开始对话 → 完成微玩法 → 章节结算。
- 不要一开始就逐行读完整文件，先建立整体印象。

注意：`GameController.js` 是早期按题目线性推进的控制器，当前 `app.js` 不实例化它，学习时先不要花太多时间。

### 阶段 5：看懂视图层

重点阅读：

- `js/views/PageRenderer.js`
- `js/views/MapView.js`
- `js/views/CertificateRenderer.js`

需要弄懂的问题：

1. `PageRenderer` 负责哪些页面？
2. 页面切换的本质是什么？
3. 题目页如何根据不同题型渲染不同组件？
4. `MapView` 如何创建 Canvas 并桥接 `MapEngine`？
5. 证书如何通过 Canvas 生成并保存？

### 阶段 6：看懂工具层

重点阅读：

- `js/utils/storage.js`
- `js/utils/validator.js`
- `js/utils/qr-parser.js`

这三个文件都比较短，适合作为入门阅读。它们分别负责本地存储、文本判定和二维码彩蛋参数解析。

### 阶段 7：看懂样式与素材

重点阅读：

- `css/style.css`：设计变量和全局样式。
- `css/pages.css`：页面样式。
- `css/map.css`：地图样式。
- `css/dialogue.css`：对话样式。
- `css/microgame.css`：微玩法样式。
- `css/responsive.css`：响应式样式。

同时查看 `assets/images/` 下的目录，理解素材如何按背景、人物、徽章、物证、道具和纹理分类。

### 阶段 8：阅读文档

推荐阅读顺序：

1. `docs/PRD3.0.md`：当前玩法主文档。
2. `docs/TechnicalDesign.md`：技术架构主文档。
3. `docs/game_content.md`：完整闯关内容。
4. 需要了解需求演进时，再看 `docs/PRD.md`、`docs/PRD2.0.md` 和 `docs/PRD4.0.md`。

## 六、动手练习

完成阅读后，可以通过以下练习验证理解。建议从易到难进行。

### 练习 1：新增一个史料碎片

目标：在地图中增加一个新的知识点。

可修改：

- `js/data/map.js`：在 `knowledge` 数组中加入新条目。

完成后刷新页面，观察地图上是否出现新的史料碎片，点击是否显示正确内容。

### 练习 2：修改一段对话文案

目标：修改序章的第一句旁白。

可修改：

- `js/data/scripts.js`：找到 `prologue_01`，修改 `text` 字段。

完成后重新开始游戏，观察对话是否生效。

### 练习 3：修改一个知识点

目标：修改序章第一个选择题的解析。

可修改：

- `js/data/scripts.js`：找到序章的选择题 `prologue_choice`，修改错误选项的 `feedback`。

### 练习 4：调整地图节点位置

目标：把第一章节点移动到一个新位置。

可修改：

- `js/data/map.js`：调整对应节点的 `x`、`y`。

观察玩家是否能走到新位置并触发剧情。

### 练习 5：增加一个新的知识问答题

目标：在第一章中新增一道选择题。

可修改：

- `js/data/questions.js`：加入一个新题目对象。
- `js/data/scripts.js`：如需在对话中体现，可加入对应步骤。

建议先只改题库，观察旧版题目模型是否仍能读取；再尝试在主对话中引用它。

### 练习 6：增加一种新徽章或成就

目标：为某个章节增加额外奖励。

可修改：

- `js/data/badges.js` 或 `js/data/artifacts.js`。
- `js/controllers/BadgeManager.js` 或 `AchievementManager.js` 中的判定逻辑。

建议先做简单版本，例如为生成证书新增一个可显示的徽章。

### 练习 7：新增一个彩蛋参数

目标：让游戏支持新的 URL 解锁参数。

可修改：

- `js/utils/qr-parser.js`：扩展解析逻辑。
- `js/views/PageRenderer.js`：找到隐藏内容的展示位置。
- `js/controllers/AdventureController.js` 或 `ProgressModel.js`：接入解锁状态。

### 练习 8：调整证书样式

目标：修改证书标题或颜色。

可修改：

- `js/views/CertificateRenderer.js`：找到 `fillText` 或颜色相关代码。

完成后通关并生成证书，观察样式变化。

## 七、调试技巧

### 使用浏览器开发者工具

1. 按 `F12` 打开开发者工具。
2. 在 Console 中查看报错和日志。
3. 在 Elements 中查看当前页面 DOM。
4. 在 Application → Local Storage 中查看进度数据。
5. 在 Sources 中给 `js/` 下的脚本打断点。

### 使用全局变量快速调试

因为项目使用 `window` 暴露全局变量，可以直接在 Console 中查看：

```javascript
window.GAME_CHAPTERS
window.GAME_MAP
window.GAME_SCRIPTS
window.GAME_QUESTIONS
window.GAME_BADGES
```

也可以手动读取进度：

```javascript
localStorage.getItem('lrg_progress')
```

### 修改后刷新

本项目没有构建步骤，修改 `.js`、`.css`、`.html` 后直接刷新浏览器即可看到效果。若页面仍显示旧内容，可使用 `Ctrl + F5` 强制刷新。

### 清空进度重新测试

可以在浏览器开发者工具的 Application → Local Storage 中删除 `lrg_progress`，或在游戏首页点击“重新开始”。

## 八、学习时容易踩的坑

1. 脚本加载顺序很重要。`app.js` 最后加载，因此它启动时前面定义的全局对象已经存在。
2. 所有数据文件都挂在 `window` 上，不要在本地单独运行 JS 文件。
3. 当前主控制器是 `AdventureController`，不是 `GameController`。
4. `assets/images/` 下的 SVG 多为可运行占位图，正式素材需要替换。
5. `README.md` 和 `docs/TechnicalDesign.md` 是重要入口，遇到文档矛盾时以代码和 `PRD3.0.md` 为主。
6. 修改数据后最好清空一次旧进度，避免旧缓存状态和新数据结构冲突。

## 九、推荐学习节奏

- 第 1 天：运行游戏，通读 `README.md` 和 `docs/TechnicalDesign.md`。
- 第 2 天：阅读 `index.html`、`js/app.js` 和全部 `js/data/`。
- 第 3 天：阅读 `js/models/` 和 `js/utils/`，完成练习 1 和 2。
- 第 4 天：阅读 `MapEngine.js` 和 `DialogueEngine.js`，完成练习 4。
- 第 5 天：阅读 `MicroGameEngine.js`、`CollectionGameEngine.js` 和 `CraftGameEngine.js`。
- 第 6 天：阅读 `PageRenderer.js`、`MapView.js` 和 `CertificateRenderer.js`。
- 第 7 天：完成练习 5 到 8，尝试独立追踪一个完整流程。

## 十、学习完成标准

完成以下事项后，可以认为已经掌握项目基础：

- 能说清一次完整游玩链路涉及哪些文件。
- 能说明 `ProgressModel` 保存了哪些关键状态。
- 能解释 `AdventureController` 如何调度地图、对话和结算。
- 能说明对话中 `line`、`choice`、`microgame`、`collect`、`craft` 步骤类型的区别。
- 能独立新增一个地图节点并触发剧情。
- 能独立新增一个知识点并让它出现在游戏中。
- 能通过浏览器开发者工具查看并修改进度。