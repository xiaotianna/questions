# 手写题

## 问题 1：实现一个函数柯里化 add

1. add(1,2,3).valueOf() // 6
2. add(1,2)(3)(4,5).valueOf() // 15
3. add(1)(2)(3)(4,5,6)(7).valueOf() // 28

```js
const curry = (...args1) => {
  let params = args1

  const addFn = (...args2) => {
    params = params.concat(args2)
    return addFn
  }

  addFn.valueOf = () => {
    return params.reduce((pre, cur) => {
      return pre + cur
    }, 0)
  }

  return addFn
}

const add = curry(1, 2, 3)
console.log(add(4, 5, 6)(7).valueOf()) // 28
```

## 问题 2：实现响应式数据 + 依赖收集

要求：编写 `constructor`，让其实现数据修改触发 render，且同步变更需要合并。

```js
class Component {
  data = { name: '' }

  constructor() {}

  render() {
    console.log(`render - name:${this.proxyData.name}`)
  }
}

// 要求以下代码需要触发render, 且同步变更需要合并。
const com = new Component()
com.proxyData.name = 'a'
com.proxyData.name = 'b'
com.proxyData.name = 'wifi'
// 上面三个执行完后，第一次触发 render

setTimeout(() => {
  com.proxyData.name = 'hello wifi'
})
// 定时器执行完后，第二次触发 render
```

解析：通过 `Proxy` 触发响应式，加上 `Promise` 实现依赖收集。

```js {3,5-19,22}
class Component {
  data = { name: '' }
  pending = false

  constructor() {
    this.proxyData = new Proxy(this.data, {
      set: (target, key, value) => {
        // target => sthis.data
        target[key] = value
        if (!this.pending) {
          this.pending = true
          // 第一次和第二次触发，相差一个微任务，只需要在微任务中重新执行render就行
          Promise.resolve().then(() => {
            this.render()
          })
        }
      }
    })
  }

  render() {
    this.pending = false
    console.log(`render - name:${this.proxyData.name}`)
  }
}

// 要求以下代码需要触发render, 且同步变更需要合并。
const com = new Component()
com.proxyData.name = 'a'
com.proxyData.name = 'b'
com.proxyData.name = 'wifi'
// 上面三个执行完后，第一次触发 render

setTimeout(() => {
  com.proxyData.name = 'hello wifi'
})
// 定时器执行完后，第二次触发 render
```

## 问题 3：手写 instanceof 操作符

`instanceof` 运算符用于检测构造函数的 `prototype` 属性是否出现在某个实例对象的原型链上。

```js
/**
 * 思路：
 *  1、通过 Object.getPrototypeOf 获取 obj 的原型
 *  2、循环判断 objProtoType 是否和 constructor 的原型相等
 *    2.1、如果相等就返回 true
 *    2.2、如果不相等 就重新赋值一下 obj 的原型 进入下一次循环
 *  3、判断是 objProtoType 是否为空 如果为空就说明不存在 返回 false
 */
function myInstanceof(obj, constructor) {
  // 检查obj是否为对象或函数
  if (obj === null || (typeof obj !== 'object' && typeof obj !== 'function')) {
    return false
  }

  // 获取构造函数的原型对象 let proto = obj.__proto__
  let proto = Object.getPrototypeOf(obj)

  // 检查构造函数的原型链是否包含给定的构造函数的原型
  while (proto !== null) {
    if (proto === constructor.prototype) {
      return true
    }
    // obj.__proto__.__proto__ ...
    proto = Object.getPrototypeOf(proto)
  }

  return false
}

class A {}
class B extends A {}
class C extends B {}

let obj = new C()
console.log(myInstanceof(obj, A))
```

## 问题 4：手写 Object.create

`Object.create()`：创建一个新的对象，将传入的对象原型指向新对象并返回。

