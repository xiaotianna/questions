# Promise 和 PromiseA+ 规范

::: details 目录

[[toc]]

:::

## Promise A+ 规范

是一个民间规范，是一个有 `then` 方法的对象或者函数（就是一套定义如何实现 `Promise` 的标准）。

## Promise

ES6 的 `Promise` 是一个满足 `Promise A+` 规范的 `Promise` 实现。是 JS 中处理异步操作的一种模式和对象，它提供了一种更优雅的方式来处理异步代码，尤其是处理回调地狱（callback hell）问题。

- **Promise 有三种状态**：
  - Pending（进行中）：Promise 的初始状态，表示异步操作尚未完成，也不失败。
  - Fulfilled（已完成）：表示异步操作成功完成，其结果值可用。
  - Rejected（已失败）：表示异步操作失败，包含失败的原因。

::: tip 注意

1. `Promise` 的回调是立即执行的

```js
new Promise(() => {
  // ...
})
```

2. 只有当 `Promise` 状态完成，才会执行 `.then()` 回调

```js
new Promise((resolve) => {
  console.log(1)
}).then(() => {
  console.log(2)
})

// 结果：只会输出 1

new Promise((resolve) => {
  console.log(1)
  resolve()
}).then(() => {
  console.log(2)
})

// 结果：输出 1 2
```

3. 调用 `Promise` 的 `resolve` / `reject` 方法后，再是不会再改变 `Promise` 的状态

```js
new Promise((resolve, reject) => {
  resolve('success')
  reject('fail') // 不会执行
})
```

4. 带有 `async` 和 `await` 的 `Promise` 的执行顺序

> `await` 后面的那一部分是同步代码（因为 `await` 等待的是后面内容的运行结果，所以会立即执行）
>
> 当 `await` 后的 `Promise` 完成后，将剩余代码放入微队列中，也就是下面的 `console.log(3)` 会放入微队列中

```js
const fn = async () => {
  console.log(2)
  await p // 这里的 await 后面的 Promise 是同步执行的
  console.log(3)
}

fn()
```

5. 两个 `script` 的情况，会先执行一个`script`的代码，再执行另一个

需要注意：多个 `<script>` 按顺序执行，前一个执行完（包括其微任务）才会执行下一个。（但是不包含宏任务，也就是 `setTimeout`）

```html
<script>
  console.log(111)
  Promise.resolve().then(() => {
    console.log(222)
  })
  setTimeout(() => {
    console.log(333)
  })
</script>
<script>
  console.log(444)
</script>
<!-- 输出结果：111 222 444 333 -->
```

:::

## .then、catch、finally 的使用场景

### 1、.then

`.then` 用于注册 Promise 对象状态变为 fulfilled（成功）时的回调函数。它可以接收一个或两个参数，第一个参数是成功时的回调函数，该函数会接收到 Promise 成功的返回值；第二个参数是失败时的回调函数（不常用，一般用.catch 处理失败）。并且 `.then方法会返回一个新的Promise对象` ，方便进行链式调用。

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('操作成功')
  }, 1000)
})

promise
  .then((result) => {
    console.log(result) // 输出 "操作成功"
    return '新的结果'
  })
  .then((newResult) => {
    console.log(newResult) // 输出 "新的结果"
  })
```

### 2、.catch

`.catch` 用于注册 Promise 对象状态变为 “rejected”（失败）时的回调函数，该回调函数会接收到 Promise 失败的错误信息。它本质上是.then 的特例，相当于 .then(null, err => {})。`.catch 同样会返回一个新的 Promise 对象`。

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject(new Error('操作失败'))
  }, 1000)
})

promise.catch((error) => {
  console.log(error.message) // 输出 "操作失败"
})
```

### 3、.finally

`.finally` 方法的回调函数在 Promise 对象的状态变为 “fulfilled” 或 “rejected” 时都会执行，且**该方法不能接受参数**。`.finally也会返回一个新的Promise对象，其状态由之前的Promise决定`。

