# JS

::: details 目录

[[toc]]

:::

## 问题 1：阐述一下 JS 的事件循环

事件循环又叫做消息循环，是浏览器渲染主线程的工作方式。

它开启一个不会结束的 for 循环，每次循环从消息队列中取出第一个任务执行，而其他线程只需要在合适的时候将任务加入到队列末尾即可。

每个任务有不同的类型，同类型的任务必须在同一个队列，不同的任务可以属于不同的队列。不同任务队列有不同的优先级，在一次事件循环中，由浏览器自行决定取哪一个队列的任务。但浏览器必须有一个微队列，微队列的任务一定具有最高的优先级，必须优先调度执行。

## 问题 2：请说说你对函数式编程的理解

### 基本概念

函数式编程是一种编程范式，函数为一等公民，函数封装的方式解决问题

### 核心概念

#### 纯函数

无任何副作用，相同的输入（参数）得到相同的输出（返回值）

```js
const add = (a, b) => a + b
```

#### 不可变性

#### 高阶函数（也就是函数柯里化）

高阶函数特点：

- 接受一个或多个函数作为输入参数
- 输出一个函数作为返回值

```js
const add = (a) => (b) => a + b
add(1)(2)
```

#### 函数组合（类似面向对象的继承）

```js
const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((y, fn) => fn(y), x)
const double = (x) => x * 2
const square = (x) => x * x
const doubleAndSquare = compose(square, double)
console.log(doubleAndSquare(3)) // 36
```

### 优点总结

- 可测试性，更好写单元测试
- 可维护性
- 并发
- 简洁

## 问题 3：如何理解 JS 的异步？

JS 是一门单线程的语言，这是因为它运行在浏览器的渲染主线程中，而渲染主线程只有一个。

而渲染主线程承担着诸多的工作，渲染页面、执行 JS 都在其中运行。

如果使用同步的方式，就极有可能导致主线程产生阻塞，从而导致消息队列中的很多其他任务无法得到执行。这样一来，一方面会导致繁忙的主线程白白的消耗时间，另一方面导致页面无法及时更新，给用户造成卡死现象。

所以浏览器采用异步的方式来避免。具体做法是当某些任务发生时，比如计时器、网络、事件监听，主线程将任务交给其他线程去处理，自身立即结束任务的执行，转而执行后续代码。当其他线程完成时，将事先传递的回调函数包装成任务，加入到消息队列的末尾排队，等待主线程调度执行。

在这种异步模式下，浏览器永不阻塞，从而最大限度的保证了单线程的流畅运行。

## 问题 4：同一个页面三个组件请求同一个 API

思路：进行缓存

```js
// 模拟请求
const fetchData = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(id)
    }, 1000)
  })
}

// 记录缓存
const cache = {}

// 缓存请求
const cacheFetchData = (id) => {
  if (cache[id]) {
    return cache[id]
  }
  cache[id] = fetchData(id)
  return cache[id]
}

// 测试
cacheFetchData(3).then((id) => console.log(id))
cacheFetchData(3).then((id) => console.log(id))
cacheFetchData(3).then((id) => console.log(id))
```

<img src="./img/同一个页面三个组件请求同一个API.png" alt="同一个页面三个组件请求同一个API.png" style="zoom:50%;" />

## 问题 5：JS 中的计时器能做到精确计时吗？为什么？

不能，因为：

- js 是单线程的，执行任务需要先等待同步任务、微任务执行完成后，才会执行延时任务。
- 在嵌套超过 5 层，如果设置的 timeout 小于 4ms，则会强制将其设置为 4ms，即会导致至少 4ms 的延迟。
- 页面失活（页面在后台）会导致不准确。

## 问题 6：js 超过 Number 最大值的数怎么处理

`Number.MAX_VALUE`

### 在哪些 `场景` 会超过 Number 最大值

- 大数据计算
- 格式展示
- 用户输入

针对大数据处理

- 金融
- 科学计算
- 数据分析

### 解决方案

- BigInt

```js
const bigNum = BigInt('12312312321323313123213123132343434343434')
bigNum + bigNum
```

- Decimal.js

- big.js

- 比如在用户输入场景，需要限制输入大小

## 问题 7：window 对象上频繁绑定内容的风险

### 风险分析

- 命名冲突
- 全局污染
- 安全风险（任何人都可以修改）
- 性能问题，增加内存开销、垃圾回收的难度

### 解决方案

- 模块化
- 命名空间
- iife（形成闭包，形成独立作用域）
- 开启严格模式

## 问题 8：Symbol 数据类型

在 JavaScript 中，Symbol 是一种基本数据类型，表示独一无二的标识符。

> 它不能被隐式转换成其他类型，并且不能被直接访问。

以下是关于 Symbol 数据类型的几个关键点：

- **创建 Symbol**：

```js
let sym1 = Symbol()
let sym2 = Symbol('description')
```

- **唯一性**： 每个 Symbol 值都是唯一的，即使它们有相同的描述。

```js
let sym1 = Symbol('key')
let sym2 = Symbol('key')
console.log(sym1 === sym2) // false
```

- **作为对象属性键**： Symbol 可以用作对象属性的键，这有助于避免属性名冲突。

```js
let mySymbol = Symbol('myKey')
let obj = {}
obj[mySymbol] = 'value'
console.log(obj[mySymbol]) // "value"
```

- **全局 Symbol 注册表**： 如果需要在不同的上下文中共享同一个 Symbol，可以使用 Symbol.for 和 Symbol.keyFor 方法。

```js
let sym1 = Symbol.for('sharedKey')
let sym2 = Symbol.for('sharedKey')
console.log(sym1 === sym2) // true

let res = Symbol.keyFor(sym1)
console.log(res) // "sharedKey"
```

- **内置符号**： JavaScript 提供了一些内置的 Symbol，用于实现语言内部的功能，例如迭代器协议、异步迭代等。

> `Symbol.iterator` 是一个内置的符号，用于定义对象的默认迭代行为。当对象被用在 `for...of` 循环中时，JavaScript 引擎会查找该对象的 `Symbol.iterator` 方法，并调用它来获取一个迭代器。

```js
let obj = {
  [Symbol.iterator]() {
    let i = 0
    return {
      next: () => ({ value: i++, done: i > 3 })
    }
  }
}

for (let value of obj) {
  console.log(value) // 0, 1, 2
}
```

> 迭代器对象：迭代器是一个具有 next() 方法的对象。每次调用 next() 方法时，它应该返回一个包含 value 和 done 属性的对象：
>
> - value：当前迭代的值。
> - done：一个布尔值，表示迭代是否已经完成。

## 问题 9：以下哪段代码运行效率更高（隐藏类）

::: code-group

```js [案例1]
// 代码1（隐藏类）
const obj1 = {
  a: 1
}
const obj2 = {
  a: 1
}
const obj3 = {
  a: 1
}

// 代码2
const obj1 = {
  a: 1
}
const obj2 = {
  b: 1
}
const obj3 = {
  c: 1
}
```

```js [案例2]
// 代码1（隐藏类）
console.time('a')
for (let i = 0; i < 1000000; ++i) {
  const obj = {}
  obj['a'] = i
}
console.timeEnd('a')

// 代码2
console.time('b')
for (let i = 0; i < 1000000; ++i) {
  const obj = {}
  obj['$(i)'] = i
}
console.timeEnd('b')
```

:::

`代码1`效率更高，重用了隐藏类（Hidden Class）

> 隐藏类的特性是：多个属性顺序一致的 JS 对象，会重用同一个隐藏类，减少 new Class 的开销。

所以`案例1的代码1`生成 1 个隐藏类，而`案例1的代码2`生成 3 个隐藏类，因此`案例1的代码1`代码性能更好。

## 问题 10：以下哪段代码效率更高（数组 - 快速模式 / 字典模式）

```js
// 代码1（数组 - 快速模式）
const arr1 = []
for (let i = 0; i < 10000000; ++i) {
  arr1[i] = 1
}

// 代码2（数字 - 字典模式）
const arr2 = []
arr2[10000000 - 1] = 1
for (let i = 0; i < 10000000; ++i) {
  arr2[i] = 1
}
```

`代码1`效率更高，因为数组的快速模式。

- 快速模式：数组在内存中是连续存储的
- 字典模式：数组是在内存中不是连续存储的

**数组模式 - 触发机制**

- `快速模式`：索引从 `0` -到 `length-1`，且没有空位 或 预分配数组小于 100000，无论是否有空位。
- `字典模式`：预分配数组大于等于 100000，数组有空位。

## 问题 11：如何判断 Object 为空？

- 常用方法：

  - `Object.keys(obj).length === 0`
  - `JSON.stringify(obj) === '{}'`
  - `for in` 判断
    > 以上方法都是不太严谨，因为处理不了 `const obj = { [Symbol('a')]: 1 }` 这种情况。

- 更严谨的方法： `Reflect.ownKeys(obj).length === 0`

## 问题 12：强制类型转换、隐式类型转换

**强制类型转换：**

```js
var num = Number('42') // 强制将字符串转换为数字
var str = String(123) // 强制将数字转换为字符串
var bool = Boolean(0) // 强制将数字转换为布尔值
```

**隐式类型转换：**

```js
var result = 10 + '5' // 隐式将数字和字符串相加，结果为字符串 "105"
true == 1 // 隐式将布尔值转换为数字 1
false == 0 // 隐式将布尔值转换为数字 0
true + false // 1
true + '5' // 隐式将布尔值转换为字符串，结果为 "true5"
true + 2 // 3
'5' * '2' // 隐式将字符串转换为数字，结果为 10
undefined + 2 // NaN
```

## 问题 13：js 的数据类型有哪些？

- **基本数据类型**：

  - Number（数字）：表示数值，包括整数和浮点数。
  - String（字符串）：表示文本数据，使用引号（单引号或双引号）括起来。
  - Boolean（布尔值）：表示逻辑值，即 `true`（真）或 `false`（假）。
  - Null（空）：表示一个空值或没有值的对象。
  - Undefined（未定义）：表示一个未被赋值的变量的值。
  - Symbol（符号）：表示唯一的标识符。
  - BigInt（大整数）：表示大于 2 的 53 位的整数，结尾用 `n` 表示。

- **复杂数据类型（也被称为引用类型）**：

  - Object（对象）：表示复杂数据结构，可以包含键值对的集合。
  - Array（数组）：表示有序的集合，可以包含任意类型的数据。
  - Function（函数）：表示可执行的代码块。
  - Map（映射）：表示键值对集合，键可以是任何类型的值，值可以是任何类型的值。
  - Set（集合）：表示不重复的元素集合，可以包含任何类型的值。
  - WeakMap（弱映射）：是一种特殊的 Map，它的键必须是 `对象（Object）`或 `Symbol`，值可以是任何类型的值
  - WeakSet（弱集合）：是一种特殊的 Set，`WeakSet` 的成员只能是 `对象（Object）`或 `Symbol`

    > ⚠️ 注意：
    >
    > - 这里的`对象（Object）`指的是引用类型
    > - `WeakMap` 和 `WeakSet` 都是弱引用，不会阻止垃圾回收器回收这些对象
    > - API 和 各自对应的 `Map` 和 `Set` 的 API 是相同的
    > - 但是 `WeakMap` 和 `WeakSet` 不支持迭代，所以没有 `forEach`, `values`, `keys`, `entries` 方法。

  ::: details ⛽️ 补充：什么是强引用和弱引用？

  弱引用是不能确保其引用的对象不会被垃圾回收器回收的引用，而强引用是确保其引用的对象不会被垃圾回收器回收的引用。

  也就是说，JavaScript 引擎在执行代码时，对象通过变量直接赋值形成的引用会被视为强引用，垃圾回收器就不会回收这类对象；通过 `WeakMap` 和 `WeakSet` 建立的引用会被视为弱引用，**弱引用不影响垃圾回收**。

  当一个变量被设置为 `null` 时，会断开该变量与原对象间的引用，该对象就会变成垃圾回收器的回收目标。

  > 如果当我们不再需要这个原对象时，我们必须手动的删除这个引用（赋值为 `null`），解除引用这个原对象和原对象的引用关系，否则垃圾回收机制不会释放原对象占用的内存。
  >
  > 也就是当我们不需要 person 时，需要将 person 设置为 null，才会解除与 person1 的引用关系，否则没有办法被垃圾回收机制回收。
  >
  > ```js
  > const person = { name: '张三' }
  > const person1 = [person]
  > person = null
  > ```

  例如：强引用

  ```js
  let person = { name: '张三' }
  const person1 = [person]
  person = null
  console.log(person1) // [ { name: '张三' } ]
  ```

  > 创建一个叫 person 的对象，并将该对象存储到 person1 中；然后将 person 设置为 null，断开引用，但是因为变量 person1 存在对 person 对象的强引用，所以该对象不会被垃圾回收器给盯上。

  例如：弱引用

  ```js
  let person = { name: '张三' }
  let person2 = new WeakMap()
  person2.set(person, '张三')
  person = null
  // 等待垃圾回收后
  console.log(person2, person2.get(mpPerson)) // WeakMap {{…}} => '张三'}   undefined
  ```

  > 创建一个 weakMap 对象 person1 和一个对象 person，并且将该对象作为键，键值为"张三"添加到 person1 中；然后将变量 person 设置为 null，断开了变量与对象的引用，然而 person1 对 person 是弱引用，所以垃圾回收器可以回收 person 对象。

  :::

  ::: tip WeakMap 使用场景

  1. DOM 元素附加数据（避免内存泄漏）：因为 weakMap 不会影响垃圾回收，所以可以用来关联元数据

     ```js
     const wm = new WeakMap()
     const loginBtn = document.getElementById('loginBtn')
     wm.set(loginBtn, { disabled: true })
     ```

     > 如何使用 `Map`，当 DOM 元素被删除时，仍然保存着对按钮的引用，会引起内存泄漏，而 `WeakMap` 避免了这种情况。

  2. 私有属性封装

  假设外部在使用的时候，只能 `new` 这个类，`_privateData` 没有被导出，就做到了私有化属性。

  ```js
  const _privateData = new WeakMap()
  class MyClass {
    constructor(data) {
      _privateData.set(this, { secret: data })
    }

    getSecret() {
      return _privateData.get(this).secret
    }
  }

  const instance = new MyClass('敏感数据')
  console.log(instance.getSecret()) // 输出 "敏感数据"

  // 外部无法直接访问 instance.secret
  // 这种情况还是可以访问到：_privateData.get(instance).secret
  ```

  3. 数据缓存：当我们需要在不修改原有对象的情况下储存某些属性等，而又不想管理这些数据时，可以使用 WeakMap

  ```js
  const cache = new WeakMap()
  function cacheData(obj, key, value) {
    if (cache.has(obj)) {
      return cache.get(obj)
    } else {
      const count = Object.keys(cache).length
      cache.set(obj, count)
      return count
    }
  }
  ```

  :::

