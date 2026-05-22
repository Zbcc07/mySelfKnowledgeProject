export interface CategoryConfig {
  id: string
  name: string
  icon: string
  color: string
}

export const categories: CategoryConfig[] = [
  { id: 'frontend', name: '前端', icon: 'Code2', color: 'sun' },
  { id: 'backend', name: '后端', icon: 'TerminalSquare', color: 'coral' },
  { id: 'database', name: '数据库', icon: 'Database', color: 'leaf' },
  { id: 'ai', name: 'AI', icon: 'Sparkles', color: 'sky' },
  { id: '需求开发', name: '需求开发', icon: 'ClipboardList', color: 'purple' },
]

/** 根据 id 查找分类配置，找不到返回 undefined */
export function getCategoryById(id: string): CategoryConfig | undefined {
  return categories.find((c) => c.id === id)
}
