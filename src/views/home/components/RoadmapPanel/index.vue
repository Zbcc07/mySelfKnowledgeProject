<script setup lang="ts">
import type { RoadmapItem } from '../../../../types/content'
import { resolveIcon } from '../../../../utils/iconMap'

defineProps<{
  items: RoadmapItem[]
}>()
</script>

<template>
  <div id="roadmap" class="roadmap-panel">
    <div class="block-heading compact">
      <div>
        <span class="kicker">How to use</span>
        <h2>使用流程</h2>
      </div>
    </div>

    <ol v-if="items.length > 0" class="roadmap-list">
      <li v-for="item in items" :key="item.title" class="step-item">
        <span class="step-icon" aria-hidden="true">
          <component :is="resolveIcon(item.icon)" v-if="resolveIcon(item.icon)" :size="18" />
        </span>
        <div class="step-body">
          <strong>{{ item.title }}</strong>
          <p>{{ item.detail }}</p>
        </div>
      </li>
    </ol>
    <el-empty v-else description="暂无说明" />
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
