---
title: 动作流 ApplicationTag 关联上下文变量需求
tags: [需求开发, 动作流, Java注解, 后端架构, 数据流]
date: 2026-05-22
summary: 从前端开发者视角，梳理动作流设计器中基于 applicationTag 自动追加应用关联数据对象到节点上下文变量列表的需求背景、机制设计与数据流转。
---

## 需求概述

在动作流设计器中，根据当前应用的标识（applicationTag），自动将该应用关联的数据对象追加到节点的上下文变量列表里。

前端类比：类似于在 Vue 中根据路由参数动态注入不同的 `provide` 数据，让子组件能访问到。

## 核心概念：Java 注解 ≈ 前端装饰器

| 前端 TypeScript 装饰器 | Java 注解 |
|---|---|
| `@Component({ ... })` | `@Component` |
| `@Injectable()` | `@Service` |
| `@Input() name: string` | `@RuleCustomFunField` |

本次涉及两个注解：

```java
// 旧注解（已废弃，相当于 deprecated 的老 API）
@RuleCustomImportClass(ruleClassName = "工作流数据")

// 新注解（本次需求引入）
@AppContext(contextName = "短信", relationAppTag = "ceshishangxiawenaaa")
```

前端类比：

```ts
// 旧写法
@OldDecorator({ label: '工作流数据' })
class WorkflowProcessData {}

// 新写法
@AppContext({ label: '短信', appTag: 'ceshishangxiawenaaa' })
class SmsDTO {}
```

> 注解本身不执行任何逻辑，只是**贴标签**，真正的逻辑在"扫描器"里。

## 注解扫描机制 ≈ 前端自动路由/自动注册

| 前端 | 后端 |
|---|---|
| Vite 的 `import.meta.glob()` 自动扫描 `views/**/*.vue` | `SpringScan.getFitCls()` 自动扫描所有带注解的 class |
| 注册到路由表 | 注册到 Map<appTag, 类名列表> |

启动时（`FrameActFlowInfoStart.scanContextClasses()`）执行流程：

```
服务启动
  │
  ▼
扫描所有带 @AppContext 的类
  │
  ▼
按 relationAppTag 分组存入 Map
  │
  ▼
Map = {
  "ceshishangxiawenaaa": ["com.epoint.frame.sms.actflow.entity.SmsDTO"],
  "xmly":                ["com.epoint.frame.xxx.XxxDTO"],
  ...
}
```

该 Map 是 `AppContextScanner` 中维护的索引，相当于前端的路由表。

## 整体数据流

```
浏览器打开设计器
  │  URL 里带 applicationTag=ceshishangxiawenaaa
  │
  ▼
前端调用 /getContextInfo 接口
  │  请求 Header 里有 Referer（带 applicationTag 的页面 URL）
  │
  ▼
Controller 层（FrameActionFlowDesigerController）
  │  从 request.getHeader("referer") 取出 URL
  │  把 url 塞进 params 传给 Service
  │
  ▼
Service 层（FrameActFlowServiceImpl.getContextInfo）
  │
  ├─① 解析节点本身的上下文（原有逻辑，不动）
  │
  └─② 新增：resolveApplicationTag(params)
         │  从 params.url 里提取 applicationTag 参数值
         │
         ▼
       appendContextByApplicationTag(data, "ceshishangxiawenaaa")
         │  查 AppContextScanner 的 Map
         │  找到 SmsDTO
         │  构建 ContextStruct（variable / des / children）
         │  追加到 data 数组
         │
         ▼
  返回给前端
  data: [
    { variable: "smsDTO", des: "短信", children: [...] },
    ...原有节点上下文...
  ]
  │
  ▼
前端公式选择器里显示「短信」对象及其字段
```

## DTO / Entity 说明

前端类比：**DTO 就是接口返回的数据结构定义，相当于 TypeScript 的 interface / type。**

