/**
 * 首页与详情页共用的数据类型定义。
 */

export interface NavItem {
  label: string
  href: string
}

export interface HeroMetric {
  key: string
  icon: string
  label: string
  value: string
}

export interface HeroData {
  eyebrow: string
  title: string
  description: string
  primaryAction: { label: string; href: string }
  secondaryAction: { label: string; href: string }
  metrics: HeroMetric[]
}

export interface RoadmapItem {
  title: string
  detail: string
  done: boolean
}

// ─── 生成数据类型 ─────────────────────────────────────────────────────────────

/** 文档列表条目（list.json） */
export interface DocItem {
  id: string
  title: string
  category: string
  categoryName: string
  categoryColor: string
  tags: string[]
  date: string
  summary: string
  author: string
  source: string
}

/** 搜索索引条目（search-index.json） */
export interface SearchIndexItem {
  id: string
  title: string
  category: string
  categoryName: string
  tags: string[]
  summary: string
  plainText: string
}

/** 最近更新条目（recent.json） */
export interface RecentItem {
  id: string
  title: string
  category: string
  categoryColor: string
  date: string
  summary: string
  tags: string[]
}

/** 文档详情（detail/:id.json） */
export interface DocDetail {
  id: string
  title: string
  category: string
  categoryName: string
  categoryColor: string
  tags: string[]
  date: string
  summary: string
  author: string
  source: string
  toc: TocItem[]
  html: string
}

export interface TocItem {
  id: string
  label: string
}

/** localStorage 访问记录结构 */
export interface VisitRecord {
  count: number
  lastVisit: number
}

export type VisitRecords = Record<string, VisitRecord>

// ─── 旧类型保留（兼容现有组件） ───────────────────────────────────────────────

export interface Category {
  id: string
  name: string
  count: number
  color: string
  icon: string
}

export interface UpdateItem {
  id: string
  title: string
  category: string
  date: string
  summary: string
}

export interface HomeData {
  nav: NavItem[]
  hero: HeroData
  categories: Category[]
  tags: string[]
  sidebarPanel: { title: string; description: string }
  updates: UpdateItem[]
  roadmap: RoadmapItem[]
}

export interface ArticleSection {
  id: string
  heading: string
  paragraphs?: string[]
  list?: string[]
}

export interface ArticleDetail {
  id: string
  title: string
  category: string
  categoryColor: string
  date: string
  author: string
  readTime: string
  tags: string[]
  cover?: string
  summary: string
  toc: TocItem[]
  sections: ArticleSection[]
  related: string[]
}

export interface DetailData {
  articles: ArticleDetail[]
}
