# 个人 Markdown 技术知识库需求规格说明书

## 1. 背景

当前项目是一个基于 Vue3、TypeScript、Vite 的个人技术知识库静态站点初版，已经具备首页、详情页、静态数据文件和 GitHub Pages 部署基础。

后续希望把知识库内容从手写静态 JSON 改为由本地 Markdown 文档自动生成。用户只需要在代码仓库中维护 Markdown 文件，提交到 GitHub 后，通过 GitHub Actions 自动构建并发布到 GitHub Pages。

## 2. 项目目标

实现一个纯静态的个人技术知识库站点，用于管理和浏览用户平时整理的 Markdown 技术文档。

核心目标：

- 用户可以把 Markdown 技术文档放入项目指定目录。
- 构建时自动读取 Markdown 文档并生成页面所需数据。
- 首页支持搜索、分类浏览、最近更新和频繁访问入口。
- 详情页支持 Markdown 内容预览。
- 支持 GitHub Pages 静态部署。
- 不依赖后端接口和数据库。

## 3. 使用者

本项目只面向用户本人使用。

站点部署后可以通过互联网地址访问，但不要求用户体系、权限控制、登录鉴权、多人协作、后台管理等能力。

## 4. 技术约束

沿用当前项目技术栈和工程结构：

- Vue3
- TypeScript
- Vite
- Vue Router
- Sass / SCSS
- 当前已有 UI 风格和组件拆分方式
- GitHub Pages 静态部署

不引入后端服务，不引入数据库。

可以根据 Markdown 解析、frontmatter 解析、构建期数据生成的需要，引入必要的 npm 依赖。

## 5. 本次范围

本次需要实现：

- Markdown 文档目录接入
- 分类配置
- Markdown frontmatter 解析
- Markdown 正文渲染
- 构建期生成静态数据
- 首页搜索
- 首页分类入口
- 首页最近更新入口
- 首页频繁访问入口
- 详情页 Markdown 预览
- 当前浏览器 localStorage 访问记录
- 图片在线地址和本地地址展示
- GitHub Pages 构建部署兼容
- AI 辅助整理 Markdown 的规范文档或模板

## 6. 不在本次范围内

本次不实现：

- 在线技术文档抓取
- 在线技术文档复制导入
- 网页内容转 Markdown
- 网页内 AI 接口
- AI 自动调用
- 后端接口
- 数据库
- 登录鉴权
- 评论、点赞、收藏同步
- 多用户能力
- 跨设备访问记录同步
- Pagefind 或其他全文搜索引擎
- 相关文章推荐

用户自行准备 Markdown 文件，并放入项目指定目录。后续可以通过外部 AI 工具辅助整理 Markdown 内容，但网页项目本身不需要集成 AI 能力。

## 7. 文档目录规范

项目根目录新增 `docs` 目录，用于存放 Markdown 技术文档。

默认一级目录：

```txt
docs/
  frontend/
  backend/
  database/
  ai/
```

一级目录与分类一一对应：

- `frontend`：前端
- `backend`：后端
- `database`：数据库
- `ai`：AI

文档所属分类由 Markdown 文件所在的一级目录决定，不需要在 Markdown frontmatter 中重复声明 `category`。

示例：

```txt
docs/
  frontend/
    vue3-reactivity.md
    vite-config.md
  backend/
    node-stream.md
  database/
    mysql-index.md
  ai/
    prompt-engineering.md
```

## 8. 分类配置要求

分类需要集中配置，方便后续维护。

建议新增配置文件：

```txt
src/config/categories.ts
```

配置示例：

```ts
export const categories = [
  { id: 'frontend', name: '前端', icon: 'Code2', color: 'sun' },
  { id: 'backend', name: '后端', icon: 'TerminalSquare', color: 'coral' },
  { id: 'database', name: '数据库', icon: 'Database', color: 'leaf' },
  { id: 'ai', name: 'AI', icon: 'Sparkles', color: 'sky' },
]
```

要求：

- `id` 必须与 `docs` 下的一级目录名一致。
- `name` 用于页面展示。
- `icon` 复用当前项目已有图标方案。
- `color` 复用当前项目已有颜色方案。
- 首页分类展示顺序以配置文件顺序为准。
- 如果某个 Markdown 文件位于未配置的一级目录中，忽略该文档并以构建警告方式提示。

