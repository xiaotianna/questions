# 数据结构

## 数组

**数组的创建**

```js
// 方式1
const arr = [1,2,3];
// 方式2 构造函数
const arr = new Array(10); // 创建了10个元素的空数组
const arr = (new Array(7)).fill(1) // 得到一个长度为7，且每个元素都初始化为1的数组
```

**数组遍历**

1. for循环
2. forEach
3. map

**数组增加元素三种方法**

- `unshift` 方法-添加元素到数组的头部

```js
const arr = [1,2]
arr.unshift(0) // [0,1,2]
```

- `push` 方法-添加元素到数组的尾部

```js
const arr = [1,2]
arr.push(3) // [1,2,3]
```

- `splice` 方法-添加元素到数组的任何位置

第一个入参是起始的索引值，第二个入参表示从起始索引开始需要删除的元素个数。这里我们指明从索引为1的元素开始，删掉1个元素，也就相当于把 arr[1] 给删掉了。这就是数组中删除任意位置元素的方法。
至于传入两个以上参数这种用法，是用于在删除的同时完成数组元素的新增。

```js
const arr = [1,2] 
arr.splice(1,0,3) // [1,3,2]
```

**数组删除元素三种方法**

- `shift` 方法-删除数组头部的元素

```js
const arr = [1,2,3]
arr.shift() // [2,3]
```

- `pop` 方法-删除数组尾部的元素

```js
const arr = [1,2,3]
arr.pop() // [1,2]
```

- `splice` 方法-删除数组任意位置的元素

## 栈（Stack）——只用 pop 和 push 完成增删的“数组”

特点：`后进先出`，类似于 `拿盘子`

```js
// 初始状态，栈空
const stack = []  
// 入栈过程
stack.push('东北大板')
stack.push('可爱多')
stack.push('巧乐兹')
stack.push('冰工厂')
stack.push('光明奶砖')

// 出栈过程，栈不为空时才执行
while(stack.length) {
    // 单纯访问栈顶元素（不出栈）
    const top = stack[stack.length-1]
    console.log('现在取出的冰淇淋是', top)  
    // 将栈顶元素出栈
    stack.pop()
}

// 栈空
stack // []
```

```bash
现在取出的冰淇淋是 光明奶砖
现在取出的冰淇淋是 冰工厂
现在取出的冰淇淋是 巧乐兹
现在取出的冰淇淋是 可爱多
现在取出的冰淇淋是 东北大板
```

## 队列（Queue）——只用 shift 和 push 完成增删的“数组”

特点：`先进先出`，类似于 `排队`

```js
const queue = []  
queue.push('user1')
queue.push('user2')
queue.push('user3')  
  
while(queue.length) {
    // 单纯访问队头元素（不出队）
    const top = queue[0]
    console.log(top,'取餐')
    // 将队头元素出队
    queue.shift()
}

// 队空
queue // []
```

```bash
user1 取餐
user2 取餐
user3 取餐
```
