# 项目难点

## 难点 1：目录获取渲染区 dom 不同步问题

使用 MutationObserver 的原因是为了解决 React 状态更新和 DOM 渲染的时序问题。让我解释一下：

1. 虽然 preview 内容更新会被设置到仓库中，但是 DOM 的实际渲染可能会有延迟。这是因为：

   - React 的状态更新是异步的
   - DOM 的实际渲染会在 React 完成虚拟 DOM 的计算后才进行
   - 特别是在处理 Markdown 渲染这种复杂操作时，DOM 的更新可能会有一定延迟

2. 如果不使用 MutationObserver ，可能会出现以下问题：

   ```typescript
   useEffect(() => {
     if (!previewView) return

     // 这时候虽然 content 更新了，但 DOM 可能还没有渲染完成
     const elements = previewView.querySelectorAll('h1, h2, h3, h4, h5, h6')
     setTitles(formatContents(elements)) // 可能会获取不到最新的标题
   }, [content, previewView])
   ```

3. 使用 MutationObserver 的好处：
   - 它能够直接监听 DOM 的变化
   - 只有在 DOM 真正更新后才会触发回调
   - 确保我们获取到的是最新的 DOM 结构
     所以，虽然内容会更新到仓库，但使用 MutationObserver 可以确保我们在正确的时机（DOM 真正更新后）获取标题列表，避免出现标题列表不同步的问题。

最终实现：

```tsx
useEffect(() => {
  if (!preview) return

  // 初始化时立即执行一次
  if (rootElement.length > 0) {
    const initialTitles = addAnchor()
    setTitles(initialTitles)
    if (initialTitles.length > 0) {
      setActiveLink(initialTitles[0].href)
    }
  }

  const observer = new MutationObserver(() => {
    // 再获取一次元素，防止更新不及时
    const elements = getRootElement()
    if (elements && elements.length > 0) {
      requestAnimationFrame(() => {
        const newTitles = formatContents(elements)
        setTitles(newTitles)
        if (newTitles.length > 0 && !activeLink) {
          setActiveLink(newTitles[0].href)
        }
      })
    }
  })

  observer.observe(preview, {
    childList: true,
    subtree: true,
    characterData: true,
    attributes: true
  })

  return () => {
    observer.disconnect()
  }
}, [preview, rootElement])
```

## 难点 2：编辑区优化

1. 采用**防抖**的方式，减少编辑区渲染的频率，提高性能。
2. 采用**虚拟滚动**（具体看[虚拟列表](../../性能优化/虚拟列表.html)）
3. 使用 `useDeferredValue` 优化预览区内容渲染

> `useDeferredValue` 它通过将某些状态的更新延迟到主渲染任务完成后再进行，确保高优先级的用户交互不会被低优先级的解析任务阻塞，从而提高应用的性能和响应速度。

```tsx
const deferredContent = useDeferredValue(content) // content 为编辑区源内容
return <Preview content={deferredContent} />
```

::: details useDeferredValue 和 useTransition 的区别

### useDeferredValue

`useDeferredValue` 用于<u>延迟某些状态的更新</u>，直到主渲染任务完成。这对于高频更新的内容(如输入框、滚动等)非常有用，可以让 U 更加流畅，避免由于频繁更新而导致的性能问题。

### useTransition

`useTransition` 可以将一个更新转为低优先级更新，使其可以被打断，不阻塞 ui 对用户操作的响应，能够提高用户的使用体验，它常用于优化视图切换时的用户体验。

> ⚠️ 注意：传递给 `startTransition` 的函数必须是同步的，React 会立即执行此函数

```tsx
const [isPending, startTransition] = useTransition()

// startTransition包裹需要更新状态代码
startTransition(() => {
  setCount(1)
})
```

:::

## 难点 3：工具栏插件化

使用 `Map` 结构，定义了基础的工具栏，对于工具栏的新增和删除，对外暴露了一个接口，方便插件开发者进行扩展。

## 难点 4：语法高亮

项目采用的 CodeMirror 实现的，原生实现如下：

首先需要解析输入的 JavaScript 代码文本，识别出不同的语法元素（如关键字、字符串、注释等）；然后需要实时监听输入框的内容变化，对变化的内容进行解析和高亮处理；最后通过 CSS 样式或者动态插入 span 标签的方式来实现不同语法元素的颜色区分。（AST 解析的应用）

::: code-group

```html [index.html]
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>JavaScript编辑器</title>
    <style>
      #editor {
        width: 600px;
        height: 400px;
        border: 1px solid #ccc;
        padding: 10px;
        font-family: monospace;
        white-space: pre-wrap;
        overflow-y: auto;
        background-color: #1e1e1e;
        color: #d4d4d4;
      }
      .keyword {
        color: #569cd6;
      }
      .string {
        color: #ce9178;
      }
      .number {
        color: #b5cea8;
      }
      .comment {
        color: #6a9955;
      }
      .operator {
        color: #d4d4d4;
      }
      .function {
        color: #dcdcaa;
      }
      .variable {
        color: #9cdcfe;
      }
    </style>
  </head>
  <body>
    <div
      id="editor"
      contenteditable="true"
    ></div>
    <script src="editor.js"></script>
  </body>
</html>
```