```ts
// 前端 TS interface
interface SmsDTO {
  rowGuid: string   // 主键
  content: string   // 短信内容
  receiver: string  // 接收人
}
```

```java
// 后端 Java DTO
@AppContext(contextName = "短信", relationAppTag = "ceshishangxiawenaaa")
@Entity(table = "Sms", id = {"rowGuid"})
public class SmsDTO extends BaseEntity {

    @RuleCustomFunField(name = "主键")
    public String getRowGuid() { ... }

    @RuleCustomFunField(name = "短信内容")
    public String getContent() { ... }

    @RuleCustomFunField(name = "接收人")
    public String getReceiver() { ... }
}
```

`@RuleCustomFunField(name = "短信内容")` 告知扫描器该字段的中文显示名，对应前端公式选择器中看到的字段标签。

## 仓库分工

```
epoint-rule-parent（核心引擎，相当于 npm 包）
  └── FrameActFlowServiceImpl   ← 核心逻辑，本次主要改这里
  └── AppContextScanner         ← 新增，appTag → 类名的索引

event-center（业务应用，相当于使用该 npm 包的项目）
  └── FrameActionFlowDesigerController  ← 设计器接口，把 url 传下去
  └── FrameActFlowDebugController       ← 调试接口，同样补传 url
  └── SmsDTO                            ← 测试用例（已删除，不提交）
```

| 角色 | 前端类比 | 后端对应 |
|------|----------|----------|
| 核心引擎 | 发布的 UI 组件库 | `epoint-rule-parent` |
| 业务项目 | 使用组件库的业务项目 | `event-center` |
| 发布命令 | `npm publish` 到本地 | `mvn install` 到本地仓库 |

> 改完 `epoint-rule-parent` 要先 `mvn install`，`event-center` 才能用到新版本。等价于：改了组件库源码必须重新 `npm build`，业务项目才能用到新的 dist。

## 踩坑记录

| 现象 | 原因 | 前端类比 |
|------|------|----------|
| `des: ""` 显示空 | `FrameActFlowContextStruct.innerBuilder()` 只读旧注解，不认 `@AppContext.contextName` | 组件只处理了旧 props，新 props 没接 |
| 改完代码没生效 | `epoint-rule-api` 没 install 到本地 maven 仓库，web 模块还在用旧 jar | 改了组件库源码但没重新 `npm build`，项目还在用旧的 dist |
| `WorkflowProcessData` 干扰测试 | 测试时临时加了 `relationAppTag`，导致旧注解类也被命中 | 测试时给旧组件加了 props，影响了测试结果 |

## 机制总结

```
@AppContext 注解  →  启动时扫描建索引  →  请求时按 URL 的 appTag 查索引  →  追加到上下文返回给前端
```

等价的前端伪代码：

```ts
// 启动时（main.ts）
const contextRegistry = new Map<string, any[]>()
// 扫描所有带 @AppContext 的组件，按 appTag 分组注册
contextRegistry.set('ceshishangxiawenaaa', [SmsDTO])

// 请求时（getContextInfo）
const appTag = new URL(referer).searchParams.get('applicationTag')
const extraContexts = contextRegistry.get(appTag) ?? []
return [...nodeContexts, ...extraContexts]
```

## 关键词速查

| 后端术语 | 前端对应理解 |
|----------|-------------|
| 注解 `@AppContext` | 装饰器，给类贴标签 |
| 注解扫描 `SpringScan` | `import.meta.glob()` 自动扫描文件 |
| `DTO` | TypeScript `interface` / `type` |
| `Entity` | 对应数据库表的数据模型，类似 ORM 的 Model |
| `Service` 层 | 业务逻辑层，相当于 Pinia store 里的 action |
| `Controller` 层 | 路由处理层，相当于 Vue Router 的路由守卫 + 接口入口 |
| `mvn install` | `npm build` + 发布到本地 |
| `git status` | 同前端，查看工作区改动 |
| `Untracked files` | 新建但未 `git add` 的文件 |
