<script setup lang="ts">
import { ElEmpty } from 'element-plus'
import { RouterLink } from 'vue-router'
import type { UpdateItem } from '../../../../types/content'

defineProps<{
  updates: UpdateItem[]
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
      </RouterLink>
    </div>
    <el-empty v-else description="暂无更新" />
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
