# 设计模式

## 大纲

### 设计原则

- 单一职责原则 Single Responsibility Principle（SRP）
- 开放封闭原则 Open Closed Principle（OCP）
- 里氏替换原则 Liskov Substitution Principle（LSP）
- 接口隔离原则 Interface Segregation Principle（ISP）
- 依赖倒置原则 Dependency Inversion Principle（DIP）
- 迪米特法则（最少知识原则） DP
- 合成复合原则 CSP

### 设计模式

- 创建型
  - 工厂、单例、建造者
- 结构型
  - 代理、适配器、桥接、装饰、外观、享元、组合
- 行为型
  - 观察者、迭代器、模板、策略、命令、职责链、状态、访问者、中介者、备忘录、解释器

## 五大原则 单一职责原则-SRP

`SRP` ：单一职责原则，一个对象只做一件事

::: code-group

```js [修改前，未使用 SRP]
class UserOptions {
  // 修改用户信息、密码
  updateUserInfo(user, type) {
    if (type === 'username') {
      this.user.username = user.username
    } else if (type === 'password') {
      this.user.password = user.password
    }
  }
}

const userOpts = new UserOptions()
userOpts.updateUserInfo({ username: 'admin' }, 'username')
```

```js [修改后，使用 SRP]
class UserOptionsSRP {
  updateUserName(username) {
    this.user.username = username
  }
  updatePassword(password) {
    this.user.password = password
  }
}

const userOptsSPR = new UserOptionsSRP()
userOptsSPR.updateUserName('admin')
userOptsSPR.updatePassword('123456')
```

:::

使用前和使用后对比：如果需要新增修改字段，在修改前，就需要新增 `else if` 条件，而修改后，只需要新增一个方法即可

## 五大原则 开放封闭原则-OCP

1. 什么是开和闭？

   - 对扩展开放，对修改封闭
   - 进行解耦

2. 我们在设计一个功能时，如何考虑让核心功能是一个扩展的逻辑，而不是修改的逻辑

   - slot 插槽
   - compose 组合
   - webpack，redux，axios 插件

例如：需要在 process 前去增加一些 before、after 的处理逻辑

::: code-group

```js [使用 OCP 前]
// 不利于扩展
const process = ({ before, after }) => {
  if (before) {
    console.log('this is a before')
  }
  console.log('this is a process')
  if (after) {
    console.log('this is a after')
  }
}
```

```js [使用 OCP 后]
const newProcess = () => {
  console.log('this is a process')
}

// 使用高阶函数实现了开放封闭原则
const compose = ({ beforeFn, afterFn }) => {
  return function (fn) {
    beforeFn && beforeFn()
    fn()
    afterFn && afterFn()
  }
}

compose({
  beforeFn: () => console.log('this is a before'),
  afterFn: () => console.log('this is a after')
})(newProcess)
```

:::

## 五大原则 里氏替换原则-LSP

超类的对象必须能够被其子类的对象替换，而不影响正确性

例如：

::: code-group

```js [使用 LSP 前]
class Animal {}

class Cat extends Animal {
  eatFish() {
    console.log('吃鱼')
  }
}

class Dog extends Animal {
  eatBone() {
    console.log('吃骨头')
  }
}

function eat(animal) {
  if (animal instanceof Cat) {
    animal.eatFish()
  } else if (animal instanceof Dog) {
    animal.eatBone()
  }
}

eat(new Cat())
eat(new Dog())
```

```js [使用 LSP 后]
class Animal {}

class Cat extends Animal {
  eat() {
    console.log('吃鱼')
  }
}

class Dog extends Animal {
  eat() {
    console.log('吃骨头')
  }
}

function eat(animal) {
  animal.eat()
}

eat(new Cat())
eat(new Dog())
```

:::

注意：

1. 在设计子类时，可以完整地继承父亲的职责，而不是去修改
2. 组合的方式，可能会优于继承
3. 多考虑多态逻辑的实现和应用

## 五大原则 接口隔离原则-ISP

意义和目的：尽量减少接口之间的耦合，在大型的软件架构设计中，多个接口的组合使用，好过一个大而全的接口

例子：

::: code-group

```js [使用 ISP 前]
class Vehicle {
  drive() {
    console.log('driving...')
  }
  fly() {
    console.log('flying...')
  }
}

class Car extends Vehicle {
  drive() {
    console.log('driving car...')
  }
  fly() {
    console.log('car can not fly...')
  }
}

class Plane extends Vehicle {
  drive() {
    console.log('plane can not drive...')
  }
  fly() {
    console.log('plane is flying...')
  }
}

new Car().fly()
```

```js [使用 ISP 后]
class Vehicle {}

class Car extends Vehicle {
  drive() {
    console.log('driving car...')
  }
}

class Plane extends Vehicle {
  fly() {
    console.log('plane is flying...')
  }
}

new Car().fly()
```

:::

注意：

