import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import LeetCodeLink from './components/LeetCodeLink.vue'
import IsHot100 from './components/IsHot100.vue'
import FeiShuDocs from './components/FeiShuDocs.vue'

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 注册自定义全局组件
    app.component('LeetCodeLink', LeetCodeLink)
    app.component('IsHot100', IsHot100)
    app.component('FeiShuDocs', FeiShuDocs)
  }
} satisfies Theme