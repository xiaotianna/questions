# React 基础知识

## 问题 1：React 中为什么要设计 Hook，为了解决什么问题

- **简化状态管理和副作用**：Hooks 允许你直接在函数组件中处理状态和副作用，无需类和复杂的生命周期方法。
- **逻辑拆分与重用**：通过自定义 Hooks，你可以将复杂的逻辑拆分成小的可重用单元，从而使代码更简洁、可读。

## 问题 2：组件的生命周期方法

React 组件的生命周期可以分为三个阶段：挂载阶段、更新阶段和卸载阶段。

- 挂载阶段包括`constructor`、`render`、`componentDidMount`等方法，用于初始化组件、渲染到真实 DOM 和处理副作用。
- 更新阶段包括`shouldComponentUpdate`、`render`、`componentDidUpdate`等方法，用于控制组件的重新渲染和处理更新后的副作用。
- 卸载阶段包括`componentWillUnmount`方法，用于清理组件产生的副作用和资源

> 新生命周期只有这个带`will`的没有被移除，其余 3 个`componentWillMount`、`componentWillReceiveProps`、`componentWillUpdate`被移除了。

## 问题 3：React 组件可请求数据生命周期钩子

- `componentDidMount`：组件挂载后立即调用，在此方法中可以发起请求，并更新组件的状态或 props。
- `componentDidUpdate`：组件更新后立即调用，在此方法中可以根据 props 或 state 的变化发起请求，

## 问题 4：什么是高阶组件（HOC）

高阶组件（Higher-Order Component）是一个函数，它<u>接收一个组件作为参数，返回一个新的组件</u>。高阶组件的作用是复用组件的逻辑，并返回一个增强后的组件。

## 问题 5：受控组件 和 非受控组件

- **受控组件**：表单元素的数据是由 React 的 State 来管理。

> 其实就是实现了一个类似 Vue 的 v-model 的机制，通过 onChange 事件来更新 value，这样就实现了受控组件。

::: details 例如：

我们在界面的输入框中输入内容，这时候你会发现这个 value 是只读的，无法修改，还会报错

```tsx
import React, { useState } from 'react'

const App: React.FC = () => {
  const [value, setValue] = useState('')
  return (
    <>
      <input
        type='text'
        value={value}
      />
      <div>{value}</div>
    </>
  )
}

export default App
```

当用户输入内容的时候，value 并不会自动更新，这时候就需要我们手动实现一个 onChange 事件来更新 value。

```tsx
import React, { useState } from 'react'

const App: React.FC = () => {
  const [value, setValue] = useState('')
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }
  return (
    <>
      <input
        type='text'
        value={value}
        onChange={handleChange}
      />
      <div>{value}</div>
    </>
  )
}

export default App
```

:::

```jsx
import React, { useState } from 'react'

// 受控组件
function ControlledComponent() {
  const [inputValue, setInputValue] = useState('')

  const handleChange = (event) => {
    setInputValue(event.target.value)
  }

  return (
    <div>
      <input
        type='text'
        value={inputValue}
        onChange={handleChange}
      />
      <p>输入的内容: {inputValue}</p>
    </div>
  )
}

export default ControlledComponent
```

- **非受控组件**：是指表单元素不受 React 的 State 管理。它的状态通常通过 ref 从 DOM 中获取。

> 采用 `defaultValue`，变为非受控组件

```jsx {13}
import React, { useState, useRef } from 'react'
const App = () => {
  const value = 'wifi'
  const inputRef = useRef(null)
  const handleChange = () => {
    console.log(inputRef.current?.value)
  }
  return (
    <>
      <input
        type='text'
        onChange={handleChange}
        defaultValue={value}
        ref={inputRef}
      />
    </>
  )
}

export default App
```

- **特殊的非受控组件**：对于 file 类型的表单控件，它是一个特殊的组件，因为它的值只能由用户通过文件选择操作来设置，而不能通过程序直接设置，所以<u>`file`只能是非受控组件</u>。

> 受控组件适用于所有表单元素，包括 input、textarea、select 等。但是除了 `input type="file"` 外，其他表单元素都推荐使用受控组件。

## 问题 6：类组件 和 函数式组件 区别

