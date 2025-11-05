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

#### useDeferredValue

`useDeferredValue` 用于<u>延迟某些状态的更新</u>，直到主渲染任务完成。这对于高频更新的内容(如输入框、滚动等)非常有用，可以让 U 更加流畅，避免由于频繁更新而导致的性能问题。

#### useTransition

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