> 无论传入的是 resolve 还是 reject 都会输出 (一般用于 Promise 出错后的善后措施，如某些计时器的关闭等)

```js
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 1000)
})

const p = promise.finally(() => {
  console.log('Promise已处理完毕')
})
p.then((data) => {
  console.log(p)
  console.log(data)
})
/**
 * 1s后输出：
 * Promise已处理完毕
   Promise { '成功' }
   成功
 * /
```

## Promise resolve/all/allSettle/any/race 的使用场景

### 1、Promise.resolve

`Promise.resolve` 用于将一个值转换为一个 Promise 对象，返回一个状态为已解决（fulfilled）的 Promise 对象，其结果值为传入的 value。

- 当传入的是其他普通值时，创建一个新的 `Promise` 对象，将该值作为结果，并且将其状态设置为已解决。
- 当传入的值是一个 `Promise` 对象时，直接返回该 `Promise` 对象（当前是啥状态，就返回啥状态，如果当前为 pending，返回 pending）。
- 当传入的值是一个 `thenable` 对象（即具有 `then` 方法的对象）时，将其转换为一个真正的 `Promise` 对象，并根据 `thenable` 的状态来决定新 `Promise` 的状态。

> - value：可以是一个具体的值，也可以是一个 Promise 对象，或者是一个具有 then 方法的 thenable 对象。
>
> - thenable 对象是指具有 then 方法的对象。Promise.resolve 可以将 thenable 对象转换为真正的 Promise 对象。

**1. 将普通值转换为 Promise 对象**

```js
const value = 42
const promise = Promise.resolve(value)

promise.then((result) => {
  console.log(result) // 输出: 42
})
```

**2. 将 Promise 对象转换为 Promise 对象**

```js
const reject = Promise.reject(3)

Promise.resolve(reject)
  .then((res) => {
    console.log(res, 'res')
  })
  .catch((err) => {
    console.log(err, 'err')
  })
// 输出: 3 err
```

**3. 将 thenable 对象转换为 Promise 对象**

```js
const thenable = {
  then: function (resolve, reject) {
    setTimeout(() => {
      resolve('成功')
    }, 1000)
  }
}

const promiseFromThenable = Promise.resolve(thenable)

promiseFromThenable.then((result) => {
  console.log(result) // 1s后输出: 成功
})
```

### 2、Promise.all

场景：并发请求多个任务，且不允许失败

```js
/**
 * 全部任务执行“成功”后，进入 then 逻辑
 * 返回所有任务的“结果”
 * 只要一个任务失败，进入 catch 逻辑
 */
Promise.all([
  Promise.resolve('p1'),
  Promise.resolve('p2'),
  Promise.resolve('p3')
])
  .then((results) => {
    console.log('success', results)
  })
  .catch((error) => {
    console.error('error', error)
  })
```

### 3、Promise.allSettled

场景：并发请求多个任务，且能允许失败（例如：前端埋点日志上报）

```js
/**
 * 全部任务执行“完成”（不论成功还是失败）后，进入 then 逻辑
 * 返回所有任务的“结果”和“状态”。
 * 不会进入 catch 逻辑，成功或失败内容的状态和值，都以数组的形式返回（.then中）
 */
Promise.allSettled([
  Promise.resolve('p1'),
  Promise.reject('p2'),
  Promise.resolve('p3')
]).then((results) => {
  console.log('success: ', results)
})
/**
 * success:  [
    { status: 'fulfilled', value: 'p1' },
    { status: 'rejected', reason: 'p2' },
    { status: 'fulfilled', value: 'p3' }
  ]
 */
```

### 4、Promise.any

场景：一个任务成功即可继续，不关心其他失败任务（例如：寻找有效 CDN、抢票）

```js
/**
 * 首个任务执行“成功”后，进入 then 逻辑
 * 返回该任务的“结果”
 * 若全部任务失败，进入 catch 逻辑
 */
Promise.any([
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('p1')
    }, 100)
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('p2')
    }, 200)
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('p3')
    }, 300)
  })
])
  .then((result) => {
    console.log('success ', result)
  })
  .catch((error) => {
    console.log('error ', error)
  })
```

