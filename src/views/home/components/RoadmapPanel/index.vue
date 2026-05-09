<script setup lang="ts">
import { CheckCircle2 } from 'lucide-vue-next'
import { ElEmpty } from 'element-plus'
import type { RoadmapItem } from '../../../../types/content'

defineProps<{
  items: RoadmapItem[]
}>()
</script>

<template>
  <div id="roadmap" class="roadmap-panel">
    <div class="block-heading compact">
      <div>
        <span class="kicker">Roadmap</span>
        <h2>整理路线</h2>
      </div>
    </div>

    <ol v-if="items.length > 0" class="roadmap-list">
      <li v-for="item in items" :key="item.title" :class="{ done: item.done }">
        <CheckCircle2 :size="19" />
        <div>
          <strong>{{ item.title }}</strong>
          <p>{{ item.detail }}</p>
        </div>
      </li>
    </ol>
    <el-empty v-else description="路线规划中" />
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
