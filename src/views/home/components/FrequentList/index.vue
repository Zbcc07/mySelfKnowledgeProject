<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { Flame } from 'lucide-vue-next'
import type { DocItem } from '../../../../types/content'
import type { VisitRecord } from '../../../../types/content'

defineProps<{
  docs: DocItem[]
  visitRecords: Record<string, VisitRecord>
}>()
</script>

<template>
  <div v-if="docs.length > 0" class="frequent-column">
    <div class="block-heading">
      <div>
        <span class="kicker">Frequent</span>
        <h2>频繁访问</h2>
      </div>
    </div>

    <div class="frequent-list">
      <RouterLink
        v-for="doc in docs"
        :key="doc.id"
        :to="{ name: 'detail', params: { id: doc.id } }"
        class="frequent-card"
      >
        <div class="frequent-icon">
          <Flame :size="16" />
        </div>
        <div class="frequent-info">
          <div class="frequent-title">{{ doc.title }}</div>
          <div class="frequent-meta">
            <span>{{ doc.categoryName }}</span>
            <span v-if="visitRecords[doc.id]">· 访问 {{ visitRecords[doc.id].count }} 次</span>
          </div>
        </div>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