### 5、Promise.race

场景：需要获取最快返回的结果，不关心其他任务。

```js
/**
 * 首个任务执行“完成”（不论成功还是失败）后触发
 * 首任务状态是成功：进入 then 逻辑，返回该任务“结果”
 * 首任务状态是失败：进入 catch 逻辑
 */
Promise.race([
  new Promise((resolve, reject) => {
    setTimeout(() => reject('p1'), 100)
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => reject('p2'), 200)
  }),
  new Promise((resolve, reject) => {
    setTimeout(() => reject('p3'), 300)
  })
])
  .then((res) => {
    console.log('success ', res)
  })
  .catch((error) => {
    console.log('error ', error)
  })
```

## Promise 和 await/async 的关系

- Promise：一种用于处理异步操作的对象，它代表了一个异步操作的最终完成或失败，并允许在异步操作完成后执行相关的代码。`Promise` 提供了一种更灵活的方式来管理异步代码，尤其是在处理多个异步操作的情况下。
- async/await：一种构建在 Promise 之上的**语法糖**。它是 ECMAScript 2017 (ES8) 引入的特性，旨在简化异步代码的编写和理解。<u>async 函数返回一个 Promise，允许在函数内使用 await 关键字等待异步操作完成。</u>

**关系：**

- async 函数返回一个 Promise 对象。这意味着你可以在 async 函数内使用 await 来等待一个 Promise 对象的解决。await 暂停 async 函数的执行，直到 Promise 状态变为 resolved（成功）或 rejected（失败）。
- async/await 是一种更直观的方式来处理 Promise，可以避免嵌套的回调函数（回调地狱）。

## 1、手写 Promise 构造器的实现

1. Promise 的 state <u>只能改变一次</u>
2. 应该使用 try catch 语法完善 executor(resolve，reject) 的执行

```js
class MyPromise {
  constructor(executor) {
    this.status = 'pending'
    this.value = null // 成功的值
    this.reason = null // 失败的值

    const resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled'
        this.value = value
      }
    }

    const reject = (reason) => {
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.reason = reason
      }
    }
    // 如果执行器中出现错误 直接将promise改为失败状态
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }
}

const p = new MyPromise((resolve, reject) => {
  resolve(1)
})

console.log(p)
```

## 2、手写 Promise 的 .then 方法的实现

- then 方法接收两个参数 onFulfilled 和 onRejected（包含同步、异步操作）
- then 方法（成功或失败）返回一个新的 `Promise` 实例（链式调用）

  - then 方法（成功或失败）返回结果是一个 promise 的话，会自动将这个 promise 执行，并且采用它的状态。
  - then 方法（成功或失败）返回结果是一个普通值（不是 promise），会作为参数传递给下一个 then 的 onFulfilled 或者 onRejected。

  ```js
  const p = new Promise((resolve, reject) => {
    resolve(1)
  })

  p.then((res) => {
    return new Promise((resolve, reject) => {
      resolve(2)
    })
  }).then((res) => {
    console.log(res) // 2
  })
  ```

> 如果要终止 promise，不让继续往下 then，可以返回一个`pending`的 promise。（`return new Promise(() => {})`）

::: details 过程分解

1. then 方法接收两个参数 onFulfilled 和 onRejected

