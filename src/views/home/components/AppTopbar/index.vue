<script setup lang="ts">
import { CloudSun, Rocket, Search } from 'lucide-vue-next'
import { RouterLink } from 'vue-router'
import type { NavItem } from '../../../../types/content'

defineProps<{
  navItems: NavItem[]
}>()
</script>

<template>
  <header class="topbar">
    <RouterLink class="brand" to="/" aria-label="Sunny Docs 首页">
      <span class="brand-mark">
        <CloudSun :size="24" />
      </span>
      <span>
        <strong>Sunny Docs</strong>
        <small>技术知识库</small>
      </span>
    </RouterLink>

    <label class="top-search" for="global-search">
      <Search :size="18" />
      <input id="global-search" type="search" placeholder="搜索 Vue、Docker、AI、数据库..." />
    </label>

    <nav class="nav-links" aria-label="主导航">
      <a v-for="navItem in navItems" :key="navItem.label" :href="navItem.href">{{ navItem.label }}</a>
    </nav>

    <a class="publish-button" href="https://pages.github.com/" target="_blank" rel="noreferrer">
      <Rocket :size="18" />
      <span>GitHub Pages</span>
    </a>
  </header>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
