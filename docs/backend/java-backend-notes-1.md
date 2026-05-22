---
title: Java 后端学习笔记（一）：环境配置与入门
tags: [Java, 后端, Spring Boot, Maven, 环境配置]
date: 2026-05-22
summary: 从前端开发者视角整理 Java 后端入门知识，涵盖 JDK、Maven、MySQL、Nginx 环境配置以及标准 Spring Boot 项目结构。
---

## 环境配置

### JDK 配置

**安装路径：** `D:\myJAVA\JDK\OpenJDK8U-jdk_x64_windows_hotspot_8u312b07\jdk8u312-b07`

**环境变量设置：**

| 变量名 | 值 |
|---|---|
| `JAVA_HOME` | `D:\myJAVA\JDK\OpenJDK8U-jdk_x64_windows_hotspot_8u312b07\jdk8u312-b07` |
| `Path` | 追加 `%JAVA_HOME%\bin` |

**验证命令：**

```powershell
java -version
javac -version
```

> 注意：`java -v` 是错误命令，正确是 `java -version`。
> `CLASSPATH` 环境变量在 JDK 5 以后无需手动配置。

### Maven 配置

**安装路径：** `D:\myJAVA\Maven\apache-maven-3.9.7-bin\apache-maven-3.9.7`

**环境变量设置：**

| 变量名 | 值 |
|---|---|
| `MAVEN_HOME` | `D:\myJAVA\Maven\apache-maven-3.9.7-bin\apache-maven-3.9.7` |
| `M2_HOME` | `D:\myJAVA\Maven\apache-maven-3.9.7-bin\apache-maven-3.9.7` |
| `Path` | 追加 `%MAVEN_HOME%\bin` |

**验证命令：**

```powershell
mvn -version
```

### MySQL 配置

**安装路径：** `D:\myJAVA\mySQL\mysql-5.7.44-winx64`

**环境变量设置：**

| 变量名 | 值 |
|---|---|
| `MYSQL_HOME` | `D:\myJAVA\mySQL\mysql-5.7.44-winx64` |
| `Path` | 追加 `%MYSQL_HOME%\bin` |

**配置文件** `my.ini` 关键内容：

```ini
[mysqld]
port=3306
character-set-server=utf8mb4

[client]
default-character-set=utf8mb4
```

**默认账号：** root / root（端口 3306）

**常用命令：**

```powershell
# 启动服务
net start MySQL57

# 停止服务
net stop MySQL57

# 登录数据库
mysql -u root -p
```

### Nginx 配置

**安装路径：** `D:\myJAVA\nGinx\nginx-1.28.1-20260108\nginx-1.28.1`

**配置文件** `conf\nginx.conf` 关键内容：

```nginx
upstream epoint-web {
    server 127.0.0.1:8080;
}

server {
    listen 8897;
    location / {
        proxy_pass http://epoint-web;
    }
}
```

**常用命令（在 Nginx 目录下执行）：**

```powershell
# 启动
.\nginx.exe

# 重载配置（不停服）
.\nginx.exe -s reload

# 停止
.\nginx.exe -s stop
```

### IDEA 配置

**配置文件路径：** `C:\Users\25782\AppData\Roaming\JetBrains\IntelliJIdea2026.1\options\`

| 文件 | 作用 |
|---|---|
| `maven.xml` | 指向 Maven 安装路径 |
| `project.default.xml` | 默认 SDK 设为 temurin-1.8（JDK 8） |

## 每日工作流程

### 开启项目

1. **启动 MySQL 服务**（如果项目用到数据库）

   ```powershell
   net start MySQL57
   ```

2. **用 IDEA 打开项目**：打开 IDEA → `File` → `Open` → 选择项目目录
3. **启动后端服务**：找到主类（含 `@SpringBootApplication` 注解），点击左侧绿色三角按钮运行，或右键 → `Run`
4. **启动前端**：如果是静态页面，直接用浏览器打开 `index.html`

### 关闭项目

1. IDEA 中点击红色停止按钮停止后端服务
2. 关闭 IDEA
3. 如需停止 MySQL：`net stop MySQL57`

## 后端项目结构

一个标准 Spring Boot 项目的目录结构：

```
my-project/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/myproject/
│   │   │       ├── MyProjectApplication.java   # 启动类
│   │   │       ├── controller/                 # 接收请求，返回响应
│   │   │       │   └── ProductController.java
│   │   │       ├── service/                    # 业务逻辑层
│   │   │       │   ├── ProductService.java     # 接口
│   │   │       │   └── ProductServiceImpl.java # 实现
│   │   │       ├── entity/                     # 数据库实体类（对应表结构）
│   │   │       │   └── Product.java
│   │   │       └── repository/                 # 数据库操作层（DAO）
│   │   │           └── ProductRepository.java
│   │   └── resources/
│   │       ├── application.properties          # 配置文件（端口、数据库连接等）
│   │       └── static/                         # 静态资源（前端文件）
│   │           ├── index.html
│   │           └── app.js
│   └── test/                                   # 单元测试
└── pom.xml                                     # Maven 依赖配置
```

### 各层职责

| 层 | 注解 | 职责 |
|---|---|---|
| Controller | `@RestController` | 接收 HTTP 请求，调用 Service，返回 JSON |
| Service | `@Service` | 处理业务逻辑 |
| Repository | `@Repository` | 操作数据库（增删改查） |
| Entity | `@Entity` | 对应数据库表的 Java 类 |

## 关于 MySQL 是否必要

| 场景 | 是否需要 MySQL |
|---|---|
| 学习阶段、数据写死在代码里 | 不需要，用 List 模拟即可 |
| 数据需要持久化保存 | 需要 |
| 真实项目、有增删改查需求 | 需要 |

**学习建议：** 先用 Mock 数据（写死在代码里的 List）跑通流程，再接入真实数据库。

**接入数据库需要的步骤：**

1. `pom.xml` 引入 `spring-boot-starter-data-jpa` 和 `mysql-connector-java`
2. `application.properties` 配置数据库连接
3. 创建 Entity 类，加上 `@Entity`、`@Table` 注解
4. 创建 Repository 接口，继承 `JpaRepository`

## Java 语法速览（对比 JavaScript）

### 变量声明

```java
// Java - 强类型，必须声明类型
int age = 25;
String name = "Tom";
boolean isActive = true;
List<String> list = new ArrayList<>();

