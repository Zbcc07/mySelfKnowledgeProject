<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElEmpty, ElSkeleton, ElBacktop } from 'element-plus'
import { Rocket } from 'lucide-vue-next'
import DetailHeader from './components/DetailHeader/index.vue'
import TocNav from './components/TocNav/index.vue'
import type { DocDetail, TocItem } from '../../types/content'
import { loadDocDetail } from '../../utils/dataLoader'
import { recordVisit, recordTagVisit } from '../../utils/visitRecord'

const route = useRoute()
const articleId = computed(() => String(route.params.id ?? ''))

const article = ref<DocDetail | null>(null)
const loading = ref(true)
const notFound = ref(false)

async function fetchArticle(id: string) {
  loading.value = true
  notFound.value = false
  article.value = null
  try {
    article.value = await loadDocDetail(id)
    recordVisit(id)
    recordTagVisit(id, article.value.tags)
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
}

// 目录高亮
const activeTocId = ref<string>('')
let observer: IntersectionObserver | null = null

function setupObserver() {
  observer?.disconnect()
  if (!article.value || article.value.toc.length === 0) return

  const targets = article.value.toc
    .map((i: TocItem) => document.getElementById(i.id))
    .filter((el): el is HTMLElement => Boolean(el))

  if (targets.length === 0) return

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (visible) activeTocId.value = visible.target.id
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
  )
  targets.forEach((el) => observer!.observe(el))
}

onMounted(async () => {
  await fetchArticle(articleId.value)
  await nextTick()
  setupObserver()
})

watch(articleId, async (id) => {
  activeTocId.value = ''
  await fetchArticle(id)
  await nextTick()
  setupObserver()
})

onBeforeUnmount(() => {
  observer?.disconnect()
  observer = null
})

function handleTocSelect(id: string) {
  activeTocId.value = id
}
</script>

<template>
  <div class="detail-page">
    <!-- 加载骨架 -->
    <template v-if="loading">
      <div class="skeleton-header">
        <ElSkeleton :rows="4" animated />
      </div>
      <div class="detail-layout">
        <ElSkeleton :rows="6" animated />
        <ElSkeleton :rows="12" animated />
      </div>
    </template>

    <!-- 文章内容 -->
    <template v-else-if="article">
      <DetailHeader :article="article" />

      <div class="detail-layout">
        <TocNav
          :items="article.toc"
          :active-id="activeTocId"
          @select="handleTocSelect"
        />
        <!-- Markdown 渲染区域 -->
        <article class="article-body">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="markdown-content" v-html="article.html" />
        </article>
      </div>
    </template>

    <!-- 404 -->
    <div v-else-if="notFound" class="empty-wrap">
      <el-empty description="没找到这篇文章">
        <router-link to="/">
          <el-button type="primary">返回首页</el-button>
        </router-link>
      </el-empty>
    </div>

    <!-- 回到顶部 -->
    <el-backtop :right="128" :bottom="48" :visibility-height="200" class="detail-backtop">
      <Rocket :size="28" :stroke-width="1.8" />
    </el-backtop>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