- **存储方式**：
  - 基础类型存放于栈，变量记录原始值。
  - 引用类型存放于堆，变量记录地址。

> `null` 存放在**栈**中，因为 null 属于基本数据类型。

## 问题 14：JS 单线程设计的目的

JavaScript 是浏览器的脚本语言，主要用途是<u>进行页面的一系列交互操作以及用户互动</u>。多线程编程通常会引发<u>竞态条件、死锁和资源竞争</u>等问题。如果以多线程的方式进行浏览器操作，则可能出现不可预测的冲突。例如，假设有两个线程同时操作同一个 DOM 元素，线程 1 要求浏览器修改 DOM 内容，而线程 2 却要求删除 DOM，浏览器就会困惑，无法决定采用哪个线程的操作。

因此，JavaScript 的单线程设计很好地简化了这类并发问题，避免了因多线程而引发的竞态条件、死锁和资源竞争等问题。当然，如果在开发中确实需要处理异步场景，JavaScript 也有众多的异步队列来帮助我们实现，也就是我们熟知的事件循环、微任务队列和宏任务队列。如果真的需要开辟一个新线程处理逻辑，也可以通过 Web Worker 实现。

## 问题 15：如何判断 JS 的数据类型

- **`typeof` 操作符**：可以用来确定一个值的基本数据类型，返回一个表示数据类型的字符串。

```js
typeof 42 // "number"
typeof 'Hello' // "string"
typeof true // "boolean"
typeof undefined // "undefined"
typeof null // "object" (这是 typeof 的一个常见的误解)
typeof [1, 2, 3] // "object"
typeof { key: 'value' } // "object"
typeof function () {} // "function"
```

> 注意，typeof null 返回 "object" 是历史遗留问题，不是很准确。

- **`Object.prototype.toString`**：用于获取更详细的数据类型信息。

```js
Object.prototype.toString.call(42) // "[object Number]"
Object.prototype.toString.call('Hello') // "[object String]"
Object.prototype.toString.call(true) // "[object Boolean]"
Object.prototype.toString.call(undefined) // "[object Undefined]"
Object.prototype.toString.call(null) // "[object Null]"
Object.prototype.toString.call([1, 2, 3]) // "[object Array]"
Object.prototype.toString.call({ key: 'value' }) // "[object Object]"
Object.prototype.toString.call(function () {}) // "[object Function]"
```

- **`instanceof`** 操作符：用于检查对象是否属于某个类的实例。

```js
var obj = {}
obj instanceof Object // true

var arr = []
arr instanceof Array // true

function Person() {}
var person = new Person()
person instanceof Person // true
```

- `Array.isArray` 方法：用于检查一个对象是否是数组。

```js
Array.isArray([1, 2, 3]) // true
Array.isArray('Hello') // false
```

## 问题 16：变量提升 & 函数提升（优先级）

```js
// 以下代码输出什么结果
console.log(s);
var s = 2;
function s() {}
console.log(s);

// 会变成
function s() {}
console.log(s);
s = 2;
console.log(s);

// 答案
[Function: s]
2
```

- `var` 会变量提升。
- 优先级：函数提升 > 变量提升。

## 问题 17：null 和 undefined 的区别

**`null`**

- `null` 是一个特殊的关键字，表示一个空对象指针。
- 它通常用于显式地指示一个变量或属性的值是空的，`null` 是一个赋值的操作，用来表示 "没有值" 或 "空"。
- `null` 通常需要开发人员主动分配给变量，而不是自动分配的默认值。
- `null` 是原型链的顶层：所有对象都继承自 `Object` 原型对象，`Object` 原型对象的原型是 `null`。

```js
const a = null
console.log(a) // null

const obj = { a: 1 }
const proto = obj.__proto__
console.log(proto.__proto__) // null
```

**`undefined`**

- 当声明了一个变量但未初始化它时，它的值为 `undefined`。
- 当访问对象属性或数组元素中不存在的属性或索引时，也会返回 `undefined`。
- 当函数没有返回值时，默认返回 `undefined`。
- 如果函数的参数没有传递或没有被提供值，函数内的对应参数的值为 `undefined`。

```js
let x
console.log(x) // undefined

const obj = {}
console.log(obj.property) // undefined

function exampleFunc() {}
console.log(exampleFunc()) // undefined

function add(a, b) {
  return a + b
}
console.log(add(2)) // NaN
```

## 问题 18：什么是内存泄漏

内存泄漏是指应用程序中的内存不再被使用但仍然被占用，导致内存消耗逐渐增加，最终可能导致应用程序性能下降或崩溃。内存泄漏通常是由于开发者编写的代码未正确释放不再需要的对象或数据而导致的。

**特征**：程序对内存失去控制

**内存泄漏案例**：

- 意外的全局变量

```js
function someFunction() {
  // 这个变量会变成全局变量，并可能导致内存泄漏
  myObject = {
    /* ... */
  }
}
```

- 闭包：闭包可能会无意中持有对不再需要的变量或对象的引用，从而阻止它们被垃圾回收。

```js
function createClosure() {
  const data = [
    /* 大量数据 */
  ]
  return function () {
    // 闭包仍然持有对 'data' 的引用，即使它不再需要
    console.log(data)
  }
}

const closureFunction = createClosure()
// 当 'closureFunction' 不再需要时，它仍然保留着 'data' 的引用，导致内存泄漏。
```

- 事件监听器: 忘记移除事件监听器可能会导致内存泄漏，因为与监听器相关联的对象将无法被垃圾回收。

```js
function createListener() {
  const element = document.getElementById('someElement')
  element.addEventListener('click', () => {
    // ...
  })
}
createListener()
// 即使 'someElement' 从 DOM 中移除，该元素及其事件监听器仍将在内存中。
```

- 循环引用: 对象之间的循环引用会阻止它们被垃圾回收。

```js
function createCircularReferences() {
  const obj1 = {}
  const obj2 = {}
  obj1.ref = obj2
  obj2.ref = obj1
}
createCircularReferences()
// 由于循环引用，'obj1' 和 'obj2' 都将保留在内存中。
```

- setTimeout/setInterval: 使用 setTimeout 或 setInterval 时，如果没有正确清理，可能会导致内存泄漏，特别是当回调函数持有对大型对象的引用时。

```js
function doSomethingRepeatedly() {
  const data = [
    /* 大量数据 */
  ]
  setInterval(() => {
    // 回调函数持有对 'data' 的引用，即使它不再需要
    console.log(data)
  }, 1000)
}
doSomethingRepeatedly()
// 'doSomethingRepeatedly' 不再使用时，定时器仍然运行，导致内存泄漏。
```

## 问题 19：什么是闭包，有什么作用？是否会造成内存泄漏？

**定义**：<u style="background: pink;">闭包是</u>指引用了另一个函数作用域中变量的<u style="background: pink;">函数</u>，通常是在嵌套函数中实现的。

**作用**：闭包可以保留其被定义时的作用域，这意味着闭包内部可以访问外部函数的局部变量，即使外部函数已经执行完毕。这种特性使得闭包可以在后续调用中使用这些变量。

**注意**：闭包会使得函数内部的变量在函数执行后仍然存在于内存中，直到没有任何引用指向闭包。如果不注意管理闭包，可能会导致内存泄漏问题。

**案例**：

```js
// 案例1
const accumulation = function (initial) {
  let result = initial
  return function (value) {
    result += value
    return result
  }
}

// 案例2
for (var i = 0; i < 10; ++i) {
  ;(function (index) {
    setTimeout(function () {
      console.log(index)
    }, 1000)
  })(i)
}
```

### 是否会造成内存泄漏？

不一定，如果是闭包还在，当前变量也在，但是后续不会去使用，那么就是内存泄漏；如果后续还使用，那就不算内存泄漏。

## 问题 20：数组去重的方法

- Set：只允许存储唯一的值，可以将数组转换为 `Set`，然后再将 `Set` 转换回数组以去重。

```js
const arr = [1, 2, 2, 3, 4, 4, 5]
const uniqueArr = [...new Set(arr)]
```

- 利用 filter 方法: 遍历数组，只保留第一次出现的元素。

```js
const arr = [1, 2, 2, 3, 4, 4, 5]
const uniqueArr = arr.filter(
  (value, index, self) => self.indexOf(value) === index
)
```

- 使用 reduce 方法: 逐个遍历数组元素，构建一个新的数组，只添加第一次出现的元素。

```js
const arr = [1, 2, 2, 3, 4, 4, 5]
const uniqueArr = arr.reduce((acc, current) => {
  if (!acc.includes(current)) {
    acc.push(current)
  }
  return acc
}, [])
```

- 使用 indexOf 方法: 遍历数组，对于每个元素，检查其在数组中的索引，如果第一次出现，则添加到新数组。

```js
const arr = [1, 2, 2, 3, 4, 4, 5]
const uniqueArr = []
arr.forEach((value) => {
  if (uniqueArr.indexOf(value) === -1) {
    uniqueArr.push(value)
  }
})
```

- 使用 includes 方法: 类似于 indexOf 方法，只不过使用 includes 来检查元素是否已存在于新数组。

```js
const arr = [1, 2, 2, 3, 4, 4, 5]
const uniqueArr = []
arr.forEach((value) => {
  if (!uniqueArr.includes(value)) {
    uniqueArr.push(value)
  }
})
```

## 问题 21：JS 数组 reduce 方法的使用

```js
// 累加
const result = [1, 2, 3].reduce((pre, cur) => pre + cur)
console.log(result)

// 找最大值
const result = [1, 2, 3, 2, 1].reduce((pre, cur) => Math.max(pre, cur))
console.log(result)

// 数组去重
const resultList = [1, 2, 3, 2, 1].reduce((preList, cur) => {
  if (preList.indexOf(cur) === -1) {
    preList.push(cur)
  }
  return preList
}, [])
console.log(resultList)

// 归类
const dataList = [
  { name: 'aa', country: 'China' },
  { name: 'bb', country: 'China' },
  { name: 'cc', country: 'USA' },
  { name: 'dd', country: 'EN' }
]
const resultObj = dataList.reduce((preObj, cur) => {
  const { country } = cur
  if (!preObj[country]) {
    preObj[country] = []
  }
  preObj[country].push(cur)
  return preObj
}, {})
console.log(resultObj)

// 字符串反转
const str = 'hello world'
const resultStr = Array.from(str).reduce((pre, cur) => {
  return `${cur}${pre}`
}, '')
console.log(resultStr)
```

## 问题 22：JS 数组、字符串常见操作方式及方法

### 数组

