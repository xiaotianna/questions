import { defineConfig } from 'vitepress'
import { nav } from './nav'
import { sidebar } from './sidebar'

export default defineConfig({
  title: '前端面试题',
  markdown: {
    lineNumbers: true
  },
  base: '/interview-questions/',
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档'
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                }
              }
            }
          }
        }
      }
    },
    docFooter: {
      prev: '上一页',
      next: '下一页'
    },
    outline: {
      label: '本页目录'
    },
    nav: nav,
    sidebarMenuLabel: '菜单',
    sidebar: sidebar
  }
})