```js
function MyObjectCreate(obj) {
  // object 必须是对象或 null，否则抛错
  if (typeof obj !== 'object' && typeof obj !== 'function' && obj !== null) {
    throw new TypeError('Object prototype may only be an Object or null')
  }
  // 核心代码
  function Fn() {}
  Fn.prototype = obj
  return new Fn()
}

const person = { name: 'wifi' }
const p = MyObjectCreate(person)
console.log(p.__proto__ === person) // true（原型绑定成功）
```

## 问题 5：使用 setTimeout 实现 setInterval

::: code-group

```js [简易版]
function MySetInterval(callback, delay) {
  const interval = () => {
    callback()
    setTimeout(interval, delay)
  }
  setTimeout(interval, delay)
}

MySetInterval(() => {
  console.log(111)
}, 1000)
```

```js [完整版-带clear]
function MySetInterval(callback, delay) {
  let timerId = null
  const interval = () => {
    callback()
    timerId = setTimeout(interval, delay)
  }
  timerId = setTimeout(interval, delay)

  return {
    clear() {
      clearTimeout(timerId)
    }
  }
}

const { clear } = MySetInterval(() => {
  console.log(111)
}, 1000)
```

:::

## 问题 6：发布订阅模式

::: code-group

```js [class]
class EventEmitter {
  constructor() {
    this.emit = {}
  }

  // 订阅事件
  on(eventName, callback) {
    if (!this.emit[eventName]) {
      this.emit[eventName] = []
    }
    this.emit[eventName].push(callback)
  }

  // 发布事件
  emits(eventName, ...args) {
    if (!this.emit[eventName]) {
      return new Error(eventName + 'event is not find')
    }
    this.emit[eventName].forEach((cb) => cb(...args))
  }

  // 取消订阅
  off(eventName, callback) {
    if (!this.emit[eventName]) {
      return new Error(eventName + 'event is not find')
    }
    if (callback) {
      this.emit[eventName] = this.emit[eventName].filter(
        (cb) => cb !== callback
      )
    } else {
      delete this.emit[eventName]
    }
  }
}

// 使用示例
const emitter = new EventEmitter()

// 订阅事件
emitter.on('message', (message) => {
  console.log(`收到消息: ${message}`)
})

// 发布事件
emitter.emits('message', '你好，世界！')
emitter.emits('message', '你好，世界2！')

// 取消订阅事件
emitter.off('message')

// 再次发布事件，此时回调函数不会被执行
emitter.emits('message', '再见，世界！')
```

```js [es5]
const emitter = (function () {
  var deps = {}
  return {
    on: function (type, cb) {
      deps[type] = deps[type] || []
      deps[type].push(cb)
    },
    emit: function (type, ...rest) {
      deps[type] instanceof Array &&
        deps[type].forEach((cb) => cb.apply(null, rest))
    },
    off: function (type, cb) {
      if (!deps[type]) return
      let index = deps[type].findIndex((item) => item === cb)
      if (index !== -1) {
        deps[type].splice(index, 1)
      }
    }
  }
})()

const handle1 = (data) => {
  console.log('test 1', data)
}
emitter.on('test', handle1)

emitter.on('test', (data) => {
  console.log('test 2', data)
})

setTimeout(() => {
  emitter.emit('test', 'hello world')
  emitter.off('test', handle1) // 取消订阅
  emitter.emit('test', 'hello world') // 当 off 了handle1 后，handle1 不会再执行了
}, 1000)
```

:::

## 问题 7：手写 节流、防抖、深浅拷贝、new、call、apply、bind、promise、setTimeout、setInterval 校正、并发请求

这些问题在对应 JS 部分 和 Promise 部分有。

## 问题 8：手写 LRU 缓存算法

LRU 缓存算法是一种常用的缓存算法，它基于**最久未使用**的原则，即当缓存空间满了时，会淘汰最近最不常用的缓存项。