```js
// 遍历
for (let i = 0; i < list.length; ++i) {} // 遍历性能最好
for (const key in list) {
}
for (const item of list) {
}
list.forEach((item) => {}) // 仅遍历
list.map((item) => {}) // 返回构造后的新数组

// 逻辑判断
list.every((item) => {}) // 全部返回 true 则函数返回 true
list.some((item) => {}) // 有一项返回 true, 则函数返回 true, 内部 或 关系

// 过滤
list.filter((item) => {}) // 返回过滤后的新数组

// 查找
list.indexOf() // 第一个找到的位置，否则为 -1
list.lastIndexOf() // 最后一个找到的位置，否则为 -1
list.includes() // 接受一个参数，如果数组有目标值，则返回 true
list.find() // 如果找到目标值，返回目标值，否则返回 undefined
list.findIndex() // 如果找到目标值，返回下标，否则返回 -1

// 拼接
var arr = [1, 2, 3]
arr.join('-') // 1-2-3

// 新增
arr.unshift(1) // 添加到数组头部
arr.push(4) // 添加到数组尾部
arr.splice(0, 0, 1) // 第一个入参是起始的索引值，第二个入参表示从起始索引开始需要删除的元素个数。 [1,1,2,3]

// 删除
const res = arr.shift() // 原[2,3] res为1 删除数组头部的元素，返回删除的元素
arr.pop() // 删除数组尾部的元素
arr.splice(1, 1) // [1,3] 删除数组任意位置的元素，返回的是删除的数组元素

// 排序
/**
 * 如果返回值小于 0，则 a 会被排在 b 之前。
 * 如果返回值等于 0，则 a 和 b 的相对顺序不变。
 * 如果返回值大于 0，则 a 会被排在 b 之后。
 * a 和 b 是数组中任意两个元素
 */
arr.sort((a, b) => a - b)
arr.reverse() // 倒序

// 合并 concat
const arr1 = [1, 2, 3]
const res = arr1.concat([4, 5]) // [1,2,3,4,5] 原数组不变，返回一个新数组

// 截取 slice 返回从原数组中指定开始下标到结束下标之间的项组成的新数组
const arr = [1, 2, 3, 4, 5]
const res = arr.slice(1) // [2,3,4,5] 在只有一个参数的情况下，返回从该参数指定位置开始到当前数组末尾的所有项。
const res = arr.slice(1, 3) // [2,3] 如果有两个参数，该方法返回起始和结束位置之间的项，但不包括结束位置的项。
const res = arr.slice(1, -2) // [2,3] 当出现负数时，将负数加上数组长度的值（5）来替换该位置的数，相当于 arr.slice(1,3)

// 填充
arr.fill(1) // 会覆盖原数组，全部填充为1
```

### 字符串

```js
const str = 'hello world'
// 指定元素下标
const res = str.charAt(1) // e

// 查找
const res = str.indexOf('l') // 2 未找到返回 -1
const res = str.includes('l') // true 判断字符串是否包含指定的子字符串
const res = str.startsWith('l') // false 判断字符串是否以指定的子字符串开头
const res = str.endsWith('l')

// 连接
const res = str.concat('!', 1) // hello world!1

// 字符串切割成数组
const res = str.split(' ') // [ 'hello', 'world' ]
const res = str.split('', 4) // [ 'h', 'e', 'l', 'l' ] 将前4个字符进行切割
const res = str.split(' ').join('-') // hello-world

// 截取
const res = str.slice(1, 2) // e 开始下标，结束下标（不包括结束处的字符）
const res = str.substr(1, 2) // el 在字符串中抽取从开始下标开始的指定数目的字符
const res = str.substring(1, 2) // e 和 slice 一样

// 替换
const res = str.replace('l', 'L') // heLlo world 字符串替换，它只替换第一个匹配子串

// 移除空白
str.trim()
str.trimStart()
str.trimEnd()

// 字符串转数字
const str = '123.45'
const num1 = parseInt(str, [进制]) // 123 解析一个字符串，并返回一个整数
const num2 = parseFloat(str) // 123.45 解析一个字符串，并返回一个浮点数
```

## 问题 23：如何遍历对象

```js
// for in
const obj = { a: 1, b: 2, c: 3 }
for (let key in obj) {
  console.log(key, obj[key])
}

// Object.keys
const obj = { a: 1, b: 2, c: 3 }
const keys = Object.keys(obj)
keys.forEach((key) => {
  console.log(key, obj[key])
})

// Object.entries
const obj = { a: 1, b: 2, c: 3 }
const entries = Object.entries(obj) // [ ['a', 1], ['b', 2], ['c', 3] ]
entries.forEach(([key, value]) => {
  console.log(key, value)
})

// Reflect.ownKeys
const obj = { a: 1, b: 2, c: 3 }
Reflect.ownKeys(obj).forEach((key) => {
  console.log(key, obj[key])
})
```

## 问题 24：创建对象的方式

- 对象字面量：使用大括号 `{}` 创建对象，可以在大括号内定义对象的属性和方法。

```js
var person = {
  name: 'Alice',
  age: 30,
  sayHello: function () {
    console.log('Hello!')
  }
}
```

- 构造函数（Constructor Function）：使用构造函数创建对象，通过 new 关键字调用以创建对象。

```js
function Person(name, age) {
  this.name = name
  this.age = age
}

var person1 = new Person('Alice', 30)
```

- Object.create() 方法：使用 Object.create() 方法创建对象，可以指定对象的原型。

```js
var person = Object.create(null) // 创建一个空对象
person.name = 'Alice'
person.age = 30
```

- 类（ES6 中引入的类）：使用类定义对象，类是一种对象构造器的语法糖。

```js
class Person {
  constructor(name, age) {
    this.name = name
    this.age = age
  }
}

var person1 = new Person('Alice', 30)
```

## 问题 25：什么是作用域链

作用域链是 JavaScript 中用于查找变量的一种机制，它是由一系列嵌套的作用域对象构成的链式结构。每个作用域对象包含了在该作用域中声明的变量以及对外部作用域的引用，目的是确定在给定的执行上下文中如何查找变量。当您引用一个变量时，JavaScript 引擎会首先在当前作用域对象中查找该变量。如果找不到，它会沿着作用域链向上查找，直到找到该变量或达到全局作用域。如果变量在全局作用域中也找不到，将抛出一个引用错误。

**作用域链的形成方法**：

1. 在函数内部，会创建一个新的作用域对象，包含了函数的参数、局部变量以及对外部作用域的引用。
2. 如果在函数内部嵌套了其他函数，那么每个内部函数都会创建自己的作用域对象，形成一个链。
3. 这个链条会一直延伸到全局作用域。

## 问题 26：作用域链如何延长

**闭包**

闭包可以延长作用域链，使得函数内部的变量在函数执行完毕后仍然可以被访问。

```js
function makeCounter() {
  var count = 0
  return function () {
    count++
    return count
  }
}

var counter1 = makeCounter()
var counter2 = makeCounter()

console.log(counter1()) // 1
console.log(counter1()) // 2
console.log(counter2()) // 1，每个 counter 具有自己的作用域链，且都延长了 count 的作用域
```

## 问题 27：事件冒泡和事件捕获的区别，如何阻止？

**事件冒泡（Bubbling）**

- 事件从触发事件的目标元素开始，逐级向上冒泡到 DOM 树的根节点。
- 首先执行目标元素上的事件处理程序，然后是父元素，再是更高层次的祖先元素。
- 事件冒泡是默认的事件传播方式。

**事件捕获（Capturing）**

- 事件从 DOM 树的根节点开始，逐级向下捕获到触发事件的目标元素。
- 首先执行根节点上的事件处理程序，然后是子元素，再是更低层次的子孙元素。
- 事件捕获通常需要显式启用，通过 `addEventListener` 的第三个参数设置为 `true` 来启用事件捕获。

**应用**

- `addEventListener` 第三个参数：`true` 为捕获，`false` 为冒泡，默认 `false`
- `event.stopPropagation()` 阻止冒泡

## 问题 28：事件委托

事件委托是一种常见的 JavaScript 编程技巧，它的核心思想是将事件处理程序附加到一个祖先元素上，而不是直接附加到每个子元素上，当事件在子元素上冒泡时，祖先元素捕获事件并根据事件目标来确定如何处理事件。

- **性能优势**：事件委托可以减少事件处理程序的数量，特别是在大型文档中，因为您只需为一个祖先元素添加一个事件处理程序。这降低了内存消耗和提高了性能，因为不必为每个子元素都绑定事件。
- **动态元素**：事件委托适用于动态生成的元素，因为无需为新添加的元素单独绑定事件，而是在祖先元素上继续使用相同的事件处理程序。
- **代码简洁性**：通过将事件处理逻辑集中在祖先元素上，代码更加简洁和可维护，因为您不需要为每个子元素编写相似的事件处理代码。
- **处理多个事件类型**：通过在祖先元素上处理多个事件类型，可以实现更多的灵活性。例如，您可以在祖先元素上处理点击事件、鼠标移动事件和键盘事件，而不必为每个事件类型创建单独的事件处理程序。

示例：假设您有一个无序列表（`<ul>`）中的多个列表项（`<li>`），您希望在点击任何列表项时执行某些操作。您可以使用事件委托来处理这些点击事件，而不必为每个列表项单独添加事件处理程序。

```js
const ulElement = document.querySelector('ul')
ulElement.addEventListener('click', function (event) {
  if (event.target.tagName === 'LI') {
    // 在这里执行点击列表项时的操作console.log("点击了列表项: " + event.target.textContent);
  }
})
```

在上述示例中，事件委托将点击事件处理程序附加到了 `<ul>` 元素上，并使用 event.target 来确定被点击的列表项。这种方法使得单个事件处理程序能够处理整个列表的点击事件。

## 问题 29：链式调用实现方式

### ES6 class 类实现

链式调用是通过在对象的方法中返回对象自身（this）来实现的。可使多个方法调用连续写在一起，形成链式调用。

```js {7,11,15,19,22}
class Calculator {
  constructor(num) {
    this.value = num
  }
  add(num) {
    this.value += num
    return this // 返回自身，以实现链式调用
  }
  subtract(num) {
    this.value -= num
    return this
  }
  multiply(num) {
    this.value *= num
    return this
  }
  divide(num) {
    this.value /= num
    return this
  }
  getValue() {
    return this.value
  }
}
const calculator = new Calculator(10)
  .add(5)
  .subtract(2)
  .multiply(3)
  .divide(4)
  .getValue()
console.log(calculator) // 输出 9.75
```

### Proxy 实现

```js
function increase(num) {
  return num + 1
}

function decrease(num) {
  return num - 1
}

function double(num) {
  return num * 2
}

/**
 * 要求：
 * 1. 实现 chain 方法，可以链式调用
 * 2. 调用 end 结束调用，返回最终结果
 */
function chain(value) {}

console.log(chain(3).increase.decrease.double.end)
```

**解析：**

```js
function increase(num) {
  return num + 1
}

function decrease(num) {
  return num - 1
}

function double(num) {
  return num * 2
}

/**
 * 要求：
 * 1. 实现 chain 方法，可以链式调用
 * 2. 调用 end 结束调用，返回最终结果
 */
function chain(value) {
  const handler = {
    get(target, key) {
      // target：为代理对象，这里为 {value: xxx}；key：为变化 / 访问的值
      if (key === 'end') {
        return target.value
      }
      if (window[key] instanceof Function) {
        target.value = window[key](target.value)
        return proxy
      }
    }
  }
  const proxy = new Proxy({ value }, handler)
  return proxy
}

console.log(chain(3).increase.decrease.double.end)
```

## 问题 30：for-in 和 for-of

**for-in**：遍历对象的可枚举属性（包括原型链上的属性）。

```js
const obj = { a: 1, b: 2, c: 3 }
for (let key in obj) {
  console.log(key) // 输出 "a", "b", "c"
}
```

**for-of**：遍历可迭代对象（如数组、字符串、Map、Set 等）的值。

```js
const arr = [1, 2, 3]
for (let value of arr) {
  console.log(value) // 输出 1, 2, 3
}

const map = [
  ['a', 1],
  ['b', 2]
]
for (let [key, value] of map) {
  console.log(key, value) // 输出 "a" 1, "b" 2
}
```

**总结**：

- 如果你需要遍历对象的键（属性名），使用 for-in。
- 如果你需要遍历可迭代对象的值，使用 for-of。
- 对于数组，推荐使用 for-of 或者 forEach，避免使用 for-in，以防止意外遍历到非索引属性。

## 问题 31：上下文 与 this 的指向问题

`this` 的指向取决于函数如何调用

```js
function fn() {
  console.log(this)
}

function Person() {
  this.name = 'wifi'
}

上面的两个例子 `this` 都不知道指向谁，因为没有被调用
```

| 调用方式              | 示例                     | 函数中的 this 指向                                      |
| :-------------------- | :----------------------- | :------------------------------------------------------ |
| 直接调用              | `method()`               | 全局对象（window/global）（严格模式下，是 `undefined`） |
| 作为对象的方法调用    | `obj.method()`           | 对象本身                                                |
| 作为构造函数(new)调用 | `const p = new Person()` | 构造函数的实例对象(p)                                   |
| call、apply、bind     | `method.call(ctx)`       | 第一个参数                                              |
| 箭头函数              | `() => {}`               | 箭头函数的词法作用域（指向外层最近作用域的 this）       |

> ⚠️ 注意：箭头函数的 `this` 是由定义时的作用域决定的，而不是由调用方式决定的。（即使使用 `call`、`apply` 也不能改变 this 指向，但是他可以**继承**外层作用域的 this【具体可以参考下面例 2 的`person1.foo4.call(person2)()`】）。

::: tip 执行上下文 ctx

> 执行上下文可以理解是 JavaScript 代码执行的环境

JavaScript 的运行环境分为三种:

1. **全局环境**：全局环境是指 JS 执行的默认环境，如果是在浏览器的环境，那就会创建一个 window 对象，node 环境中会创建一个 global 对象。
2. **函数环境**：当函数被调用时会创建对应的上下文环境，会进入当前函数中执行代码，并且每次执行函数都会创建对应的执行环境，
3. **eval 环境**：JavaScript 中的 eval 函数执行内部代码创建的上下文环境，但是这个不推荐使用，具体可以查看 eval 作用。