```js
class MyPromise {
  constructor(executor) {
    this.status = 'pending'
    this.value = null // 成功的值
    this.reason = null // 失败的值

    this.onFulfilledCallbacks = [] // 存放then异步成功的回调 // [!code ++]
    this.onRejectedCallbacks = [] // 存放then异步失败的回调 // [!code ++]

    const resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled'
        this.value = value
        // 因为在Promise中可能resolve是在异步（例如定时器）中完成的，此时then调用时的status为pending，所以需要展示存储回调
        this.onFulfilledCallbacks.forEach((fn) => fn()) // [!code ++]
      }
    }

    const reject = (reason) => {
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach((fn) => fn()) // [!code ++]
      }
    }
    // 如果执行器中出现错误 直接将promise改为失败状态
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) { // [!code ++]
    // 同步成功 // [!code ++]
    if (this.status === 'fulfilled') { // [!code ++]
      onFulfilled(this.value) // [!code ++]
    } // [!code ++]
    // 同步失败 // [!code ++]
    if (this.status === 'rejected') { // [!code ++]
      onRejected(this.reason) // [!code ++]
    } // [!code ++]
    // 异步 // [!code ++]
    if (this.status === 'pending') { // [!code ++]
      // push一个函数的原因：方便后续在函数内添加其他操作 // [!code ++]
      this.onFulfilledCallbacks.push(() => { // [!code ++]
        // 异步调用时，在 constructor 的 resolve 中，this.value 已经被赋值 // [!code ++]
        onFulfilled(this.value) // [!code ++]
      }) // [!code ++]
      this.onRejectedCallbacks.push(() => { // [!code ++]
        onRejected(this.reason) // [!code ++]
      }) // [!code ++]
    } // [!code ++]
  } // [!code ++]
}

const p = new MyPromise((resolve, reject) => {
  // resolve(1)
  setTimeout(() => {
    resolve(1)
  }, 1000)
})

p.then(
  (data) => {
    console.log(data)
  },
  (err) => {
    console.log(err)
  }
)
```

2. then 方法返回的是一个新的 `Promise` 对象

