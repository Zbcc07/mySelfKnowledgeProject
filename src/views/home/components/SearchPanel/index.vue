<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { Search, X } from 'lucide-vue-next'
import { ElEmpty } from 'element-plus'
import type { SearchIndexItem } from '../../../../types/content'

const props = defineProps<{
  searchIndex: SearchIndexItem[]
}>()

const keyword = ref('')
const isOpen = ref(false)

const results = computed<SearchIndexItem[]>(() => {
  const q = keyword.value.trim().toLowerCase()
  if (!q) return []
  return props.searchIndex.filter((item) => {
    return (
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.categoryName.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q)) ||
      item.plainText.toLowerCase().includes(q)
    )
  })
})

function doSearch() {
  if (keyword.value.trim()) {
    isOpen.value = true
  }
}

function closePanel() {
  isOpen.value = false
  keyword.value = ''
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') closePanel()
  if (e.key === 'Enter') doSearch()
}
</script>

<template>
  <div class="search-wrap">
    <div class="search-bar">
      <Search :size="18" class="search-icon" />
      <input
        v-model="keyword"
        type="search"
        placeholder="搜索标题、标签、正文..."
        class="search-input"
        @keydown="handleKeydown"
      />
      <button
        v-if="keyword"
        type="button"
        class="clear-btn"
        aria-label="清空搜索"
        @click="closePanel"
      >
        <X :size="16" />
      </button>
      <button type="button" class="search-btn" @click="doSearch">搜索</button>
    </div>

    <!-- 搜索结果浮层 -->
    <transition name="panel-fade">
      <div v-if="isOpen" class="search-panel" role="dialog" aria-label="搜索结果">
        <div class="panel-header">
          <span class="panel-title">
            搜索"{{ keyword }}"
            <em>{{ results.length }} 条结果</em>
          </span>
          <button type="button" class="panel-close" aria-label="关闭" @click="closePanel">
            <X :size="18" />
          </button>
        </div>

        <div v-if="results.length > 0" class="result-list">
          <RouterLink
            v-for="item in results"
            :key="item.id"
            :to="{ name: 'detail', params: { id: item.id } }"
            class="result-card"
            @click="closePanel"
          >
            <div class="result-top">
              <span class="result-category">{{ item.categoryName }}</span>
              <span v-for="tag in item.tags.slice(0, 3)" :key="tag" class="result-tag">#{{ tag }}</span>
            </div>
            <div class="result-title">{{ item.title }}</div>
            <div class="result-summary">{{ item.summary }}</div>
          </RouterLink>
        </div>
        <el-empty v-else description="没有找到相关文档" :image-size="80" />
      </div>
    </transition>

    <!-- 遮罩 -->
    <transition name="mask-fade">
      <div v-if="isOpen" class="search-mask" @click="closePanel" />
    </transition>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
