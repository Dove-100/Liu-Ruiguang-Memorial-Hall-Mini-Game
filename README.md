# 弄染寻踪 · 火种永续

陆瑞光纪念馆红色历史研学闯关网页 H5。纯前端实现，零框架依赖，使用 HTML5 + CSS3 + JavaScript（ES6+）与 LocalStorage 保存进度。

## 项目简介

《弄染寻踪 · 火种永续》是一款面向陆瑞光纪念馆红色历史研学场景的互动闯关 H5。玩家以历史寻访者身份，在 2D 俯视角展厅地图中探索镇宁弄染寨红色记忆，沿着“乱世奋起 → 弄染相逢 → 信守盟约 → 烈火忠魂 → 火种千秋”的章节脉络，通过剧情对话、知识选择、史料收集、手工制作和多种微玩法完成研学任务。项目采用纯前端、零框架架构，适配桌面、平板与手机端，并支持进度存档、徽章收集、研学证书生成与展厅二维码彩蛋解析。

当前版本已依次升级：
- PRD2.0：2D 俯视角探索地图 + Galgame 式剧情对话 + 知识选择分支
- PRD3.0：在对话中嵌入档案整理、平衡操作、画面搜索、节奏点击、拼图、快速反应、长按坚守、传火仪式等微玩法

## 快速运行

本项目是静态站点，任意静态服务器均可运行：

```bash
# 方式一：Python
python -m http.server 8080

# 方式二：Node
npx --yes serve .
```

浏览器打开 `http://localhost:8080` 即可。

## 3.0 玩法

- 地图中操控“研学记者”自由移动，触发章节剧情点
- 剧情对话逐字显示，支持自动播放、历史记录、跳过
- 关键节点以选择肢呈现知识问答，选错弹出史料解析
- 对话中穿插微玩法，形成“舒缓对话 → 专注操作 → 反馈回归”的节奏
- 每章完成获得记忆物证与徽章，全部完成后生成研学证书

## 操作方式

- 桌面端：方向键 / WASD 移动，空格或 Enter 与最近点位互动
- 触屏端：点击地面移动，点击剧情点或史料碎片互动
- 对话模式：点击对话框继续；选择肢为卡片按钮
- 微玩法：按各玩法界面提示进行点击、拖放归位、长按或限时操作

## 目录结构

```text
.
├── index.html
├── css/
│   ├── style.css
│   ├── pages.css
│   ├── map.css
│   ├── dialogue.css
│   ├── microgame.css
│   └── responsive.css
├── js/
│   ├── data/
│   │   ├── questions.js
│   │   ├── chapters.js
│   │   ├── badges.js
│   │   ├── map.js
│   │   ├── scripts.js
│   │   └── microgames.js
│   ├── models/
│   │   ├── ProgressModel.js
│   │   └── QuestionModel.js
│   ├── controllers/
│   │   ├── AdventureController.js
│   │   ├── GameController.js
│   │   ├── MapEngine.js
│   │   ├── DialogueEngine.js
│   │   ├── MicroGameEngine.js
│   │   ├── AnswerValidator.js
│   │   └── BadgeManager.js
│   ├── views/
│   │   ├── MapView.js
│   │   ├── PageRenderer.js
│   │   └── CertificateRenderer.js
│   ├── utils/
│   │   ├── storage.js
│   │   ├── qr-parser.js
│   │   └── validator.js
│   └── app.js
├── assets/
│   └── images/
│       ├── backgrounds/
│       ├── badges/
│       ├── characters/
│       ├── props/
│       └── textures/
└── docs/
```

## 已实现功能

- 2D 俯视角 Canvas 地图渲染与视口跟随
- 角色键盘 / 触控 / 点击移动
- 地图边界与障碍物碰撞检测
- 章节点位状态：未解锁 / 可进入 / 已通关
- 史料碎片交互
- Galgame 对话引擎：逐字、自动、历史、跳过
- 六章剧本与知识选择分支
- 六类微玩法：信息整理、平衡操作、画面搜索、节奏点击、拼图、快速反应、长按坚守、多阶段传火
- 答错弹出史料解析，支持再次选择
- 章节通关解锁徽章与记忆物证
- LocalStorage 进度恢复与重置
- 终章徽章合集与 Canvas 电子证书生成
- 展厅二维码彩蛋参数解析
- 手机 / 平板 / 桌面响应式布局

## 二维码彩蛋

展厅二维码链接可直接携带参数打开游戏：

```text
index.html?unlock=ch1_extra
index.html?unlock=ch2_extra
index.html?unlock=ch4_extra
```

当前彩蛋内容为文档文案占位，实际高清史料图片上线前需替换为纪念馆提供素材。

## 素材替换

`assets/images/` 下的 SVG 为可运行占位图。目前序章与五个章节背景、陆瑞光 / 彭德怀 / 杨尚昆人物头像，以及识图题中的 `nongran-zhai.jpg` 已替换为来自 Wikimedia Commons 的图片，详见 `docs/IMAGE_CREDITS.md`。

尚未替换、仍为 SVG 占位图的部分：

- `assets/images/characters/`：`narrator.svg` 旁白立绘、`player.svg` 玩家角色
- `assets/images/badges/`：6 枚徽章视觉图
- `assets/images/artifacts/`：6 件物证图标
- `assets/images/textures/`：纸张 / 老照片肌理
- 已替换图片对应的旧 `.svg` 文件保留在原目录，可作为占位回退

## 文档说明

- 游戏内容与 3.0 玩法以 `docs/PRD3.0.md` 为主。
- 技术架构与目录以 `docs/TechnicalDesign.md` 为主。
- 徽章按 `game_content.md` 和 `TechnicalDesign.md` 采用 6 枚里程碑徽章；`PRD.md` 中“5 枚徽章”为早期口径，二者存在数量差异。