函数组件和类组件早起是两种差异比较大的写法，类组件支持状态和生命周期方法，而函数组件最初只能作为纯展示组件，但从 react16.8 开始，函数组件通过引入 hook，例如`useState`和`useEffect`等，也可以实现状态管理，副作用处理，让函数组件具备类组件的功能。不过两者的运行机制还是有明显差异：

1. 类组件会在初次渲染时被实例化一次，实例上会挂载组件的 state、props 和生命周期方法等，后续每次更新 react 只需要复用这个实例，调用其 render 方法，以及相关的生命周期钩子。
2. 但是函数组件不同，每一次更新，本质都是对组件函数的重新调用，函数内部的变量会重新声明，react 通过 hook 的内部机制来保留和恢复状态，比如通过闭包+hook 索引（本质是`workInProgressHook`指针）来记录上一次的 state、effect 等，这也是为什么 hook 调用顺序不能变的原因。

::: details hooks 索引

**Hooks 索引**是 React 内部用于追踪组件中 Hooks 调用顺序的「隐形指针」，确保每次渲染时，`useState`、`useEffect` 等 Hooks 的执行顺序与初始化时完全一致，从而正确关联对应的状态和副作用。

核心逻辑可简化为 3 点：

1. 组件首次渲染时，Hooks 索引从 0 开始，每调用一个 Hook，索引就 +1，并将 Hook 的状态、副作用等信息存入「Hook 链表」。
2. 组件更新渲染时，Hooks 索引重置为 0，再次按顺序调用 Hooks，通过索引从链表中读取对应的数据，保证状态不错乱。
3. 若在条件判断（如 `if`）、循环（如 `for`）中调用 Hooks，会破坏索引顺序，导致 React 无法匹配正确的 Hook 数据，引发 bugs。

> 这个索引不是数字，是`workInProgressHook`指针

:::

3. 另外函数组件不依赖 this，避免了上下文混乱的问题，而类组件经常需要手动绑定 this，或使用箭头函数来解决。
4. 函数组件可以更方便的拆分逻辑，例如自定义 hook 来抽离副作用和状态，使其代码逻辑更清晰，复用性高

无论是哪种组件，react 都会将他们转为 fiber 节点，交由调度器统一处理，进入 reconciliation（调度阶段） 和 commit（提交阶段） 阶段完成更新，组件的更新会触发重新渲染。

## 问题 7：React 中组件通信方式

- 父传子
  - props、Context 上下文（useContext）
- 子传父
  - 回调函数（通过父组件向子组件 props 传递一个函数，由子组件向函数中传递参数，父组件接收）
- 子孙组件
  - Context 上下文（useContext）
- 兄弟组件
  - 类似全局事件总线（例如：第三方库 PubSubJS），原理：消息的发布订阅机制
  - 状态管理库（redux、zustand）

## 问题 8：React 是 mvvm 框架吗？

- React 不是一个典型的 MVVM（Model-View-ViewModel）框架。
- React 强调单向数据流的概念，其中数据从父组件通过 props 传递给子组件，子组件通过回调函数将状态更改传递回父组件。这种单向数据流的模型有助于构建可预测和可维护的组件，但与典型的双向绑定的 MVVM 模式不同。

## 问题 9：React 性能优化方案

1. 使用 React.memo()来缓存组件，该组件在 props 没有变化时避免不必要的渲染。
2. 使用 React.lazy()和 Suspense 来延迟加载组件。可降低初始加载时间，并提高应用程序的性能。
3. 使用 React.useCallback()和 React.useMemo()来缓存函数和计算结果，避免不必要的函数调用和计算。
4. 使用 React.Fragment 来避免不必要的 DOM 节点。可减少 DOM 节点数量，提高应用程序的性能。

## 问题 10：refs 的作用

在 React 中，refs（引用）是用于访问组件或 DOM 元素的方法。

1. **访问组件实例**：通过 refs，可以获取到组件的实例，从而可以直接调用组件的方法或访问组件的属性。这在某些情况下非常有用，例如需要手动触发组件的某个方法或获取组件的状态。
2. **访问 DOM 元素**：通过 refs，可以获取到 React 组件中的 DOM 元素，从而可以直接操作 DOM，例如改变样式、获取输入框的值等。这在需要直接操作 DOM 的场景下非常有用，但在 React 中应该尽量避免直接操作 DOM，而是通过状态和属性来控制组件的渲染。

