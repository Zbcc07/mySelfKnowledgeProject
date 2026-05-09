---
title: MySQL 索引优化笔记
tags: [MySQL, 索引, 性能优化]
date: 2026-05-06
summary: 整理 MySQL 索引的基本原理、常见类型和优化建议，帮助排查慢查询问题。
author: Sunny
---

## 索引的本质

MySQL InnoDB 使用 B+ 树存储索引，叶子节点存储完整行数据（聚簇索引）或主键值（二级索引）。

## 常见索引类型

- **主键索引**：唯一且非空，InnoDB 表必须有
- **唯一索引**：值唯一，允许一个 NULL
- **普通索引**：最基础的索引类型
- **联合索引**：多列组合，遵循最左前缀原则
- **全文索引**：用于文本搜索，不适合精确匹配

## 最左前缀原则

联合索引 `(a, b, c)` 可以命中：

- `WHERE a = 1`
- `WHERE a = 1 AND b = 2`
- `WHERE a = 1 AND b = 2 AND c = 3`

不能命中：

- `WHERE b = 2`（跳过了 a）
- `WHERE b = 2 AND c = 3`

## EXPLAIN 分析

```sql
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';
```

关注 `type` 字段：

| type | 说明 |
|------|------|
| const | 主键或唯一索引等值查询，最优 |
| ref | 普通索引等值查询 |
| range | 索引范围扫描 |
| ALL | 全表扫描，需要优化 |

## 常见优化建议

- 高频查询字段加索引，但不要过度索引（影响写入性能）
- 避免在索引列上使用函数或运算
- 字符串索引考虑前缀索引节省空间
- 定期用 `SHOW INDEX FROM table` 检查索引使用情况
