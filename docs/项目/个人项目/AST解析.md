# AST 解析

## 问题 1：你的 AST 是怎样生成的？

1. 语法分析

将 Markdown 文本拆分成每一行的内容，去递归分析每一行内容（正则匹配），得到 AST

```ts
// 语法分析
export interface IncrementalParseOptions {
  prevMarkdown?: string
  prevRoot?: RootTokens
}

export const parseMarkdown = (
  markdown: string,
  options?: IncrementalParseOptions
): RootTokens => {
  // 对 Markdown 文本进行拆分，得到每一行的内容
  const lines = markdown.split('\n')
  // 如果有增量解析选项且存在前一个解析结果
  if (options?.prevMarkdown && options?.prevRoot) {
    return parseIncrementally(markdown, lines, options)
  }

  // 如果没有增量解析选项，执行完整解析
  const root: RootTokens = {
    type: 'root',
    children: [],
    position: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: lines.length, column: 1, offset: markdown.length }
    }
  }
  // 语法解析（词法分析器），遍历后对 map 进行匹配
  tokenizer(lines, root)
  return root
}
```

2. 语法匹配分析

采用策略模式对块级语法进行匹配，无结果默认为段落，在每个块级语法中对特殊内容作行内语法的匹配转换。

- 块级

```ts
export const parseMap: Partial<ParseMapType> = {
  // 块级
  code: parseCode, // 代码块
  html: parseHtml, // html
  heading: parseHeading, // 标题
  blockquote: parseBlockquote, // 引用
  thematicBreak: parseThematicBreak, // 分割线
  list: parseList, // 列表
  table: parseTable // 表格
}

export const defaultParse = parseParagraph // 默认解析器（段落）
```

> 按照 Markdown 的语法规则，可分为 块 / 行 元素（块内可以包含行）。如果满足条件，就 `return`，不执行后续匹配

## 问题 2：如何处理 code 代码块 ，以及在解析过程中的顺序问题？

例如：在项目中，code 代码块的语言为 `bash`，其中的注释信息为 `#`，但是 `#` 是标题的符号，这时候就会出现 h1 和代码块顺序冲突，会把 code 中注释内容转为 h1。

解决方法如下：

- 方案 1：将 code 和 heading 顺序调整，保证 code 先匹配（之前是 heading 在 code 之前）

```ts {3,5}
export const parseMap: Partial<ParseMapType> = {
  // 块级
  code: parseCode, // 代码块
  html: parseHtml, // html
  heading: parseHeading, // 标题
  blockquote: parseBlockquote, // 引用
  thematicBreak: parseThematicBreak, // 分割线
  list: parseList, // 列表
  table: parseTable // 表格
}

export const defaultParse = parseParagraph // 默认解析器（段落）
```

- 方案 2：借鉴 vite 插件的执行顺序，有个 `enforce` 选项，`pre` 优先级高，`post` 优先级低，可以控制解析顺序。

## 问题 3：code 代码块的转换怎么做的，处理未闭合的异常情况了吗？

去匹配内容是否是由【`` `】开始的，就不 return true，接着执行下面内容匹配，直到匹配到【```】结束，就 return true。

异常情况处理：在用户输入顺序中，一般是从上至下，在遇到开头的 【```】，在没有遇到结束符号，会将剩余内容，强制生成代码块节点，确保了解析的准确。

## 问题 4：html 标签有做转义吗

在对 html 标签进行解析的时候，在最后输出内容时，有对 html 标签进行转义，防止 XSS 攻击。（采用正则）

处理情况有：

- 移除所有事件处理器
- 移除 formaction 和 form 属性
- 移除 `javascript:` 和 `data:` 协议

> - `javascript:`：`<a href="javascript:alert('Hello, World!')">Click me</a>`
>
> - `data:`：`<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA..." alt="Embedded Image">`

```ts
const escapeHtml = (unsafe: string): string => {
  // 移除所有事件处理器属性和危险属性
  return unsafe
    .replace(/\son\w+\s*=\s*["']?[^"']*["']?/gi, '') // 移除所有事件处理器
    .replace(/\s(?:javascript|data):[^\s>]*/gi, '') // 移除javascript:和data:协议
    .replace(/\sformaction\s*=\s*["']?[^"']*["']?/gi, '') // 移除formaction属性
    .replace(/\sform\s*=\s*["']?[^"']*["']?/gi, '') // 移除form属性
}
```

