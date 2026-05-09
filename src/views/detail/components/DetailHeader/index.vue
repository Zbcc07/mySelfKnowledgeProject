<script setup lang="ts">
import { ArrowLeft, Calendar, ExternalLink, User } from 'lucide-vue-next'
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
    <button type="button" class="back-button" @click="goBack">
      <ArrowLeft :size="16" />
      <span>返回</span>
    </button>

    <span class="badge">{{ article.categoryName }}</span>
    <h1 class="title">{{ article.title }}</h1>
    <p class="summary">{{ article.summary }}</p>

    <div class="meta">
      <span v-if="article.author">
        <User :size="14" />
        {{ article.author }}
      </span>
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

    <div v-if="article.tags.length > 0" class="tags">
      <span v-for="tag in article.tags" :key="tag">#{{ tag }}</span>
    </div>
  </header>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