```js
class LRUCache {
  constructor(capacity) {
    // 最大容量
    this.capacity = capacity
    this.cache = new Map()
  }

  has(key) {
    return this.cache.has(key)
  }
  get(key) {
    const value = this.cache.get(key)
    // 删除并重新插入，确保是最新加入的
    this.cache.delete(key)
    this.cache.set(key, value)
    return value
  }
  put(key, value) {
    if (this.cache.has(key)) {
      // 如果有值，先删除，再新增
      this.cache.delete(key)
    } else if (this.cache.size >= this.capacity) {
      // 没有值，如果容量已满，删除最老的缓存
      // this.cache.keys() 返回一个迭代器对象，该迭代器可以遍历 Map 中所有的键
      // 迭代器对象具有 next() 方法，调用该方法会返回一个包含 value 和 done 属性的对象
      // this.cache.keys().next().value 用来获取迭代器中第一个键的值
      this.cache.delete(this.cache.keys().next().value)
      // 或者将 Map 的 keys 转换为数组，取第一个元素
      // const oldestKey = Array.from(this.cache.keys())[0]
      // this.cache.delete(oldestKey)
    }
    this.cache.set(key, value)
  }
}
```

## 问题 9：排序算法

::: code-group

```js [冒泡排序]
/**
 * 冒泡排序：相邻元素两两比较，大的往后冒
 * 时间复杂度 O(n²)
 */
function bubbleSort(arr) {
  const result = [...arr]
  const n = result.length
  for (let i = 0; i < n - 1; i++) {
    let swapped = false
    for (let j = 0; j < n - 1 - i; j++) {
      if (result[j] > result[j + 1]) {
        ;[result[j], result[j + 1]] = [result[j + 1], result[j]]
        swapped = true
      }
    }
    if (!swapped) break
  }
  return result
}
```

```js [快速排序]
/**
 * 快速排序：选基准分区，递归排序
 * 时间复杂度 平均 O(n log n)
 */
function quickSort(arr) {
  if (arr.length <= 1) return [...arr]
  const pivot = arr[Math.floor(arr.length / 2)]
  const left = arr.filter((x) => x < pivot)
  const mid = arr.filter((x) => x === pivot)
  const right = arr.filter((x) => x > pivot)
  return [...quickSort(left), ...mid, ...quickSort(right)]
}
```

:::

## 问题 10：数组操作

### 1. 数组扁平化

`flat`：将多维数组转换为一维数组

::: code-group

```js [递归实现]
function flattenRecursive(arr) {
  const result = []
  for (const item of arr) {
    if (Array.isArray(item)) {
      result.push(...flattenRecursive(item))
    } else {
      result.push(item)
    }
  }
  return result
}
```

```js [堆栈实现]
function flattenStack(arr) {
  const stack = [...arr]
  const result = []
  while (stack.length) {
    const top = stack.pop()
    if (Array.isArray(top)) {
      stack.push(...top)
    } else {
      result.unshift(top)
    }
  }
  return result
}
```

```js [示例]
const nested = [1, [2, [3, [4, 5]], 6], 7]
console.log('原数组:', JSON.stringify(nested))
console.log('递归扁平化:', flattenRecursive(nested))
console.log('堆栈扁平化:', flattenStack(nested))
// 原数组: [1,[2,[3,[4,5]],6],7]
// 递归扁平化: [
//   1, 2, 3, 4,
//   5, 6, 7
// ]
// 堆栈扁平化: [
//   1, 2, 3, 4,
//   5, 6, 7
// ]
```

:::

### 2. 数组去重

```js
// 方法一：Set（最常用）
function unique1(arr) {
  return [...new Set(arr)]
}

// 方法二：Map（根据指定键值去重）
function uniqueBy(arr, keyFn = (x) => x) {
  const seen = new Map()
  return arr.filter((item) => {
    const k = keyFn(item)
    if (seen.has(k)) return false
    seen.set(k, true)
    return true
  })
}
```

### 3. 实现 filter

实现 `Array.prototype.filter`：返回通过回调测试的元素组成的新数组

