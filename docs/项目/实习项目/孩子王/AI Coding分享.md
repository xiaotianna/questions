# AI Coding 分享

## AI 消息格式扩展方案

### 背景

在如今的 ai 应用中，回答的内容不再局限于最简单的 Markdown 内容，而是根据内容可以展示出很多丰富的节点内容，例如：询问天气，展示天气专属的 ui 组件。

但是 ai 生成的内容，只是 markdown 格式的，不做扩展是无法支持多 ui 风格的。

因为 markdown 格式在渲染前也可以当作纯文本，在其中可以展示 html 标签，也可以展示 mdx 这样的组件。

> ai 回复的内容可以通过 prompt 来让 ai 生成符合对应场景的 ui 组件，例如`<weather-ui>`

扩展 ui 有 3 种方案：

1. 新增 markdown 语法，例如：

```md
::: weather-ui

:::
```

2. 通过 mdx 语法，当作组件渲染（需要引入 mdx 解析器）
3. 通过 web component，当作 html 标签渲染（浏览器天生支持）
4. 根据 type 来渲染：通过`content_type`属性来渲染，前端可以通过枚举来渲染特定的组件，此方
   法需要**服务端**对 ai 数据进行处理（对豆包抓包处理的数据）

   ```json
   {
     "event_data": {
       "message": {
         "content_type": 2071,
         "content": {
           "text": "\nimport './style.css'"
         },
         "id": "3bf701ae-0d20-4c50-8fbf-c5e976bf6361"
       },
       "message_id": "14910377382769154"
     },
     "event_id": "74",
     "event_type": 2001
   }
   ```

> 这里探究 2、3 两种方案

### mdx

mdx 天然支持 jsx 语法，让我们扩展节点变得容易，把 Ai 回复的纯文本标签解析成组件即可。

优点：

- 扩展方便，渲染简单
- ui 统一
- 适合 react

::: details 具体代码

这里了用到了 `@mdx-js/mdx` 这个库

```tsx
import React, { useState, useEffect } from 'react'
import { compile, run } from '@mdx-js/mdx'
import * as runtime from 'react/jsx-runtime'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'
import './MDXRenderer.css'
import { components } from './components-config'

interface MDXRendererProps {
  mdxContent: string
}

type MDXComponent = React.ComponentType<{
  components?: Record<string, React.ComponentType>
}>

const MDXRenderer: React.FC<MDXRendererProps> = ({ mdxContent }) => {
  const [MDXComponent, setMDXComponent] = useState<MDXComponent | null>(null)

  useEffect(() => {
    const compileMDX = async () => {
      // 编译MDX内容
      // 这段代码是MDX渲染器的核心部分，负责将MDX内容转换为可执行的React组件。
      const compiledMDX = await compile(mdxContent, {
        // outputFormat: 'function-body' ：输出格式为函数体，这样可以直接被 run 函数执行
        // program它生成的是完整的 ES 模块代码（包含 import 语句），而 run() 函数无法直接执行包含 import 语句的代码。
        outputFormat: 'function-body',
        // remarkPlugins: [remarkGfm] ：启用GitHub风格的Markdown扩展（如表格、任务列表等）
        remarkPlugins: [remarkGfm],
        // - rehypePlugins: [rehypeHighlight] ：启用代码高亮功能
        rehypePlugins: [rehypeHighlight],
        // development: false ：生产模式，优化性能
        development: false
      })

      // 运行编译后的代码
      /**
       * run函数作用：
       * - 执行编译后的JavaScript代码，返回一个React组件
       * - String(compiledMDX) ：将编译结果转换为字符串
       * - ...runtime ：提供React运行时环境（包含jsx、jsxs、Fragment等）
       * - baseUrl: import.meta.url ：设置模块的基础URL，用于解析相对路径
       */
      // 返回的{default}，本质是一个react组件
      /**
       *  run 方法是用于处理和执行 MDX 内容的核心函数之一，主要作用是将经过 MDX 编译器处理后的代码（通常是经过 compile 方法转换后的代码）在 JavaScript 环境中运行，并返回执行结果。
       * 返回内容结构：执行后通常会返回一个包含 default 属性的对象，其中 default 是 MDX 内容对应的 React 组件（如果使用 React 环境），此外可能还包含 MDX 中导出的其他变量或组件。
       * 环境依赖：run 方法的执行依赖于具体的 JavaScript 运行环境，并且需要相应的 JSX 运行时（如 React、Preact 等）支持，通常需要在调用时传入这些环境依赖。
       */
      const { default: Component } = await run(String(compiledMDX), {
        ...runtime
      })

      /**
       * ## 整个流程总结
       * 1. 1. MDX源码 → compile() → JavaScript函数体
       *    - 编译MDX内容，将其转换为可执行的JavaScript函数体
       * 2. 2. JavaScript函数体 → run() → React组件
       *    - 执行编译后的JavaScript代码，返回一个React组件
       * 3. 3. React组件 → 渲染到页面
       *    - 将返回的React组件渲染到页面上
       */

      setMDXComponent(() => Component)
    }

    if (mdxContent) {
      compileMDX()
    }
  }, [mdxContent])

  return (
    <div className='mdx-renderer'>
      {MDXComponent && <MDXComponent components={components} />}
    </div>
  )
}

// 自定义组件配置
export const components = {
  // 自定义React组件 (使用Antd)
  InteractiveCounter: InteractiveCounter as React.ComponentType,
  UserCard: UserCard as React.ComponentType
}

export default MDXRenderer
```