## 9. Markdown frontmatter 规范

每篇 Markdown 支持 frontmatter 元信息。

推荐格式：

```md
---
title: Vue3 响应式系统整理
tags: [Vue3, 响应式, Composition API]
date: 2026-05-09
summary: 整理 Vue3 响应式系统的核心概念、常见 API 和实践注意事项。
source: https://example.com/original-doc
author: Sunny
---

正文内容。
```

字段说明：

- `title`：文档标题，可选但推荐填写。
- `tags`：标签数组，可选。
- `date`：文档日期，可选，格式建议为 `YYYY-MM-DD`。
- `summary`：摘要，可选。
- `source`：来源链接，可选。
- `author`：作者或整理人，可选。

不要求填写 `category`，分类由文档路径决定。

## 10. frontmatter 缺失兜底规则

当 Markdown frontmatter 字段缺失时，需要有兜底策略：

- `title`：优先使用 Markdown 正文中的第一个一级标题；如果仍不存在，则使用文件名转换后的文本（连字符替换为空格，首字母大写）。
- `tags`：默认为空数组。
- `date`：优先使用文件最后修改时间（`mtime`）；如果获取不到，则使用构建当天日期。
- `summary`：从 Markdown 正文纯文本中截取前 100 个字符生成，去除 Markdown 标记、图片语法、代码块噪音后再截取。
- `source`：默认为空字符串。
- `author`：默认为空字符串。

如果一篇 Markdown 只有图片，没有正文文本，也需要可以正常生成文档数据。此时 `summary` 优先使用 frontmatter 中的 `summary`，如果没有填写，则使用固定文本"图片文档"作为默认摘要。

## 11. Markdown 正文渲染要求

详情页需要渲染 Markdown 正文内容。

需要支持：

- 标题
- 段落
- 列表（有序、无序）
- 引用
- 代码块（含语言标识和语法高亮）
- 行内代码
- 表格
- 链接
- 图片
- 分割线

代码块需要保留语言标识，语法高亮样式应与当前页面视觉风格协调。

Markdown 内容只需查看预览，不要求可编辑。

## 12. 图片支持要求

Markdown 正文中的图片需要正常展示。

图片地址支持两种形式：

在线图片地址：

```md
![示例图](https://example.com/image.png)
```

本地相对路径：

```md
![示例图](./assets/demo.png)
```

要求：

- 在线图片地址按原地址渲染。
- 本地图片在构建期由数据生成脚本复制到 `public` 目录下对应路径，确保构建产物中可以正常访问。
- 本地图片可以与 Markdown 文件放在同目录，也可以放在当前分类目录下的 `assets` 子目录中。
- 一篇 Markdown 可以只有一张图片，没有其他正文内容。

示例：

```md
---
title: 系统架构图
tags: [架构, 图片]
date: 2026-05-09
summary: 一张系统架构图。
---

![系统架构图](./assets/architecture.png)
```

## 13. 构建期数据生成要求

新增独立的 Node.js 构建脚本（如 `scripts/generate.ts` 或 `scripts/generate.js`），用于扫描 `docs` 目录并生成前端运行所需的静态数据。

生成数据包括：

- 文档列表（含 `id`、`title`、`category`、`tags`、`date`、`summary`、`author`、`source`）
- 分类统计（每个分类的文档数量）
- 标签集合
- 最近更新列表（按 `date` 倒序，取前 5 条）
- 文档详情数据（含 Markdown 渲染后的 HTML 内容）
- 用于搜索的纯文本字段（去除 Markdown 标记后的正文文本）

生成目录：

```txt
public/data/generated/
```

本地图片在生成过程中同步复制到 `public/docs-assets/` 目录，渲染后的 HTML 中图片路径替换为对应的静态路径。

触发方式（方案 A）：

- 在 `package.json` 中配置 `prebuild` 和 `predev` 钩子，`npm run build` 和 `npm run dev` 前自动执行数据生成脚本。
- 本地开发时改动 Markdown 后需重启 dev server 才能看到最新数据。

其他要求：