```js
Array.prototype.myFilter = function (callback) {
  if (typeof callback !== 'function') {
    throw new TypeError(callback + ' is not a function')
  }
  const result = []
  for (let i = 0; i < this.length; i++) {
    // this指向调用他的元素，也就是下面的nums数组
    if (callback(this[i])) {
      result.push(this[i])
    }
  }
  return result
}

// ========== 示例 ==========
const nums = [1, 2, 3, 4, 5, 6]
console.log('原数组:', nums)
console.log(
  '偶数:',
  nums.myFilter((x) => x % 2 === 0)
)
console.log(
  '大于3:',
  nums.myFilter((x) => x > 3)
)

const users = [
  { name: 'Alice', age: 20 },
  { name: 'Bob', age: 17 },
  { name: 'Carol', age: 22 }
]
console.log(
  '成年人:',
  users.myFilter((u) => u.age >= 18)
)
```

### 4. 实现 map

```js
Array.prototype.myMap = function (callback) {
  const result = []
  for (let i = 0; i < this.length; i++) {
    // this 指向调用它的数组
    result.push(callback(this[i]))
  }
  return result
}

// ========== 示例 ==========
const nums = [1, 2, 3, 4, 5]
console.log('原数组:', nums)
console.log(
  '平方:',
  nums.myMap((x) => x * x)
)
console.log(
  '转字符串:',
  nums.myMap((x) => String(x))
)
```

### 5. 实现 reduce

```js
Array.prototype.myReduce = function (callback, initialValue) {
  let acc = initialValue
  let i = 0
  // 没传初始值时，用第一个元素作为初始值
  if (acc === undefined) {
    acc = this[0]
    i = 1
  }
  for (; i < this.length; i++) {
    acc = callback(acc, this[i])
  }
  return acc
}

// ========== 示例 ==========
const nums = [1, 2, 3, 4, 5]
console.log(
  '求和:',
  nums.myReduce((a, b) => a + b, 0)
)
```

## 问题 11：二叉树的前中后序遍历

> 具体可以在【算法】部分的【二叉树基础知识】部分查看。

```js
/**
 * 二叉树节点
 */
function TreeNode(val, left = null, right = null) {
  this.val = val
  this.left = left
  this.right = right
}

/** 前序遍历：根 -> 左 -> 右 */
function preOrder(root, result = []) {
  if (!root) return result
  result.push(root.val)
  preOrder(root.left, result)
  preOrder(root.right, result)
  return result
}

/** 中序遍历：左 -> 根 -> 右 */
function inOrder(root, result = []) {
  if (!root) return result
  inOrder(root.left, result)
  result.push(root.val)
  inOrder(root.right, result)
  return result
}

/** 后序遍历：左 -> 右 -> 根 */
function postOrder(root, result = []) {
  if (!root) return result
  postOrder(root.left, result)
  postOrder(root.right, result)
  result.push(root.val)
  return result
}

// ========== 示例 ==========
//       1
//      / \
//     2   3
//    / \
//   4   5
const root = new TreeNode(
  1,
  new TreeNode(2, new TreeNode(4), new TreeNode(5)),
  new TreeNode(3)
)
console.log('前序遍历:', preOrder(root)) // [1, 2, 4, 5, 3]
console.log('中序遍历:', inOrder(root)) // [4, 2, 5, 1, 3]
console.log('后序遍历:', postOrder(root)) // [4, 5, 2, 3, 1]
```

## 问题 12：驼峰命名转下划线命名

```js
function pascalToSnake(str) {
  let result = ''
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    const isUpper = char >= 'A' && char <= 'Z'
    if (isUpper && i > 0) {
      result += '_'
    }
    result += isUpper ? char.toLowerCase() : char
  }
  return result
}
```

## 问题 13：url 解析

这个题在解析参数的时候会换着考，例如：

- `&`这个符号会写成`&amp;`
- 参数的 value 会对中文进行编码，例如：`你好`会写成`%E4%BD%A0%E5%A5%BD`
- 嵌套 key 的话会写成`key[subkey]`这样的形式

::: code-group

