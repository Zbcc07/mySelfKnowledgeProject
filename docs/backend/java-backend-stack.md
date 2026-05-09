---
title: Java 后端核心技术栈整理
tags: [Java, Spring Boot, Maven, Nginx, Redis]
date: 2026-05-09
summary: 梳理 Java 后端开发常用的核心组件（JDK、Maven、Spring Boot、Nginx、Redis）与学习路径，帮助建立完整知识体系。
author: Sunny
---

## 核心技术组件

### JDK (Java Development Kit)

Java 开发与运行的基石，提供编译、运行环境以及基础工具链。

- 包含：JRE、编译器、调试工具、API 文档
- 常用长期支持版本：Java 8 / 11 / 17
- 没有 JDK，Java 程序无法编译和运行

### Maven

项目构建与依赖管理工具，核心配置文件为 `pom.xml`。

- 自动化依赖管理
- 标准化项目结构
- 项目构建与打包
- 多模块项目管理

解决了"Jar 包地狱"，统一了构建流程。

### Spring Boot

Java 企业级应用的主流开发框架。

- 自动配置，减少 XML 配置
- 内嵌 Web 服务器（Tomcat / Jetty）
- 提供生产就绪功能（监控、健康检查等）
- 丰富的 Starter 依赖

常用模块：

| 模块 | 作用 |
|------|------|
| Spring MVC | Web 层 |
| Spring Data | 数据访问 |
| Spring Security | 安全认证 |
| Spring Cloud | 分布式系统 |

### Nginx

高性能 Web 服务器与反向代理。

- 反向代理与负载均衡
- 静态资源服务
- SSL/TLS 终端
- 请求缓存与限流

典型场景：多服务负载均衡、静态资源加速、API 网关。

### Redis

高性能内存数据存储。

- 缓存热点数据
- 会话（Session）存储
- 消息队列
- 分布式锁

优势是毫秒级响应并支持丰富的数据结构。

## 为什么需要这些技术

![核心组件关系图](https://app.epoint.com.cn/h5/fileattaches/20260429/1777452619087_4c07bece/Sheet_20260429.png)

## 学习路径建议

### 1. 基础阶段

- 学习 Java 基础 + JDK
- 学习 Maven 的基本使用

### 2. 框架阶段

- 学习 Spring Boot
- 学习数据库（MySQL）和缓存（Redis）

### 3. 部署阶段

- 学习 Linux 基础
- 学习 Nginx 配置
- 学习 Docker 容器化

### 4. 进阶阶段

- 微服务（Spring Cloud）
- 消息队列（Kafka / RabbitMQ）
- 容器编排（Kubernetes）
