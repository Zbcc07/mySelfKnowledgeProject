<script setup lang="ts">
import { ElEmpty } from 'element-plus'
import { RouterLink } from 'vue-router'
import type { RecentItem } from '../../../../types/content'

defineProps<{
  updates: RecentItem[]
}>()
</script>

<template>
  <div class="update-column">
    <div class="block-heading">
      <div>
        <span class="kicker">Updates</span>
        <h2>最近更新</h2>
      </div>
    </div>

    <div v-if="updates.length > 0" class="update-list">
      <RouterLink
        v-for="article in updates"
        :key="article.id"
        :to="{ name: 'detail', params: { id: article.id } }"
        class="update-card"
      >
        <span>{{ article.category }} · {{ article.date }}</span>
        <h3>{{ article.title }}</h3>
        <p>{{ article.summary }}</p>
        <div v-if="article.tags.length > 0" class="update-tags">
          <span v-for="tag in article.tags.slice(0, 3)" :key="tag">#{{ tag }}</span>
        </div>
      </RouterLink>
    </div>
    <el-empty v-else description="暂无更新" />
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
