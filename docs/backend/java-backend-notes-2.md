---
title: Java 后端学习笔记（二）：项目结构与语法入门
tags: [Java, 后端, Spring Boot, 入门, 语法]
date: 2026-05-22
summary: 从前端开发者视角整理 Java 后端项目的日常操作流程、完整项目结构及各层职责、Java 语法与 JavaScript 对比速览。
source: https://app.epoint.com.cn/h5/fileattaches/20260509/1778308644107_655b07ea/javaTestProject.zip
---

## 项目日常开启与关闭

### 每天开始工作推荐流程

**第一步：打开 IDEA**

用 IDEA 打开项目目录 `D:\myCodes\javaTestProject`，如果 IDEA 已有最近项目记录，直接点进去即可。

**第二步：确认 JDK 和 Maven 环境**

```powershell
java -version
mvn -v
```

> 如果命令不识别，先关闭 PowerShell / IDEA 重新打开再试。

**第三步：启动项目**

推荐方式一：**IDEA 启动**（日常开发首选）

找到启动类，点击左侧绿色运行按钮：

```
src/main/java/com/example/javatestproject/JavaTestProjectApplication.java
```

方式二：**命令行启动**

```powershell
cd D:\myCodes\javaTestProject
mvn spring-boot:run
```

方式三：**双击启动脚本**

```
D:\myCodes\javaTestProject\start.bat
```

**第四步：验证项目是否正常运行**

浏览器访问以下地址，能看到页面说明项目已成功启动：

```
http://localhost:8081
http://localhost:8081/api/health
```

### 关闭项目

| 启动方式 | 关闭操作 |
|----------|----------|
| IDEA 启动 | 点击控制台右侧红色停止按钮 |
| 命令行启动 | 按 `Ctrl + C`，输入 `Y` 确认 |

**不确定项目是否还在运行时：**

```powershell
# 查找占用 8081 端口的进程
netstat -ano | findstr :8081
```

输出示例：`TCP 0.0.0.0:8081 0.0.0.0:0 LISTENING 29164`

其中 `29164` 是进程 ID，执行以下命令关闭它：

```powershell
# 方式一
taskkill /PID 29164 /F

# 方式二（PowerShell）
Stop-Process -Id 29164 -Force
```

### 每天工作准备清单

| 步骤 | 操作 |
|:---:|---|
| 1 | 打开 IDEA |
| 2 | 打开项目 `D:\myCodes\javaTestProject` |
| 3 | 启动 `JavaTestProjectApplication` |
| 4 | 浏览器访问 `http://localhost:8081` 确认正常 |
| 5 | 开始修改代码、测试接口 |
| 6 | 下班前关闭项目 |

> 当前项目暂时不依赖 MySQL，所以不需要每天启动 MySQL 服务。

## 后端项目完整结构

### 当前入门项目结构

```
javaTestProject
├─ pom.xml                                        # 依赖配置（类似前端的 package.json）
├─ src/main/java/com/example/javatestproject
│  ├─ controller                                  # 接口层
│  ├─ model                                       # 数据模型
│  ├─ service                                     # 业务层
│  └─ JavaTestProjectApplication.java             # 启动入口
└─ src/main/resources
   ├─ application.properties                      # 配置文件（端口、数据库等）
   └─ static                                      # 静态资源（前端页面）
```

### 真实项目完整结构

```
src/main/java/com/example/project
├─ controller        接口层，接收前端请求
├─ service           业务层，处理业务逻辑
├─ service/impl      业务实现类
├─ mapper            数据库访问层（MyBatis 风格）
├─ repository        数据库访问层（JPA 风格）
├─ entity            数据库实体类，对应数据库表
├─ dto               接收前端传参的数据结构
├─ vo                返回给前端的数据结构
├─ config            配置类（跨域、拦截器、Swagger 等）
├─ common            通用返回结果、异常定义、常量
├─ exception         全局异常处理
├─ util              工具类
└─ XxxApplication.java
```

### 各层之间的关系

请求从前端到后端的完整链路：

```
前端页面  →  Controller  →  Service  →  Mapper/Repository  →  数据库
数据库    →  Mapper/Repository  →  Service  →  Controller  →  前端页面
```

**以商品详情接口为例：**

```
POST /api/products/detail
        ↓
ProductController 接收请求
        ↓
调用 ProductService.findById(id)
        ↓
Service 查询并返回 Product 对象
        ↓
Controller 将结果序列化为 JSON 返回给前端
```

> 当前项目没有数据库，ProductService 直接用内存中的 List 模拟数据。

### 后端功能开发流程

1. 明确需求
2. 设计接口（路径、请求参数、返回结构）
3. 设计数据库表
4. 写 Entity / Model
5. 写 Mapper / Repository
6. 写 Service
7. 写 Controller
8. 前后端联调
9. 测试接口
10. 修 Bug

**示例：商品详情功能**

```
需求：点击商品列表，查看商品详情

接口：POST /api/products/detail

请求体：
{
  "id": 1
}

返回：
{
  "id": 1,
  "name": "Spring Boot 入门课",
  "price": 99.00
}
```

## 是否需要 MySQL 数据库

### 学习初期：暂时不需要