1. 接口尽量小
2. 接口要高内聚

## 五大原则 依赖倒置原则-DIP

核心：减少高层模块和底层模块之间的耦合

- 高层模块不应该直接依赖低层模块，两者都应该依赖其抽象；
- 抽象不应该依赖细节，细节应该依赖抽象。

例子：模拟邮件收发服务

::: code-group

```js [使用 DIP 前]
// 高层模块
class MessageService {
  constructor() {
    this.emailSender = new EmailSender()
    this.imSender = new IMSender()
    // 当需要扩展更多的方法时，需要去修改高层模块，高度耦合，需要将 send 方法进行抽象解耦
  }

  sendingEmail(message) {
    this.emailSender.send(message)
  }

  sendingIM(message) {
    this.imSender.send(message)
  }
}

// 底层模块
class EmailSender {
  send(message) {
    console.log('send email:', message)
  }
}

class IMSender {
  send(message) {
    console.log('send im:', message)
  }
}
```

```js [使用 DIP 后]
// 抽象模块
class MessageSender {
  send() {
    throw new Error('not implemented')
  }
}

// 高层模块
class MessageService {
  constructor(sender) {
    this.sender = sender
  }

  sendMessage(message) {
    this.sender.send(message)
  }
}

// 底层模块
class EmailSender extends MessageSender {
  send(message) {
    console.log('send email:', message)
  }
}

class IMSender extends MessageSender {
  send(message) {
    console.log('send im:', message)
  }
}

new MessageService(new EmailSender()).sendMessage('hello')
new MessageService(new IMSender()).sendMessage('hello')
```

:::

## 设计模式 创建型-建造者模式

建造者模式也叫构造器模式，就是分步骤构造一个复杂的对象

简单的建造者模式：

```js
function createUser(name, age, sex) {
  this.name = name
  this.age = age
  this.sex = sex
}

const user = new createUser('admin', 18, 'male')
```

复杂的建造者模式：

```js
function Car() {}

Car.prototype.init = function ({ door, options, color }) {
  this.initDoor(door).initOptions(options).initColor(color)
  return this
}

Car.prototype.initDoor = function (door) {
  this.door = door
  return this
}

Car.prototype.initOptions = function (options) {
  this.options = options
  return this
}

Car.prototype.initColor = function (color) {
  this.color = color
  return this
}

const car = new Car().init({
  door: 4,
  options: ['自动', '手动'],
  color: '白色'
})

const car2 = new Car()
  .initDoor(4)
  .initOptions(['自动', '手动'])
  .initColor('白色')

console.log(car) // Car { door: 4, options: [ '自动', '手动' ], color: '白色' }
console.log(car2) // Car { door: 4, options: [ '自动', '手动' ], color: '白色' }
```

## 设计模式 创建型-工厂模式

将创建的对象的过程，进行单独封装

假设我们有一个简单的场景，需要创建不同类型的汽车对象，比如 Sedan 和 SUV。

```js
// 定义汽车的基类
class Car {
  constructor(type) {
    this.type = type
  }

  drive() {
    console.log(`Driving a ${this.type}`)
  }
}

// 定义具体的汽车类
class Sedan extends Car {
  constructor() {
    super('Sedan')
  }
}

class SUV extends Car {
  constructor() {
    super('SUV')
  }
}

// 定义汽车工厂
class CarFactory {
  createCar(type) {
    switch (type) {
      case 'sedan':
        return new Sedan()
      case 'suv':
        return new SUV()
      default:
        throw new Error('Unknown car type')
    }
  }
}

// 使用工厂创建汽车对象
const factory = new CarFactory()
const sedan = factory.createCar('sedan')
const suv = factory.createCar('suv')

sedan.drive() // 输出: Driving a Sedan
suv.drive() // 输出: Driving a SUV
```

## 设计模式 创建型-单例模式

单例模式就是全局只有一个实例，并提供一个访问它的全局访问点。例如：window 对象、global

- 好处
    - 全局唯一
    - 可以实现状态管理
- 坏处
    - 副作用太大
    - 不符合单一职责原则

::: code-group

```js [构造函数的实现，实例在外部]
let singleton

function Singleton() {
  if (!singleton) {
    singleton = this
  }
  return singleton
}

Singleton.prototype.getName = function () {
  console.log('单例模式')
}

const singletonA = new Singleton()
const singletonB = new Singleton()

console.log(singletonA === singletonB) // true
```

```js [构造函数在外部]
function Singleton() {
  this.instance = null
}

Singleton.getInstance = function () {
  if (!this.instance) {
    this.instance = new Singleton()
  }
}

Singleton.prototype.getName = function () {
  console.log('单例模式')
}

const singletonA = Singleton.getInstance()
const singletonB = Singleton.getInstance()

console.log(singletonA === singletonB) // true
```