```js [题1：解析嵌套参数]
// console.log(parseSmartUrl('https://maps.test.com/map?zoom=12&points=1&points=3&filter[type]=park&loaded=true'));/* 输出：
// {
//     zoom: 12,
//     points: [1,3],
//     filter: { type: "park" },
//     loaded: true
//  }
// */

function parseSmartUrl(url) {
  const query = url.split('?')[1]
  if (!query) return {}
  const params = query.split('&')
  const result = {}
  for (const param of params) {
    const [key, value] = param.split('=')
    const depStart = key.split('').findIndex((v) => v === '[')
    const depEnd = key.split('').findIndex((v) => v === ']')
    if (depStart !== -1 && depEnd !== -1) {
      const depKey = key.slice(depStart + 1, depEnd)
      const newKey = key.slice(0, depStart)
      result[newKey] = {
        [depKey]: value
      }
      continue
    }
    if (result.hasOwnProperty(key)) {
      if (Array.isArray(result[key])) {
        result[key].push(value)
      } else {
        result[key] = [result[key], value]
      }
    } else {
      result[key] = value
    }
  }
  return result
}
```

```js [题2：多参数解析]
/**
 * 实现一个函数 parseQueryString(url)，将 URL 的查询字符串解析成对象。
 *
 * 功能要求：
 *
 * 1. 支持基本解析：
 * 例如：?a=1&amp;b=2
 * 输出：{ a: '1', b: '2' }
 *
 * 2. 支持 decodeURIComponent：
 * 例如：?name=%E5%BC%A0%E4%B8%89
 * 输出：{ name: '张三' }
 *
 * 3. 支持重复 key 自动合并为数组：
 * 例如：?a=1&amp;a=2
 * 输出：{ a: ['1', '2'] }
 *
 * 4. 支持空值：
 * ?a=&amp;b
 * 输出：{ a: '', b: '' }
 *
 * 示例用例：
 * parseQueryString('https://www.test.com?a=1&amp;a=2&amp;name=%E5%BC%A0%E4%B8%89&amp;empty=')
 *
 * 输出结果：
 * {
 * a: ['1', '2'],
 * name: '张三',
 * empty: ''
 * }
 */
function parseQueryString(url) {
  const queryString = url.split('?')[1]
  if (!queryString) {
    return {}
  }
  const paramsString = queryString.replaceAll('&amp;', '&')
  const params = paramsString.split('&')
  const result = {}
  for (const param of params) {
    const [key, value] = param.split('=')
    const decodeKey = decodeURIComponent(key)
    const decodeValue = decodeURIComponent(value)
    if (result.hasOwnProperty(decodeKey)) {
      if (Array.isArray(result[decodeKey])) {
        result[decodeKey].push(decodeValue)
      } else {
        // 第二次遇到
        result[decodeKey] = [result[decodeKey], decodeValue]
      }
    } else {
      // 没有key
      result[decodeKey] = decodeValue
    }
  }
  return result
}
```

:::

## 问题 14：转为树

### 1. 数组转树

假设每一项结构为：`{ id, parentId, ...其它字段 }`，`parentId` 为 `null` 或 `undefined` 时表示根节点。

```js
function arrayToTree(list) {
  const nodeMap = new Map()
  const roots = []

  // 先拷贝一份，避免直接修改入参
  for (const item of list) {
    const clone = { ...item, children: [] }
    nodeMap.set(clone['id'], clone)
  }

  // nodeMap.values()：[Map Iterator] {
  //   { id: 1, parentId: null, name: '根 1', children: [] },
  //   { id: 2, parentId: 1, name: '子节点 1-1', children: [] },
  //   { id: 3, parentId: 1, name: '子节点 1-2', children: [] },
  //   { id: 4, parentId: 2, name: '子节点 1-1-1', children: [] },
  //   { id: 5, parentId: null, name: '根 2', children: [] }
  // }

  for (const node of nodeMap.values()) {
    const parentId = node['parentId']
    if (parentId == null || !nodeMap.has(parentId)) {
      // 根节点
      roots.push(node)
    } else {
      const parent = nodeMap.get(parentId)
      parent['children'].push(node)
    }
  }

  return roots
}

// ===== 示例 =====
const flatList = [
  { id: 1, parentId: null, name: '根 1' },
  { id: 2, parentId: 1, name: '子节点 1-1' },
  { id: 3, parentId: 1, name: '子节点 1-2' },
  { id: 4, parentId: 2, name: '子节点 1-1-1' },
  { id: 5, parentId: null, name: '根 2' }
]

const tree = arrayToTree(flatList)
console.dir(tree, { depth: null })
```

