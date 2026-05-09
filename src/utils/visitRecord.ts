/**
 * localStorage 访问记录工具
 * - kb_visit_records: 文档访问记录
 * - kb_tag_records: 标签访问记录（从访问过的详情页中收集）
 */

import type { VisitRecord, VisitRecords } from '../types/content'

const VISIT_KEY = 'kb_visit_records'
const TAG_KEY = 'kb_tag_records'

/** 标签访问记录条目 */
export interface TagRecord {
  count: number
  lastDocId: string
  lastVisit: number
}

export type TagRecords = Record<string, TagRecord>

// ─── 文档访问记录 ────────────────────────────────────────────────────────────

export function getVisitRecords(): VisitRecords {
  try {
    const raw = localStorage.getItem(VISIT_KEY)
    return raw ? (JSON.parse(raw) as VisitRecords) : {}
  } catch {
    return {}
  }
}

export function recordVisit(docId: string): void {
  try {
    const records = getVisitRecords()
    const existing = records[docId]
    records[docId] = {
      count: (existing?.count ?? 0) + 1,
      lastVisit: Date.now(),
    }
    localStorage.setItem(VISIT_KEY, JSON.stringify(records))
  } catch {
    // localStorage 不可用时静默失败
  }
}

export function getFrequentDocIds(limit = 5): string[] {
  const records = getVisitRecords()
  return Object.entries(records)
    .sort(([, a], [, b]) => {
      if (b.count !== a.count) return b.count - a.count
      return b.lastVisit - a.lastVisit
    })
    .slice(0, limit)
    .map(([id]) => id)
}

export function getVisitRecord(docId: string): VisitRecord | undefined {
  return getVisitRecords()[docId]
}

// ─── 标签访问记录 ────────────────────────────────────────────────────────────

export function getTagRecords(): TagRecords {
  try {
    const raw = localStorage.getItem(TAG_KEY)
    return raw ? (JSON.parse(raw) as TagRecords) : {}
  } catch {
    return {}
  }
}

/** 访问某篇详情时，把这篇文档的所有标签计数 +1，并记录最近关联文档 */
export function recordTagVisit(docId: string, tags: string[]): void {
  if (!tags || tags.length === 0) return
  try {
    const records = getTagRecords()
    const now = Date.now()
    for (const tag of tags) {
      const existing = records[tag]
      records[tag] = {
        count: (existing?.count ?? 0) + 1,
        lastDocId: docId,
        lastVisit: now,
      }
    }
    localStorage.setItem(TAG_KEY, JSON.stringify(records))
  } catch {
    // 静默失败
  }
}

/** 返回热门标签列表，按访问次数倒序，取前 limit 个 */
export interface HotTag {
  name: string
  count: number
  docId: string
  lastVisit: number
}

export function getHotTags(limit = 20): HotTag[] {
  const records = getTagRecords()
  return Object.entries(records)
    .map(([name, r]) => ({ name, count: r.count, docId: r.lastDocId, lastVisit: r.lastVisit }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      return b.lastVisit - a.lastVisit
    })
    .slice(0, limit)
}
