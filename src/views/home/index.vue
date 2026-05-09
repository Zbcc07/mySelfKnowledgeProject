<script setup lang="ts">
import { ref } from 'vue'
import HeroSection from './components/HeroSection/index.vue'
import CategoryGrid from './components/CategoryGrid/index.vue'
import UpdateList from './components/UpdateList/index.vue'
import RoadmapPanel from './components/RoadmapPanel/index.vue'
import homeDataJson from '../../../public/data/home/index.json'
import type { HomeData } from '../../types/content'

const pageData = ref<HomeData>(homeDataJson as HomeData)
</script>

<template>
  <div class="home-page">
    <HeroSection :config="pageData.hero" />
    <CategoryGrid :categories="pageData.categories" />

    <section id="updates" class="two-column">
      <UpdateList :updates="pageData.updates" />
      <RoadmapPanel :items="pageData.roadmap" />
    </section>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
