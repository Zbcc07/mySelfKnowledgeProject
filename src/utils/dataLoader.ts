/**
 * 从 public/data/generated/ 加载静态数据
 * 使用 import.meta.env.BASE_URL 确保 GitHub Pages 子路径下路径正确
 */

import type { DocItem, DocDetail, RecentItem, SearchIndexItem } from '../types/content'

function baseUrl(): string {
  // BASE_URL 在 vite.config 中由 base 决定，末尾带 /
  return import.meta.env.BASE_URL
}

async function fetchJson<T>(relativePath: string): Promise<T> {
  const url = `${baseUrl()}data/generated/${relativePath}`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.status}`)
  return res.json() as Promise<T>
}

export async function loadDocList(): Promise<DocItem[]> {
  return fetchJson<DocItem[]>('list.json')
}

export async function loadSearchIndex(): Promise<SearchIndexItem[]> {
  return fetchJson<SearchIndexItem[]>('search-index.json')
}

export async function loadRecentUpdates(): Promise<RecentItem[]> {
  return fetchJson<RecentItem[]>('recent.json')
}

export async function loadCategoryStats(): Promise<Record<string, number>> {
  return fetchJson<Record<string, number>>('category-stats.json')
}

export async function loadTags(): Promise<string[]> {
  return fetchJson<string[]>('tags.json')
}

export async function loadDocDetail(id: string): Promise<DocDetail> {
  return fetchJson<DocDetail>(`detail/${id}.json`)
}
