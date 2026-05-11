/**
 * 构建期数据生成脚本
 * 扫描 docs/ 目录，解析 Markdown + frontmatter，生成静态 JSON 数据到 public/data/generated/
 *
 * 触发方式：npm run predev / npm run prebuild（自动）或 npm run generate（手动）
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import matter from 'gray-matter'
import { Marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const DOCS_DIR = path.resolve(ROOT, 'docs')
const OUT_DIR = path.resolve(ROOT, 'public/data/generated')
const ASSETS_OUT_DIR = path.resolve(ROOT, 'public/docs-assets')
const ID_MAP_FILE = path.resolve(OUT_DIR, 'id-map.json')

// ─── Markdown 渲染器 ──────────────────────────────────────────────────────────

const marked = new Marked(
  markedHighlight({
    langPrefix: 'hljs language-',
    highlight(code, lang) {
      const language = hljs.getLanguage(lang) ? lang : 'plaintext'
      return hljs.highlight(code, { language }).value
    },
  }),
)

// 自定义渲染：图片路径替换（本地图片 → /docs-assets/...）
const renderer = new marked.Renderer()
const originalImage = renderer.image.bind(renderer)
renderer.image = function (token) {
  const { href, title, text } = token
  if (href && !href.startsWith('http://') && !href.startsWith('https://')) {
    // 本地图片，路径在复制阶段处理，这里先打标记
    token = { ...token, href: `__LOCAL_IMG__${href}` }
  }
  return originalImage(token)
}
marked.use({ renderer })

// ─── 工具函数 ─────────────────────────────────────────────────────────────────

/** 读取或初始化 id-map.json */
function loadIdMap() {
  if (fs.existsSync(ID_MAP_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(ID_MAP_FILE, 'utf8'))
    } catch {
      return {}
    }
  }
  return {}
}

