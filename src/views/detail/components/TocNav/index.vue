<script setup lang="ts">
import { List } from 'lucide-vue-next'
import type { TocItem } from '../../../../types/content'

defineProps<{
  items: TocItem[]
  activeId?: string
}>()

const emit = defineEmits<{
  (e: 'select', id: string): void
}>()

function handleClick(id: string, event: MouseEvent) {
  event.preventDefault()
  const target = document.getElementById(id)
  if (target) {
    target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
  emit('select', id)
}
</script>

<template>
  <aside class="toc-nav">
    <div class="section-title">
      <List :size="17" />
      目录
    </div>

    <ul v-if="items.length > 0" class="toc-list">
      <li v-for="tocItem in items" :key="tocItem.id">
        <a
          :href="`#${tocItem.id}`"
          :class="{ active: activeId === tocItem.id }"
          @click="handleClick(tocItem.id, $event)"
        >
          {{ tocItem.label }}
        </a>
      </li>
    </ul>
    <el-empty v-else description="暂无目录" :image-size="60" />
  </aside>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