- 不再依赖当前手写的模拟文章数据作为真实内容来源。
- 生成的静态数据路径需适配 GitHub Pages 子路径部署（与 `vite.config.ts` 的 `base` 配置保持一致）。

## 14. 文档 ID 规则

每篇文档在首次被数据生成脚本扫描时，按当时的时间戳生成唯一 `id`，并将文件路径到 `id` 的映射持久化存储在 `public/data/generated/id-map.json` 中。

规则：

- `id` 格式为时间戳字符串，例如 `"1746787200000"`。
- 同一篇文档（以相对文件路径为 key）在后续构建中复用已生成的 `id`，不重新生成。
- 文件路径发生变化（重命名或移动）时视为新文档，生成新 `id`，原访问记录自然失效，不报错。
- `id` 用于路由跳转，路由形式为：

```txt
/detail/:id
```

## 15. 首页功能要求

首页需要包含以下区域。

### 15.1 搜索

首页提供简单搜索能力。

搜索范围：

- 标题
- 摘要
- 标签
- 分类名称
- Markdown 正文纯文本

搜索方式：

- 前端本地搜索，不请求后端接口。
- 用户输入关键词后，点击搜索按钮触发搜索。
- 搜索结果以浮层面板形式展示在搜索框下方，不跳转页面，不替换首页内容区域。
- 关闭面板或清空搜索词后，浮层收起，首页恢复原始状态。

搜索结果面板每条结果展示：

- 标题
- 分类
- 标签
- 摘要
- 日期
- 点击后进入详情页

### 15.2 分类浏览

首页展示分类入口。

要求：

- 分类来自 `src/config/categories.ts`。
- 显示每个分类下的文档数量。
- 点击分类后在首页内联展示该分类下的文档列表，不跳转页面。
- 再次点击同一分类收起列表，点击其他分类切换展示内容。
- 分类顺序以配置文件为准。

### 15.3 最近更新

首页展示最近更新文档。

规则：

- 按 `date` 倒序排列，展示数量固定为 5 条。
- 每条可点击进入详情页。

### 15.4 频繁访问

首页展示当前浏览器中的频繁访问文档入口。

规则：

- 访问记录存储在 `localStorage`，key 为固定字符串（如 `kb_visit_records`），value 为 JSON 对象，结构为 `{ [docId]: { count: number, lastVisit: number } }`。
- 打开详情页时记录文档访问次数加一，并更新最近访问时间戳。
- 首页展示排序规则：访问次数高的优先；次数相同时，最近访问时间新的优先。
- 展示数量固定为 5 条。
- 只在当前浏览器生效，不要求跨设备同步。
- 如果没有访问记录，隐藏该区域或展示空状态提示。

## 16. 详情页功能要求

详情页用于查看单篇 Markdown 文档。

需要展示：

- 标题
- 分类
- 标签
- 日期
- 摘要
- 作者或整理人（有值时展示，无值时不显示该行）
- 来源链接（有值时展示，无值时不显示该区域）
- Markdown 正文内容
- 目录导航（复用现有 TocNav 组件，支持滚动高亮当前章节）

不展示相关文章区域。

来源链接要求：

- 如果 Markdown frontmatter 中存在 `source`，详情页显示来源链接，点击后在新标签页打开。
- 如果不存在 `source`，不显示该区域。

访问记录要求：

- 进入详情页时更新 `localStorage` 中该文档的访问次数和最近访问时间。

## 17. AI 辅助整理规范

项目本身不集成 AI 接口，但需要提供给外部 AI 工具使用的 Markdown 整理规范或模板。

新增以下文件：

```txt
docs-template.md        # Markdown 文档模板示例
AI整理提示词.md          # 供外部 AI 工具使用的整理提示词
```

AI 整理 Markdown 时应遵循：

- 补全 `title`、`tags`、`date`、`summary` 等 frontmatter 字段。
- `date` 默认使用整理当天日期，格式 `YYYY-MM-DD`。
- `tags` 建议 2-5 个。
- `summary` 用 1-2 句话概括正文。
- 分类不写在 frontmatter 中，由文件目录决定。
- 标题层级清晰，正文从二级标题开始。
- 保留必要代码块，并标注代码语言。
- 删除从网页复制时可能带来的无用导航、广告、页脚等内容。
- 将过长段落拆分为更易阅读的短段落。
- 图片可以使用在线地址或本地相对路径。
- 如果有来源链接，保留到 `source` 字段。

