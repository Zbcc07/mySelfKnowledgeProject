<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import UpdateList from './components/UpdateList/index.vue'
import RoadmapPanel from './components/RoadmapPanel/index.vue'
import FrequentList from './components/FrequentList/index.vue'
import homeDataJson from '../../../public/data/home/index.json'
import type { HomeData, DocItem } from '../../types/content'
import type { VisitRecord } from '../../types/content'
import { loadDocList } from '../../utils/dataLoader'
import { getFrequentDocIds, getVisitRecords } from '../../utils/visitRecord'

const pageData = ref<HomeData>(homeDataJson as HomeData)

const docList = ref<DocItem[]>([])

const visitRecords = ref<Record<string, VisitRecord>>({})
const frequentDocs = computed<DocItem[]>(() => {
  const ids = getFrequentDocIds(3)
  return ids
    .map((id) => docList.value.find((d) => d.id === id))
    .filter((d): d is DocItem => Boolean(d))
})

onMounted(async () => {
  visitRecords.value = getVisitRecords()
  try {
    docList.value = await loadDocList()
    visitRecords.value = getVisitRecords()
  } catch (e) {
    console.error('加载知识库数据失败:', e)
  }
})
</script>

<template>
  <div class="home-page">
    <section id="updates" class="two-column">
      <UpdateList :doc-list="docList" />
      <div class="right-column">
        <FrequentList :docs="frequentDocs" :visit-records="visitRecords" />
        <RoadmapPanel :items="pageData.roadmap" />
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
@import './index.scss';
</style>