```js
class MyPromise {
  constructor(executor) {
    this.status = 'pending'
    this.value = null // 成功的值
    this.reason = null // 失败的值

    this.onFulfilledCallbacks = [] // 存放then异步成功的回调
    this.onRejectedCallbacks = [] // 存放then异步失败的回调

    const resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled'
        this.value = value
        this.onFulfilledCallbacks.forEach((fn) => fn())
      }
    }

    const reject = (reason) => {
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach((fn) => fn())
      }
    }
    // 如果执行器中出现错误 直接将promise改为失败状态
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    // 判断then的参数是可选参数 // [!code ++]
    onFulfilled = // [!code ++]
      typeof onFulfilled === 'function' ? onFulfilled : (value) => value // [!code ++]
    onRejected = // [!code ++]
      typeof onRejected === 'function' // [!code ++]
        ? onRejected // [!code ++]
        : (err) => { // [!code ++]
            throw err // [!code ++]
          } // [!code ++]
    // promise2 为新的 promise
    let promise2 = new MyPromise((resolve, reject) => { // [!code ++]
      // 同步成功
      if (this.status === 'fulfilled') {
        queueMicrotask(() => { // [!code ++]
          try { // [!code ++]
            // x为onFulfilled的返回值（then的第一个参数的返回值） // [!code ++]
            let x = onFulfilled(this.value) // [!code ++]
            // x可能是普通值，也可能是promise，不能直接resolve(x)，需要处理 // [!code ++]
            // 判断新promise和x的关系（判断是普通值，还是promise） // [!code ++]
            // [!code ++]
            /**
             * 这个时候拿不到promise2，因为会先执行new MyPromise，有结果后才能获取到promise2， // [!code ++]
             * 所以采用异步代码包裹（可以用 setTimeout、queueMicrotask） // [!code ++]
             */ // [!code ++]
            resolvePromise(promise2, x, resolve, reject) // [!code ++]
          } catch (error) { // [!code ++]
            reject(error) // [!code ++]
          } // [!code ++]
        }) // [!code ++]
      }
      // 同步失败
      if (this.status === 'rejected') {
        queueMicrotask(() => {
          // [!code ++]
          try { // [!code ++]
            const x = onRejected(this.reason) // [!code ++]
            resolvePromise(promise2, x, resolve, reject) // [!code ++]
          } catch (error) { // [!code ++]
            reject(error) // [!code ++]
          } // [!code ++]
        }) // [!code ++]
      }
      // 异步
      if (this.status === 'pending') {
        // push一个函数的原因：方便后续在函数内添加其他操作
        this.onFulfilledCallbacks.push(() => {
          queueMicrotask(() => {
            // [!code ++]
            try {
              // [!code ++]
              // 异步调用时，在 constructor 的 resolve 中，this.value 已经被赋值 // [!code ++]
              const x = onFulfilled(this.value) // [!code ++]
              resolvePromise(promise2, x, resolve, reject) // [!code ++]
            } catch (error) { // [!code ++]
              reject(error) // [!code ++]
            } // [!code ++]
          }) // [!code ++]
        })
        this.onRejectedCallbacks.push(() => {
          queueMicrotask(() => {
            // [!code ++]
            try { // [!code ++]
              const x = onRejected(this.reason) // [!code ++]
              resolvePromise(promise2, x, resolve, reject) // [!code ++]
            } catch (error) { // [!code ++]
              reject(error) // [!code ++]
            } // [!code ++]
          }) // [!code ++]
        })
      }
    })
    return promise2 // [!code ++]
  }
}

const resolvePromise = (promise2, x, resolve, reject) => { // [!code ++]
  // 判断x是否是promise // [!code ++]
  if (promise2 == x) { // [!code ++]
    return reject(new TypeError('循环引用')) // [!code ++]
  } // [!code ++]
  // 判断then的返回值x：是一个promise // [!code ++]
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') { // [!code ++]
    try { // [!code ++]
      // 判断该方法或对象是否带有then方法 // [!code ++]
      if (typeof x.then === 'function') { // [!code ++]
        x.then( // [!code ++]
          (res) => resolve(res), // [!code ++]
          (rej) => reject(rej) // [!code ++]
        ) // [!code ++]
      } else { // [!code ++]
        // 不带then，为普通对象，直接返回 // [!code ++]
        resolve(x) // [!code ++]
      } // [!code ++]
    } catch (error) { // [!code ++]
      reject(error) // [!code ++]
    } // [!code ++]
  } else { // [!code ++]
    // x是一个普通值 // [!code ++]
    resolve(x) // [!code ++]
  } // [!code ++]
} // [!code ++]

// 测试
const p = new MyPromise((resolve, reject) => {
  resolve()
})

/**
 * 1. 如果return是同一个promise，直接报错
let promise2 = p.then((data) => {
  return promise2 // 要将这个1000传递到下一个then中，需要在then内部调用新promise的resolve方法
})
promise2.then(null, (err) => {
  console.log(err)
})
 */

/**
 * 2. 如果return是一个promise，会自动将这个 promise 执行，并且采用它的状态。
let promise2 = p.then((data) => {
  return new MyPromise((resolve, reject) => {
    resolve(1000)
  })
})
promise2.then((res) => {
  console.log(res) // 1000
})
 */
```

:::