## 问题 5：AST 增量解析

增量解析其实和 vue、react 的 diff 算法原理一样，通过比较前后两个 AST，找出变化的部分，然后更新变化的部分。

::: details 简单实现

```ts
import { RootTokens } from '@/types/tokens'
import { IncrementalParseOptions } from '.'
import { tokenizer } from './tokenizer'

// 增量解析方法
export const parseIncrementally = (
  markdown: string,
  lines: string[],
  options: IncrementalParseOptions
): RootTokens => {
  const prevLines = options.prevMarkdown?.split('\n') || []
  // 找到所有变化的区间
  const changeRanges: { start: number; end: number }[] = []
  let currentRange: { start: number; end: number } | null = null

  // 遍历所有行，找出所有变化的区间
  for (let i = 0; i < Math.max(lines.length, prevLines.length); i++) {
    const isLineDifferent = lines[i] !== prevLines[i]

    if (isLineDifferent && !currentRange) {
      currentRange = { start: i, end: i + 1 }
    } else if (isLineDifferent && currentRange) {
      currentRange.end = i + 1
    } else if (!isLineDifferent && currentRange) {
      changeRanges.push(currentRange)
      currentRange = null
    }
  }

  // 处理最后一个区间
  if (currentRange) {
    changeRanges.push(currentRange)
  }

  // 如果没有变化，直接返回之前的解析结果
  if (changeRanges.length === 0 && options.prevRoot) {
    return options.prevRoot
  }

  // 如果没有变化但也没有之前的解析结果，创建新的根节点
  if (changeRanges.length === 0) {
    return {
      type: 'root',
      children: [],
      position: {
        start: { line: 1, column: 1, offset: 0 },
        end: { line: lines.length, column: 1, offset: markdown.length }
      }
    }
  }

  // 创建新的根节点
  const root: RootTokens = {
    type: 'root',
    children: [],
    position: {
      start: { line: 1, column: 1, offset: 0 },
      end: { line: lines.length, column: 1, offset: markdown.length }
    }
  }

  // 复制第一个变化区间之前的节点
  root.children = (options.prevRoot?.children || []).filter(
    (node) => node.position.end.line <= changeRanges[0].start
  )

  // 处理每个变化区间
  let lastEndLine = changeRanges[0].start
  for (const range of changeRanges) {
    // 复制区间之间的未变化节点
    if (range.start > lastEndLine && options.prevRoot?.children) {
      const unchangedNodes = options.prevRoot.children.filter(
        (node) =>
          node.position.start.line > lastEndLine &&
          node.position.end.line <= range.start
      )
      root.children.push(...unchangedNodes)
    }

    // 解析变化的部分
    const changedText = lines.slice(range.start, range.end).join('\n')
    const changedOffset =
      lines.slice(0, range.start).join('\n').length + (range.start > 0 ? 1 : 0)
    const tempRoot: RootTokens = {
      type: 'root',
      children: [],
      position: {
        start: { line: range.start + 1, column: 1, offset: changedOffset },
        end: {
          line: range.end,
          column: 1,
          offset: changedOffset + changedText.length
        }
      }
    }

    tokenizer(lines.slice(range.start, range.end), tempRoot)
    root.children.push(...tempRoot.children)

    lastEndLine = range.end
  }

  // 复制最后一个变化区间之后的节点，并调整位置信息
  const lineDiff = lines.length - prevLines.length
  const remainingNodes = options.prevRoot?.children
    .filter(
      (node) =>
        node.position.start.line > changeRanges[changeRanges.length - 1].end
    )
    .map((node) => ({
      ...node,
      position: {
        start: {
          ...node.position.start,
          line: node.position.start.line + lineDiff
        },
        end: {
          ...node.position.end,
          line: node.position.end.line + lineDiff
        }
      }
    }))

  if (remainingNodes) {
    root.children.push(...remainingNodes)
  }
  return root
}
```

:::
