<script setup lang="ts">
import { ArrowRight, Sparkles } from 'lucide-vue-next'
import { resolveIcon } from '../../../../utils/iconMap'
import type { HeroData } from '../../../../types/content'

defineProps<{
  config: HeroData
}>()

function metricClass(key: string) {
  return `metric-${key}`
}
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero-copy">
      <span class="eyebrow">
        <Sparkles :size="16" />
        {{ config.eyebrow }}
      </span>
      <h1 id="hero-title" class="hero-title">{{ config.title }}</h1>
      <p class="hero-desc">{{ config.description }}</p>
      <div class="hero-actions">
        <a class="primary-action" :href="config.primaryAction.href">
          {{ config.primaryAction.label }}
          <ArrowRight :size="18" />
        </a>
        <a class="secondary-action" :href="config.secondaryAction.href">
          {{ config.secondaryAction.label }}
        </a>
      </div>
    </div>

    <div class="hero-board" aria-label="知识库概览">
      <div class="sun-disc">
        <component :is="resolveIcon('FileSearch')" :size="52" />
      </div>
      <div
        v-for="metric in config.metrics"
        :key="metric.key"
        class="metric-card"
        :class="metricClass(metric.key)"
      >
        <component :is="resolveIcon(metric.icon)" v-if="resolveIcon(metric.icon)" :size="22" />
        <span>{{ metric.label }}</span>
        <strong>{{ metric.value }}</strong>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
