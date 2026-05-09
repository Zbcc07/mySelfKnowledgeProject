/**
 * 全局共享「当前选中分类」状态。
 * - 侧边栏分类点击时调用 setActiveCategory(id)
 * - 首页 UpdateList 订阅 activeCategoryId 展示对应列表
 */

import { ref, readonly } from 'vue'
import { categories } from '../config/categories'

const activeCategoryId = ref<string>(categories[0]?.id ?? '')

export function useActiveCategory() {
  function setActiveCategory(id: string) {
    activeCategoryId.value = id
  }

  return {
    activeCategoryId: readonly(activeCategoryId),
    setActiveCategory,
  }
}