/** 文件名转可读标题：vue3-reactivity → Vue3 Reactivity */
function fileNameToTitle(fileName) {
  return fileName
    .replace(/\.md$/, '')
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

/** 从 Markdown 正文提取第一个一级标题 */
function extractFirstH1(content) {
  const match = content.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : null
}

/** 去除 Markdown 标记，提取纯文本（用于 summary 兜底和搜索） */
function extractPlainText(content) {
  return content
    .replace(/```[\s\S]*?```/g, '') // 代码块
    .replace(/`[^`]+`/g, '') // 行内代码
    .replace(/!\[.*?\]\(.*?\)/g, '') // 图片
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // 链接保留文字
    .replace(/^#{1,6}\s+/gm, '') // 标题标记
    .replace(/[*_~>|]/g, '') // 其他标记
    .replace(/\n{2,}/g, '\n')
    .trim()
}

/** 格式化日期为 YYYY-MM-DD */
function formatDate(date) {
  if (!date) return null
  if (typeof date === 'string') return date
  const d = new Date(date)
  if (isNaN(d.getTime())) return null
  return d.toISOString().slice(0, 10)
}

/** 递归扫描目录，返回所有 .md 文件的绝对路径 */
function scanMarkdownFiles(dir) {
  const results = []
  if (!fs.existsSync(dir)) return results
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      results.push(...scanMarkdownFiles(fullPath))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      results.push(fullPath)
    }
  }
  return results
}

/** 复制本地图片到 public/docs-assets，返回新路径 */
function copyLocalImage(imgRelPath, mdFilePath, categoryId) {
  // imgRelPath 是相对于 md 文件的路径，如 ./assets/demo.png
  const mdDir = path.dirname(mdFilePath)
  const absImgPath = path.resolve(mdDir, imgRelPath)
  if (!fs.existsSync(absImgPath)) {
    console.warn(`  [warn] 图片不存在: ${absImgPath}`)
    return imgRelPath
  }
  const imgFileName = path.basename(absImgPath)
  const destDir = path.join(ASSETS_OUT_DIR, categoryId)
  fs.mkdirSync(destDir, { recursive: true })
  const destPath = path.join(destDir, imgFileName)
  fs.copyFileSync(absImgPath, destPath)
  // 返回相对于 public 的路径（运行时通过 base 访问）
  return `docs-assets/${categoryId}/${imgFileName}`
}

/** 处理 HTML 中的本地图片标记，替换为实际路径 */
function resolveLocalImages(html, mdFilePath, categoryId) {
  return html.replace(/src="__LOCAL_IMG__([^"]+)"/g, (_, imgPath) => {
    const newPath = copyLocalImage(imgPath, mdFilePath, categoryId)
    return `src="${newPath}"`
  })
}

/** 从渲染后的 HTML 提取目录（h2/h3 标题） */
function extractToc(html) {
  const toc = []
  const headingRegex = /<h([23])[^>]*id="([^"]*)"[^>]*>(.*?)<\/h[23]>/gi
  let match
  while ((match = headingRegex.exec(html)) !== null) {
    const label = match[3].replace(/<[^>]+>/g, '').trim()
    toc.push({ id: match[2], label })
  }
  return toc
}

// marked 默认不给标题加 id，需要自定义 renderer
function buildMarkedWithHeadingId() {
  const m = new Marked(
    markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, { language }).value
      },
    }),
  )
  const r = new m.Renderer()

  r.heading = function ({ text, depth }) {
    const id = text
      .toLowerCase()
      .replace(/<[^>]+>/g, '')
      .replace(/[^\w\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return `<h${depth} id="${id}">${text}</h${depth}>\n`
  }

  r.image = function ({ href, title, text }) {
    if (href && !href.startsWith('http://') && !href.startsWith('https://')) {
      return `<img src="__LOCAL_IMG__${href}" alt="${text}"${title ? ` title="${title}"` : ''} />`
    }
    return `<img src="${href}" alt="${text}"${title ? ` title="${title}"` : ''} />`
  }

  m.use({ renderer: r })
  return m
}

// ─── 主流程 ───────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍 开始扫描 docs/ 目录...')

  // 读取分类配置
  const categoriesModule = await import('../src/config/categories.ts').catch(() => null)
  // 如果 ts 无法直接 import，读取并解析
  let categoryConfigs = []
  const catFile = path.resolve(ROOT, 'src/config/categories.ts')
  if (fs.existsSync(catFile)) {
    const catContent = fs.readFileSync(catFile, 'utf8')
    // 简单解析 categories 数组中的 id 和 name
    const matches = [...catContent.matchAll(/\{\s*id:\s*'([^']+)'[^}]*name:\s*'([^']+)'[^}]*color:\s*'([^']+)'/g)]
    categoryConfigs = matches.map((m) => ({ id: m[1], name: m[2], color: m[3] }))
  }
  const categoryMap = Object.fromEntries(categoryConfigs.map((c) => [c.id, c]))

  // 确保输出目录存在
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.mkdirSync(ASSETS_OUT_DIR, { recursive: true })

  // 加载已有 id-map
  const idMap = loadIdMap()

  // 扫描所有 md 文件
  const allMdFiles = scanMarkdownFiles(DOCS_DIR)
  console.log(`  找到 ${allMdFiles.length} 篇 Markdown 文档`)

  const markedWithId = buildMarkedWithHeadingId()
  const docList = []
  const detailMap = {}
  const tagSet = new Set()

  for (const mdPath of allMdFiles) {
    const relPath = path.relative(DOCS_DIR, mdPath).replace(/\\/g, '/')
    const parts = relPath.split('/')
    if (parts.length < 2) continue // 根目录下的 md 文件忽略

    const categoryId = parts[0]
    const fileName = parts[parts.length - 1]

    // 检查分类是否在配置中
    if (!categoryMap[categoryId]) {
      console.warn(`  [warn] 未配置的分类目录，已跳过: ${relPath}`)
      continue
    }

    // 生成或复用 id
    if (!idMap[relPath]) {
      idMap[relPath] = String(Date.now() + Math.floor(Math.random() * 1000))
      // 避免同一毫秒内多个文件 id 碰撞
      await new Promise((r) => setTimeout(r, 2))
    }
    const docId = idMap[relPath]

    // 解析 frontmatter
    const raw = fs.readFileSync(mdPath, 'utf8')
    const { data: fm, content } = matter(raw)

    // 兜底字段
    const title = fm.title || extractFirstH1(content) || fileNameToTitle(fileName)
    const tags = Array.isArray(fm.tags) ? fm.tags : []
    const stat = fs.statSync(mdPath)
    const date = formatDate(fm.date) || formatDate(stat.mtime) || new Date().toISOString().slice(0, 10)
    const author = fm.author || ''
    const source = fm.source || ''
    const plainText = extractPlainText(content)
    const summary = fm.summary || (plainText.length > 0 ? plainText.slice(0, 100) : '图片文档')

    tags.forEach((t) => tagSet.add(t))

    // 渲染 Markdown → HTML
    let html = await markedWithId.parse(content)
    html = resolveLocalImages(html, mdPath, categoryId)

    // 提取目录
    const toc = extractToc(html)

    const categoryName = categoryMap[categoryId].name
    const categoryColor = categoryMap[categoryId].color

    // 文档列表条目
    docList.push({
      id: docId,
      title,
      category: categoryId,
      categoryName,
      categoryColor,
      tags,
      date,
      summary,
      author,
      source,
      plainText, // 用于搜索
    })

    // 详情数据
    detailMap[docId] = {
      id: docId,
      title,
      category: categoryId,
      categoryName,
      categoryColor,
      tags,
      date,
      summary,
      author,
      source,
      toc,
      html,
    }

    console.log(`  ✓ ${relPath} → id: ${docId}`)
  }

  // 按 date 倒序
  docList.sort((a, b) => (a.date < b.date ? 1 : -1))

  // 分类统计
  const categoryStats = {}
  for (const doc of docList) {
    categoryStats[doc.category] = (categoryStats[doc.category] || 0) + 1
  }

  // 最近更新（前 5 条）
  const recentUpdates = docList.slice(0, 5).map(({ id, title, categoryName, categoryColor, date, summary, tags }) => ({
    id,
    title,
    category: categoryName,
    categoryColor,
    date,
    summary,
    tags,
  }))

  // 写出文件
  fs.writeFileSync(path.join(OUT_DIR, 'id-map.json'), JSON.stringify(idMap, null, 2), 'utf8')

  fs.writeFileSync(
    path.join(OUT_DIR, 'list.json'),
    JSON.stringify(
      docList.map(({ plainText: _, ...rest }) => rest), // list 不含 plainText，减小体积
      null,
      2,
    ),
    'utf8',
  )

  fs.writeFileSync(
    path.join(OUT_DIR, 'search-index.json'),
    JSON.stringify(
      docList.map(({ id, title, category, categoryName, tags, summary, plainText }) => ({
        id,
        title,
        category,
        categoryName,
        tags,
        summary,
        plainText,
      })),
      null,
      2,
    ),
    'utf8',
  )

  fs.writeFileSync(
    path.join(OUT_DIR, 'recent.json'),
    JSON.stringify(recentUpdates, null, 2),
    'utf8',
  )

  fs.writeFileSync(
    path.join(OUT_DIR, 'category-stats.json'),
    JSON.stringify(categoryStats, null, 2),
    'utf8',
  )

  fs.writeFileSync(
    path.join(OUT_DIR, 'tags.json'),
    JSON.stringify([...tagSet].sort(), null, 2),
    'utf8',
  )

  // 每篇文章单独一个 JSON 文件，避免一次性加载全部详情
  const detailOutDir = path.join(OUT_DIR, 'detail')
  fs.mkdirSync(detailOutDir, { recursive: true })
  for (const [docId, detail] of Object.entries(detailMap)) {
    fs.writeFileSync(path.join(detailOutDir, `${docId}.json`), JSON.stringify(detail, null, 2), 'utf8')
  }

  // sitemap.xml & robots.txt（供搜索引擎收录）
  writeSitemap(docList)

  console.log(`\n✅ 数据生成完成`)
  console.log(`   文档总数: ${docList.length}`)
  console.log(`   标签总数: ${tagSet.size}`)
  console.log(`   输出目录: public/data/generated/`)
}

/**
 * 生成 sitemap.xml 和 robots.txt，写到 public/ 下
 * SITE_URL 取自 package.json 的 homepage 或环境变量 SITE_URL；
 * 未配置时退化为相对路径（搜索引擎抓不到，但不会报错）
 */
function writeSitemap(docList) {
  const publicDir = path.resolve(ROOT, 'public')
  const pkgPath = path.resolve(ROOT, 'package.json')
  let siteUrl = process.env.SITE_URL || ''
  if (!siteUrl && fs.existsSync(pkgPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
      siteUrl = pkg.homepage || ''
    } catch {
      // ignore
    }
  }
  if (!siteUrl) {
    console.log(`   (未配置 SITE_URL 或 package.json#homepage，跳过 sitemap)`)
    return
  }

  // 去掉末尾斜杠
  const base = siteUrl.replace(/\/$/, '')
  const today = new Date().toISOString().slice(0, 10)

  // 页面列表：首页（hash 路由无法索引详情，但留一条保证首页被抓）+ 详情页
  const urls = [
    { loc: `${base}/`, lastmod: today, changefreq: 'weekly', priority: '1.0' },
    ...docList.map((d) => ({
      loc: `${base}/#/detail/${d.id}`,
      lastmod: d.date,
      changefreq: 'monthly',
      priority: '0.7',
    })),
  ]

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>\n` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
    urls
      .map(
        (u) =>
          `  <url>\n` +
          `    <loc>${u.loc}</loc>\n` +
          `    <lastmod>${u.lastmod}</lastmod>\n` +
          `    <changefreq>${u.changefreq}</changefreq>\n` +
          `    <priority>${u.priority}</priority>\n` +
          `  </url>`,
      )
      .join('\n') +
    `\n</urlset>\n`

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8')

  const robots = `User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`
  fs.writeFileSync(path.join(publicDir, 'robots.txt'), robots, 'utf8')

  console.log(`   sitemap: ${urls.length} 个 URL → public/sitemap.xml`)
}

main().catch((err) => {
  console.error('❌ 数据生成失败:', err)
  process.exit(1)
})
