<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import { ElEmpty } from 'element-plus'
import { resolveIcon } from '../../../../utils/iconMap'
import type { CategoryConfig } from '../../../../config/categories'
import type { DocItem } from '../../../../types/content'

const props = defineProps<{
  categories: CategoryConfig[]
  categoryStats: Record<string, number>
  docList: DocItem[]
}>()

/** 当前展开的分类 id，再次点击同一个则收起 */
const activeCategory = ref<string | null>(null)

function toggleCategory(id: string) {
  activeCategory.value = activeCategory.value === id ? null : id
}

const activeDocs = () => {
  if (!activeCategory.value) return []
  return props.docList.filter((d) => d.category === activeCategory.value)
}
</script>

<template>
  <section id="categories" class="section-block">
    <div class="block-heading">
      <div>
        <span class="kicker">Categories</span>
        <h2>精选分类</h2>
      </div>
    </div>

    <div v-if="categories.length > 0" class="category-grid">
      <article
        v-for="category in categories"
        :key="category.id"
        class="category-card"
        :class="[`tone-${category.color}`, { 'is-active': activeCategory === category.id }]"
        role="button"
        tabindex="0"
        :aria-expanded="activeCategory === category.id"
        @click="toggleCategory(category.id)"
        @keydown.enter.prevent="toggleCategory(category.id)"
        @keydown.space.prevent="toggleCategory(category.id)"
      >
        <div class="card-icon">
          <component :is="resolveIcon(category.icon)" v-if="resolveIcon(category.icon)" :size="24" />
        </div>
        <h3>{{ category.name }}</h3>
        <p class="count-text">{{ categoryStats[category.id] ?? 0 }} 篇资料</p>
        <span class="browse-link">
          {{ activeCategory === category.id ? '收起' : '浏览资料' }}
          <ArrowRight :size="16" :class="{ 'icon-rotate': activeCategory === category.id }" />
        </span>
      </article>
    </div>
    <el-empty v-else description="暂无分类" />

    <!-- 内联文档列表 -->
    <transition name="slide-down">
      <div v-if="activeCategory" class="inline-doc-list">
        <div class="inline-list-header">
          <span class="kicker">{{ categories.find((c) => c.id === activeCategory)?.name }}</span>
          <span class="doc-count">共 {{ activeDocs().length }} 篇</span>
        </div>
        <div v-if="activeDocs().length > 0" class="inline-doc-grid">
          <RouterLink
            v-for="doc in activeDocs()"
            :key="doc.id"
            :to="{ name: 'detail', params: { id: doc.id } }"
            class="inline-doc-card"
          >
            <div class="inline-doc-title">{{ doc.title }}</div>
            <div class="inline-doc-meta">
              <span class="inline-doc-date">{{ doc.date }}</span>
              <span v-for="tag in doc.tags.slice(0, 3)" :key="tag" class="inline-doc-tag">#{{ tag }}</span>
            </div>
          </RouterLink>
        </div>
        <el-empty v-else description="该分类暂无文档" :image-size="60" />
      </div>
    </transition>
  </section>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