JS 中用 `栈` 的方式来管理执行上下文，遵循“先进后出，后进先出”的顺序。一个 JavaScript 程序在运行的过程中，会产生多个执行上下文，其中`有且只有一个是全局执行上下文`。

:::

#### 例 1：

```js
// 通过 globalThis 可以获取全局对象（内置的）
globalThis.a = 100
function fn() {
  console.log(this, 'fn this') // window，this指向全局对象
  return {
    a: 200,
    m: function () {
      console.log(this.a)
    },
    n: () => {
      console.log(this.a) // 外层作用域this => window
    },
    k: function () {
      return function () {
        console.log(this.a)
      }
    },
    l: function () {
      return () => {
        console.log(this.a) // 外层作用域this => window
      }
    }
  }
}

const fn0 = fn()
fn0.m() // 200，this指向当前对象
fn0.n() // 100，this指向全局对象
fn0.k()() /** 100
因为：第一次调用 fn0.k() 返回了一个匿名函数。
    第二次调用 () 执行这个匿名函数，**此时没有通过对象或方法调用来改变 this 的指向，所以 this 指向全局对象**。
*/
fn0.l()() // 200，指向外层作用域 this为当前对象，所以箭头函数this指向当前对象

const context = { a: 300 }
const fn1 = fn.call(context)
fn1.m() // 输出：200，this指向调用他的对象，{a,m,n}
fn1.n() // 输出：300，this指向外层，也就是 context 对象
fn1.k().call(context) // 输出：300，this指向 context 对象
```

#### 例 2：

```js
var name = 'globalName'

const person1 = {
  name: 'person1',
  age: 18,
  foo1: function () {
    console.log(this.name)
  },
  foo2: () => {
    console.log(this.name)
  },
  foo3: function () {
    return function () {
      console.log(this.name)
    }
  },
  foo4: function () {
    console.log(this)
    return () => {
      console.log(this.name)
    }
  }
}

const person2 = {
  name: 'person2'
}

person1.foo1()
person1.foo1.call(person2)

person1.foo2()
person1.foo2.call(person2)

person1.foo3()()
person1.foo3.call(person2)()

person1.foo4()()
person1.foo4.call(person2)()
```

**解析：**

```js
var name = 'globalName'

const person1 = {
  name: 'person1',
  age: 18,
  foo1: function () {
    console.log(this.name)
  },
  foo2: () => {
    console.log(this.name)
  },
  foo3: function () {
    return function () {
      console.log(this.name)
    }
  },
  foo4: function () {
    console.log(this)
    return () => {
      console.log(this.name)
    }
  }
}

const person2 = {
  name: 'person2'
}

person1.foo1() // 输出：person1，this指向person1
person1.foo1.call(person2) // 输出：person2，this指向person2（不会继承到person1的age属性）

person1.foo2() // 输出：globalName，this指向全局对象，即window
person1.foo2.call(person2) // 输出：globalName，箭头函数的this是定义时决定的，call和apply不能改变它的this指向

person1.foo3()() // 输出：globalName，相当于函数的直接调用，this指向全局
person1.foo3.call(person2)() /**
 * 输出：globalName
 * 
person1.foo3.call(person2)()
可以理解为：
const fn = person1.foo3.call(person2)
fn() // fn是全局window调用的，所以this指向全局
*/

person1.foo4()() // 输出：person1，箭头函数this指向外层的this，外层this是person1
person1.foo4.call(person2)() // 输出：person2，箭头函数this【继承】外层的this，外层的this通过call指向了person2
```

#### 例 3：

```js
let length = 10

function fn() {
  return this.length + 1
}

const obj = {
  length: 5,
  test1: function () {
    return fn()
  }
}

obj.test2 = fn

console.log(obj.test1())
console.log(obj.test2())
```

**解析：**

```js
let length = 10

function fn() {
  return this.length + 1
}

const obj = {
  length: 5,
  test1: function () {
    return fn()
  }
}

obj.test2 = fn

// window.length 返回窗口中框架的数量（包括 iframe 元素），没有为0
console.log(obj.test1()) // 1，test1的this指向obj，此时没有通过对象或方法调用来改变 this 的指向，所以 this 指向全局对象
console.log(obj.test2()) // 6，obj.test2调用fn，this指向为obj
```

## 问题 32：call、apply、bind

### call

- 作用：立即调用函数，并指定函数内部的 this 指向。
- 语法：`fn.call(thisArg, arg1, arg2, ...)`
- 特点：
  - 第一个参数是函数执行时的 `this` 值。
  - 后面的参数是传递给函数的具体参数，按顺序传入。

::: tip 本质

`函数.call(xxx, arg1, arg2, ...)` => `xxx.函数(arg1, arg2, ...)`

:::

```js
function greet(name, age) {
  console.log(name, age)
  console.log(this, 'greet this')
}

function Person(name) {
  this.name = name
}
const person = new Person('Alice')

/**
 * call
 * 参数1：thisArg，指定函数执行时的 this 值，这里指向 person
 * 剩余参数：传递给 greet函数 的具体参数，按顺序传入。
 */
greet.call(person, 'Bob', 30)
```

### 手写`call`方法

> 注意：`call` 方法的第一个参数 `this`，需要的是一个对象，如果不是，this 就是一个包装对象，例如：`call(123)`，会自动包装成对象，即 `call(Number(123))`，`null` 和 `undefined` 会指向`全局`。

```js
// `call` 写在函数原型上
Function.prototype.myCall = function (ctx, ...args) {
  ctx = ctx || window // 默认为window
  const key = Symbol() // 创建一个唯一键，避免属性名冲突
  ctx[key] = this // 在上下文中添加一个属性，将函数赋值给这个属性（通过 this 获取到 greet 函数）
  const result = ctx[key](...args) // 执行函数（cxt上下文调用后，函数的this就指向ctx）
  delete ctx[key] // 删除属性
  return result
}

function greet(name) {
  console.log(name)
  console.log(this)
}
const person = {
  name: 'Alice'
}
greet.myCall(person, 'wifi')

/**
 * - myCall的this指向？
 *    myCall 是由 greet 调用的，所以 myCall 的 this 指向 greet。
举例：
function greet(name) {}

greet.hello = function() {
  // this结果：[Function: greet] { hello: [Function (anonymous)] }
  console.log(this);
}

greet.hello()
 */
```

### apply

- 作用：立即调用函数，并指定函数内部的 this 指向。
- 语法：`fn.apply(thisArg, [argsArray])`
- 特点：
  - 第一个参数是函数执行时的 `this` 值。
  - 第二个参数是一个数组或类数组对象，作为参数列表传递给函数。

```js
function greet(name, age) {
  console.log(name, age)
  console.log(this, 'greet this')
}

function Person(name) {
  this.name = name
}
const person = new Person('Alice')

/**
 * apply
 * 参数1：thisArg，指定函数执行时的 this 值，这里指向 person
 * 参数2：数组，将数组的每一项按顺序传递给 greet函数。
 */
greet.apply(person, ['wifi', 30])
```

> `apply` 和 `call` 的区别：
>
> - 都是<u>立即调用函数，并指定函数内部的 this 指向。</u>
>
> - `call` 方法接受一个参数列表，而 `apply` 方法接受一个数组作为参数。

### 手写`apply`方法

```js
Function.prototype.myApply = function (ctx, args) {
  ctx = ctx || window // 默认为window
  const key = Symbol() // 创建一个唯一键，避免属性名冲突
  ctx[key] = this // 在上下文中添加一个属性，将函数赋值给这个属性
  const result = ctx[key](...args) // 执行函数
  delete ctx[key] // 删除属性
  return result
}
```

### bind

- 作用：创建一个新的函数，新函数在被调用时，会将 `this` 设置为 bind 的第一个参数。
- 语法：`fn.bind(thisArg, arg1, arg2, ...)`
- 特点：
  - <u>返回一个新的函数，不会立即执行</u>。
  - 可以提前绑定部分参数（柯里化）。

```js
function greet(name, age) {
  console.log(name, age)
  console.log(this)
}

function Person(name) {
  this.name = name
}
const person = new Person('Alice')

// greet 函数的 this 指向 person
const greetBind = greet.bind(person)
greetBind('Alice', 18)

// 柯里化写法
greet.bind(person)('Alice', 18)
```

### 手写`bind`方法

```js
Function.prototype.myBind = function (ctx, ...args) {
  const fn = this
  return function (...newArgs) {
    fn.apply(ctx, [...args, ...newArgs])
    // fn.call(ctx, ...args, ...newArgs)
  }
}
```

### 总结

- `call` 和 `apply` 都是<u>立即调用函数</u>，并且可以指定 this，区别在于参数传递方式不同。
- `bind` <u>返回一个新函数，不会立即执行</u>，适合用于绑定 this 或部分参数。

## 问题 33：原型链和原型对象

### 原型对象 prototype

```js
function test(name) {
  this.name = name
}
console.log(test.prototype)
```

`prototype` 是**函数**的一个属性（每个函数都有一个 `prototype` 属性），这个属性是一个对象，叫做 `原型对象`。当我们创建函数的时候，会默认添加 `prototype` 属性。

> 这个 `原型对象` 上有一个 `constructor` 属性，指向构造函数（test）本身。因此，test.prototype.constructor 等于 test。

例如：

```js
function test(name) {
  this.name = name
}

console.log('test.prototype🌍', test.prototype)
console.log('test🌍', test)
console.log('test.prototype.constructor🌍', test.prototype.constructor)
```

<img src="./img/原型constructor.png" alt="原型constructor" style="zoom:50%;" />

### 隐式原型 `__proto__`

`__proto__` 是**实例对象**的一个属性，叫做 `隐式原型`。`__proto__` 指向构造函数的 `prototype`（也就是 `A.prototype === a.__proto__`）。

### 原型链

原型对象也是对象，也有**proto**属性，像这样一层一层往上的结构就是原型链，最顶层为 null（`Object.prototype.__proto__ === null`），返回值是 undefined

原型链顶层为 `null`（`Object.prototype.__proto__ === null`）

```js
function test(name) {
  this.name = name
}

const obj = new test('wifi')
console.log(obj.__proto__ === test.prototype) // true
console.log(test.prototype.__proto__ === Object.prototype) // true
console.log(Object.prototype.__proto__) // null

/**
 * obj {
 *      __proto__: test.prototype = {
 *          __proto__: Object.prototype = {
 *              __proto__: null
 *          }
 *      }
 * }
 */
```

### 原型链的查找规则

先在当前对象上查找，如果找到了就返回。原型链顶层为 `null`（`Object.prototype.__proto__`），找不到则返回 `undefined`。

![原型链](./img/原型链.png)

### 原型中，对象遍历的一些问题

```js
function test(name) {
  this.name = name
}

const obj = new test('wifi')
obj.a = 1
test.prototype.b = 2
Object.prototype.c = 3
/**
 * 原型链
 * obj {
 *      a: 1
 *      __proto__: test.prototype = {
 *          b: 2
 *          __proto__: Object.prototype = {
 *              c: 3
 *              __proto__: null
 *          }
 *      }
 * }
 */

for (const key in obj) {
  console.log(key) // name a b c
}
```

这个时候，遍历出来的 `key`，会遍历到原型对象里面的属性，解决方法如下：

```js
// 方法1
Object.keys(obj).forEach((key) => {
  console.log(key) // name a
})

// 方法2
for (const key in obj) {
  // 判断属性是否存在于自身，而不是在原型对象上
  if (obj.hasOwnProperty(key)) {
    console.log(key) // name a
  }
}
```

### 原型链实战

```js
const Foo = function () {
  this.a = function () {
    console.log(1)
  }
}

Foo.prototype.a = function () {
  console.log(2)
}

Foo.a = function () {
  console.log(3)
}

let foo = new Foo()
foo.a()
```

输出：1

解析：

在 `foo` 访问属性的时候，优先会访问自身属性，如果自身没有，就会访问原型属性。

> 这里需要注意函数的`静态方法`。静态方法，是通过 `Foo.a()` 直接调用执行的

```js
const Foo = function () {
  this.a = function () {
    // this 指向 foo，所以 foo.a 就是自身的方法
    console.log(1)
  }
}

Foo.prototype.a = function () {
  // 方法在Foo的原型上
  console.log(2)
}

Foo.a = function () {
  // 静态方法，是通过 `Foo.a()` 直接调用执行的
  console.log(3)
}

let foo = new Foo()
foo.a() // 输出：1
```

## 问题 34：继承

### ES6 类继承

使用 `class` 和 `extends` 关键字，实现继承。

```js
class Animal {
  constructor(name) {
    this.name = name
  }
}

class Dog extends Animal {
  constructor(name, age) {
    // super 调用父类的构造函数
    super(name)
    this.age = age
  }
}
```

### 原型链继承

> 在子类的原型上，添加父类的实例，实现继承。`Dog.prototype = new Animal('dog')`

```js
function Animal(name) {
  this.name = name
}

Animal.prototype.say = function () {
  console.log('Animal say: ', this.name)
}

function Dog(age) {
  this.age = age
}

Dog.prototype = new Animal('dog')
const myDog = new Dog(2)
myDog.say() // Animal say: dog
```

### 构造函数继承

```js
function Animal(name) {
  this.name = name
}

function Dog(name, age) {
  Animal.call(this, name) // 使用构造函数继承，继承属性
  // Animal.bind(this, name)()
  this.age = age
}

let myDog = new Dog('旺财', 2)
console.log(myDog) // Dog { name: '旺财', age: 2 }
```

