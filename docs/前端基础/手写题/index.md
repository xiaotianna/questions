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

## 问题 3：手写 intanceof 操作符

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

  // 获取构造函数的原型对象 obj.__proto__
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
  function Fn() {}
  Fn.prototype = obj
  return new Fn()
}

class A {}
const aObj = MyObjectCreate(A.prototype)
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

```js
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

## 问题 7：手写 节流、防抖、深浅拷贝、call、apply、bind、promise

这些问题在对应 JS 部分 和 Promise 部分有。
