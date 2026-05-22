---
title: 常用 SQL 命令速查
tags: [SQL, 数据库, MySQL]
date: 2026-05-22
summary: 整理 MySQL 的常用 SQL 命令，涵盖数据库创建、表创建、数据插入与查询等基础操作。
---

## 数据库操作

```sql
-- 查看所有数据库
SHOW DATABASES;

-- 创建一个新数据库
CREATE DATABASE mytest DEFAULT CHARACTER SET utf8mb4;

-- 使用这个数据库
USE mytest;
```

## 表操作

```sql
-- 创建一张商品表
CREATE TABLE product (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2),
  created_at DATETIME DEFAULT NOW()
);
```

## 数据操作

```sql
-- 插入一条数据
INSERT INTO product (name, price) VALUES ('Spring Boot 入门课', 99.00);

-- 查询所有数据
SELECT * FROM product;
```