## 问题 11：React 项目是如何捕获错误的？

在 react16 中引入了错误边界，来捕获错误，做出降级处理。

- 使用 `static getDerivedStateFromError()` 做 UI 降级。
- 使用 `componentDidCatch()` 打印错误信息。

**可以捕获的错误**：渲染层面的错误 和 生命周期方法中的错误。

> ⚠️ 注意：以下异常无法捕获
>
> 1. 事件处理函数中抛出的异常
>
> 2. 异步代码中抛出的异常
>
> 3. 错误边界自身抛出的错误：如果错误边界组件本身抛出了错误，则它无法捕获该错误。

::: code-group

```tsx [ErrorBoundary组件]
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染能够显示降级后的 UI。
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器。
    logErrorToMyService(error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级后的 UI 并渲染。
      return <h1>Something went wrong.</h1>
    }
    return this.props.children
  }
}
```

```tsx [使用ErrorBoundary]
<ErrorBoundary>
  <MyComponent />
  {/* ...其余业务组件 */}
</ErrorBoundary>
```

:::

## 问题 12：React 的事件合成机制

在 React 中，事件合成机制（SyntheticEvent）是 React 对浏览器原生事件系统的一层封装，它定义了一套统一的事件处理接口，让开发者在**不同浏览器环境**下能够以一致的方式处理事件。

### **事件合成机制的核心原理**

1. **事件委托（Event Delegation）-> 性能优化**  
   React 并不会将事件处理器直接绑定到 DOM 元素上，而是将所有事件委托到根节点（`root` 容器）。当事件触发时，浏览器会先执行原生事件流（捕获 → 目标 → 冒泡），最终由根节点的统一监听器接收，再由 React 内部模拟一套事件冒泡/捕获机制，将事件分发到对应的组件。

   - React 17 之前将事件委托到 `document` 层级。React 17+ 改为委托到渲染的`根容器`（如 ReactDOM.render 挂载的节点）。减少内存占用，动态添加元素无需重新绑定事件。
   - DOM 事件 直接绑定到元素，大量事件监听时可能导致性能问题。

2. **合成事件对象（SyntheticEvent）**  
   当事件触发时，React 会创建一个 **合成事件对象**（而非原生事件对象），它封装了原生事件的常用属性和方法（如 `stopPropagation()`、`preventDefault()`、`target` 等），并确保在不同浏览器中表现一致。

::: details 事件池

**事件池**（Event Pooling） 是 React 早期为优化性能引入的机制，用于复用合成事件对象。

1. **事件池的核心作用**：减少内存分配和垃圾回收的开销

当一个事件（如 `onClick`）被触发时，React 会从事件池中取出一个合成事件对象，将原生事件的属性（如 `target`、`type`、`preventDefault` 等）复制到该对象上，供事件处理函数使用。  
当事件处理函数执行完毕后，React 会**清空该合成事件对象的所有属性**，并将其放回事件池，以便下次事件触发时重复利用。

2. 事件池的「坑」：**异步访问问题**

由于事件池会在事件处理函数执行后清空合成事件对象的属性，**如果在异步代码中访问合成事件的属性，会得到 `null` 或 `undefined`**。

例如，在 React 16 及之前版本中：

```jsx
function handleClick(event) {
  console.log(event.target) // 正常输出（同步访问）

  setTimeout(() => {
    console.log(event.target) // 输出 null（异步访问，事件已被回收）
  }, 0)
}

;<button onClick={handleClick}>点击</button>
```

解决方案：`event.persist()`

为了在异步场景中访问合成事件的属性，React 提供了 `event.persist()` 方法。调用该方法后，合成事件对象会**从事件池中移除**，其属性不会被清空，可在异步代码中安全访问：

```jsx
function handleClick(event) {
  event.persist() // 将事件从池中移除，属性不会被清空
  console.log(event.target) // 正常输出

  setTimeout(() => {
    console.log(event.target) // 正常输出（异步访问有效）
  }, 0)
}
```

3. 总结

