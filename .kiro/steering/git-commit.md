# Git 提交信息规范

每次执行 git commit 时，必须按照以下 Conventional Commits 规范填写提交信息。

## 格式

```
<type>(<scope>): <subject>
```

- `scope` 可选，表示影响范围（如组件名、模块名）
- `subject` 使用中文或英文均可，简明描述本次变更内容

## type 类型

| type | 说明 |
|------|------|
| `feat` | 新增功能 |
| `fix` | 修复 bug |
| `style` | 样式调整（不影响逻辑） |
| `refactor` | 代码重构（非新增功能、非修复 bug） |
| `perf` | 性能优化 |
| `docs` | 文档变更 |
| `chore` | 构建配置、依赖更新等杂项 |
| `ci` | CI/CD 配置变更 |
| `revert` | 回滚提交 |

## 示例

```
feat(ArticleBody): 新增代码块高亮渲染
fix(TocNav): 修复锚点跳转偏移问题
style(HeroSection): 调整标题字号和间距
refactor(router): 拆分路由配置文件
chore: 升级 vite 到 8.x
docs: 更新 README 部署说明
ci: 修复 GitHub Actions 构建步骤
```
