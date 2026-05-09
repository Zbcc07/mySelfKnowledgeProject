<script setup lang="ts">
import { ArrowLeft, Calendar, Clock, User } from 'lucide-vue-next'
import { useRouter } from 'vue-router'
import type { ArticleDetail } from '../../../../types/content'

defineProps<{
  article: ArticleDetail
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

    <span class="badge">{{ article.category }}</span>
    <h1 class="title">{{ article.title }}</h1>
    <p class="summary">{{ article.summary }}</p>

    <div class="meta">
      <span>
        <User :size="14" />
        {{ article.author }}
      </span>
      <span>
        <Calendar :size="14" />
        {{ article.date }}
      </span>
      <span>
        <Clock :size="14" />
        {{ article.readTime }}
      </span>
    </div>

    <div v-if="article.tags.length > 0" class="tags">
      <span v-for="tag in article.tags" :key="tag">#{{ tag }}</span>
    </div>
  </header>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