- 事件池是 React 早期为优化性能设计的合成事件复用机制，会在事件处理函数执行后清空事件属性；
- React 16 及之前版本中，异步访问合成事件属性需用 `event.persist()`；
- 由于**异步访问事件属性失效**问题却经常让开发者困惑，在 React 17 及之后版本已移除事件池，无需考虑事件复用问题，异步访问属性直接有效。

:::

### 为什么事件委托是挂在到 root，而不是挂载到 window 或者 document 上

核心：**应用隔离，避免全局事件污染**

因为 react 应用是挂载到根元素上的，应用内的东西不能影响内容外的。

### **为什么不用原生事件？**

1. **跨浏览器兼容性问题**  
   不同浏览器对原生事件的实现存在差异（例如 IE 中的 `attachEvent` 与标准的 `addEventListener`，事件对象的获取方式不同等）。如果直接使用原生事件，开发者需要手动处理大量兼容性逻辑，而 React 的合成事件已内置了这些兼容处理，简化开发。

2. **React 组件模型的需要**  
   React 的核心是虚拟 DOM（Virtual DOM），组件的 DOM 结构可能会被频繁更新（挂载/卸载）。如果直接绑定原生事件，组件更新时需要手动解绑事件以避免内存泄漏，而合成事件通过委托到根节点，自动与组件生命周期同步，无需手动管理。

3. **统一的事件处理机制**  
   原生事件的行为在不同场景下可能不一致（如事件冒泡的细节、事件类型的命名差异）。合成事件提供了统一的 API（如 `onClick`、`onChange` 等），无论底层浏览器如何实现，开发者只需遵循 React 的事件规范即可。

总之，React 的事件合成机制是为了在保证跨浏览器一致性的同时，适配 React 的组件模型和性能需求，大幅简化了事件处理逻辑。

## 问题 13：React Hooks 与 Utils 的区别

- **React Hooks**：Hooks 是 React 16.8 新增的特性，允许在函数组件中使用状态和其他 React 特性，打破了函数组件只能渲染 UI，不能使用状态和生命周期的限制。通常以 use 开头，如 useState、useEffect、useContext 等。
- **Utils**：指的是开发者自己编写的一些工具函数，用于解决特定问题，实现某些逻辑，减少重复代码。这些函数不依赖于 React 的生命周期，可以在任何 JavaScript 环境中使用。

## 问题 14：为何 dev 模式下 useEffect 执行两次？

在 React 18 的 **开发模式** 下，你可能会注意到 `useEffect` 执行了两次，这是 **刻意设计的行为**，不是 bug。

**为什么会执行两次？**

React 18 引入了 **Strict Mode（严格模式）** 的开发增强功能，会在开发环境中模拟"组件二次挂载"的场景：

- 第一次正常挂载
- 立即"卸载"组件
- 再次重新挂载

**影响范围**

- **只在开发模式**下发生，生产环境不会有此行为
- **只影响**带有副作用的钩子：`useEffect`、`useLayoutEffect` 等
- **不影响**纯渲染逻辑

**如何避免重复执行**

1. **清理副作用**（推荐做法）

   ```jsx
   useEffect(() => {
     const timer = setInterval(() => console.log('tick'), 1000)
     return () => clearInterval(timer) // 清理函数
   }, [])
   ```

2. **移除 StrictMode**（不推荐）

   ```jsx
   // index.js
   ReactDOM.createRoot(rootElement).render(<App />)
   // 而不是 <React.StrictMode><App /></React.StrictMode>
   ```

3. **条件判断**
   ```jsx
   useEffect(() => {
     if (isMounted.current) {
       // 执行副作用
     }
     return () => {
       isMounted.current = false
     }
   }, [])
   ```

**总结**

- React 18 开发模式下 `useEffect` 执行两次是 **正常现象**
- 这是为了帮助你写出更健壮的代码
- 最佳实践是 **正确清理副作用**，而不是盲目寻找"关闭"方法

## 问题 15：React state 不可变数据

在 React 中，**状态（state）的不可变性** 是指你不能直接修改状态的值，而是需要创建一个新的值来替换旧的状态。

使用不可变数据可以带来如下好处：

1. **性能优化**

React 使用浅比较（shallow comparison）来检测状态是否发生变化。如果状态是不可变的，React 只需要比较引用（即内存地址）是否变化，而不需要深度遍历整个对象或数组。

2. **可预测性**

