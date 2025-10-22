<template>
  <div class="hot-problems-container">
    <div class="problems-list">
      <div
        v-for="problem in paginatedProblems"
        :key="problem.id"
        class="problem-item"
        @click="goToLeetCode(problem.leetcode.slug_title)"
      >
        <div class="problem-content">
          <span class="problem-title"
            >{{ problem.leetcode.frontend_question_id }}
            <span class="problem-title-separator">·</span>
            {{ problem.leetcode.title }}</span
          >
          <span :class="['level', 'level-' + problem.leetcode.level]">
            {{ getLevelText(problem.leetcode.level) }}
          </span>
          <span class="frequency">频度: {{ problem.value }}</span>
        </div>
      </div>
    </div>

    <!-- 分页组件 -->
    <div class="pagination">
      <button
        :disabled="currentPage === 1"
        @click="prevPage"
        class="pagination-btn"
      >
        上一页
      </button>

      <!-- 页码按钮 -->
      <button
        v-for="page in displayedPages"
        :key="page"
        @click="goToPage(page)"
        :class="['pagination-btn-num', { active: currentPage === page }]"
      >
        {{ page }}
      </button>

      <button
        :disabled="currentPage === totalPages"
        @click="nextPage"
        class="pagination-btn"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import hotData from './hot.json'

// 定义响应式变量
const allProblems = ref([])
const currentPage = ref(1)
const pageSize = ref(10) // 每页显示20条数据

// 计算总页数
const totalPages = computed(() => {
  return Math.ceil(allProblems.value.length / pageSize.value)
})

// 计算显示的页码按钮
const displayedPages = computed(() => {
  const total = totalPages.value
  const current = currentPage.value
  const pages = []

  // 总页数小于等于7页时，显示所有页码
  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // 总页数大于7页时，显示部分页码
    if (current <= 4) {
      // 当前页在前4页时，显示1-5页和最后2页
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total - 1)
      pages.push(total)
    } else if (current >= total - 3) {
      // 当前页在最后4页时，显示前2页和最后5页
      pages.push(1)
      pages.push(2)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      // 当前页在中间时，显示前2页、当前页和后2页
      pages.push(1)
      pages.push(2)
      pages.push('...')
      for (let i = current - 2; i <= current + 2; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total - 1)
      pages.push(total)
    }
  }

  return pages
})

// 获取等级文本
const getLevelText = (level) => {
  switch (level) {
    case 1:
      return '简单'
    case 2:
      return '中等'
    case 3:
      return '困难'
    default:
      return '未知'
  }
}

// 跳转到LeetCode
const goToLeetCode = (slugTitle) => {
  window.open(`https://leetcode.cn/problems/${slugTitle}`, '_blank')
}

// 上一页
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

// 下一页
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// 跳转到指定页
const goToPage = (page) => {
  // 如果点击的是省略号，不处理
  if (page === '...') return
  currentPage.value = page
}

// 计算当前页显示的数据
const paginatedProblems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return allProblems.value.slice(start, end)
})

// 初始化数据
const initData = () => {
  allProblems.value = hotData.list
}

// 组件挂载时初始化数据
onMounted(() => {
  initData()
})
</script>

<style scoped>
.hot-problems-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.problems-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.problem-item {
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: var(--vp-c-bg-soft);
}

.problem-item:hover {
  border-color: var(--vp-c-brand);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.problem-content {
  display: flex;
  align-items: center;
  gap: 16px;
  white-space: nowrap;
  overflow: hidden;
}

.problem-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.frequency {
  color: var(--vp-c-text-2);
  font-size: 14px;
  white-space: nowrap;
}

.level {
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  white-space: nowrap;
}

.level-1 {
  background-color: #e8f5e9;
  color: #2e7d32;
  border: 1px solid #c8e6c9;
}

.level-2 {
  background-color: #fff8e1;
  color: #f57f17;
  border: 1px solid #ffecb3;
}

.level-3 {
  background-color: #ffebee;
  color: #c62828;
  border: 1px solid #ffcdd2;
}

/* 分页样式 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 30px;
  padding: 20px 0;
  flex-wrap: wrap;
}

.pagination-btn {
  padding: 8px 16px;
  background-color: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
  min-width: 40px;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #2d6ae0; /* 更明显的悬停颜色 */
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.pagination-btn:disabled {
  background-color: var(--vp-c-gray-2);
  cursor: not-allowed;
}

.pagination-btn-num {
  padding: 8px 16px;
  background-color: var(--vp-c-bg-soft);
  color: var(--vp-c-text-2);
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  min-width: 40px;
}

.pagination-btn-num.active {
  background-color: #1a4db3; /* 当前页的背景色 */
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.pagination-info {
  font-size: 14px;
  color: var(--vp-c-text-2);
}

@media (max-width: 768px) {
  .problem-content {
    flex-wrap: nowrap;
  }

  .problem-title {
    flex: 1 1 auto;
    min-width: 0;
  }

  .pagination {
    gap: 10px;
    flex-wrap: wrap;
  }

  .pagination-btn {
    padding: 6px 12px;
  }
}
</style>
