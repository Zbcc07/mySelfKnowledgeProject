<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppTopbar from './views/home/components/AppTopbar/index.vue'
import AppSidebar from './views/home/components/AppSidebar/index.vue'
import homeDataJson from '../public/data/home/index.json'
import type { HomeData } from './types/content'

const homeData = homeDataJson as HomeData
const route = useRoute()

// 详情页隐藏侧边栏，让内容区可以占满可读宽度
const showSidebar = computed(() => route.name === 'home')
</script>

<template>
  <div class="app-shell">
    <AppTopbar :nav-items="homeData.nav" />

    <div class="layout" :class="{ 'layout--full': !showSidebar }">
      <AppSidebar
        v-if="showSidebar"
        :categories="homeData.categories"
        :tags="homeData.tags"
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
  gap: 28px;
  width: min(1460px, 100%);
  margin: 0 auto;
  padding: 28px 32px 56px;

  &--full {
    grid-template-columns: minmax(0, 1fr);
  }
}

.content {
  display: grid;
  gap: 28px;
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
