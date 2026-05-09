---
title: Node.js Stream 使用整理
tags: [Node.js, Stream, 性能]
date: 2026-05-07
summary: 整理 Node.js Stream 的核心概念和常见使用场景，避免大文件处理时的内存问题。
author: Sunny
---

## 为什么用 Stream

处理大文件时，一次性读入内存会导致内存溢出。Stream 以分块方式处理数据，内存占用稳定。

## 四种 Stream 类型

| 类型 | 说明 |
|------|------|
| Readable | 可读流，数据来源 |
| Writable | 可写流，数据目标 |
| Duplex | 双工流，可读可写 |
| Transform | 转换流，读写时可修改数据 |

## 常见用法

### 读取文件

```js
import { createReadStream } from 'fs'

const stream = createReadStream('./large-file.txt', { encoding: 'utf8' })

stream.on('data', (chunk) => {
  console.log('收到数据块:', chunk.length)
})

stream.on('end', () => {
  console.log('读取完成')
})
```

### pipe 管道

```js
import { createReadStream, createWriteStream } from 'fs'

createReadStream('./input.txt')
  .pipe(createWriteStream('./output.txt'))
```

## 注意事项

- 监听 `error` 事件，否则流出错会抛出未捕获异常
- `pipe` 会自动处理背压（backpressure）
- Node 18+ 推荐使用 `stream/promises` 的 `pipeline`