`Dog` 构造函数内部调用了 `Animal` 构造函数，继承了 `Animal` 的属性和方法。

## 问题 35：new 操作符

`new` 一般用于实例化构造函数、类，实例化后返回的是一个对象。

```js
function Test(name) {
  this.name = name
}

// 追加方法
Test.prototype.getName = function () {
  return this.name
}

let test = new Test('test') // Test { name: 'test' }
```

### new 操作符做了什么

1. 创建了一个空对象（因为实例化后返回的是个对象）
2. 将空对象的原型，指向于构造函数的原型（`obj.__proto__ = Obj.prototype`）

```js
// 在 Test 构造函数上能添加原型方法，所以需要改变（空）对象的原型
// obj.__proto__ = Obj.prototype（建立原型链联系）
Test.prototype.getName = function () {
  return this.name
}
```

3. 将空对象作为构造函数的上下文（就是改变 this 的指向）

> 第 2 步改变原型后，this 指向会发生变化（这里 this 在浏览器中是 window）

4. 对构造函数有返回值的处理判断（如果构造函数返回值是基本类型，就忽略返回值；如果是引用类型，则使用该返回值）

```js
function Foo() {
  this.name = 'wifi'
  return {}
}
console.log(new Foo()) // {}

function Foo2() {
  this.name = 'wifi'
  return 123
}
console.log(new Foo2()) // {name: "wifi"}
```

### 手写 new 操作符

```js
function Person(name, age) {
  this.name = name
  this.age = age
}

function myNew(constructor, ...args) {
  /**
   * 1. 创建了一个空对象
   * const obj = {}
   * 2. 将空对象的原型，指向于构造函数的原型（`obj.__proto__ = Obj.prototype`）
   * obj.__proto__ = constructor.prototype
   */
  // Object.create() 静态方法以一个现有对象作为原型，创建一个新对象。
  const obj = Object.create(constructor.prototype)
  // 3. 将空对象作为构造函数的上下文（就是改变this的指向）
  const result = constructor.apply(obj, args)
  // 4. 对构造函数有返回值的处理判断（如果构造函数返回值是基本类型，就忽略返回值；如果是引用类型，则使用该返回值）
  return result instanceof Object ? result : obj
}

const p = myNew(Person, 'wifi', 18)
console.log(p)
```

### 为什么箭头函数不能使用 new 关键字的？

- **没有自身的 this 绑定**：箭头函数没有自己独立的 this 值，它的 this 是继承自外层作用域的。而 new 操作符在执行时需要一个独立的 this 来指向新创建的对象，箭头函数无法满足这一要求。

- **没有 prototype 属性**：每个函数在创建时都会有一个 prototype 属性，用于设置和访问对象的原型。new 操作符会利用这个 prototype 属性来为新创建的对象设置原型链。但箭头函数没有 prototype 属性，所以不能通过 new 来创建对象并设置原型链。

- **不可被构造**：箭头函数没有 constructor，而 new 操作符在执行过程中会调用构造函数的 constructor 来创建新对象，由于箭头函数不存在 constructor，因此无法使用 new 来调用。（原型链部分有讲）

## 问题 36：call 和 apply 的链式调用

> 考察：原型和原型链

```js
const r = console.log.call.call.call.call.call.call.call.call.apply(
  (a) => a,
  [1, 2]
)
```

解析：

```js
/**
console.log.__proto__ === Function.prototype // console 是一个对象，log方法是对象上的属性
console.log.call === Function.prototype.call // log是一个函数，函数有 call 方法
console.log.call.call === Function.prototype.call
 */
const r = console.log.call.call.call.call.call.call.call.call.apply(
  (a) => a,
  [1, 2]
)

// r可以转成：
const r1 = Function.prototype.call.apply((a) => a, [1, 2])
/**
 * Function.prototype.call也是一个函数
 * 函数.apply(xxx, [...args]) => xxx.函数(...args) ，函数为call
 * (a) => a => xxx
 */
// r1可以转成：
const fn = (a) => a
const r2 = fn.call(1, 2)

console.log(r2) // 2
```

## 问题 37：Symbol 特性与作用

1. **唯一性**：每个 Symbol 值都是唯一的，即使它们具有相同的描述字符串，它们也不相等。

2. **不可枚举**：Symbol 类型的属性通常是不可枚举的，这意味着它们不会出现在 `for...in` 循环中。

3. **用作属性名**：主要用途是作为对象属性的键，以确保属性的唯一性。

```js
const mySymbol = Symbol('mySymbol')
const obj = {
  [mySymbol]: '这是Symbol作为属性名的值'
}
```

4. **Symbol 常量**：在代码中，可以使用 Symbol 来定义常量，以避免意外的值修改。

```js
const COLOR_RED = Symbol('red')
const COLOR_GREEN = Symbol('green')
```

## 问题 38：JS 监听对象属性的改变

- **Object.defineProperty**

```js
const person = {
  _firstName: 'John', // _xxx 表示使用私有变量存储实际值
  _lastName: 'Doe'
}

// 监听属性 "firstName"
Object.defineProperty(person, 'firstName', {
  get() {
    return this._firstName
  },
  set(value) {
    this._firstName = value
    console.log(`firstName 改变为: ${value}`)
  },
  configurable: true // 允许属性重新定义
})

// 修改属性 "firstName" 会触发监听
person.firstName = 'Alice' // 输出："firstName 改变为: Alice"
```

- **Proxy**

```js
const person = {
  firstName: 'John',
  lastName: 'Doe'
}

const handler = {
  /**
   * target： 被代理的对象
   * property： 访问的属性名
   * value： 设置的值
   */
  get(target, property) {
    console.log(`访问了属性 ${property}`)
    return target[property]
  },
  set(target, property, value) {
    console.log(`设置属性 ${property} 为 ${value}`)
    target[property] = value
    return true
  }
}

const proxyPerson = new Proxy(person, handler)
console.log(proxyPerson.firstName) // 输出: "访问了属性 firstName", 然后输出 "John"
proxyPerson.lastName = 'Smith' // 输出: "设置属性 lastName 为 Smith"
```

## 问题 39：要执行 100 万个任务，如何优化?

- 分段处理
- webworker 并行处理（核心）

### requestIdleCallback

在 `requestIdleCallback` 中，浏览器会等待主线程空闲的时间，然后执行部分任务。

```js
const total = 1000 // 定义需要生成的函数数量，即1000个任务
const arr = [] // 存储任务函数的数组

// 生成1000个函数并将其添加到数组中
function generateArr() {
  for (let i = 0; i < total; i++) {
    // 每个函数的作用是将一个 <div> 元素插入到页面的 body 中
    arr.push(function () {
      document.body.innerHTML += `<div>${i + 1}</div>` // 将当前索引 + 1 作为内容
    })
  }
}
generateArr() // 调用函数生成任务数组

// 用于调度和执行任务的函数
function workLoop(deadline) {
  // 检查当前空闲时间是否大于1毫秒，并且任务数组中还有任务未执行
  if (deadline.timeRemaining() > 1 && arr.length > 0) {
    const fn = arr.shift() // 从任务数组中取出第一个函数
    fn() // 执行该函数，即插入对应的 <div> 元素到页面中
  }
  // 再次使用 requestIdleCallback 调度下一个空闲时间执行任务
  requestIdleCallback(workLoop)
}

// 开始调度任务，在浏览器空闲时执行 workLoop
requestIdleCallback(workLoop, { timeout: 1000 })
```

### setTimeout

分段执行，每次执行一小部分

### webworker

::: tip 什么时候使用 webworker

1. 需要执行大量计算（例如：大文件分片算 md5
2. 任务可以被独立拆分

:::

> ⚠️ 注意：webworker 不能使用 DOM 操作。

```html
<!DOCTYPE html>
<html>
  <head>
    <title></title>
    <meta charset="utf-8" />
    <style type="text/css">
      .circle {
        width: 300px;
        height: 300px;
        background-color: blue;
        border-radius: 50%;
        position: absolute;
        animation: moveRightLeft 2s infinite alternate;
      }
      @keyframes moveRightLeft {
        from {
          left: 100px;
        }
        to {
          left: 800px;
        }
      }
    </style>
    <script type="text/javascript">
      const worker = new Worker('./worker.js')
      worker.onmessage = function (res) {
        console.log('length: ', res.data)
      }
      setTimeout(() => {
        worker.postMessage({})
      }, 1000)
    </script>
  </head>
  <body>
    <div class="circle"></div>
  </body>
</html>
```

```js
// worker.js
self.onmessage = function (req) {
  const list = []
  for (let i = 0; i < 100000000; ++i) {
    list.push(Date.now())
  }
  self.postMessage(list.length)
}
```

## 问题 40：后端响应巨量数据，如何避免其性能问题？

会造成的性能问题有：

- 网络性能
  1.  少传数据（例如：分页）
  2.  流式获取数据
- 渲染性能
  1.  分页
  2.  虚拟滚动

## 问题 41：为什么 0.1 + 0.2 不等于 0.3？

![0.1+0.2](./img/0.1+0.2.png)

因为 js 存储 number 是双精度浮点数存储，浮点数在计算机中无法精确表示。

**解决方法：**

```js
// 方法1
const num = (0.1 * 100 + 0.2 * 100) / 100
// 方法2
const num = (0.1 + 0.2).toFixed(1)
```

## 问题 42：插件化（微内核）

```js
class Doc {
  constructor() {
    this.plugins = []
  }

  use(plugin) {
    this.plugins.push(plugin)
  }

  run() {
    this.plugins.forEach((plugin) => {
      plugin.fn(this) // this => doc构造函数
    })
  }
}

const doc = new Doc()

// 定义插件协议
const textPlugin = {
  name: 'text',
  fn(doc) {
    console.log(doc, 'text')
    return 'text'
  }
}
const imagePlugin = {
  name: 'image',
  fn(doc) {
    console.log(doc, 'image')
    return 'image'
  }
}

doc.use(textPlugin)
doc.use(imagePlugin)

doc.run()
```

## 问题 43：为什么 setTimeout(setInterval)不精确？如何解决？

**为什么不精确？**

1. js 是单线程的，执行任务需要先等待同步任务、微任务执行完成后，才会执行延时任务。
2. 在嵌套超过 5 层，如果设置的 timeout 小于 4ms，则会强制将其设置为 4ms，即会导致至少 4ms 的延迟。
3. 页面失活（页面在后台）会导致不准确。

**解决办法：**

1. 使用 `performance.now()` 进行时间校准

```js
function preciseTimeout(callback, delay) {
  const start = performance.now()

  function check() {
    const elapsed = performance.now() - start
    if (elapsed >= delay) {
      callback()
    } else {
      setTimeout(check, delay - elapsed)
    }
  }

  setTimeout(check, delay)
}

// 使用示例
preciseTimeout(() => {
  console.log('This is a more precise timeout')
}, 1000)
```

2. 使用 `requestAnimationFrame` 进行微调

> 但是 `requestAnimationFrame` 只能在浏览器中运行，并且渲染帧会受电脑的性能影响。

::: code-group

```js [setTimeout]
function preciseTimeout(callback, delay) {
  const start = performance.now()

  function check(currentTime) {
    // currentTime 上一帧渲染的结束时间
    const elapsed = currentTime - start
    if (elapsed >= delay) {
      callback()
    } else {
      requestAnimationFrame(check)
    }
  }

  requestAnimationFrame(check)
}

// 使用示例
preciseTimeout(() => {
  console.log('This is a more precise timeout using requestAnimationFrame')
}, 1000)
```

```js [setInterval]
function preciseAnimation(callback, delay) {
  let lastTime = performance.now()
  function animate(timestamp) {
    const deltaTime = timestamp - lastTime // 获取当前时间和上次执行的时间差
    if (deltaTime >= delay) {
      // 每 delay 毫秒执行一次
      callback()
      lastTime = timestamp
    }
    requestAnimationFrame(animate) // 请求下一帧
  }

  requestAnimationFrame(animate)
}

// 示例：每 1s 执行一次任务
preciseAnimation(() => {
  console.log('执行任务', Date.now())
}, 1000)
```

:::

3. 使用 `Web Workers` 进行独立计时

通过将计时逻辑放在 Web Worker 中，可以减少主线程的干扰，从而提高定时器的精度。

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Precise Timeout with Web Worker</title>
  </head>
  <body>
    <script>
      const worker = new Worker('worker.js')
      worker.postMessage('start')
      worker.onmessage = function (event) {
        console.log('This is a more precise timeout using Web Worker')
      }
    </script>
  </body>
