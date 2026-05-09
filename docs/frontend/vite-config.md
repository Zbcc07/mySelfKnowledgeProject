---
title: Vite 配置常用项整理
tags: [Vite, 构建工具, 配置]
date: 2026-05-08
summary: 整理 Vite 项目中常用的配置项，包括路径别名、环境变量、构建优化等。
author: Sunny
---

## 路径别名

```ts
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
})
```

配置后可以用 `@/components/Button.vue` 代替相对路径。

## base 路径

部署到 GitHub Pages 子路径时需要配置：

```ts
export default defineConfig({
  base: '/my-repo/',
})
```

## 环境变量

Vite 通过 `.env` 文件管理环境变量，变量名必须以 `VITE_` 开头才能在客户端访问：

```
VITE_API_URL=https://api.example.com
```

在代码中通过 `import.meta.env.VITE_API_URL` 访问。

## 构建优化

```ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router'],
        },
      },
    },
  },
})
```
