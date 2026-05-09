<script setup lang="ts">
import { FolderKanban, Star, Tags } from 'lucide-vue-next'
import { resolveIcon } from '../../../../utils/iconMap'
import type { Category } from '../../../../types/content'

defineProps<{
  categories: Category[]
  tags: string[]
  panel: { title: string; description: string }
}>()
</script>

<template>
  <aside class="sidebar" aria-label="知识库侧边栏">
    <section class="sidebar-section">
      <div class="section-title">
        <FolderKanban :size="17" />
        分类
      </div>
      <a
        v-for="category in categories"
        :key="category.name"
        class="side-link"
        href="/#categories"
      >
        <component :is="resolveIcon(category.icon)" v-if="resolveIcon(category.icon)" :size="17" />
        <span>{{ category.name }}</span>
        <em>{{ category.count }}</em>
      </a>
    </section>

    <section class="sidebar-section">
      <div class="section-title">
        <Tags :size="17" />
        热门标签
      </div>
      <div class="tag-cloud">
        <span v-for="tag in tags" :key="tag">{{ tag }}</span>
      </div>
    </section>

    <section class="sidebar-panel">
      <Star :size="19" />
      <strong>{{ panel.title }}</strong>
      <p>{{ panel.description }}</p>
    </section>
  </aside>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