```js
class MyPromise {
  constructor(executor) {
    this.status = 'pending'
    this.value = null // 成功的值
    this.reason = null // 失败的值

    this.onFulfilledCallbacks = [] // 存放then异步成功的回调 // [!code ++]
    this.onRejectedCallbacks = [] // 存放then异步失败的回调 // [!code ++]

    const resolve = (value) => {
      if (this.status === 'pending') {
        this.status = 'fulfilled'
        this.value = value
        this.onFulfilledCallbacks.forEach((fn) => fn()) // [!code ++]
      }
    }

    const reject = (reason) => {
      if (this.status === 'pending') {
        this.status = 'rejected'
        this.reason = reason
        this.onRejectedCallbacks.forEach((fn) => fn()) // [!code ++]
      }
    }
    // 如果执行器中出现错误 直接将promise改为失败状态
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) { // [!code ++]
    // 判断then的参数是可选参数 // [!code ++]
    onFulfilled = // [!code ++]
      typeof onFulfilled === 'function' ? onFulfilled : (value) => value // [!code ++]
    onRejected = // [!code ++]
      typeof onRejected === 'function' // [!code ++]
        ? onRejected // [!code ++]
        : (err) => { // [!code ++]
            throw err // [!code ++]
          } // [!code ++]
    // promise2 为新的 promise // [!code ++]
    let promise2 = new MyPromise((resolve, reject) => { // [!code ++]
      // 同步成功 // [!code ++]
      if (this.status === 'fulfilled') { // [!code ++]
        queueMicrotask(() => { // [!code ++]
          // try...catch用于捕获onFulfilled、onRejected中抛出的错误 // [!code ++]
          try { // [!code ++]
            // x为onFulfilled的返回值（then的第一个参数的返回值） // [!code ++]
            let x = onFulfilled(this.value) // [!code ++]
            // x可能是普通值，也可能是promise，不能直接resolve(x)，需要处理 // [!code ++]
            // 判断新promise和x的关系（判断是普通值，还是promise） // [!code ++]
            // [!code ++]
            /**
             * 这个时候拿不到promise2，因为会先执行new MyPromise，有结果后才能获取到promise2， // [!code ++]
             * 所以采用异步代码包裹（可以用 setTimeout、queueMicrotask） // [!code ++]
             */ // [!code ++]
            resolvePromise(promise2, x, resolve, reject) // [!code ++]
          } catch (error) { // [!code ++]
            reject(error) // [!code ++]
          } // [!code ++]
        }) // [!code ++]
      } // [!code ++]
      // 同步失败 // [!code ++]
      if (this.status === 'rejected') { // [!code ++]
        queueMicrotask(() => { // [!code ++]
          try { // [!code ++]
            const x = onRejected(this.reason) // [!code ++]
            resolvePromise(promise2, x, resolve, reject) // [!code ++]
          } catch (error) { // [!code ++]
            reject(error) // [!code ++]
          } // [!code ++]
        }) // [!code ++]
      } // [!code ++]
      // 异步 // [!code ++]
      if (this.status === 'pending') { // [!code ++]
        // push一个函数的原因：方便后续在函数内添加其他操作 // [!code ++]
        this.onFulfilledCallbacks.push(() => { // [!code ++]
          queueMicrotask(() => { // [!code ++]
            try { // [!code ++]
              // 异步调用时，在 constructor 的 resolve 中，this.value 已经被赋值 // [!code ++]
              const x = onFulfilled(this.value) // [!code ++]
              resolvePromise(promise2, x, resolve, reject) // [!code ++]
            } catch (error) { // [!code ++]
              reject(error) // [!code ++]
            } // [!code ++]
          }) // [!code ++]
        }) // [!code ++]
        this.onRejectedCallbacks.push(() => { // [!code ++]
          queueMicrotask(() => { // [!code ++]
            try { // [!code ++]
              const x = onRejected(this.reason) // [!code ++]
              resolvePromise(promise2, x, resolve, reject) // [!code ++]
            } catch (error) { // [!code ++]
              reject(error) // [!code ++]
            } // [!code ++]
          }) // [!code ++]
        }) // [!code ++]
      } // [!code ++]
    }) // [!code ++]
    return promise2 // [!code ++]
  } // [!code ++]
}

const resolvePromise = (promise2, x, resolve, reject) => { // [!code ++]
  // 判断x是否是promise // [!code ++]
  if (promise2 == x) { // [!code ++]
    return reject(new TypeError('循环引用')) // [!code ++]
  } // [!code ++]
  // 判断then的返回值x：是一个promise // [!code ++]
  if ((typeof x === 'object' && x !== null) || typeof x === 'function') { // [!code ++]
    try { // [!code ++]
      // 判断该方法或对象是否带有then方法 // [!code ++]
      if (typeof x.then === 'function') { // [!code ++]
        x.then( // [!code ++]
          (res) => resolve(res), // [!code ++]
          (rej) => reject(rej) // [!code ++]
        ) // [!code ++]
      } else { // [!code ++]
        // 不带then，为普通对象，直接返回 // [!code ++]
        resolve(x) // [!code ++]
      } // [!code ++]
    } catch (error) { // [!code ++]
      reject(error) // [!code ++]
    } // [!code ++]
  } else { // [!code ++]
    // x是一个普通值 // [!code ++]
    resolve(x) // [!code ++]
  } // [!code ++]
} // [!code ++]

// 测试
const p = new MyPromise((resolve, reject) => {
  resolve(1)
})
  .then((res) => {
    return res
  })
  .then((res) => {
    console.log(res, 'res1')
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(2)
      }, 1000)
    })
  })
  .then((res) => {
    console.log(res, 'res2')
  })
```