### 2. 树转数组

默认 children 字段为子节点数组，将整棵树拍平成一维数组。

::: code-group

```js
function treeToArray(roots) {
  const result = []

  const stack = Array.isArray(roots) ? [...roots] : [roots]

  while (stack.length) {
    const node = stack.pop()
    if (!node) continue

    const { children, ...rest } = node
    result.push(rest)

    if (Array.isArray(children) && children.length) {
      // 为了保持从上到下，从左到右的顺序，这里倒序入栈
      for (let i = children.length - 1; i >= 0; i--) {
        stack.push(children[i])
      }
    }
  }

  return result
}
```

```js [示例]
// ===== 示例 =====
const sampleTree = [
  {
    id: 1,
    parentId: null,
    name: '根 1',
    children: [
      {
        id: 2,
        parentId: 1,
        name: '子节点 1-1',
        children: [{ id: 4, parentId: 2, name: '子节点 1-1-1', children: [] }]
      },
      {
        id: 3,
        parentId: 1,
        name: '子节点 1-2',
        children: []
      }
    ]
  },
  {
    id: 5,
    parentId: null,
    name: '根 2',
    children: []
  }
]

const flat = treeToArray(sampleTree)
console.log(flat)
```

:::

### 3. 路径字符串转树

- 输入：一组类似文件路径的字符串，例如：`['src/index.js', 'src/utils/helper.js', 'test/index.test.js']`
- 输出：树结构：

```js
[
  {
    name: 'src',
    children: [
      { name: 'index.js', children: [] },
      {
        name: 'utils',
        children: [{ name: 'helper.js', children: [] }]
      }
    ]
  },
  ...
]
```

```js
function pathStringsToTree(paths) {
  const root = {}

  for (const raw of paths) {
    // 'src/index.js' → ['src', 'index.js']
    const parts = raw.split('/')

    let current = root
    for (const part of parts) {
      // 如果当前这一层还没有这个节点（比如还没有 src），就先建一个空对象
      if (!current[part]) {
        current[part] = {}
      }
      // 然后进入下一层，继续找下一层
      // 例如：处理 'src/index.js' 后：root = { src: { 'index.js': {} } }
      current = current[part]
    }
  }

  // 将嵌套对象转成需要的 { name, children } 树形结构
  function toNodes(obj) {
    // [key, value] => [name, childrenObj]
    return Object.entries(obj).map(([name, childrenObj]) => ({
      name,
      children: toNodes(childrenObj)
    }))
  }

  return toNodes(root)
}

// ===== 示例 =====
const pathList = [
  'src/index.js',
  'src/utils/helper.js',
  'src/components/Button.jsx',
  'test/index.test.js',
  'README.md'
]

const tree = pathStringsToTree(pathList)
console.dir(tree, { depth: null })
```

## 问题 15：红绿灯循环

红灯亮 3 秒 → 绿灯亮 2 秒 → 黄灯亮 1 秒 → 循环往复

示例输出（每轮）：

```md
现在是 红 灯，持续 3000ms
（3 秒后）
现在是 绿 灯，持续 2000ms
（2 秒后）
现在是 黄 灯，持续 1000ms
（1 秒后）
下一轮...
```

> 用 Promise / async-await 实现「按顺序、可循环」的亮灯逻辑

```js
// ---------- 工具：延迟 N 毫秒（sleep 工具函数） ----------
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

// ---------- 核心：亮某灯并持续 duration 毫秒 ----------
async function light(color, duration) {
  console.log(`现在是 ${color} 灯，持续 ${duration}ms`)
  await sleep(duration)
}

// ---------- 无限循环：红 → 绿 → 黄，一直重复 ----------
async function trafficLightLoop() {
  while (true) {
    await light('红', 3000)
    await light('绿', 2000)
    await light('黄', 1000)
  }
}

trafficLightLoop()
```