- 不可变数据使得状态的变化更加可预测和可追踪。
- 每次状态更新都会生成一个新的对象或数组，这样可以更容易地调试和追踪状态的变化历史。

3. **避免副作用**

- 直接修改状态可能会导致意外的副作用，尤其是在异步操作或复杂组件中。
- 不可变数据确保了状态的更新是纯函数式的，避免了副作用。

## 问题 16：React state 异步更新

**react18 前**：

在 React 18 之前，React 采用批处理策略来优化状态更新。在批处理策略下，React 将在事件处理函数结束后应用所有的状态更新，这样可以避免不必要的渲染和 DOM 操作。

然而，这个策略在异步操作中就无法工作了。因为 React 没有办法在适当的时机将更新合并起来，所以结果就是在异步操作中的每一个状态更新都会导致一个新的渲染。

例如，当你在一个 onClick 事件处理函数中连续调用两次 setState，React 会将这两个更新合并，然后在一次重新渲染中予以处理。

然而，在某些场景下，如果你在事件处理函数之外调用 setState，React 就无法进行批处理了。比如在 setTimeout 或者 Promise 的回调函数中。在这些场景中，每次调用 setState，React 都会触发一次重新渲染，无法达到批处理的效果。

---

**react18 后**：

React 18 引入了自动批处理更新机制，让 React 可以捕获所有的状态更新，并且无论在何处进行更新，都会对其进行批处理。这对一些异步的操作，如 Promise，setTimeout 之类的也同样有效。

这一新特性的实现，核心在于 React 18 对渲染优先级的管理。React 18 引入了一种新的协调器，被称为“React Scheduler”。它负责管理 React 的工作单元队列。每当有一个新的状态更新请求，React 会创建一个新的工作单元并放入这个队列。当 JavaScript 运行栈清空，Event Loop 即将开始新的一轮循环时，Scheduler 就会进入工作，处理队列中的所有工作单元，实现了批处理。

## 问题 17：Hooks 使用的限制

1. 不要在循环、条件或嵌套函数中调用 Hooks
2. 只能在函数组件中使用 Hooks

## 问题 18：React19 升级了哪些新特性？

1. 新的 API: `use`

在 React 19 中，我们引入了一个新的 API 来在渲染中读取资源：use。

例如，你可以使用 use 读取一个 promise，React 将挂起，直到 promise 解析完成：

```jsx
import { use } from 'react'

function Comments({ commentsPromise }) {
  // `use` 将被暂停直到 promise 被解决.
  const comments = use(commentsPromise)
  return comments.map((comment) => <p key={comment.id}>{comment}</p>)
}

function Page({ commentsPromise }) {
  // 当“use”在注释中暂停时,
  // 将显示此悬念边界。
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Comments commentsPromise={commentsPromise} />
    </Suspense>
  )
}
```

2. ref 作为一个属性

从 React 19 开始，你现在可以在函数组件中将 ref 作为 prop 进行访问：

```jsx
function MyInput({ placeholder, ref }) {
  return (
    <input
      placeholder={placeholder}
      ref={ref}
    />
  )
}

//...
;<MyInput ref={ref} />
```

新的函数组件将不再需要 `forwardRef`。

## 问题 19：useDeferredValue 和 useTransition 的区别

useDeferredValue 和 useTransition 都是 React 18 引入的并发特性，核心目标是优化长任务导致的 UI 阻塞问题

- `useDeferredValue`：优化「**状态的渲染优先级**」—— 让一个 “非紧急” 状态的更新延迟执行，优先保证紧急状态（如输入、点击）的响应性。这对于高频更新的内容(如输入框、滚动等)非常有用

```jsx
const deferredContent = useDeferredValue(content) // content 为编辑区源内容
return <Preview content={deferredContent} />
```

- `useTransition`：优化「**更新操作的优先级**」—— 把一个 “非紧急” 的更新操作标记为 “过渡任务”，让它在后台低优先级执行，不阻塞紧急操作。它常用于优化视图切换时的用户体验（如 tab 切换）。

```js
const [isPending, startTransition] = useTransition()

// startTransition包裹需要更新状态代码
startTransition(() => {
  setCount(1)
})
```

> ⚠️ 注意：传递给 `startTransition` 的函数必须是同步的，React 会立即执行此函数