// 类比 JS
// let age = 25;
// const name = "Tom";
```

### 函数（方法）

```java
// Java - 必须声明返回类型和参数类型
public String greet(String name) {
    return "Hello, " + name;
}

// void 表示无返回值
public void printName(String name) {
    System.out.println(name);
}
```

### 类

```java
public class Product {
    private Long id;
    private String name;
    private Double price;

    // 构造函数
    public Product(Long id, String name, Double price) {
        this.id = id;
        this.name = name;
        this.price = price;
    }

    // getter/setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
}
```

### 常用注解（Spring Boot）

| 注解 | 作用 |
|---|---|
| `@SpringBootApplication` | 标记启动类 |
| `@RestController` | 标记 Controller 类，返回 JSON |
| `@GetMapping("/path")` | 处理 GET 请求 |
| `@PostMapping("/path")` | 处理 POST 请求 |
| `@RequestBody` | 从请求体读取 JSON 参数 |
| `@PathVariable` | 从 URL 路径读取参数 |
| `@RequestParam` | 从 URL 查询参数读取 |
| `@Service` | 标记 Service 类 |
| `@Autowired` | 自动注入依赖 |

## 全栈项目示例

### 项目路径

```
D:\myCodes\javaTestProject\
```

### 后端接口

**端口：** 8081

| 接口 | 方法 | 路径 | 说明 |
|---|---|---|---|
| 获取列表 | POST | `/api/products/list` | 返回商品列表 |
| 获取详情 | POST | `/api/products/detail` | 返回单个商品详情 |

### ProductController 核心代码

```java
@PostMapping("/list")
public List<Product> listByPost(@RequestBody(required = false) Map<String, Object> request) {
    return productService.list();
}

@PostMapping("/detail")
public ResponseEntity<Product> detailByPost(@RequestBody Map<String, Object> request) {
    Long id = Long.valueOf(String.valueOf(request.get("id")));
    return findDetail(id);
}
```

### 前端 Ajax POST 调用示例

```javascript
function request(url, data, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(JSON.stringify(data));
}

// 获取列表
request('/api/products/list', {}, function(data) {
    console.log(data);
});

// 获取详情
request('/api/products/detail', { id: 1 }, function(data) {
    console.log(data);
});
```

### 启动命令

```powershell
# 进入项目目录
cd D:\myCodes\javaTestProject

# 编译打包
mvn clean package -DskipTests

# 启动（后台运行）
Start-Process java -ArgumentList "-jar", "target\javaTestProject-1.0-SNAPSHOT.jar"
```

## 常见问题排查

| 问题 | 原因 | 解决方法 |
|---|---|---|
| `mvn` 命令无法识别 | Path 变量配置错误 | 检查用户 Path，确保包含 `%MAVEN_HOME%\bin` |
| MySQL 服务无法启动 | 端口 3306 被占用 | 执行 `mysqladmin -u root -p shutdown` 后重启服务 |
| 修改代码后接口未生效 | 旧 jar 包仍在运行 | `mvn clean package` 重新打包，停止旧进程后重启 |
| 端口被占用 | 上次未正常关闭服务 | `netstat -ano \| findstr :8081` 找到 PID，`taskkill /PID xxx /F` 结束进程 |

## 推荐学习路线

```
阶段一：Java 基础语法（1-2周）
  └── 变量、数据类型、控制流、类与对象

阶段二：Spring Boot 入门（2-3周）
  └── RESTful API、Controller/Service/Repository 分层

阶段三：数据库（2-3周）
  └── MySQL 基础 SQL + Spring Data JPA / MyBatis

阶段四：进阶（持续）
  └── Spring Security（认证鉴权）
  └── Redis（缓存）
  └── Docker（容器化部署）
  └── 微服务（Spring Cloud）
```