> - `then` 方法返回的也是一个 `Promise` 对象
>
> - `then` 方法的执行时机：当前 `Promise` 完成后，才会执行 `then` 方法

## 3、手写 Promise 的 .catch 方法的实现

- 借助 then 方法，返回一个 Promise 对象

> catch 方法实际上是通过调用 then 方法并传入 null 作为成功回调，传入错误处理回调来实现捕获错误的功能。

```js
catch(onRejected) {
  return this.then(null, onRejected)
}
```

## 4、手写 Promise 的 .finally 方法的实现

- 无论传入的是 resolve 还是 reject 都会输出

```js
finally(callback) {
  return this.then(
    (value) => {
      // MyPromise.resolve需要等待callback()的返回结果
      return MyPromise.resolve(callback()).then(() => value)
    },
    (reason) => {
      return MyPromise.resolve(callback()).then(() => {
        throw reason
      })
    }
  )
}
```

## 5、手写 Promise 的 resolve 方法的实现

- 如果参数是 `Promise` 对象，直接返回该 Promise 对象（当前是啥状态，就返回啥状态，如果当前为 pending，返回 pending）
- 如果是普通值，转换为 `Promise` 对象

> 静态方法，`class` 中通过 `static` 修饰，构造函数中使用 `A.xxx`。

```js
// resolve 静态方法
static resolve(success) {
  if (success instanceof MyPromise) {
    return success;
  }

  return new MyPromise(resolve => {
    resolve(success);
  });
}

// reject 静态方法
static reject(fail) {
  if (fail instanceof MyPromise) {
    return fail;
  }
  return new MyPromise((resolve, reject) => {
    reject(fail);
  });
}
```

## 6、手写 Promise 的 all 方法的实现

- `all` 方法返回一个 `Promise` 对象，该对象在传入的 `Promise` 对象全部完成时才会完成，并返回一个数组，该数组的成员顺序与传入的 `Promise` 对象的顺序保持一致。
- 一个 `Promise` 对象失败时，`all` 方法也会失败。

```js
// 通过构造函数/类直接调用的是静态方法，用static
static all(params) {
  return new MyPromise((resolve, reject) => {
    const arr = []
    let index = 0
    // 判断是否所有的promise都执行完毕
    const isPromiseAllEnd = (key, value) => {
      arr[key] = value
      index++
      if (index === params.length) {
        resolve(arr)
      }
    }
    // 遍历数组，依次循环执行
    for (let i = 0; i < params.length; i++) {
      let current = params[i]
      if (isPromise(current)) {
        // 如果是promise，则执行then
        current.then(
          (res) => {
            isPromiseAllEnd(i, res)
          },
          (err) => {
            // 如果有一个失败，则返回失败
            reject(err)
          }
        )
      } else {
        // 如果不是promise，则直接返回
        isPromiseAllEnd(i, current)
      }
    }
  })
}

// 测试
const p = MyPromise.all([
  1,
  2,
  3,
  new Promise((resolve, reject) => {
    resolve(4)
  })
]).then((res) => {
  console.log(res)
})
```

## 7、手写 Promise 的 allSettled 方法的实现

- 无论成功或失败，都会返回一个数组，该数组的成员顺序与传入的 `Promise` 对象的顺序保持一致。
- 传入的元素是 Promise，返回的数组元素对象的就是那个 Promise 成功/失败的值
- 传入的元素不是 Promise，返回的数组元素对象的 status 为 fulfilled，value 为传入的元素值（具体看下面测试的例子结果）