```js [editor.js]
document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('editor')

  // JavaScript关键字列表 列举部分
  const keywords = [
    'break',
    'case',
    'const',
    'else',
    'for',
    'function',
    'if',
    'new',
    'return',
    'typeof',
    'var',
    'while',
    'let',
    'await'
  ]

  // 操作符列表 列举部分
  const operators = ['+', '-', '*']

  function tokenize(code) {
    let tokens = []
    let current = 0

    while (current < code.length) {
      let char = code[current]

      // 处理空白字符
      if (/\s/.test(char)) {
        tokens.push({
          type: 'whitespace',
          value: char
        })
        current++
        continue
      }

      // 处理数字
      if (/[0-9]/.test(char)) {
        let value = ''
        while (/[0-9\.]/.test(char)) {
          value += char
          char = code[++current]
        }
        tokens.push({
          type: 'number',
          value: value
        })
        continue
      }

      // 处理标识符和关键字
      if (/[a-zA-Z_$]/.test(char)) {
        let value = ''
        while (/[a-zA-Z0-9_$]/.test(char)) {
          value += char
          char = code[++current]
        }

        tokens.push({
          type: keywords.includes(value) ? 'keyword' : 'variable',
          value: value
        })
        continue
      }

      // 处理字符串
      if (char === '"' || char === "'") {
        let value = char
        let quote = char
        char = code[++current]

        while (char !== quote) {
          if (char === undefined) break
          value += char
          char = code[++current]
        }
        value += quote
        tokens.push({
          type: 'string',
          value: value
        })
        current++
        continue
      }

      // 处理注释
      if (char === '/' && code[current + 1] === '/') {
        let value = ''
        while (char !== '\n' && current < code.length) {
          value += char
          char = code[++current]
        }
        tokens.push({
          type: 'comment',
          value: value
        })
        continue
      }

      // 处理操作符
      let op = char
      if (code[current + 1] && operators.includes(char + code[current + 1])) {
        op += code[++current]
      }
      if (operators.includes(op)) {
        tokens.push({
          type: 'operator',
          value: op
        })
        current++
        continue
      }

      // 其他字符
      tokens.push({
        type: 'other',
        value: char
      })
      current++
    }

    return tokens
  }

  function highlight(code) {
    const tokens = tokenize(code)
    return tokens
      .map((token) => {
        if (token.type === 'whitespace') {
          return token.value
        }
        return `<span class="${token.type}">${token.value}</span>`
      })
      .join('')
  }

  // 处理输入事件
  editor.addEventListener('input', () => {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const offset = range.startOffset

    const content = editor.innerText
    editor.innerHTML = highlight(content)

    // 恢复光标位置
    const newRange = document.createRange()
    const walker = document.createTreeWalker(
      editor,
      NodeFilter.SHOW_TEXT,
      null,
      false
    )

    let currentOffset = 0
    let node

    while ((node = walker.nextNode())) {
      const nodeLength = node.length
      if (currentOffset + nodeLength >= offset) {
        newRange.setStart(node, offset - currentOffset)
        newRange.setEnd(node, offset - currentOffset)
        break
      }
      currentOffset += nodeLength
    }

    selection.removeAllRanges()
    selection.addRange(newRange)
  })
})
```

:::

## 难点 5：如何实现增量解析？

**增量解析实现思路：**

1. **变化区间检测**

   - 将新旧文本按行分割，逐行比较找出发生变化的区间
   - 使用 `changeRanges` 数组存储所有变化区间，每个区间包含 `start` 和 `end` 行号
   - 连续的变化行会被合并为一个区间

2. **优化处理**

   - 如果没有检测到变化且存在之前的解析结果，直接返回之前的结果
   - 如果没有变化且没有之前的结果，创建一个空的根节点返回

3. **增量构建过程**

   - 创建新的根节点作为最终结果
   - 保留未变化部分：
     - 复制第一个变化区间之前的节点
     - 复制各个变化区间之间的未变化节点
     - 复制最后一个变化区间之后的节点
   - 处理变化部分：
     - 对每个变化区间的内容重新进行解析
     - 使用 `tokenizer` 解析变化区间的文本
     - 将解析结果合并到最终的 AST 中

4. **位置信息处理**
   - 精确计算变化部分的偏移量（offset）
   - 对于变化区间后的节点，根据行数变化调整其位置信息

> 这种增量解析方法的主要优点是：
>
> - 只重新解析发生变化的部分，提高性能
> - 保留未变化部分的解析结果，避免重复工作
> - 准确维护了节点的位置信息，确保 AST 的完整性
>
> 这种实现特别适合编辑器这类需要实时解析的场景，因为它能够高效地处理局部更新，而不是每次都重新解析整个文档。

**代码实现：**

- 存储变化区间的数组 `changeRanges`
- 存储当前变化的区别 `currentRange`
  - 一个变化的行时，如果 currentRange 为 null ，就创建新的区间
  - 如果发现连续的变化行，就更新 currentRange.end
  - 当遇到未变化的行时，就把当前区间加入到 changeRanges 数组中，并重置 currentRange 为 null

::: details 增量解析

```js
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
  const changeRanges: { start: number, end: number }[] = []
  let currentRange: { start: number, end: number } | null = null

  // 遍历所有行，找出所有变化的区间
  for (let i = 0; i < Math.max(lines.length, prevLines.length); i++) {
    const isLineDifferent = lines[i] !== prevLines[i]

    /**
     * currentRange：处理当前变化的区间
     *  - 当发现一个变化的行时，如果 currentRange 为 null ，就创建新的区间
        - 如果发现连续的变化行，就更新 currentRange.end
        - 当遇到未变化的行时，就把当前区间加入到 changeRanges 数组中，并重置 currentRange 为 null
     */
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
