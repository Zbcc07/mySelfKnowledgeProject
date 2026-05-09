import {
  BookOpen,
  Boxes,
  Code2,
  Database,
  FileSearch,
  FolderKanban,
  GitBranch,
  Layers3,
  Sparkles,
  Tags,
  TerminalSquare,
} from 'lucide-vue-next'
import type { Component } from 'vue'

/**
 * JSON 数据源中以字符串声明图标名，运行时用此映射取到实际组件。
 */
export const iconMap: Record<string, Component> = {
  BookOpen,
  Boxes,
  Code2,
  Database,
  FileSearch,
  FolderKanban,
  GitBranch,
  Layers3,
  Sparkles,
  Tags,
  TerminalSquare,
}

export function resolveIcon(name?: string): Component | null {
  if (!name) return null
  return iconMap[name] ?? null
}