```js
static allSettled(params) {
  return new MyPromise((resolve, reject) => {
    const arr = []
    let index = 0
    // 判断是否所有的promise都执行完毕
    const isPromiseAllEnd = (key, value) => {
      arr[key] = value
      index++
      if (index === params.length) {
        resolve(arr)
      }
    }
    for (let i = 0; i < params.length; i++) {
      let current = params[i]
      if (isPromise(current)) {
        current.then(
          (res) => {
            isPromiseAllEnd(i, {
              status: 'fulfilled',
              value: res
            })
          },
          (err) => {
            isPromiseAllEnd(i, {
              status: 'rejected',
              reason: err
            })
          }
        )
      } else {
        isPromiseAllEnd(i, {
          status: 'fulfilled',
          value: current
        })
      }
    }
  })
}

// 测试
MyPromise.allSettled([
  Promise.resolve('p1'),
  Promise.reject('p2'),
  Promise.resolve('p3'),
  4,
  5,
  new Error('error')
]).then((results) => {
  console.log('success: ', results)
})
/**
 * success:  success:  [
  { status: 'fulfilled', value: 'p1' },
  { status: 'rejected', reason: 'p2' },
  { status: 'fulfilled', value: 'p3' },
  { status: 'fulfilled', value: 4 },
  { status: 'fulfilled', value: 5 },
  {
    status: 'fulfilled',
    value: Error: error
  }
]
 */
```

## 8、手写 Promise 的 any 方法的实现

- 传入的是一个数组，返回一个 Promise 对象
- 首个任务执行“成功”后，进入 then 逻辑
- 若全部任务失败，进入 catch 逻辑

```js
static any(params) {
  return new MyPromise((resolve, reject) => {
      let index = 0
      // 存放所有拒绝的错误
      const errors = []
      for (let i = 0; i < params.length; i++) {
          let current = params[i]
          if (isPromise(current)) {
              current.then(
                  (res) => {
                      resolve(res) // 第一个成功的结果直接 resolve
                  },
                  (err) => {
                      errors.push(err); // 记录错误
                      index++
                      if (index === params.length) {
                          reject(new AggregateError(errors, 'All promises were rejected'))
                      }
                  }
              )
          } else {
              resolve(current)
          }
      }
  })
}

// 测试
MyPromise.any([
  new MyPromise((resolve, reject) => {
    setTimeout(() => {
      reject('p1')
    }, 500)
  }),
  new MyPromise((resolve, reject) => {
    setTimeout(() => {
      reject('p2')
    }, 200)
  }),
  new MyPromise((resolve, reject) => {
    setTimeout(() => {
      reject('p3')
    }, 300)
  })
]).then((result) => {
  console.log('success ', result)
}).catch((error) => {
  console.log('error ', error)
})
```

## 9、手写 Promise 的 race 方法的实现

- 接受一个 promise 数组
- 首个任务执行“完成”（不论成功还是失败）后触发
  - 首任务状态是成功：进入 then 逻辑，返回该任务“结果”
  - 首任务状态是失败：进入 catch 逻辑

```js
static race(params) {
  return new MyPromise((resolve, reject) => {
    for (let i = 0; i < params.length; i++) {
      let current = params[i]
      if (isPromise(current)) {
        current.then(
          (res) => {
            resolve(res)
          },
          (err) => {
            reject(err)
          }
        )
      } else {
          resolve(current)
      }
    }
  })
}

// 测试
MyPromise.race([
  new MyPromise((resolve, reject) => {
    setTimeout(() => reject('p1'), 500)
  }),
  new MyPromise((resolve, reject) => {
    setTimeout(() => resolve('p2'), 200)
  }),
  new MyPromise((resolve, reject) => {
    setTimeout(() => reject('p3'), 300)
  }),
]).then((res) => {
  console.log('success ', res)
}).catch((error) => {
  console.log('error ', error)
})
// 输出：success  p2
```