当前项目的数据写死在 `ProductService.java` 里，项目重启后数据始终不变，不依赖 MySQL。

### 什么时候才需要 MySQL

- 新增 / 删除 / 修改商品
- 用户注册与登录
- 保存订单、文章、评论
- 分页查询

### MySQL 连接信息

| 配置项 | 值 |
|---|---|
| Host | localhost |
| Port | 3306 |
| User | root |
| Password | root |
| 服务名 | MySQL57 |

```powershell
# 启动 MySQL
net start MySQL57

# 停止 MySQL
net stop MySQL57
```

### 学习建议

**第一阶段（现在）：** 先不用 MySQL，重点理解以下概念：

- Controller / Service / Model 各层职责
- 接口请求与 JSON 返回
- 前端 Ajax 如何调用后端

**第二阶段（后续）：** 将项目升级为 `Spring Boot + MySQL + MyBatis`，这样学习更扎实。

## Java 语法快速入门

> 结合实际项目代码讲解，有前端基础更容易理解。

### package — 包声明

```java
package com.example.javatestproject.controller;
```

声明这个类属于哪个包，相当于文件夹分类，便于组织代码。

### import — 引入依赖

```java
import org.springframework.web.bind.annotation.RestController;
```

引入别人写好的类或注解，类似前端的 `import xxx from 'xxx'`。

### class — 类

```java
public class ProductController {
}
```

Java 里几乎所有代码都写在类里面。

### public / private — 访问修饰符

```java
public class ProductController          // 外部可以访问
private final ProductService service;   // 只能在当前类内部访问
```

| 修饰符 | 含义 |
|---|---|
| `public` | 外部可访问 |
| `private` | 仅当前类内部可访问 |
| `protected` | 当前类及子类可访问 |

### 变量类型 — 强类型声明

```java
String name;
Long id;
BigDecimal price;
List<Product> products;
Map<String, Object> request;
```

常见类型速查：

| 类型 | 说明 | 对应 JS |
|---|---|---|
| `String` | 字符串 | `string` |
| `Integer` | 整数 | `number` |
| `Long` | 长整数（大数字） | `number` |
| `Boolean` | 布尔值 | `boolean` |
| `BigDecimal` | 高精度小数（常用于金额） | — |
| `List<T>` | 列表 | `Array` |
| `Map<K,V>` | 键值对 | `Object` |

### 方法 — 函数

```java
public List<Product> list() {
    return productService.list();
}
```

| 部分 | 含义 |
|---|---|
| `public` | 外部可以调用 |
| `List<Product>` | 返回值类型（商品列表） |
| `list` | 方法名 |
| `()` | 参数列表（此处为空） |
| `return` | 返回结果 |

### 注解 — Spring Boot 核心用法

**`@RestController`** — 标记接口控制器，方法返回值自动转为 JSON

```java
@RestController
public class ProductController {
}
```

**`@RequestMapping`** — 设置接口路径前缀

```java
@RequestMapping("/api/products")
// 该 Controller 下所有接口路径都以 /api/products 开头
```

**`@PostMapping`** — 处理 POST 请求

```java
@PostMapping("/list")
// 完整接口路径：POST /api/products/list
```

**`@RequestBody`** — 从请求体中接收 JSON 参数

```java
public ResponseEntity<Product> detailByPost(@RequestBody Map<String, Object> request)
```

前端传入 `{"id": 1}`，后端通过 `request.get("id")` 取值。

### 构造方法 — 依赖注入

```java
public ProductController(ProductService productService) {
    this.productService = productService;
}
```

Spring Boot 会自动将 `ProductService` 实例注入到 `ProductController` 中，这种机制叫**依赖注入**。可以理解为：Controller 需要 Service，Spring 自动帮你传进来，不需要手动 `new`。

### Service — 业务层

```java
@Service
public class ProductService {

    public List<Product> list() {
        return new ArrayList<>(products.values());
    }
}
```

`@Service` 标记业务层，负责处理逻辑。当前项目中它直接返回内存里的商品数据。

### Model — 数据模型

```java
public class Product {
    private Long id;
    private String name;
    private BigDecimal price;
}
```

`Product` 是数据模型类，对应一条数据记录。Spring Boot 返回时会自动将 Java 对象转为 JSON：

```json
{
  "id": 1,
  "name": "Spring Boot 入门课",
  "price": 99.00
}
```

### 条件判断与响应返回

```java
// if 条件判断
if (product == null) {
    return ResponseEntity.notFound().build();   // 返回 404
}

// return 返回响应
return ResponseEntity.ok(product);   // 返回 200 成功，并附带 product 数据
```

## 下一步学习建议

按以下顺序逐步理解当前项目代码：

1. 看懂 `ProductController`
2. 看懂 `ProductService`
3. 看懂 `Product`
4. 看懂 `app.js` 里的 `ajaxPost`
5. 自己新增一个接口
6. 自己新增一条商品数据
7. 接入 MySQL

**推荐练习：新增一个"新增商品"接口**

```
接口：POST /api/products/create

请求体：
{
  "name": "新商品",
  "price": 99.00,
  "description": "商品描述"
}
```

前端提交表单后，商品列表自动刷新显示新数据。这是从入门走向实战的关键一步。
