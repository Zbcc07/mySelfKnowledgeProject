<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onBeforeUnmount, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'
import { CloudSun, Rocket, Search, X } from 'lucide-vue-next'
import { ElEmpty } from 'element-plus'
import type { SearchIndexItem } from '../../../../types/content'
import { loadSearchIndex } from '../../../../utils/dataLoader'

const router = useRouter()

const keyword = ref('')
const isFocused = ref(false)
const isPanelOpen = ref(false)
const searchIndex = ref<SearchIndexItem[]>([])
const searchWrapRef = ref<HTMLElement | null>(null)
const resultListRef = ref<HTMLElement | null>(null)
/** 当前通过键盘高亮的结果索引，-1 表示无选中 */
const activeIndex = ref(-1)

const results = computed<SearchIndexItem[]>(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return []
  return searchIndex.value.filter((item) => {
    return (
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.categoryName.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q)) ||
      item.plainText.toLowerCase().includes(q)
    )
  })
})

watch(keyword, (v) => {
  isPanelOpen.value = v.trim().length > 0
  activeIndex.value = -1
})

function closePanel() {
  isPanelOpen.value = false
  keyword.value = ''
  activeIndex.value = -1
}

/** 让指定索引对应的结果卡片滚动到可视区域 */
async function scrollActiveIntoView() {
  await nextTick()
  const container = resultListRef.value
  if (!container) return
  const el = container.querySelectorAll<HTMLElement>('.result-card')[activeIndex.value]
  if (el) {
    el.scrollIntoView({ block: 'nearest' })
  }
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    closePanel()
    return
  }
  if (!isPanelOpen.value || results.value.length === 0) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    activeIndex.value = (activeIndex.value + 1) % results.value.length
    scrollActiveIntoView()
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    const total = results.value.length
    activeIndex.value = (activeIndex.value - 1 + total) % total
    scrollActiveIntoView()
  } else if (e.key === 'Enter') {
    const target = results.value[activeIndex.value] ?? results.value[0]
    if (target) {
      e.preventDefault()
      router.push({ name: 'detail', params: { id: target.id } })
      closePanel()
    }
  }
}

function handleClickOutside(e: MouseEvent) {
  if (searchWrapRef.value && !searchWrapRef.value.contains(e.target as Node)) {
    isPanelOpen.value = false
  }
}

onMounted(async () => {
  try {
    searchIndex.value = await loadSearchIndex()
  } catch {
    searchIndex.value = []
  }
  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <header class="topbar">
    <RouterLink class="brand" to="/" aria-label="Sunny Docs 首页">
      <span class="brand-mark">
        <CloudSun :size="24" />
      </span>
      <span>
        <strong>Sunny Docs</strong>
        <small>技术知识库</small>
      </span>
    </RouterLink>

    <div ref="searchWrapRef" class="search-wrap">
      <label class="top-search" :class="{ 'is-focused': isFocused }" for="global-search">
        <Search :size="18" class="search-icon" />
        <input
          id="global-search"
          v-model="keyword"
          type="search"
          placeholder="搜索标题 / 摘要 / 分类 / 标签 / 正文"
          @focus="isFocused = true"
          @blur="isFocused = false"
          @keydown="handleKeydown"
        />
        <button
          v-if="keyword"
          type="button"
          class="clear-btn"
          aria-label="清空"
          @click="closePanel"
        >
          <X :size="14" />
        </button>
      </label>

      <!-- 搜索结果浮层 -->
      <transition name="panel-fade">
        <div v-if="isPanelOpen" class="search-panel" role="dialog" aria-label="搜索结果">
          <div class="panel-header">
            <span class="panel-title">
              搜索"{{ keyword }}"
              <em>{{ results.length }} 条结果</em>
            </span>
          </div>

          <div v-if="results.length > 0" ref="resultListRef" class="result-list">
            <RouterLink
              v-for="(item, index) in results"
              :key="item.id"
              :to="{ name: 'detail', params: { id: item.id } }"
              class="result-card"
              :class="{ 'is-active': activeIndex === index }"
              @click="closePanel"
              @mouseenter="activeIndex = index"
            >
              <div class="result-top">
                <span class="result-category">{{ item.categoryName }}</span>
                <span v-for="tag in item.tags.slice(0, 3)" :key="tag" class="result-tag">#{{ tag }}</span>
              </div>
              <div class="result-title">{{ item.title }}</div>
              <div class="result-summary">{{ item.summary }}</div>
            </RouterLink>
          </div>
          <el-empty v-else description="没有找到相关文档" :image-size="60" />
        </div>
      </transition>
    </div>

    <a class="publish-button" href="https://pages.github.com/" target="_blank" rel="noreferrer">
      <Rocket :size="18" />
      <span>GitHub Pages</span>
    </a>
  </header>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
