<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { FolderKanban, Star, Tags } from 'lucide-vue-next'
import { resolveIcon } from '../../../../utils/iconMap'
import type { Category, DocItem } from '../../../../types/content'
import { loadDocList } from '../../../../utils/dataLoader'
import { useActiveCategory } from '../../../../composables/useActiveCategory'

const props = defineProps<{
  categories: Category[]
  tags: string[]
  panel: { title: string; description: string }
}>()

const router = useRouter()
const { activeCategoryId, setActiveCategory } = useActiveCategory()

const docList = ref<DocItem[]>([])

/** 标签云最多展示数量，超出用省略号代替 */
const MAX_VISIBLE_TAGS = 20
const visibleTags = computed(() => props.tags.slice(0, MAX_VISIBLE_TAGS))
const hiddenCount = computed(() => Math.max(0, props.tags.length - MAX_VISIBLE_TAGS))

/** 标签 → 首篇包含该标签的文档 id 映射 */
const tagDocMap = computed<Record<string, string>>(() => {
  const map: Record<string, string> = {}
  for (const doc of docList.value) {
    for (const tag of doc.tags) {
      if (!map[tag]) map[tag] = doc.id
    }
  }
  return map
})

function handleTagClick(tag: string) {
  const docId = tagDocMap.value[tag]
  if (docId) {
    router.push({ name: 'detail', params: { id: docId } })
  }
}

onMounted(async () => {
  try {
    docList.value = await loadDocList()
  } catch {
    docList.value = []
  }
})
</script>

<template>
  <aside class="sidebar" aria-label="知识库侧边栏">
    <section class="sidebar-section">
      <div class="section-title">
        <FolderKanban :size="17" />
        分类
      </div>
      <button
        v-for="category in categories"
        :key="category.id"
        type="button"
        class="side-link"
        :class="{ 'is-active': activeCategoryId === category.id }"
        :aria-pressed="activeCategoryId === category.id"
        @click="setActiveCategory(category.id)"
      >
        <component :is="resolveIcon(category.icon)" v-if="resolveIcon(category.icon)" :size="17" />
        <span>{{ category.name }}</span>
        <em>{{ category.count }}</em>
      </button>
    </section>

    <section class="sidebar-section">
      <div class="section-title">
        <Tags :size="17" />
        热门标签
      </div>
      <div class="tag-cloud">
        <button
          v-for="tag in visibleTags"
          :key="tag"
          type="button"
          class="tag-item"
          :disabled="!tagDocMap[tag]"
          :title="tagDocMap[tag] ? `查看标签「${tag}」相关文档` : '该标签暂无文档'"
          @click="handleTagClick(tag)"
        >
          {{ tag }}
        </button>
        <span
          v-if="hiddenCount > 0"
          class="tag-more"
          :title="`还有 ${hiddenCount} 个标签未展示`"
        >
          +{{ hiddenCount }}
        </span>
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