```js [使用闭包]
const Singleton = (function () {
  let instance
  function createInstance() {
    instance = '单例'
    return instance
  }
  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance()
      }
      console.log(instance)
      return instance
    }
  }
})()

const singletonA = Singleton.getInstance()
const singletonB = Singleton.getInstance()
console.log(singletonA === singletonB, singletonA)
```

```js [es6 class实现]
class Singleton {
  constructor() {
    if (!Singleton.instance) {
      Singleton.instance = this
    }
    return Singleton.instance
  }
}

const singletonA = new Singleton()
const singletonB = new Singleton()
console.log(singletonA === singletonB)
```

:::

## 设计模式 结构型-装饰器模式

装饰器模式就是给对象添加一些额外的功能，而不改变其原有的功能。例如：react中的 withRouter 方法，给组件添加路由信息，也是装饰器的应用

## 设计模式 结构型-适配器模式

适配器模式就是将一个类的接口转换成客户希望的另外一个接口，使得原本由于接口不兼容而不能一起工作的那些类可以一起工作。

例如：在 nestjs 中，可以使用 express 的内容

## 设计模式 结构型-代理模式

代理模式就是为另一个对象提供一种代理以控制对这个对象的访问。

## 设计模式 结构型-观察者模式

观察者模式：当对象存在一对多的关系时，则使用观察者模式。当一个对象被修改时，我需要通知其他对象

```js
// 被观察者
class Subject {
  constructor() {
    this.deps = []
    // state状态发生变化，通知到所有的 observer
    this.state = 0
  }

  // 添加观察者
  attach(obs) {
    this.deps.push(obs)
  }

  // 状态发生变化
  setState(newState) {
    this.state = newState
    this.notifyAllObservers()
  }

  // 通知所有观察者
  notifyAllObservers() {
    this.deps.forEach((dep) => {
      dep.run(this.state)
    })
  }
}

// 观察者
class Observer {
  constructor(subject) {
    this.subject = subject
    this.subject.attach(this)
  }

  run() {
    throw new Error()
  }
}

// 观察者1
class Observer1 extends Observer {
  constructor(subject) {
    super(subject)
  }
  run(data) {
    console.log(`Observer1 data: ${data}`, this.subject.state)
  }
}

// 观察者2
class Observer2 extends Observer {
  constructor(subject) {
    super(subject)
  }
  run(data) {
    console.log(`Observer2 data: ${data}`, this.subject.state)
  }
}

// 测试
const subject = new Subject()
const obs1 = new Observer1(subject)
const obs2 = new Observer2(subject)

subject.setState(15)
```

## 设计模式 行为型-发布订阅模式

发布订阅模式：当一个对象发生改变时，所有依赖于它的对象都会收到通知并自动更新。

发布订阅和观察者模式的区别：

- 观察者模式：强耦合，是一对一或一对多的关系，即一个具体的Subject对象与它的观察者们直接关联。每个观察者都明确知道它所要观察的Subject。
- 发布订阅模式：无耦合，是多对多的关系，发布者和订阅者之间没有直接联系，而是通过一个中间件（通常称为事件总线或消息代理）进行交互。

**简单实现：**

```js [基本使用]
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

**实现redux：**

::: code-group

```js [redux.js]
export const createStore = (initState) => {
  let state = initState
  let listeners = []

  // 订阅
  const subscribe = (handler) => {
    listeners.push(handler)
  }

  // 发布
  const dispatch = (currentState) => {
    state = currentState
    listeners.forEach((fn) => fn())
  }

  // 获取数据
  const getState = () => {
    return state
  }

  return {
    subscribe,
    dispatch,
    getState
  }
}

export const store = createStore()
```

```js [App.jsx]
import { useEffect, useState } from 'react'
import { store } from './redux'

function App() {
  const [list, setList] = useState([])

  useEffect(() => {
    store.subscribe(() => {
      setList(store.getState())
    })
  }, [])

  const handleClick = () => {
    store.dispatch(['html', 'css', 'js'])
  }

  return (
    <div>
      {list.map((item, index) => {
        return <div key={index}>{item}</div>
      })}
      <button onClick={handleClick}>click</button>
    </div>
  )
}

export default App
```

:::

## 设计模式 行为型-策略模式

策略模式就是定义一系列的算法，把它们一个个封装起来，并且使他们可以相互替换。可以简化 if else 逻辑，提高代码的可读性

::: code-group

```js [使用前]
function getPrice(date, originPrice) {
  if (date === '10-01') {
    return originPrice * 0.8;
  } else if (date === '10-02') {
    return originPrice * 0.9;
  } else {
    return originPrice;
  }
}
```

```js [使用后]
const priceMap = {
  '10-01': (originPrice) => {
    return originPrice * 0.8;
  },
  '10-02': (originPrice) => {
    return originPrice * 0.9;
  },
}

function getPrice(date, originPrice) {
  const priceFn = priceMap[date];
  if (priceFn) {
    return priceFn(originPrice);
  } else {
    return originPrice;
  }
}
```

:::
