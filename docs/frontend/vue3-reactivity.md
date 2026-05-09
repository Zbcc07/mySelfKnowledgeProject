---
title: Vue3 响应式系统整理
tags: [Vue3, 响应式, Composition API]
date: 2026-05-09
summary: 整理 Vue3 响应式系统的核心概念、常见 API 和实践注意事项。
author: Sunny
---

## 核心概念

Vue3 的响应式系统基于 ES Proxy 实现，相比 Vue2 的 Object.defineProperty 有更完整的拦截能力。

## 常用 API

### ref

适合基本类型和需要整体替换的对象。

```ts
const count = ref(0)
const user = ref({ name: 'Sunny' })

// 访问时需要 .value
console.log(count.value)
```

### reactive

适合稳定结构的对象，访问时不需要 `.value`。

```ts
const state = reactive({
  count: 0,
  name: 'Sunny',
})
```

### computed

派生数据优先用 computed，避免手动同步。

```ts
const double = computed(() => count.value * 2)
```

## 注意事项

- 解构 reactive 对象会丢失响应性，需要用 `toRefs`
- `ref` 在模板中自动解包，不需要写 `.value`
- 避免在 `watch` 中直接修改被监听的值，容易造成无限循环
