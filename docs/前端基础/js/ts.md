# TS

## TS 的工具类型

### 1. Partial

`Partial<Type>`构造一个类型使`Type`的所有属性都设置为可选。

```ts
interface PerItf {
    name:string;
    age:number;
}

// Partial作用：把<>里面这个接口类型设置为可缺省的属性，类似于 age?:number|undefined（也可以是undefined）
let obj:Partial<PerItf> = {
    name: 'xiaotian'
}
```

### 2. Required

`Required<Type>`构造一个类型使`Type`的所有属性都设置为`required`（必选），与`Partial<Type>`功能相反。

```ts
interface Per2Itf {
    name:string;
    age:number;
    height?:number;
}

// Required作用：将可缺省的全部变为不可缺省
let obj2:Required<Per2Itf> = {
    name: 'xiaotian',
    age: 19,
    height: 180 // 不写会报错
}
```
### 3.  Pick
`Pick<Type, Keys>`用于从一个已有类型中选择特定的属性，从而创建一个新的类型。

- 语法

```ts
// T：源类型，从中选择属性。
// K：要选择的属性键，必须是 T 的键（即 keyof T）。
type Pick<T, K extends keyof T> = { [P in K]: T[P] };
```

- 例子

```ts
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

type UserIdName = Pick<User, 'id' | 'name'>;

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
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

- 例子

```ts
interface User {
  id: number;
  name: string;
  age: number;
  email: string;
}

type UserIdName = Omit<User, 'id' | 'name'>;

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