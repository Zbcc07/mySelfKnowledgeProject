<script setup lang="ts">
import { ArrowLeft, Calendar, ExternalLink } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import type { DocDetail } from '../../../../types/content'

defineProps<{
  article: DocDetail
}>()

const router = useRouter()

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}
</script>

<template>
  <header class="detail-header" :class="`tone-${article.categoryColor}`">
    <div class="header-top">
      <button type="button" class="back-button" @click="goBack">
        <ArrowLeft :size="16" />
        <span>返回</span>
      </button>
    </div>

    <div class="title-row">
      <h1 class="title">{{ article.title }}</h1>
      <span class="badge">{{ article.categoryName }}</span>
    </div>

    <div v-if="article.tags.length > 0" class="tags">
      <span v-for="tag in article.tags" :key="tag">#{{ tag }}</span>
    </div>
    <p class="summary">{{ article.summary }}</p>

    <div class="meta">
      <span>
        <Calendar :size="14" />
        {{ article.date }}
      </span>
      <a
        v-if="article.source"
        :href="article.source"
        target="_blank"
        rel="noopener noreferrer"
        class="source-link"
      >
        <ExternalLink :size="14" />
        查看来源
      </a>
    </div>
  </header>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
