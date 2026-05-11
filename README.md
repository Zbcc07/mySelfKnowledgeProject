# Sunny Docs 技术知识库

一个基于 Vue 3 + TypeScript + Vite 的个人技术文档站，支持 Markdown 文档管理、全文搜索、分类浏览，并通过 GitHub Actions 自动发布到 GitHub Pages。

**线上预览**：[https://zbcc07.github.io/mySelfKnowledgeProject/](https://zbcc07.github.io/mySelfKnowledgeProject/)

---

## 目录结构

```
├── docs/                    # Markdown 文档源文件（按分类存放）
│   ├── frontend/            # 前端
│   ├── backend/             # 后端
│   ├── database/            # 数据库
│   └── ai/                  # AI
├── public/
│   └── data/generated/      # 构建期自动生成的 JSON 数据（勿手动修改）
├── scripts/
│   └── generate.js          # 扫描 docs/ 生成 JSON 数据的脚本
├── src/
│   ├── composables/         # 全局共享状态（如当前选中分类）
│   ├── config/
│   │   └── categories.ts    # 分类配置（id / 名称 / 图标 / 颜色）
│   ├── utils/
│   │   ├── dataLoader.ts    # fetch JSON 数据的工具函数
│   │   ├── iconMap.ts       # lucide 图标名 → 组件的映射表
│   │   └── visitRecord.ts   # localStorage 访问记录工具
│   ├── views/
│   │   ├── home/            # 首页（侧边栏 + 文档列表 + 使用流程）
│   │   └── detail/          # 文档详情页（Markdown 渲染 + 目录导航）
│   └── types/content.ts     # 全局 TypeScript 类型定义
├── .github/workflows/
│   └── deploy.yml           # GitHub Actions 自动构建 + 发布
├── AI整理提示词.md           # 用 AI 规范化 Markdown 文档的提示词
└── vite.config.ts
```

---

## 快速开始

### 环境要求

- Node.js 20+
- npm 10+

### 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器（会自动先跑 generate.js 生成数据）
npm run dev
```

访问 `http://localhost:5173/mySelfKnowledgeProject/`

### 构建

```bash
npm run build
```

---

## 新增文档

### 1. 用 AI 整理原始内容

打开 `AI整理提示词.md`，把提示词连同原始资料发给 AI（Claude / ChatGPT），AI 会输出带 frontmatter 的规范 Markdown。

frontmatter 格式：

```yaml
---
title: Vue3 响应式系统整理
tags: [Vue3, 响应式, Composition API]
date: 2026-05-09
summary: 整理 Vue3 响应式系统的核心概念、常见 API 和实践注意事项。
author: Sunny
---
```

> 不要加 `category` 字段，分类由文件所在目录决定。

### 2. 放入对应分类目录

| 分类 | 目录 |
|------|------|
| 前端 | `docs/frontend/` |
| 后端 | `docs/backend/` |
| 数据库 | `docs/database/` |
| AI | `docs/ai/` |

文件名使用小写英文 + 短横线，如 `vue3-reactivity.md`。

### 3. 提交并推送

```bash
git add docs/frontend/vue3-reactivity.md
git commit -m "docs: 新增 Vue3 响应式整理"
git push
```

推送到 `main` 后，GitHub Actions 会自动构建并发布，约 1-2 分钟后线上生效。

---

## 新增分类

在 `src/config/categories.ts` 里添加一条配置：

```ts
{ id: 'devops', name: '部署运维', icon: 'Boxes', color: 'violet' }
```

然后在 `docs/` 下创建同名目录 `docs/devops/`，放入 Markdown 文件即可。

图标名来自 [lucide.dev](https://lucide.dev)，颜色可选：`sun` / `coral` / `leaf` / `sky` / `violet` / `rose`。

---

## 发布到 GitHub Pages

1. 在 GitHub 仓库 `Settings → Pages → Source` 选择 **GitHub Actions**
2. 在 `Settings → Actions → General → Workflow permissions` 选择 **Read and write permissions**
3. 推送代码后 Actions 自动触发，完成后访问 `https://<用户名>.github.io/<仓库名>/`

---

## 技术栈

| 技术 | 用途 |
|------|------|
| Vue 3 + TypeScript | 前端框架 |
| Vite 8 | 构建工具 |
| Element Plus | UI 组件库 |
| lucide-vue-next | 图标库 |
| marked + highlight.js | Markdown 渲染 + 代码高亮 |
| gray-matter | 解析 frontmatter |
| SCSS | 样式 |
| GitHub Actions | CI/CD 自动发布 |
