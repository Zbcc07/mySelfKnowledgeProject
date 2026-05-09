# Sunny Docs 技术知识库

基于 Vite 官方 `template-vue-ts` 脚手架开发的 Vue3 + TypeScript 技术文档站首页原型。

## 本地开发

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

## GitHub Pages 发布

仓库包含 `.github/workflows/deploy.yml`。推送到 `main` 分支后，在 GitHub 仓库的 `Settings -> Pages` 中选择 `GitHub Actions` 作为发布来源即可。

## 后续扩展

- 接入 Markdown 文档目录。
- 使用 Pagefind 生成静态全文搜索索引。
- 增加分类详情页、标签页和文档详情页。
