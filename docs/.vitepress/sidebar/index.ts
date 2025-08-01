export const sidebar = {
  '/前端基础/': [
    {
      text: '前端基础',
      items: [
        { text: 'HTML + CSS', link: '/前端基础/html+css/' },
        { text: 'JS', link: '/前端基础/js/' },
        { text: 'TS', link: '/前端基础/js/ts' },
        { text: 'Promise', link: '/前端基础/promise/' },
        { text: '手写题', link: '/前端基础/手写题/' }
      ]
    },
    {
      text: '浏览器相关',
      items: [
        { text: '进程和线程', link: '/前端基础/浏览器相关/进程和线程' },
        { text: '事件循环', link: '/前端基础/浏览器相关/事件循环' },
        { text: '浏览器渲染原理', link: '/前端基础/浏览器相关/浏览器渲染原理' },
        { text: '浏览器垃圾回收', link: '/前端基础/浏览器相关/浏览器垃圾回收' },
        { text: '浏览器、v8', link: '/前端基础/浏览器相关/浏览器、v8' }
      ]
    },
    {
      items: [{ text: '计算机网络', link: '/前端基础/计算机网络/' }]
    },
    {
      items: [{ text: '设计模式', link: '/前端基础/设计模式/' }]
    }
  ],
  '/vue/': [
    { text: '基础知识', link: '/vue/' },
    { text: '原理篇', link: '/vue/原理篇' },
    { text: 'uniapp、小程序', link: '/vue/uniapp、小程序' }
  ],
  '/react/': [
    { text: '基础知识', link: '/react/' },
    { text: '原理篇', link: '/react/原理篇' }
  ],
  '/前端工程化/': [
    {
      items: [
        { text: '模块化规范', link: '/前端工程化/模块化规范' },
        { text: 'peerDependencies', link: '/前端工程化/peerDependencies' },
        { text: '包管理器', link: '/前端工程化/包管理器' },
        { text: 'PostCss', link: '/前端工程化/postcss' },
        { text: 'tree-shaking', link: '/前端工程化/tree-shaking' },
        { text: 'monorepo', link: '/前端工程化/monorepo' }
      ]
    },
    {
      items: [{ text: 'babel', link: '/前端工程化/babel' }]
    },
    {
      items: [{ text: 'webpack', link: '/前端工程化/webpack' }]
    },
    {
      items: [{ text: 'vite', link: '/前端工程化/vite' }]
    }
  ],
  '/性能优化/': [
    {
      text: '性能优化',
      items: [
        { text: '目录', link: '/性能优化/' },
        { text: '性能优化概括', link: '/性能优化/性能优化概括' },
        { text: '性能优化指标', link: '/性能优化/性能优化指标' },
        { text: '首屏加载优化', link: '/性能优化/首屏加载优化' },
        { text: '懒加载', link: '/性能优化/懒加载' },
        { text: '虚拟列表', link: '/性能优化/虚拟列表' },
        { text: '打包体积过大', link: '/性能优化/打包体积过大' },
        { text: 'React性能优化', link: '/性能优化/React性能优化' },
        { text: 'Vue性能优化', link: '/性能优化/Vue性能优化' },
        {
          text: '页面请求接口大规模并发问题',
          link: '/性能优化/页面请求接口大规模并发问题'
        },
        { text: '缓存', link: '/性能优化/缓存' }
      ]
    }
  ],
  '/项目/': [
    {
      text: '实习项目',
      items: [
        {
          text: '移动端上拉加载、下拉刷新实现方案',
          link: '/项目/实习项目/移动端上拉加载、下拉刷新实现方案'
        },
        { text: '微前端', link: '/项目/实习项目/微前端' },
        {
          text: 'echarts地图离线访问',
          link: '/项目/实习项目/echarts地图离线访问'
        },
        { text: 'monorepo路径插件', link: '/项目/实习项目/monorepo路径插件' }
      ]
    },
    {
      text: '个人项目🍔 低代码项目',
      items: [
        {
          text: '低代码项目性能优化',
          link: '/项目/个人项目/低代码项目性能优化'
        },
        {
          text: '开发约定式路由插件',
          link: '/项目/个人项目/开发约定式路由插件'
        },
        {
          text: '渲染区样式隔离、相对区域响应式协议',
          link: '/项目/个人项目/渲染区样式隔离、相对区域响应式'
        },
        {
          text: '低代码数据协议、物料渲染、vue-demi',
          link: '/项目/个人项目/低代码数据协议、物料渲染、vue-demi'
        },
        {
          text: '低代码项目JSON Schema与参数校验',
          link: '/项目/个人项目/低代码项目JSON Schema与参数校验'
        },
        {
          text: '权限控制',
          link: '/项目/个人项目/权限控制'
        },
        {
          text: '双token',
          link: '/项目/个人项目/双token'
        }
      ]
    },
    {
      text: '个人项目🍧 im项目',
      items: [
        { text: '第三方包补丁', link: '/项目/个人项目/第三方包补丁' },
        {
          text: 'im项目本地数据库方案',
          link: '/项目/个人项目/im项目本地数据库方案'
        },
        {
          text: '虚拟列表+无限滚动',
          link: '/项目/个人项目/虚拟列表+无限滚动'
        },
        {
          text: 'im项目为什么选择socket.io',
          link: '/项目/个人项目/im项目为什么选择socket.io'
        },
        { text: '大文件上传', link: '/项目/个人项目/大文件上传' },
        {
          text: 'electron兼容性处理',
          link: '/项目/个人项目/electron兼容性处理'
        }
      ]
    },
    {
      text: '个人项目🌭 迷你markdown编辑器项目',
      items: [
        { text: '打包构建工具', link: '/项目/个人项目/打包构建工具' },
        { text: 'css方案选择', link: '/项目/个人项目/css方案选择' },
        {
          text: '主题切换',
          link: '/项目/个人项目/主题切换'
        },
        {
          text: '同步滚动',
          link: '/项目/个人项目/同步滚动'
        },
        {
          text: 'AST解析',
          link: '/项目/个人项目/AST解析'
        },
        {
          text: '项目难点',
          link: '/项目/个人项目/markdown编辑器-难点.md'
        }
      ]
    }
  ],
  '/场景题/': [
    {
      text: '🚀 一个页面只有一个用户访问不了，其他用户都能访问，如何排查错误？',
      link: '/场景题/'
    },
    {
      text: '🚀 让你设计一个混淆压缩怎么做？',
      link: '/场景题/让你设计一个混淆压缩怎么做'
    },
    {
      text: '🚀 如何实现一个请求库？',
      link: '/场景题/如何实现一个请求库'
    }
  ],
  '/算法/': [
    {
      items: [
        { text: '总汇', link: '/算法/' },
        { text: '时间复杂度和空间复杂度', link: '/算法/时间复杂度和空间复杂度' },
        { text: '算法题', link: '/算法/算法题/' },
      ]
    },
    {
      items: [
        { text: '哈希表', link: '/算法/哈希表' },
        { text: '字符串', link: '/算法/字符串' },
        { text: '数组', link: '/算法/数组' },
        { text: '链表', link: '/算法/链表' },
        { text: '栈与队列', link: '/算法/栈与队列' },
        { text: '单调栈', link: '/算法/单调栈' },
      ]
    }
  ],
  '/git/': [
    {
      items: [{ text: 'git常用命令', link: '/git/' }]
    },
    {
      items: [
        { text: 'git提交规范', link: '/git/git提交规范' },
        { text: 'git提交前 husky、lint-staged', link: '/git/git提交前' },
        { text: 'git提交中', link: '/git/git提交中' },
        { text: 'git提交后 commitlint', link: '/git/git提交后' }
      ]
    }
  ],
  '/面经/': [
    {
      text: 'Tabz 腾讯WXG面经',
      link: '/面经/'
    },
    {
      text: 'wxg-企业微信部门面经',
      link: '/面经/wxg-企业微信部门面经'
    },
    {
      text: 'wxg一面-微信公众号面经',
      link: '/面经/wxg一面-微信公众号面经'
    },
    {
      text: 'wxg二面-微信公众号面经',
      link: '/面经/wxg二面-微信公众号面经'
    },
    {
      text: 'csig一面面经',
      link: '/面经/csig一面面经'
    }
  ]
}