:::

### web component

这个的灵感来源于 mdx，因为 mdx 引入的 jsx 组件，而 ai 回复的内容可以是原生的 html 标签，如
果注册好 web components 组件，就可以让 ai 的内容直接渲染成 html 标签。

优点：

- 渲染简单

缺点：

- web components 写法过于繁琐

**需要注意**：

我们的框架是 react、vue，使用对应的组件库，这样会造成 ui 的不统一，所以需要想办法在 web components 中使用对应的组件库。

要知道 web components 有个东西叫做 shadow dom，它会与外部样式完全隔离，这样即使在文件中引入了 react 组件和组件样式，也会导致样式和组件丢失，这时候可以想到在内部重新创建节点，并挂载（就和页面的根节点 id="root"挂载渲染一样）

> 这里需要注意：不能开启写`this.attachShadow`，直接让容器挂载到主 dom 中，不去创建 shadow dom，这样样式也不会丢失

::: details 具体代码

```tsx
import { createRoot } from 'react-dom/client'
import { Button } from 'antd'

const F = () => {
  return (
    <>
      <Button type='primary'>渲染React-Antd组件</Button>
    </>
  )
}

class SimpleAntdWebComponent extends HTMLElement {
  constructor() {
    // this.attachShadow({ mode: "open"})
    super()
  }

  // 当组件挂载或内容变化时触发
  connectedCallback() {
    this.render()
  }

  render() {
    const container = document.createElement('div')
    this.appendChild(container)
    createRoot(container).render(
      <>
        <F />
      </>
    )
  }
}

// 定义自定义元素
customElements.define('antd-web-component', SimpleAntdWebComponent)
```

**使用**：

```html
<antd-web-component></antd-web-component>
```

**效果**：

![](./img/web%20component.png)

:::

## AI 项目在线运行方案

像 v0、bolt 这样的网站，ai 生成了下面，是能够在线运行的，如何在不借助后端的情况下，在前端运行这个项目呢？这里就要说到一个技术：web containers,一个运行在浏览器的容器化技术，可以在浏览器跑 node 代码，内部有虚拟文件系统、终端，可以满足我们的需求。

核心就是在于 ai 返回的 json 数据需要转换成 web containers 的文件树结构即可。
