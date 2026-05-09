/**
 * localStorage 访问记录工具
 * key: kb_visit_records
 * value: { [docId]: { count: number, lastVisit: number } }
 */

import type { VisitRecord, VisitRecords } from '../types/content'

const STORAGE_KEY = 'kb_visit_records'

export function getVisitRecords(): VisitRecords {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
  } catch {
    // localStorage 不可用时静默失败
  }
}

/** 返回按访问频率排序的 docId 列表，最多 limit 条 */
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
