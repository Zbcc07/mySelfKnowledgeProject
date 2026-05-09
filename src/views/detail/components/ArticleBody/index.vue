<script setup lang="ts">
import { ElEmpty } from 'element-plus'
import type { ArticleSection } from '../../../../types/content'

defineProps<{
  sections: ArticleSection[]
}>()
</script>

<template>
  <article class="article-body">
    <template v-if="sections.length > 0">
      <section
        v-for="section in sections"
        :id="section.id"
        :key="section.id"
        class="article-section"
      >
        <h2>{{ section.heading }}</h2>
        <p v-for="(para, i) in section.paragraphs || []" :key="i">{{ para }}</p>
        <ul v-if="section.list && section.list.length > 0">
          <li v-for="(listItem, i) in section.list" :key="i">{{ listItem }}</li>
        </ul>
      </section>
    </template>
    <el-empty v-else description="正文还在整理中" />
  </article>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
