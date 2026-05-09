<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { ElEmpty, ElPagination } from 'element-plus'
import { RouterLink } from 'vue-router'
import type { DocItem } from '../../../../types/content'
import { getCategoryById } from '../../../../config/categories'
import { useActiveCategory } from '../../../../composables/useActiveCategory'

const props = defineProps<{
  docList: DocItem[]
}>()

const { activeCategoryId } = useActiveCategory()

const activeCategory = computed(() => getCategoryById(activeCategoryId.value))

/** kicker 英文：直接用 categoryId 大写（frontend / backend / database / ai） */
const kicker = computed(() => activeCategoryId.value.toUpperCase() || 'UPDATES')

const filteredDocs = computed<DocItem[]>(() =>
  props.docList.filter((d) => d.category === activeCategoryId.value),
)

// ─── 分页 ────────────────────────────────────────────────────────────────────
const currentPage = ref(1)
const pageSize = ref(4)

// 切换分类时重置到第一页
watch(activeCategoryId, () => {
  currentPage.value = 1
})

const pagedDocs = computed<DocItem[]>(() => {
  const start = (currentPage.value - 1) * pageSize.value
  return filteredDocs.value.slice(start, start + pageSize.value)
})
</script>

<template>
  <div class="update-column">
    <div class="block-heading">
      <div>
        <span class="kicker">{{ kicker }}</span>
        <h2>{{ activeCategory?.name ?? '最近更新' }}</h2>
      </div>
    </div>

    <div v-if="filteredDocs.length > 0" class="update-list">
      <RouterLink
        v-for="article in pagedDocs"
        :key="article.id"
        :to="{ name: 'detail', params: { id: article.id } }"
        class="update-card"
      >
        <h3>{{ article.title }}</h3>
        <p>{{ article.summary }}</p>
        <div v-if="article.tags.length > 0" class="update-tags">
          <span v-for="tag in article.tags.slice(0, 3)" :key="tag">#{{ tag }}</span>
        </div>
        <span class="update-date">{{ article.date }}</span>
      </RouterLink>
    </div>
    <el-empty v-else description="该分类暂无文档" />

    <div class="update-pagination">
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="Math.max(filteredDocs.length, 1)"
        layout="prev, pager, next"
        background
        small
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