## 18. GitHub Pages 部署要求

项目部署在 GitHub Pages 子路径下（`https://zbcc07.github.io/mySelfKnowledgeProject/`）。

要求：

- `vite.config.ts` 中配置 `base: '/mySelfKnowledgeProject/'`，确保 CSS、JS、静态数据、图片路径在子路径下正常工作。
- 推送到 `main` 分支后，GitHub Actions 自动构建并发布。
- 构建产物可以通过 GitHub Pages 地址访问。
- 刷新首页和详情页不出现资源加载失败。
- 当前项目使用 hash 路由，继续保留，以规避 GitHub Pages 刷新 404 问题。

## 19. 验收标准

满足以下条件视为本次需求完成。

### 19.1 Markdown 数据接入

- 在 `docs/frontend` 下新增一篇 Markdown 后，重启 dev server 或重新构建后首页能看到该文档。
- 文档分类自动识别为"前端"。
- 不需要手动修改任何 JSON 数据文件。

### 19.2 文档 ID 稳定性

- 同一篇文档多次构建后 `id` 不变。
- 文件重命名后生成新 `id`，旧访问记录自然失效，不报错。

### 19.3 frontmatter 兜底

- Markdown 只写正文、不写完整 frontmatter 时，页面仍能展示标题、摘要、日期等基础信息。
- Markdown 只有一张图片时，详情页能正常展示图片，不报错。

### 19.4 分类

- 首页分类数量与 `docs` 文档实际数量一致。
- 分类展示顺序与配置文件一致。
- 点击分类后在首页内联展示该分类文档列表，不跳转页面。

### 19.5 搜索

- 输入标题关键词点击搜索后，搜索结果浮层面板弹出并展示匹配文档。
- 输入标签关键词可以搜索到文档。
- 输入正文中的关键词可以搜索到文档。
- 搜索结果点击后进入详情页。
- 关闭面板后首页恢复原始状态。

### 19.6 频繁访问

- 打开某篇详情页后，localStorage 中记录访问信息。
- 多次访问同一篇文档后，该文档在首页频繁访问区域排序靠前。
- 清空浏览器数据后，频繁访问区域恢复为空状态。

### 19.7 目录导航

- 详情页目录导航复用 TocNav 组件正常展示。
- 滚动正文时目录导航高亮当前所在章节。

### 19.8 图片

- Markdown 中的在线图片地址可以正常展示。
- Markdown 中的本地相对图片可以在本地开发和 GitHub Pages 构建后正常展示。

### 19.9 来源链接

- Markdown frontmatter 中存在 `source` 时，详情页显示来源链接，点击在新标签页打开。
- 不存在 `source` 时，详情页不显示空来源区域。

### 19.10 部署

- `npm run build` 成功。
- GitHub Actions 构建成功。
- GitHub Pages 发布后可以通过 `https://zbcc07.github.io/mySelfKnowledgeProject/` 访问首页和详情页。

## 20. 建议实施顺序

1. 新增分类配置文件 `src/config/categories.ts`。
2. 新增 `docs` 文档目录和示例 Markdown 文件。
3. 引入 Markdown / frontmatter 解析依赖。
4. 实现构建期扫描脚本，生成静态数据到 `public/data/generated/`，同步处理本地图片复制。
5. 配置 `package.json` 的 `prebuild` 和 `predev` 钩子自动触发数据生成。
6. 配置 `vite.config.ts` 的 `base` 路径适配 GitHub Pages 子路径。
7. 改造首页数据来源，接入生成数据。
8. 实现分类点击内联展示文档列表。
9. 实现首页搜索（点击触发，浮层面板展示结果）。
10. 实现 localStorage 频繁访问记录。
11. 改造详情页，实现 Markdown 正文渲染和语法高亮。
12. 复用 TocNav 组件，实现滚动高亮。
13. 补充 AI 整理模板和提示词文件。
14. 验证本地构建和 GitHub Pages 部署。
