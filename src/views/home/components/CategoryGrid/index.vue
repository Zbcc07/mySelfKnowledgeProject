<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { ElEmpty } from 'element-plus'
import { resolveIcon } from '../../../../utils/iconMap'
import type { Category } from '../../../../types/content'

defineProps<{
  categories: Category[]
}>()
</script>

<template>
  <section id="categories" class="section-block">
    <div class="block-heading">
      <div>
        <span class="kicker">Categories</span>
        <h2>精选分类</h2>
      </div>
      <a href="#">全部分类</a>
    </div>

    <div v-if="categories.length > 0" class="category-grid">
      <article
        v-for="category in categories"
        :key="category.name"
        class="category-card"
        :class="`tone-${category.color}`"
      >
        <div class="card-icon">
          <component :is="resolveIcon(category.icon)" v-if="resolveIcon(category.icon)" :size="24" />
        </div>
        <h3>{{ category.name }}</h3>
        <p>{{ category.count }} 篇资料正在整理，覆盖入门笔记、实践清单和问题排查。</p>
        <a href="#">
          浏览资料
          <ArrowRight :size="16" />
        </a>
      </article>
    </div>
    <el-empty v-else description="暂无分类" />
  </section>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
