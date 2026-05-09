<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppTopbar from './views/home/components/AppTopbar/index.vue'
import AppSidebar from './views/home/components/AppSidebar/index.vue'
import homeDataJson from '../public/data/home/index.json'
import type { HomeData, Category } from './types/content'
import { categories as categoryConfigs } from './config/categories'
import { loadCategoryStats, loadTags } from './utils/dataLoader'

const homeData = homeDataJson as HomeData
const route = useRoute()

const showSidebar = computed(() => route.name === 'home')

// 侧边栏动态数据
const sidebarCategories = ref<Category[]>([])
const sidebarTags = ref<string[]>([])

onMounted(async () => {
  try {
    const [stats, tags] = await Promise.all([loadCategoryStats(), loadTags()])
    sidebarCategories.value = categoryConfigs.map((c) => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      color: c.color,
      count: stats[c.id] ?? 0,
    }))
    sidebarTags.value = tags
  } catch {
    // 加载失败时使用静态数据兜底
    sidebarCategories.value = homeData.categories
    sidebarTags.value = homeData.tags
  }
})
</script>

<template>
  <div class="app-shell">
    <AppTopbar />

    <div class="layout" :class="{ 'layout--full': !showSidebar }">
      <AppSidebar
        v-if="showSidebar"
        :categories="sidebarCategories"
        :tags="sidebarTags"
        :panel="homeData.sidebarPanel"
      />

      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped lang="scss">
.app-shell {
  min-height: 100vh;
  background:
    radial-gradient(circle at top left, rgba(255, 200, 77, 0.34), transparent 34rem),
    radial-gradient(circle at 88% 12%, rgba(71, 181, 255, 0.2), transparent 28rem),
    linear-gradient(135deg, rgba(255, 255, 255, 0.7) 25%, transparent 25%) 0 0 / 28px 28px,
    #fff9ed;
}

.layout {
  display: grid;
  grid-template-columns: 280px minmax(0, 1fr);
  gap: 24px;
  width: min(1460px, 100%);
  margin: 0 auto;
  padding: 20px 32px 32px;

  &--full {
    grid-template-columns: minmax(0, 1fr);
  }
}

.content {
  display: grid;
  gap: 20px;
  min-width: 0;
}

@media (max-width: 1180px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 760px) {
  .layout {
    padding: 18px 16px 40px;
  }
}
</style>
