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

export interface RoadmapItem {
  title: string
  detail: string
  done: boolean
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

export interface TocItem {
  id: string
  label: string
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
