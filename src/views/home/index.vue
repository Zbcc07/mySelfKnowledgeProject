<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import HeroSection from './components/HeroSection/index.vue'
import CategoryGrid from './components/CategoryGrid/index.vue'
import UpdateList from './components/UpdateList/index.vue'
import RoadmapPanel from './components/RoadmapPanel/index.vue'
import FrequentList from './components/FrequentList/index.vue'
import SearchPanel from './components/SearchPanel/index.vue'
import homeDataJson from '../../../public/data/home/index.json'
import type { HomeData, DocItem, RecentItem, SearchIndexItem } from '../../types/content'
import type { VisitRecord } from '../../types/content'
import { categories } from '../../config/categories'
import {
  loadDocList,
  loadRecentUpdates,
  loadCategoryStats,
  loadSearchIndex,
} from '../../utils/dataLoader'
import { getFrequentDocIds, getVisitRecords } from '../../utils/visitRecord'

const pageData = ref<HomeData>(homeDataJson as HomeData)

// 生成数据
const docList = ref<DocItem[]>([])
const recentUpdates = ref<RecentItem[]>([])
const categoryStats = ref<Record<string, number>>({})
const searchIndex = ref<SearchIndexItem[]>([])

// 频繁访问
const visitRecords = ref<Record<string, VisitRecord>>({})
const frequentDocs = computed<DocItem[]>(() => {
  const ids = getFrequentDocIds(5)
  return ids
    .map((id) => docList.value.find((d) => d.id === id))
    .filter((d): d is DocItem => Boolean(d))
})

onMounted(async () => {
  visitRecords.value = getVisitRecords()
  try {
    const [list, recent, stats, index] = await Promise.all([
      loadDocList(),
      loadRecentUpdates(),
      loadCategoryStats(),
      loadSearchIndex(),
    ])
    docList.value = list
    recentUpdates.value = recent
    categoryStats.value = stats
    searchIndex.value = index
    // 刷新频繁访问（数据加载后才能匹配 doc 信息）
    visitRecords.value = getVisitRecords()
  } catch (e) {
    console.error('加载知识库数据失败:', e)
  }
})
</script>

<template>
  <div class="home-page">
    <HeroSection :config="pageData.hero" />

    <!-- 搜索 -->
    <SearchPanel :search-index="searchIndex" />

    <!-- 分类 -->
    <CategoryGrid
      :categories="categories"
      :category-stats="categoryStats"
      :doc-list="docList"
    />

    <section id="updates" class="two-column">
      <UpdateList :updates="recentUpdates" />
      <div class="right-column">
        <FrequentList :docs="frequentDocs" :visit-records="visitRecords" />
        <RoadmapPanel :items="pageData.roadmap" />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
