<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElEmpty } from 'element-plus'
import DetailHeader from './components/DetailHeader/index.vue'
import ArticleBody from './components/ArticleBody/index.vue'
import TocNav from './components/TocNav/index.vue'
import RelatedList from './components/RelatedList/index.vue'
import detailDataJson from '../../../public/data/detail/index.json'
import type { ArticleDetail, DetailData } from '../../types/content'

const detailData = detailDataJson as DetailData
const route = useRoute()

const articleId = computed(() => String(route.params.id ?? ''))

const article = computed<ArticleDetail | undefined>(() =>
  detailData.articles.find((item) => item.id === articleId.value),
)

const relatedArticles = computed<ArticleDetail[]>(() => {
  if (!article.value) return []
  return article.value.related
    .map((id) => detailData.articles.find((item) => item.id === id))
    .filter((item): item is ArticleDetail => Boolean(item))
})

// 目录当前高亮项
const activeTocId = ref<string>('')
let observer: IntersectionObserver | null = null

function setupObserver() {
  observer?.disconnect()
  if (!article.value) return

  const sectionIds = article.value.toc.map((i) => i.id)
  const targets = sectionIds
    .map((id) => document.getElementById(id))
    .filter((el): el is HTMLElement => Boolean(el))

  if (targets.length === 0) return

  observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
      if (visible) {
        activeTocId.value = visible.target.id
      }
    },
    { rootMargin: '-40% 0px -55% 0px', threshold: 0 },
  )

  targets.forEach((el) => observer!.observe(el))
}

onMounted(() => {
  nextTick(setupObserver)
})

watch(articleId, async () => {
  activeTocId.value = ''
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
    <template v-if="article">
      <DetailHeader :article="article" />

      <div class="detail-layout">
        <TocNav
          :items="article.toc"
          :active-id="activeTocId"
          @select="handleTocSelect"
        />
        <ArticleBody :sections="article.sections" />
      </div>

      <RelatedList :items="relatedArticles" />
    </template>

    <div v-else class="empty-wrap">
      <el-empty description="没找到这篇文章">
        <router-link to="/">
          <el-button type="primary">返回首页</el-button>
        </router-link>
      </el-empty>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
