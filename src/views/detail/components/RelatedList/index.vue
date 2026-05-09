<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next'
import { ElEmpty } from 'element-plus'
import { RouterLink } from 'vue-router'
import type { ArticleDetail } from '../../../../types/content'

defineProps<{
  items: ArticleDetail[]
}>()
</script>

<template>
  <section class="related-list">
    <div class="block-heading">
      <div>
        <span class="kicker">Related</span>
        <h2>相关资料</h2>
      </div>
    </div>

    <div v-if="items.length > 0" class="related-grid">
      <RouterLink
        v-for="relatedItem in items"
        :key="relatedItem.id"
        :to="{ name: 'detail', params: { id: relatedItem.id } }"
        class="related-card"
      >
        <span class="related-category">{{ relatedItem.category }} · {{ relatedItem.date }}</span>
        <h3>{{ relatedItem.title }}</h3>
        <p>{{ relatedItem.summary }}</p>
        <span class="read-more">
          阅读全文
          <ArrowRight :size="14" />
        </span>
      </RouterLink>
    </div>
    <el-empty v-else description="暂无相关资料" />
  </section>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