</html>
```

```js
// worker.js
self.onmessage = function () {
  setInterval(() => {
    postMessage('任务完成')
  }, 1000) // 使用 setInterval，Web Worker 中执行任务不会阻塞主线程
}
```

## 问题 44：requestAnimationFrame 和 requestIdleCallback 的区别？

### requestAnimationFrame

- **用途**：主要用于执行与页面重绘相关的任务，如动画、图形渲染等。
- **触发时机**：<u>在浏览器下次重绘之前调用回调函数</u>。它会根据显示器的刷新率（通常是 60Hz）来同步调用，确保动画平滑流畅。

```js
requestAnimationFrame((timestamp) => {
  // 时间戳参数，表示当前帧开始的时间
  console.log(timestamp)
})
```

### requestIdleCallback

- **用途**：用于执行那些可以延迟到浏览器空闲时间的任务，如非关键的 DOM 操作、数据处理等（例如：后台日志记录）。
- **触发时机**：<u>在浏览器主事件循环中没有其他更高优先级的任务时（即浏览器空闲时）调用回调函数。</u>它允许开发者在不影响用户体验的情况下执行低优先级任务。
- **执行阶段**：
  1. 处理事件的回调 click...事件
  2. 处理计时器的回调
  3. 开始帧
  4. 执行 requestAnimationFrame 动画的回调
  5. 计算机页面布局计算 合并到主线程
  6. 绘制
  7. 如果此时还有空闲时间，执行 requestIdleCallback

```js
requestIdleCallback(({ didTimeout, timeRemaining }) => {
  // didTimeout 表示是否因为超时而被调用
  // timeRemaining() 返回浏览器空闲时间剩余的毫秒数，可用于判断是否有足够的时间执行任务。
  console.log(didTimeout, timeRemaining())
})
```

### 总结：

`requestIdleCallback` 比 `requestAnimationFrame` 优先级低，利用浏览器的空闲时间来执行一些非关键任务，从而避免阻塞主线程并提高整体性能。

## 问题 45：并发请求

要求：实现 concurRequest 方法

::: code-group

```html [index.html]
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Title</title>
  </head>
  <body>
    <script>
      const baseUrl = 'http://127.0.0.1:7878/api'
      const urls = []
      for (let i = 0; i <= 20; i++) {
        urls.push(`${baseUrl}/${i}`)
      }
      // 并发请求
      concurRequest(urls, 5).then((responses) => {
        console.log(responses)
      })

      /**
       * 并发请求
       * @param urls {string[]} 待请求的url数组
       * @param maxNum {number} 最大并发数
       * @return {Promise<any[]>} 返回Promise数组，请求结果是按urls数组顺序
       */
      function concurRequest(urls, maxNum) {
        return
      }
    </script>
  </body>
</html>
```

```js [server.js]
const express = require('express')
const app = express()
const cors = require('cors')
app.use(cors())
app.get('/api/:id', (req, res) => {
  res.json({
    status: 200,
    msg: 'success',
    data: req.params.id
  })
})

app.listen(7878, () => {
  console.log('server启动成功')
})
```

:::

**解析：**

```js
/**
 * 并发请求
 * @param urls {string[]} 待请求的url数组
 * @param maxNum {number} 最大并发数
 * @return {Promise<any[]>} 返回Promise数组，请求结果是按urls数组顺序
 */
function concurRequest(urls, maxNum) {
  if (urls.length === 0) {
    return Promise.resolve([])
  }
  return new Promise((resolve) => {
    // 下一个请求下标
    let nextIndex = 0
    // 存放请求完成后的结果
    const result = []
    // 完成的请求个数
    let finishCount = 0
    // 用于单次请求
    async function _request() {
      if (nextIndex >= urls.length) {
        return
      }
      const url = urls[nextIndex]
      // 当前请求下标
      const index = nextIndex
      nextIndex++
      const response = await fetch(url)
      console.log(response)
      result[index] = response
      finishCount++
      if (finishCount === urls.length) {
        resolve(result)
      }
      // 当前请求结束，进入另一个请求补位
      _request()
    }

    for (let i = 0; i < Math.min(maxNum, urls.length); i++) {
      _request()
    }
  })
}
```

## 问题 46：死循环 和 无限递归 会导致什么后果？

### 死循环

会导致主线程长期被占用，浏览器无法响应页面刷新和用户的交互，**会导致无响应**。（不会导致内存溢出）

**例 1：**

```js
while (1) {
  console.log(1)
}
```

> 页面卡死，主线程被占用

**例 2：**

```js
while (1) {
  await 1
}
```

> 页面卡死。`await 1` 相当于 `await Promise.resolve(1)`，会放入微队列，<u>因为微队列优先级很高，浏览器渲染帧也会让微任务先执行</u>，所以也会导致页面卡死

**例 3：**

```js
function delay(duration = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

while (1) {
  await delay(0)
}
```

> 页面不会卡死。因为定时器在延时队列，优先级很低

### 无限递归

会导致主线程栈溢出，但不会无响应，因为浏览器或 node 环境有最大栈数量的限制，超出会报错。

**例 1：**

```js
function m() {
  m()
}
m()
```

> 栈溢出，报错

**例 2：**

```js
function m() {
  await 1
  m()
}
m()
```

> 不会导致栈溢出（因为有等待），但会导致浏览器卡死（因为：微任务优先级比渲染帧高）

**例 3：**

```js
function delay(duration = 1000) {
  return new Promise((resolve) => {
    setTimeout(resolve, duration)
  })
}

function m() {
  await delay(0)
  m()
}
m()

// 解析：m函数 相当于转变为如下内容：
function m() {
  return new Promise((resolve) => {
    delay(0).then(() => {
      m()
      resolve()
    })
  })
}
```

> 不会导致栈溢出，也不会导致页面卡死。因为定时器是延时队列，优先级很低。
>
> 但是如果是 Promise 的话，就会导致页面卡死（原因还是：微任务优先级比渲染帧高）。

## 问题 47：jwt

JWT（JSON Web Token）,一个 JWT 由三部分组成，它们之间用点（`.`）分隔，格式为 `Header.Payload.Signature`。

### 一、jwt 组成

#### Header（头部）

它包含两部分信息：**令牌的类型**（通常是 JWT）和使用的**签名算法**（也可以包含其他标准字段和自定义字段），例如 HMAC SHA256 或 RSA。示例 JSON 如下：

```json
{
  // JWT 头部的alg字段用于指定生成签名所使用的算法，其内容是有预设值的
  "alg": "HS256",
  "typ": "JWT"
}
```

<u style="background-color: pink;">这个 JSON 会使用 **Base64Url** 编码形成 JWT 的第一部分</u>。

::: details Base64、Base64Url 编码 和 解码

##### 1. Base64 编码

Base64 是一种用 64 个字符来表示任意二进制数据的编码方法，使用字符 A-Z、a-z、0-9、+ 和 / 来表示编码结果，并且使用 = 作为填充字符。

```js
// 编码
// 方法1
Buffer.from(str).toString('base64')
// 方法2 btoa 用于将 UTF-8 字符串编码为 Base64 字符串
btoa(str)

// 解码
// 方法1
Buffer.from(str, 'base64').toString('utf8')
// 方法2 atob 用于将 Base64 字符串解码为 UTF-8 字符串
atob(str)
```

> `atob` 是 JavaScript 中的一个全局函数，用于对 Base64 编码的字符串进行解码。它接受一个 Base64 编码的字符串作为参数，并返回解码后的原始字符串。

##### 2. Base64Url

因为 URL（base64Url） 中，+、/ 和 = 有特殊含义，可能会导致问题。因此，Base64Url 编码将 + 替换为 -，/ 替换为 \_，并去掉了填充字符 =

> +、/ 和 = 有特殊含义，可能会导致问题是什么？
>
> - `+` 字符的问题
>
>   在 URL 编码规则里，`+` 通常被用来表示空格。当包含 `+` 的 Base64 编码字符串作为 URL 参数传递时，接收方在解析 URL 时可能会把 `+` 错误地解析成空格。
>
> - `/` 字符的问题
>
>   `/` 在 URL 中是路径分隔符，用于分隔 URL 的不同路径部分。如果 Base64 编码字符串包含 `/`，会使服务器对 URL 的路径解析产生混淆。
>
> - `=`字符的问题
>
>   `=` 在 Base64 编码中是填充字符，用于保证编码后的字符串长度是 4 的倍数。但在 URL 参数中，`=` 用于分隔参数名和参数值。如果 Base64 编码字符串包含 `=`，会干扰服务器对 URL 参数的解析。

**编码：**

```js
function base64UrlEncode(str) {
  return (
    btoa(str)
      // 将 + 替换为 -，将 / 替换为 _，并且去掉尾部的填充字符 =，主要是为了确保编码后的字符串可以安全、无误地在 URL 中使用，
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  )
}
```

**解码：**

在 JavaScript 中，虽然没有直接的 Base64Url 解码函数，但可以通过一些步骤将 Base64Url 编码的字符串转换为原始数据。通常的做法是先将 Base64Url 编码的字符串转换为标准的 Base64 编码字符串，然后再使用标准的 Base64 解码函数进行解码。

转换步骤如下：

1. 将 `-` 替换为 `+`。
2. 将 `_` 替换为 `/`。
3. 根据需要添加填充字符 `=`。

```js
function base64UrlDecode(base64Url) {
  // 将 Base64Url 转换为标准的 Base64
  let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
  // 添加填充字符
  while (base64.length % 4) {
    base64 += '='
  }
  // 使用 atob 进行解码
  return atob(base64)
}
```

:::

#### Payload（负载）

它包含声明（Claims），声明是关于标准字段和自定义字段的声明。标准字段并非强制要求的。

**标准字段：**

- **`iss`（Issuer，发行人）**：标识 JWT 的签发主体，通常是一个 URL 或者一个组织的名称。
- **`sub`（Subject，主题）**：代表 JWT 所面向的主体，通常是用户的唯一标识符。
- **`aud`（Audience，受众）**：指明 JWT 的接收方，可能是一个或多个。
- **`exp`（Expiration Time，过期时间）**：表示 JWT 的过期时间，时间戳格式。
- **`nbf`（Not Before，生效时间）**：表示 JWT 开始生效的时间，在此之前该 JWT 不可用。
- **`iat`（Issued At，签发时间）**：记录 JWT 的签发时间。
- **`jti`（JWT ID，JWT 唯一标识符）**：为 JWT 提供一个唯一的标识符，可用于防止重放攻击。

```json
{
  "iss": "https://example.com",
  "sub": "123456",
  "aud": ["admin", "user"],
  "exp": 1695628800,
  "nbf": 1695625200,
  "iat": 1695621600,
  "jti": "abc123def456"
}
```

**自定义声明示例：**

```json
{
  "userId": "xxxx",
  "phone": "155xxx"
}
```

<u style="background-color: pink;">这个 JSON 会使用 **Base64Url** 编码形成 JWT 的第一部分</u>。

#### Signature（签名）

要创建签名部分，需要使用**编码后的 Header**、**编码后的 Payload**、**一个秘钥（secret）**和**Header 中指定的签名算法**。例如，如果使用的是 HMAC SHA256 算法，签名将按以下方式创建：

```js
HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)
```

签名用于验证消息在传递过程中没有被更改，并且在使用私钥签名的情况下，还可以验证 JWT 的发送者的身份。

<u style="background-color: pink;">最终得到的签名也是一个 **Base64Url** 编码的字符串</u>。

::: details 手动生成签名和 jwt

```js
const crypto = require('crypto')

// Base64Url 编码函数
function base64UrlEncode(str) {
  return (
    Buffer.from(str)
      .toString('base64')
      // 将 + 替换为 -，将 / 替换为 _，并且去掉尾部的填充字符 =，主要是为了确保编码后的字符串可以安全、无误地在 URL 中使用，
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
  )
}

// 生成 JWT 签名的函数
function generateSignature(header, payload, secret) {
  // 对头部和负载进行 Base64Url 编码
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(payload))

  // 拼接编码后的头部和负载
  const dataToSign = `${encodedHeader}.${encodedPayload}`

  // 使用 HMAC-SHA256 算法生成签名
  const hmac = crypto.createHmac('sha256', secret)
  // update：分块添加数据 update 方法接受的参数可以是字符串或 Buffer 对象。如果传递的是字符串，默认使用 UTF-8 编码。
  // 顺序问题：多次调用 update 方法时，数据的添加顺序很重要，不同的顺序会导致不同的签名结果。
  hmac.update(dataToSign)
  // digest：生成 HMAC 签名
  const signature = hmac.digest('base64')

  // 对签名进行 Base64Url 编码，再一次base64url转换是为了确保签名能够在 URL 中安全、准确地传输和使用
  const encodedSignature = base64UrlEncode(signature)

  return encodedSignature
}

// 示例头部
const header = {
  alg: 'HS256',
  typ: 'JWT'
}

// 示例负载
const payload = {
  sub: '1234567890',
  name: 'John Doe'
}

// 示例秘钥
const secret = 'yourSecretKey'

// 生成签名
const signature = generateSignature(header, payload, secret)
console.log('生成的签名:', signature)

