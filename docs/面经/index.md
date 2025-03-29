# WXG 面经

微信公众号部门

::: details 目录

[[toc]]

:::

### 个人介绍

### 三个项目，聊其中一个

聊第一个项目（markdown editor）

### （项目）快捷键是调用 api 吗？

没说清楚，表达出来的感觉像全部基于 CodeMirror 的

### 浏览器兼容性？浏览器对于快捷键的支持是怎么样的？

开始吟唱

### Pnpm / Npm / Yarn 区别

- pnpm 硬链接和符号链接
- 依赖提升
- 防止依赖混乱，幻影依赖

::: tip 答案

- Pnpm：使用硬链接和符号链接优化存储，防止依赖混乱。
- Npm：传统依赖管理，存在依赖扁平化问题。
- Yarn：快速安装依赖，缓存机制优秀，但依赖树仍可能混乱。

:::

### Pnpm 如何解决幻影依赖？

- 软链接
- Pnpm 兼容性有问题

::: tip 答案

pnpm 建立了一个 store 仓库（node_modules/.pnpm）来存放拍平后的各种依赖，而项目中 node_modules 的依赖，是采用树结构，不会将它们拍平（npm、yarn会拍平，就会产生幻影依赖），然后第三方包借助的子包，**通过软链接的方式去链接到 node_modules/.pnpm**。

:::

### Pnpm7 和 Pnpm8 有什么区别？

- 不太清楚

### 为什么使用 Vite？Vite 和 Webpack 区别？

- 初始化项目
- 开发体验/打包层面
- 热更新比较快

### Vite 如何做的热更新？

和 webpack 热更新类似

### esbuild、rollup、swc

- esbuild 将 cjs 转换为 esm（esbuild 原生支持 esm），现代浏览器支持 esm，不做额外处理，都丢给浏览器

### 二者本质上差不多，什么时候用 rollup 和 esbuild？

- 打包用 rollup、构建和转译用 esbuild

### 为什么？

- rollup 打包工具，打包出来的内容比较轻量
- esbuild 基于 go，速度非常快

### esbuild 这么快，为什么还用 rollup 不用 esbuild 呢？

- esbuild 和 rollup 很多地方是重合的，esbuild 某些功能不支持，作者也没有兴趣去弄
- esbuild 生态不是特别好，插件生态比较差

### SWC 是什么？

- vercel 做的对标 babel，在 vite 中用于转译 react

### swc 和 babel 对比？

- swc 速度快一些
- swc 基于 rust，babel 基于 js
- vite 默认 babel，需要手动开启 swc

### swc 比 babel 快多少？

- babel 需要转译很多，需要多套逻辑代码，比较冗余
  （了解一下为什么这么快？）

### monorepo 和 multirepo 区别？为什么用 monorepo？

- 不了解，当时只了解 monorepo，pnpm 有 workspace

### Git 的 submodule 了解吗？和 monorepo 对比？

- 不了解

### CodeMirror 技术选型？monaco-editor？

- CodeMirror 社区生态比较好

### 使用 CodeMirror 有没有遇到什么问题？

- 说的不太好。特殊插件，额外快捷键

### Zustand 在项目中做什么？

- 在组件中存储 toolbar 和 editor

### React 生态其他状态管理库还有什么？了解吗？

- Jotai、Redux
- Redux 比较冗余，工作流，方便跟踪数据流程，但是在小项目比较难堪
- Zustand 非常轻量化，生态越来越好，写起来简单，但是大型项目中难以跟踪状态（create、get、set）
- 可能有未知副作用

### 项目中 Antd 做了什么？

- Antd 主要是用了一些小工具的实现（例如导出 HTML、同步滚动按钮）

### Tailwind，了解过 PostCSS？

- 插件...

::: tip 答案

postcss是css后处理器，可以做一些css语法降级和不同浏览器兼容性适配，以及一些css代码转换（css界的babel），通过插件来增强它的功能。

:::

### 如何理解 Tailwind 和 Antd 区别？哪个更符合现代编程？

- 大项目不适合 tailwind，但是代码都在 className 中，后续难以维护，代码可读性比较差

### Antd 主题定制和 Tailwind 主题定制哪个做得更好？为什么？

- tailwind 更好

### 输入网址按下回车到完全渲染发生了什么事情？

### 宏任务和微任务是什么？

- 讲到事件循环和 v8

### 写过 Nodejs 吗？

- 写过，通常在 Next 里面写

### 了解过 Turbopack 吗？

- 不太清楚，回去好好了解下

### CSR、SSR 和 SSG？

- CSR、SSR 服务端渲染和客户端渲染
- SSG 忘记了（静态站点生成）

::: tip 答案

- CSR：客户端渲染，首屏加载慢。
- SSR：服务端渲染，首屏加载快，SEO 友好。
- SSG：静态站点生成，适合内容固定场景。

:::

### CSR 和 SSR 在同等性能的客户端和服务端下性能一致吗？

- 这里回答的很差，以为要讲同构渲染

### 不考虑资源瓶颈，如果有多个用户，哪种比较好？

- SSR，服务端缓存

### 反问？

业务？
部门语言：不会被语言限制（OC、Swift、C++、Python）
建议？算法太拉了
