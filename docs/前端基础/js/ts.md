# TS

## interface 接口类型

定义对象、数组、函数、类等类型。

```ts
// 对象
interface Obj {
  name: string
}

// 数组
interface Arr {
  [key: number]: string
}

// 函数
interface Func {
  (p: string): void
}

// 类
interface Cls {
  time: number
}
class Time implements Cls {
  time: number
  constructor(time: number) {}
}
```

> ⚠️ 注意：
>
> - 类与类，接口与接口之间使用 extends
> - 类与接口，使用 implements

## type 类型别名

自定义类型（可以定义所有类型）

**interface 和 type 的区别**

可以用来自定义类型，类型别名（type）不支持重复定义，接口类型可以

## 泛型

类型参数化 `<T>`

## TS 的工具类型

### 1. Partial

`Partial<Type>`构造一个类型使`Type`的所有属性都设置为可选。

```ts
interface PerItf {
  name: string
  age: number
}

// Partial作用：把<>里面这个接口类型设置为可缺省的属性，类似于 age?:number|undefined（也可以是undefined）
let obj: Partial<PerItf> = {
  name: 'xiaotian'
}
```

### 2. Required

`Required<Type>`构造一个类型使`Type`的所有属性都设置为`required`（必选），与`Partial<Type>`功能相反。

```ts
interface Per2Itf {
  name: string
  age: number
  height?: number
}

// Required作用：将可缺省的全部变为不可缺省
let obj2: Required<Per2Itf> = {
  name: 'xiaotian',
  age: 19,
  height: 180 // 不写会报错
}
```

### 3. Pick

`Pick<Type, Keys>`用于从一个已有类型中选择特定的属性，从而创建一个新的类型。

- 语法

```ts
// T：源类型，从中选择属性。
// K：要选择的属性键，必须是 T 的键（即 keyof T）。
type Pick<T, K extends keyof T> = { [P in K]: T[P] }
```

- 例子

```ts
interface User {
  id: number
  name: string
  age: number
  email: string
}

type UserIdName = Pick<User, 'id' | 'name'>

/*
结果:
type UserIdName = {
    id: number;
    name: string;
}
*/
```

### 4. Omit

`Omit<Type, Keys>`用于从一个已有类型中排除特定的属性，从而创建一个新的类型。

- 语法

```ts
// T：源类型，从中排除属性。
// K：要排除的属性键，必须是 T 的键（即 keyof T）或其子集。
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>
```

- 例子

```ts
interface User {
  id: number
  name: string
  age: number
  email: string
}

type UserIdName = Omit<User, 'id' | 'name'>

/*
结果:
type UserIdName = {
    age: number;
    email: string;
}
*/
```

### 5. Record

`Record<Keys, Type>`构造一个对象类型，其属性键为`Keys`，其属性值为`Type`，通常可以使用`Record`来表示一个对象。

```ts
const TOKENS_TYPES = {
  Heading: 'heading', // 标题
  Paragraph: 'paragraph', // 段落
  Blockquote: 'blockquote' // 引用
} as const

// "Heading" | "Paragraph" | "Blockquote"
type K = keyof typeof TOKENS_TYPES
// "heading" | "paragraph" | "blockquote"，只有TOKENS_TYPES后面加了 as const，才能这样取值，不然就是string
type V = (typeof TOKENS_TYPES)[K]

/**
type TokensTypes = {
    Heading: V;
    Paragraph: V;
    Blockquote: V;
}
 */
type TokensTypes = Record<K, V>
```

## 装饰器

这里主要了解装饰器执行顺序：先会从上到下全部的执行装饰器工厂，然后获取到“真正的”装饰器后，从下到上执行装饰器

```ts
function factoryA<T extends { new (...args: any[]): {} }>(target: T) {
  console.log('factoryA')
}
function factoryB(name: string) {
  console.log('factoryB')
  return function <T extends { new (...args: any[]): {} }>(target: T) {
    console.log('factoryB 内部')
  }
}
function factoryC(name: string) {
  console.log('factoryC')
  return function <T extends { new (...args: any[]): {} }>(target: T) {
    console.log('factoryC 内部')
  }
}
function factoryD<T extends { new (...args: any[]): {} }>(target: T) {
  console.log('factoryD')
}

@factoryA
@factoryB('B')
@factoryC('C')
@factoryD
class MyClass {}
/**
 * 输出结果为：
 * factoryB
 * factoryC
 * factoryD
 * factoryC 内部
 * factoryB 内部
 * factoryA
 */
```

## 问题 1：interface 和 type 的区别

在 TypeScript 中，`interface` 和 `type` 都用于描述类型，但它们在功能和使用场景上有一些重要区别：

1. **定义方式**

   - `interface` 只能定义对象类型或类的接口
   - `type` 可以定义任何类型（包括基本类型、联合类型、交叉类型等）

2. **扩展方式**

   - `interface` 使用 `extends` 关键字扩展
   - `type` 通过交叉类型（`&`）实现类似扩展的功能

3. **合并特性**

   - `interface` 支持声明合并（多次定义同一接口会自动合并）
   - `type` 不支持合并，重复定义会报错

4. **适用场景**
   - `interface` 更适合定义对象的结构，尤其是在面向对象编程中定义类的接口
   - `type` 更适合定义复杂类型组合、联合类型、工具类型等

总的来说，`interface` 更注重对象结构的定义和扩展，而 `type` 更为灵活，能够定义各种类型组合。