// 生成完整的 JWT
const encodedHeader = base64UrlEncode(JSON.stringify(header))
const encodedPayload = base64UrlEncode(JSON.stringify(payload))
const jwt = `${encodedHeader}.${encodedPayload}.${signature}`
console.log('生成的 JWT:', jwt)
```

生成的结果：

```js
生成的签名: b3NhYzBXRzk1eG5BSlVFSXVhU3dvWEdVUkIvSW5aQmU2d3FWSmZWU1BVQT0
生成的 JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIn0.b3NhYzBXRzk1eG5BSlVFSXVhU3dvWEdVUkIvSW5aQmU2d3FWSmZWU1BVQT0
```

:::

### 二、jwt 目的

主要目的：用于在网络应用环境间传递声明，以一种**安全且可验证**的方式将用户相关信息从服务器传递到客户端，并且可以被客户端在后续请求中携带，以证明用户的身份和权限。

- **身份验证**：在用户登录或进行其他身份验证流程后，服务器会生成一个 JWT 并返回给客户端。客户端在后续的请求中携带这个 JWT，服务器通过验证 JWT 的有效性来确定用户的身份，从而实现对用户的身份验证，判断用户是否有权访问特定的资源或执行特定的操作。
- **数据传输与共享**：JWT 可以在不同的系统或服务之间安全地传输用户相关的信息或其他业务数据。由于 JWT 是**自包含**的（包含了用户的身份信息和其他必要的数据），因此可以在多个不同的环境中传递和使用，而无需在每个环境中都进行额外的数据查询或交互来获取用户信息，提高了数据传输和共享的效率和便捷性。

> ⚠️ 注意：cookie、session 是解决了请求无状态的问题，而 jwt 本身也是**无状态**的，但它也在一定程度上解决了请求无状态的问题
>
> - **无状态特性**：JWT 本身不依赖服务器端存储状态信息。它将用户的身份信息和其他必要的数据编码在 Token 中，服务器在接收到请求时，只需对 JWT 进行解码和验证，就可以获取用户的身份和相关信息，而不需要在服务器端查找和维护额外的状态数据。例如，JWT 的负载部分可以包含用户的 ID、角色等信息，服务器直接从 JWT 中获取这些信息，而无需查询数据库或其他存储。
> - **解决请求无状态问题**：JWT 通过在请求中携带包含用户信息的 Token，使得服务器能够在不依赖服务器端状态存储的情况下识别用户身份。客户端在登录成功后，服务器生成 JWT 并返回给客户端，客户端在后续的请求中将 JWT 包含在请求头中发送给服务器。服务器接收到请求后，验证 JWT 的有效性，如果验证通过，就可以根据 JWT 中的信息处理请求，实现了对用户身份的识别和状态的跟踪，在一定意义上解决了请求无状态的问题。

### 三、jwt 没有设置过期时间默认是多少？如何验证 jwt 是否过期？如何判断是否被篡改？

#### 问：没有设置过期时间默认是多少？

JWT 默认**没有过期时间**。过期时间（`exp` 声明）是可选的，由开发者在生成 JWT 时根据需求自行设置。如果不设置过期时间，那么这个 JWT 就不会因为时间原因而自动失效，除非使用其他方式（如黑名单机制）来手动使其无效。

过期的时间放在负载中，所以需要验证的时候，需要验证负载中的 `exp` 字段。

```js
const jwt = require('jsonwebtoken')

// 生成 JWT
const token = jwt.sign(
  {
    phone: '1234567890',
    WaiFCode: 'ABC123'
  },
  'mySign',
  {
    expiresIn: 60 * 1 // 过期时间设置为 1 分钟
  }
)

// 解码 JWT 查看负载内容
const decoded = jwt.decode(token)
/*
解码后的负载内容: {
  phone: '1234567890',
  WaiFCode: 'ABC123',
  iat: 1745034016, // 签发时间
  exp: 1745034076 // 过期时间
}
*/
console.log('解码后的负载内容:', decoded)
```

#### 问：如何验证 jwt 是否过期？

1. **解码 JWT**：`jwt.verify` 方法首先会对传入的 JWT 进行解码，将其**分解为头部、负载和签名**三个部分，并对头部和负载进行 **Base64Url 解码**，得到原始的 JSON 对象。

2. **验证签名**：使用指定的密钥和签名算法（在头部中指定）重新计算签名，并将其与 JWT 中的签名部分进行比较。如果两者不匹配，说明 JWT 可能被篡改，`jwt.verify` 方法会抛出 `JsonWebTokenError` 错误。

3. **验证过期时间**：在解码后的负载中查找 `exp` 声明。如果存在 `exp` 声明，`jwt.verify` 方法会将当前时间（以 Unix 时间戳表示）与 `exp` 声明的值进行比较。如果当前时间超过了 `exp` 声明的值，说明 JWT 已经过期，`jwt.verify` 方法会抛出 `TokenExpiredError` 错误。

4. **返回解码结果**：如果签名验证通过且 JWT 未过期，`jwt.verify` 方法会返回解码后的负载对象，其中包含了用户信息和其他声明。

::: details 示例代码

```js
function verify(token, secret) {
  // 解码 JWT
  const [encodedHeader, encodedPayload, signature] = token.split('.')
  const header = JSON.parse(atob(encodedHeader))
  const payload = JSON.parse(atob(encodedPayload))

  // 验证签名
  const calculatedSignature = calculateSignature(
    encodedHeader,
    encodedPayload,
    secret,
    header.alg
  )
  if (calculatedSignature !== signature) {
    throw new Error('Invalid signature')
  }

  // 验证过期时间
  if (payload.exp) {
    const currentTime = Math.floor(Date.now() / 1000)
    if (currentTime > payload.exp) {
      throw new Error('Token expired')
    }
  }

  return payload
}
```

:::

#### 问：如何判断是否被篡改？

**1. 解码 JWT**

将接收到的 JWT 按 `.` 分割成三部分，分别得到编码后的头部、负载和签名。然后对头部和负载进行 Base64Url 解码，得到原始的 JSON 对象。

**2. 获取签名算法**

从解码后的头部中获取 `alg` 字段的值，确定使用的签名算法。

**3. 重新生成签名**

使用解码后的头部和负载，按照生成签名的步骤，重新拼接并使用相同的签名算法和密钥生成一个新的签名。

**4. 比较签名**

将重新生成的签名与接收到的 JWT 中的签名进行比较。如果两个签名相同，则说明 JWT 在传输过程中没有被篡改，并且是由持有相同密钥的发送者生成的；如果两个签名不同，则说明 JWT 可能被篡改或不是由合法的发送者生成的。

### 四、在分布式系统中，session 只会保存在一个服务器进程中，而其他的进程却没有保存 session，会导致用户登录状态丢失，那 jwt 是如何解决这个问题的呢？

**状态丢失的原因：**

传统的 Session 机制是有状态的，服务器需要在内存或数据库中保存每个用户的 Session 信息。当用户发起请求时，服务器通过 Session ID 来查找对应的 Session 数据，以验证用户的身份和状态。在分布式系统中，如果用户的请求被分发到不同的服务器节点，而这些节点没有保存该用户的 Session 信息，就会导致用户登录状态丢失。

**jwt 是如何解决的：**

JWT 是无状态的，它将用户的身份信息和其他必要的数据编码在 Token 中。当用户发起请求时，只需将 JWT 发送给服务器，服务器对 JWT 进行解码和验证，即可获取用户的身份信息和状态。这样，**无论用户的请求被分发到哪个服务器节点，只要该节点能够验证 JWT 的有效性，就可以正确处理用户的请求，避免了 Session 不一致的问题**。

### 五、jwt 为什么要在请求头中，不能放在其他位置？

1. 标准化
   - 遵循 HTTP 标准：将 Token 放在请求头中符合 HTTP 协议的标准做法。HTTP 请求头是设计用来传递元数据的地方，而 Token 本质上是请求的元数据之一。
   - 易于解析：服务器可以方便地从请求头中提取 Token 进行验证，而不需要解析 URL 或请求体。
2. 安全性
   - 防止 CSRF 攻击：将 Token 放在请求头中而不是 URL 中，可以有效防止跨站请求伪造（CSRF）攻击。CSRF 攻击通常通过 URL 参数来传播 Token，而请求头中的 Token 不会被浏览器自动附加到跨域请求中。
   - 减少泄露风险：Token 放在请求头中不容易被第三方（如其他网站）通过 URL 参数获取，降低了 Token 泄露的风险。
3. 方便性
   - 简化前端实现：前端开发者可以在发送请求时统一设置请求头，而不需要在每个请求中手动附加 Token 到 URL 或请求体中。
   - 支持多种请求方法：无论是 GET、POST、PUT 还是 DELETE 请求，都可以通过请求头传递 Token，而不需要对不同请求方法进行特殊处理。

### 六、什么是双 token 机制？

双 Token 机制是一种**增强身份验证安全性**（主）和**用户体验**（次）的技术方案，常用于处理用户登录和会话管理，主要包含访问令牌（Access Token）和刷新令牌（Refresh Token）。

#### **基本概念**

- 访问令牌（Access Token）：短 token
  - 这是用于访问受保护资源的短期令牌，通常有效期较短，比如 15 分钟到 1 小时不等。
  - 它包含了用户的身份信息和权限声明，服务器通过验证该令牌来确认用户是否有权限访问特定资源。
  - 由于**有效期短**，**即使被窃取，攻击者利用它进行恶意操作的时间窗口也有限**。
- 刷新令牌（Refresh Token）：长 token
  - 刷新令牌的有效期较长，可能是几天甚至几周。
  - 其**作用**是在**访问令牌过期后，用于获取新的访问令牌，而无需用户重新登录**。
  - **刷新令牌通常存储在更安全的位置**，如 **HTTP - Only Cookie** 中，以降低被窃取的风险。

#### **工作流程**

1. **用户登录**：用户在客户端输入用户名和密码等凭据进行登录。服务器验证这些凭据，若验证通过，会生成一个访问令牌和一个刷新令牌，并将它们返回给客户端。
2. **访问资源**：客户端在后续请求中携带访问令牌，服务器验证该令牌的有效性。如果令牌有效，服务器处理请求并返回响应。
3. **访问令牌过期**：当访问令牌过期后，客户端在下次请求时会收到服务器返回的 “令牌过期” 错误。
4. **刷新令牌**：客户端使用刷新令牌向服务器发起刷新请求。服务器验证刷新令牌的有效性，如果有效，会生成一个新的访问令牌，并返回给客户端。
5. **新的访问资源**：客户端使用新的访问令牌继续访问受保护资源。
6. **刷新令牌过期**：当刷新令牌也过期时，用户需要重新登录以获取新的访问令牌和刷新令牌。

因为 access_token 如果有效期太短，用户就需要频繁地进行身份验证，用户体验差。设置得太长呢，一旦 access token 被获取之后被冒用的可能性大。所以使用 refresh token 就可以把 access token 的有效期缩短，在提高安全性的同时还保证了用户体验。

### 七、单 token 也能做到防篡改，因为 token 他本来就是为了解决防篡改的问题，那引入双 token 的意义在哪？

1. **安全性提升**

   - **降低令牌泄露风险**：

     - 访问令牌的有效期通常较短。即使攻击者截获了访问令牌，由于其有效时间有限，攻击者能够利用该令牌进行恶意操作的时间窗口也非常小。例如，若访问令牌有效期为 15 分钟，攻击者在获取令牌后，只有 15 分钟的时间来利用它，大大降低了被攻击的风险。
     - 刷新令牌则存储在更安全的位置，如 HTTP - Only Cookie 中，不能通过 JavaScript 脚本访问，这有效防止了跨站脚本攻击（XSS）窃取令牌。而且刷新令牌一般不会在每次请求中都传输，减少了被截获的机会。

   - **增强身份验证的灵活性**：当检测到异常活动时，如多次异常登录尝试，服务器可以立即吊销访问令牌，而用户只需使用刷新令牌重新获取新的访问令牌，无需重新输入用户名和密码进行登录。这样既保证了系统的安全性，又不会给用户带来过多不便。

2. **优化用户体验**

   - **减少频繁登录**：在单 Token 机制下，当 Token 过期时，用户通常需要重新输入用户名和密码进行登录，这会打断用户的操作流程，降低用户体验。而双 Token 机制中，当访问令牌过期时，客户端可以使用刷新令牌自动获取新的访问令牌，用户无需手动干预，保证了操作的连续性。例如，用户在浏览网页或使用应用时，不会因为 Token 过期而突然被要求重新登录。

   - **支持长时间会话**：对于一些需要长时间使用的应用场景，如在线办公、金融交易等，用户不希望频繁登录。刷新令牌的有效期较长，可以在较长时间内维持用户的会话状态，让用户能够持续使用服务。

3. **系统管理与扩展性**
   - **便于令牌管理**：双 Token 机制将令牌的功能进行了分离，访问令牌用于访问资源，刷新令牌用于更新访问令牌。这种分离使得令牌的管理更加清晰和灵活。例如，服务器可以针对不同类型的令牌设置不同的安全策略和管理规则。
   - **支持多服务和多设备**：在分布式系统和多设备环境中，双 Token 机制更容易实现**单点登录**（SSO）和跨服务的身份验证。**不同的服务可以共享相同的刷新令牌验证机制**，用户在不同设备上也可以方便地使用刷新令牌获取新的访问令牌，提高了系统的扩展性和兼容性。

### 八、单点登录

单点登录（Single Sign-On，简称 **SSO**）是一种身份验证机制，允许用户在多个相关但独立的系统或应用程序中进行身份验证，只需在一个系统中登录一次，就可以访问其他相互信任的系统，而无需再次输入用户名和密码等凭据。一处登录，多处访问。

#### 工作原理

- 用户访问应用系统 A，系统 A 发现用户未登录，便将用户重定向到单点登录服务器的登录页面。
- 用户在登录页面输入用户名和密码等信息进行登录。
- 单点登录服务器验证用户身份信息。如果验证成功，为用户生成一个唯一的票据（Ticket），并将用户重定向回应用系统 A，同时在重定向的 URL 中携带该票据。
- 应用系统 A 收到重定向请求后，从 URL 中提取票据，并将其发送给单点登录服务器进行验证。
- 单点登录服务器验证票据的有效性。如果有效，返回用户的身份信息给应用系统 A。
- 应用系统 A 根据用户身份信息为用户授权，并允许用户访问系统资源。

#### 优缺点

- **优点**
  - 提高用户体验：用户无需记住多个系统的用户名和密码，也无需在不同系统之间频繁登录，大大提高了工作效率和用户体验。
  - 增强安全性：减少了用户在多个系统中使用相同或相似密码的风险，降低了密码泄露的可能性。同时，单点登录系统可以集中管理用户身份信息和访问权限，便于进行安全审计和监控。
  - 便于管理：对于企业或组织来说，单点登录系统可以集中管理用户账户和权限，减少了管理员在多个系统中维护用户信息的工作量，提高了管理效率。
- **缺点**
  - 单点故障风险：单点登录服务器是整个系统的核心，如果单点登录服务器出现故障，可能会导致所有依赖它的应用系统都无法正常登录和访问，影响业务的正常运行。
  - 系统集成复杂：实现单点登录需要对多个应用系统进行集成和改造，涉及到不同系统之间的接口对接、数据传输和安全认证等问题，实施过程较为复杂，需要投入较多的人力和时间。
  - 安全风险集中：由于所有用户的身份验证都集中在单点登录服务器上，一旦单点登录服务器被攻击，攻击者可能会获取到所有用户的身份信息，进而访问各个应用系统，造成严重的安全后果。

#### 工作模式

分为两种：1、session + cookie；2、token；3、双 token 模式

##### 1. session + cookie

认证中心去维护一个 session 表

![](./img/cookie+session.png)

- **好处**
  - 有强控制力：可以让某些用户下线，可以将表格中的信息删除就行
- **缺点**
  - 服务器压力大
  - 子系统扩容，认证中心也要扩容（因为子系统用户量大了，导致认证中心访问量也会增大）

##### 2. token

优点：服务器压力小

缺点：对用户控制能力下降

![](./img/token.png)

用户登录由认证中心颁发 token，认证中心不会存储 token 信息，子系统应用时可以自己去判断 token（可以认证中心和子系统去共享一个密钥）

##### 3. 双 token

双 token 解决了 token 无法对用户控制的缺点

![](./img/双token.png)

- token 为短 token
- refresh token 为刷新 token（长 token）

子系统只需要去验证短 token，如果短 token 过期（图右），会拿这个刷新 token 去认证中心换新的短 token

## 问题 48：parseFloat 和 Number 的区别

```js
console.log(parseFloat('1.23abc')) // 1.23
console.log(Number('1.23abc')) // NaN
```

## 问题 49：数字的哪些会四舍五入？

- **Math.round**：只对整数部分四舍五入，不保留小数。
- **Math.floor**：对数字进行向下取整（向负无穷方向舍入）

```js
console.log(Math.floor(123.999)) // 123
console.log(Math.floor(-123.999)) // 124
```

- **.toFixed**：将数字转为字符串，并指定小数位数，同时对小数部分进行四舍五入。

```js
let num = 123.456
console.log(num.toFixed(2)) // "123.46"
```

## 问题 50：防抖 和 节流

**防抖（Debounce）**：当一个函数被频繁调用时，它不会立即执行，而是在最后一次调用后的特定时间间隔内没有再次被调用，才会执行。

> 场景：
>
> - 搜索框输入时，当用户停止输入时才触发搜索。
>
> - 文本编辑器实时保存。

```js
function debounce(fn, wait) {
  let timer = null
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      fn(args)
      timer = null
    }, wait)
  }
}