## 问题 16：CodingMan

题目：实现一个支持链式调用的 `CodingMan`

CodingMan 算法的经典规则通常是：

- 支持链式调用，如 `CodingMan('Tom').sleep(3).eat('dinner')`，表示
  - 先输出 Hi! This is Tom!，
  - 等待 3 秒后输出 Wake up after 3 seconds!
  - 再输出 Eat dinner~
- 链式调用的执行顺序严格遵循调用顺序，且 sleep 会阻塞后续操作的执行

```js
class _CodingMan {
  taskQueue = []

  next() {
    const task = this.taskQueue.shift()
    if (task) {
      task()
    }
  }

  constructor(name) {
    this.sayHi(name)
    // 把 next() 放入「宏任务队列」
    // 异步启动队列，确保所有链式方法的任务都入队后再执行
    setTimeout(() => {
      this.next()
    }, 0)
  }

  sayHi(name) {
    this.taskQueue.push(() => {
      console.log(`Hi! This is ${name}!`)
      this.next()
    })
    return this
  }

  sleep(delay) {
    this.taskQueue.push(async () => {
      setTimeout(() => {
        console.log(`Wake up after ${delay} seconds!`)
        this.next()
      }, delay * 1000)
    })
    return this
  }

  eat(food) {
    this.taskQueue.push(() => {
      console.log(`Eat ${food}~`)
      this.next()
    })
    return this
  }
}

function CodingMan(name) {
  return new _CodingMan(name)
}

CodingMan('Tom').sleep(3).eat('dinner')
```

## 问题 17：Promisify

这是一个Node.js中常用的工具函数，用于将基于回调的异步函数转换为返回Promise的函数。

```js
/**
 * @param {Function} fn 形如 (arg1, arg2, ..., callback) 的函数
 * @returns {Function} 返回一个新的函数，调用后得到 Promise
 */
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn.call(this, ...args, (err, result) => {
        if (err) {
          reject(err)
        } else {
          resolve(result)
        }
      })
    })
  }
}

// ===== 示例 1：模拟异步回调函数 =====
function fakeAsyncAdd(a, b, callback) {
  setTimeout(() => {
    if (typeof a !== 'number' || typeof b !== 'number') {
      callback(new Error('参数必须是数字'))
    } else {
      callback(null, a + b)
    }
  }, 300)
}

const addAsync = promisify(fakeAsyncAdd)

addAsync(1, 2)
  .then((sum) => console.log('1 + 2 =', sum))
  .catch((err) => console.error('出错：', err.message))
```

## 问题 18：retry 重试 + 超时控制

`retry` 是一个返回 Promise 的函数。会在总超时时间内，按间隔多次重试，直到成功或失败。

```js
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function retry(fn) {
  // 最大重试次数（不含第一次执行）
  const retries = 3
  // 每次重试间隔（毫秒）
  const interval = 1000
  // 总超时时间（毫秒）
  const timeout = 5000

  const start = Date.now()

  // 重新运行
  async function rerun(max) {
    try {
      return await fn()
    } catch (error) {
      // 失败重试
      const elapsed = Date.now() - start
      const timeLeft = timeout - elapsed

      if (timeLeft <= 0 || max <= 0) {
        // 总时间耗尽或没有重试次数了
        throw err
      }

      const waitTime = Math.min(interval, timeLeft)
      await sleep(waitTime)
      return rerun(max - 1)
    }
  }

  return rerun(retries)
}

// test
let failCount = 0
async function failTask() {
  // 前两次失败，第三次成功
  failCount++
  console.log(`执行第 ${failCount} 次`)
  if (failCount < 3) {
    throw new Error('模拟失败')
  }
  return '成功结果'
}

retry(failTask)
  .then((res) => {
    console.log('retry 成功：', res)
  })
  .catch((err) => {
    console.error('retry 失败：', err.message)
  })
```