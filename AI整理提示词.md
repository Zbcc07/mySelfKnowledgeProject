# AI 辅助整理 Markdown 提示词

## 使用方式

将以下提示词发送给 AI（如 Claude、ChatGPT），并附上需要整理的原始内容。

---

## 提示词

```
请帮我将以下内容整理成符合规范的 Markdown 技术文档。

要求：
1. 在文档开头添加 frontmatter，格式如下：
   ---
   title: （根据内容提炼，简洁准确）
   tags: [标签1, 标签2]（2-5 个，选择最能描述内容的关键词）
   date: （今天的日期，格式 YYYY-MM-DD）
   summary: （1-2 句话概括正文核心内容）
   source: （如果原始内容有来源链接，填写；否则省略此行）
   author: （整理人姓名，如不需要可省略）
   ---

2. 不要在 frontmatter 中添加 category 字段，分类由文件目录决定。

3. 正文结构：
   - 从二级标题（##）开始，不使用一级标题
   - 标题层级清晰，逻辑递进
   - 段落简洁，避免过长的大段文字
   - 代码块标注语言（如 ```js、```python、```sql）

4. 内容清理：
   - 删除网页导航、广告、页脚、版权声明等无关内容
   - 删除重复或冗余的段落
   - 保留所有有价值的技术内容、代码示例、注意事项

5. 图片处理：
   - 在线图片保留原始 URL
   - 本地图片使用相对路径格式：![描述](./assets/文件名.png)

6. 如果有来源链接，保留到 frontmatter 的 source 字段，正文中不需要重复。

原始内容如下：
[粘贴原始内容]
```

---

## 示例输出

```md
---
title: Vue3 响应式系统整理
tags: [Vue3, 响应式, Composition API]
date: 2026-05-09
summary: 整理 Vue3 响应式系统的核心概念、常见 API 和实践注意事项。
source: https://cn.vuejs.org/guide/essentials/reactivity-fundamentals
author: Sunny
---

## 核心概念

Vue3 的响应式系统基于 ES Proxy 实现...

## 常用 API

### ref

...
```

---

## 文件放置规则

整理好的 Markdown 文件放入对应分类目录：

| 分类 | 目录 |
|------|------|
| 前端 | `docs/frontend/` |
| 后端 | `docs/backend/` |
| 数据库 | `docs/database/` |
| AI | `docs/ai/` |

文件名使用小写英文和连字符，如 `vue3-reactivity.md`。