document.addEventListener(
  'input',
  debounce(() => {
    console.log('search')
  }, 300)
)
```

**节流（Throttle）**：一个时间间隔内，无论函数被调用多少次，都只执行一次。

> 场景：
>
> - 高频事件：快速点击、滚动事件、resize 事件、mousemove 事件

```js
const throttle = (fn, wait) => {
  let timer
  return (...args) => {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      fn(...args)
      timer = null
    }, wait)
  }
}

document.addEventListener(
  'input',
  throttle(() => {
    console.log('change')
  }, 300)
)
```

## 问题 51：如何实现深浅拷贝

### 深拷贝

- `JSON.stringify()` 将 js 对象序列化，再通过`JSON.parse`反序列
  - 如果对象中有函数、undefined、symbol 时，都会丢失
  - 如果有正则表达式、Error 对象等，会得到空对象
- 手写深拷贝

```js
function deepCopy(obj) {
  // 检查传入的参数是否为对象
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }

  let copy
  // 如果是数组，创建一个新数组
  if (Array.isArray(obj)) {
    copy = []
    for (let i = 0; i < obj.length; i++) {
      // 递归调用深拷贝函数处理数组元素
      copy[i] = deepCopy(obj[i])
    }
  } else {
    // 如果是普通对象，创建一个新对象
    copy = {}
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        // 递归调用深拷贝函数处理对象属性
        copy[key] = deepCopy(obj[key])
      }
    }
  }

  return copy
}

// 测试深拷贝
const originalObj2 = {
  a: 1,
  b: { c: 2 }
}
const deepCopiedObj = deepCopy(originalObj2)

console.log(deepCopiedObj) // 输出深拷贝后的对象
console.log(deepCopiedObj.b === originalObj2.b) // 输出 false，说明引用不同
```

### 浅拷贝

- `Object.assign()` 拷贝对象

```js
Object.assign({}, obj)
```

- 扩展运算符

```js
{ ...obj }
```

- 手写浅拷贝

```js
function shallowCopy(params) {
  // 基本类型直接返回
  if (!params || typeof params !== 'object') return params

  // 根据 params 的类型判断是新建一个数组还是对象
  let newObject = Array.isArray(params) ? [] : {}
  // 遍历 params 并判断是 params 的属性才拷贝
  for (let key in params) {
    // arr 的 key 是 index
    if (params.hasOwnProperty(key)) {
      newObject[key] = params[key]
    }
  }

  return newObject
}

// 测试浅拷贝
const originalObj = {
  a: 1,
  b: { c: 2 }
}
const shallowCopiedObj = shallowCopy(originalObj)

originalObj.a = 10
originalObj.b.c = 10
console.log(originalObj) // { a: 10, b: { c: 10 } }
console.log(shallowCopiedObj) // { a: 1, b: { c: 10 } }
```

## 问题 52：对类数组对象的理解，如何转化为数组？

类数组也叫伪数组，类数组和数组类似，但不能调用数组方法，常见的类数组有`arguments`、通过 document.getElements 获取到的内容等，这些类数组具有 length 属性。

> `arguments` 是伪数组，`[Arguments] { '0': 'a', '1': 'b', '2': 'c', '3': 'd' }`
>
> ⚠️ 注意：箭头函数本身没有 `arguments`

**转换方法**

- 通过 `call` 调用数组的 `xxx` 方法来实现转换

```js
Array.prototype.slice.call(arguments)
```

- 通过 `Array.from` 方法来实现转换

```js
Array.from(arguments)
```

## 问题 53：什么是尾调用，使用尾调用有什么好处？

尾调用就是在函数的**最后一步调用函数**。在一个函数里调用另外一个函数会保留当前执行的上下文，如果在函数尾部调用，因为已经是函数最后一步，所以这时可以不用保留当前的执行上下文，从而节省内存。但是 ES6 的尾调用只能在严格模式下开启，正常模式是无效的。

## 问题 54：数组中 concat 和 push 的区别？

- concat：该方法用于合并多个数组，进而返回一个全新的数组，而原数组不会发生改变。
- push：此方法用于在数组的末尾添加一个或多个元素，并且会改变原数组。

## 问题 55：知道变量提升吗？var、let、const 的区别？

### 变量提升

js 中，在代码执行前，会将变量、函数的声明提前到作用域的顶部，而赋值不会被提升。并且函数声明的优先级要高于变量声明。

::: code-group

```js [源代码]
console.log(a) // undefined
var a = 1
```

```js [提升后]
var a
console.log(a)
a = 1
```

:::

变量提升 & 函数提升（优先级）

> 在上面 16 题也有说

::: code-group

```js [源代码]
// 以下代码输出什么结果
console.log(s)
var s = 2
function s() {}
console.log(s)
```

```js [提升后]
function s() {}
console.log(s)
s = 2
console.log(s)
```

:::

### var 和 let、const 区别

1. **全局污染**： var 会污染全局作用域，而 let 和 const 不会。
2. **块级作用域**： let 是块级作用域，var 是函数作用域，没有块级作用域。（块级作用域指的是由 `{}` 包裹的代码块）

::: details var 的作用域

**全局作用域中使用 var**

当 var 在全局作用域（也就是在任何函数外部）被使用时，声明的变量会成为全局对象的属性。在浏览器环境下，全局对象是 window；在 Node.js 环境下，全局对象是 global。

**函数作用域中使用 var**

当 var 在函数内部使用时，它声明的变量拥有函数作用域，并非全局作用域。

```js
function exampleFunction() {
  var localVar = '这是局部变量'
  console.log(localVar) // 输出 '这是局部变量'
}
exampleFunction()
console.log(typeof localVar) // 输出 'undefined'，因为 localVar 不在全局作用域
```

**块级作用域与 var**

需要注意的是，var 没有块级作用域。这意味着在 if 语句、for 循环等代码块中使用 var 声明的变量，其作用域是包含它的函数或者全局作用域。

```js
if (true) {
  var blockVar = '这是块内变量'
}
console.log(blockVar) // 输出 '这是块内变量'，因为 var 没有块级作用域
```

:::

3. **暂时性死区**：let、var 都有变量提升，但是 let 它有暂时性死区（TDZ），在声明之前是不能使用的
   - var：存在变量提升现象。也就是在代码执行前，var 声明的变量会被提升至当前作用域的顶部，不过其赋值操作不会被提升。
   ```js
   console.log(a) // 输出 undefined
   var a = 5
   ```
   - let：虽然也会有变量提升，但是在变量声明之前访问它会引发 ReferenceError 出错，这被称作 “暂时性死区”（TDZ），也就是在声明之前是不能使用的。
   ```js
   console.log(b) // 报错：Cannot access 'b' before initialization
   let b = 10
   ```
   > **var、let 声明的变量都会到达执行上下文的**，没有到达的话是不能使用的。let 声明的相当于加了把“锁”，在未到达定义位置，上面是不能使用的，这个就是“暂时性死区”
4. **重复声明**：在同一作用域内，let 和 const 不允许重复声明，var 允许重复声明。

> let、const 与 var 的区别是一致的，let 是声明变量，而 const 是声明常量

## 问题 56：innerHTML

innerHTML 设置的 script 标签，浏览器出于安全考虑，不会执行里面的 js 代码。

## 问题 57：如何判断元素在视口？

1. `getBoundingClientRect()`
2. 根据滚动条的位置判断
3. `IntersectionObserver` API

> - 兼容性问题
> - **精度限制**：IntersectionObserver 的默认精度可能无法满足某些对精度要求极高的场景。
> - **无法观察动态变化**：如果被观察元素的大小、位置或其他属性在运行时发生动态变化，IntersectionObserver 可能无法及时准确地反映这些变化。
> - 快速滚动检测不到

## 问题 58：如何实现私有属性？

> 这道题是当前腾讯 wxg 二面原题，当时只说到了 es6 的 class 的 `private` 属性。后面被追问到 es5 如何实现的

**1. ES6 class 的 `private` 属性**

> ⚠️ 注意：这个 `private` 属性，只是在 `ts` 中使用，在 `js` 中是不支持的

**2. 使用 ES6 类的私有字段（#）**

在类中使用 `#` 前缀声明私有字段，确保外部无法直接访问。

```js
class MyClass {
  #privateField = '私有属性'

  getPrivateField() {
    return this.#privateField
  }
}

const instance = new MyClass()
console.log(instance.getPrivateField()) // 输出: 私有属性
console.log(instance.#privateField) // 报错：SyntaxError: Private field '#privateField' must be declared in an enclosing class
```

**3. 闭包（es5 的实现）**

利用闭包特性，在构造函数内部定义变量，外部无法访问。

```js
function MyClass() {
  const privateField = '私有属性'

  this.getPrivateField = function () {
    return privateField
  }
}

const instance = new MyClass()
console.log(instance.getPrivateField()) // 输出: 私有属性
console.log(instance.privateField) // 输出: undefined（外部无法直接访问）
```

## 问题 59：js 中的 requestAnimationFrame 是宏任务还是微任务？

`requestAnimationFrame` 既不是宏任务，也不是微任务，它是浏览器在每次重绘之前自动调度的一种特殊任务类型。

> 宏任务（Macro Task）：包括 `setTimeout`、`setInterval`、`DOM 事件`、`I/O 操作` 等。现在没有宏任务的说法了，定时器是延时队列的。

## 问题 60：为什么使用 `<script>` 标签引入外部的 js 不需要配置跨域？

因为浏览器对 `<script>` 标签的加载行为是 不受同源策略限制的，是浏览器**为了实现网页动态加载 JS 脚本的功能**。**这种机制的设计是为了支持一些关键功能，比如 CDN 加速、第三方库和广告脚本的加载**。
