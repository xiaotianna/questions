# Vue 基础知识

::: details 目录

[[toc]]

:::

## 问题 1：MVVM 的理解

`MVVM` 是一种软件架构模式，MVVM 分为 `Model`、`View`、`ViewModel`：

- `Model`代表数据模型，数据和业务逻辑都在 Model 层中定义；
- `View`代表 UI 视图，负责数据的展示；
- `ViewModel`负责监听 Model 中数据的改变并且控制视图的更新，处理用户交互操作；

`Model` 和 `View` 并无直接关联，而是通过 `ViewModel` 来进行联系的，`Model` 和 `ViewModel` 之间有着双向数据绑定的联系。因此当 `Model` 中的数据改变时会触发 `View` 层的刷新，`View` 中由于用户交互操作而改变的数据也会在 `Model` 中同步。

## 问题 2：vue 和 react 的区别，有什么相同

**不同：**

- **模版语法不同**，react 采用 JSX 语法，vue 使用基于 HTML 的模版语法
- **数据绑定不同**，vue 使用双向数据绑定，react 则需要手动控制组件的状态和属性。
- **状态管理不同**，vue 使用 vuex 状态管理，react 使用 redux 状态管理
- **组件通信不同**，vue 使用 props 和自定义事件的方式进行父子组件通信，react 则通过 props 和回调函数的方式进行通信。
- **生命周期不同**，vue 有 8 个生命周期钩子，react 有 10 个
- **响应式原理不同，vue 使用**双向绑定**来实现数据更新，react 则通过**单向数据流\*\*来实现

**相同：**

- **组件化开发**：Vue 和 React 都采用了组件化开发的方式，将用户界面划分为独立、可复用的组件，从而使代码更加模块化、可维护和可扩展。
- **虚拟 DOM**：Vue 和 React 都使用虚拟 DOM 技术，通过在 JavaScript 和真实 DOM 之间建立一个轻量级的虚拟 DOM 层，实现高效的 DOM 更新和渲染。
- **响应式更新**：Vue 和 React 都支持响应式更新，即当数据发生变化时，会自动更新相关的组件和视图，以保持用户界面的同步性。

## 问题 3：vue2 和 vue3 的区别

1. **响应式系统**：
   - Vue 2 使用`Object.defineProperty`来实现其响应式系统。这种方法有一些限制，例如无法检测属性的添加或删除，以及无法直接处理数组索引和长度的变化。
   - Vue 3 则采用了基于 ES6 Proxy 的响应式系统，这允许 Vue 拦截对象的任何属性的读取和写入操作，提供更强大和灵活的响应式能力。这也使得 Vue 3 能够检测属性的添加和删除，以及更有效地处理数组更新。
2. **组合式 API**：
   - Vue 2 主要通过选项 API（如`data`，`methods`，`computed`等）进行组件的逻辑组织。
   - Vue 3 引入了组合式 API（如`ref`，`reactive`，`computed`，`watch`），这为逻辑复用和代码组织提供了更灵活的方式。
3. **性能相关**：
   - Vue 3 在性能方面有显著提升。它包括更小的打包大小、更快的虚拟 DOM 重写、更高效的组件初始化等。
   - Vue 2 相比之下在性能方面相对较慢，尤其是在处理大型应用和复杂组件时。
4. **TypeScript 支持**：
   - Vue 3 从一开始就以 TypeScript 编写，提供更好的 TypeScript 支持。
   - Vue 2 对 TypeScript 的支持是有限的，通常需要额外的配置和工具来实现更好的集成。
5. **新特性和改进**：
   - Vue 3 引入了多个新特性，如 Teleport、Fragment、Suspense 等，为开发提供了更多的可能性和便利。
6. **Fragment**：
   - Vue 3 允许多个根节点（Fragment），这使得组件模板可以有多个并列的根元素。
   - Vue 2 要求每个组件必须有一个单独的根节点。
7. **虚拟节点静态标记（Patch Flag）**：
   - Vue 2 在更新组件时，会进行相对全面的虚拟 DOM 比较，这可能会导致性能开销。
   - Vue 3 引入了 Patch Flag，这是一种优化技术，它在编译时标记虚拟节点的动态部分。这样在组件更新时，Vue 只需要关注这些被标记的部分，而不是整个组件树，从而显著提升了性能。
8. **生命周期变化**：
   - Vue 2 提供了一系列的生命周期钩子，如 `created`，`mounted`，`updated`，`destroyed` 等。
   - Vue 3 对这些生命周期钩子进行了重命名和调整，以更好地与 Composition API 配合。例如，`beforeDestroy` 和 `destroyed` 分别更名为 `beforeUnmount` 和 `unmounted`。此外，Vue 3 引入了新的生命周期钩子，如 `onMounted`，`onUpdated`，`onUnmounted` 等，用于组合式 API。
9. **打包体积优化**：
   - Vue 2 的打包体积相对较大，尤其是在包含了全框架的所有特性时。
   - Vue 3 进行了大量的打包体积优化。它采用了更有效的树摇（Tree - shaking）机制，允许去除未使用的代码部分。这意味着如果你只使用 Vue 的一部分功能，最终打包出来的文件会更小。

## 问题 4：vue 生命周期

### vue2 的生命周期

1. **创建阶段（Creation）**：
   - `beforeCreate`：在实例初始化之后，数据观测之前调用。此时实例尚未初始化完成，数据和事件等都未准备好。
   - `created`：在实例创建完成后被立即调用。此时实例已经完成初始化，但 DOM 元素尚未挂载，适合进行数据初始化和异步操作。
2. **挂载阶段（Mounting）**：
   - `beforeMount`：在挂载开始之前被调用，此时虚拟 DOM 已经创建，但尚未渲染到实际 DOM 中。
   - `mounted`：在实例挂载到 DOM 后被调用。在这一阶段，实例已经成功挂载到 DOM 中，可以执行 DOM 操作和访问 DOM 元素。
3. **更新阶段（Updating）**：
   - `beforeUpdate`：在数据更新之前被调用。此时数据变化会触发重新渲染，但尚未更新到 DOM。
   - `updated`：在数据更新之后被调用。此时数据已经更新到 DOM，适合执行 DOM 依赖的操作。
4. **销毁阶段（Destruction）**：
   - `beforeDestroy`：在实例销毁之前被调用。可以用于清理定时器、取消订阅、解绑事件等清理操作。
   - `destroyed`：在实例销毁后被调用。在这一阶段，实例和所有相关的事件监听器和观察者都已经被销毁。

### vue3 的生命周期

1. **设置阶段（Setup）**：
   - `setup`：在 Vue 3 中，大部分的配置和逻辑都应该在`setup`函数中处理。这个函数用于返回组件的状态和行为。在`setup`函数中，可以设置响应式数据、计算属性、方法，以及处理 props 等。
2. **创建阶段（Creation）**：
   - `beforeCreate`：在实例初始化之后，数据观测之前调用。可以用于执行一些初始化操作，但在这个阶段，`setup`函数中的响应式数据和计算属性尚未准备好。
   - `created`：在实例创建完成后被立即调用。在这个阶段，`setup`函数中的响应式数据和计算属性已经准备好。
3. **挂载阶段（Mounting）**：
   - `beforeMount`：在挂载开始之前被调用，与 Vue 2 中的`beforeMount`类似。
   - `onBeforeMount`：Vue 3 中的新增生命周期钩子，也是在挂载前被调用。
   - `mounted`：在实例挂载到 DOM 后被调用。与 Vue 2 中的`mounted`类似。
   - `onMounted`：Vue 3 中的新增生命周期钩子，也是在挂载后被调用。
4. **更新阶段（Updating）**：
   - `beforeUpdate`：在数据更新之前被调用，与 Vue 2 中的`beforeUpdate`类似。
   - `onBeforeUpdate`：Vue 3 中的新增生命周期钩子，也是在更新前被调用。
   - `updated`：在数据更新之后被调用，与 Vue 2 中的`updated`类似。
   - `onUpdated`：Vue 3 中的新增生命周期钩子，也是在更新后被调用。
5. **卸载阶段（Unmounting）**：
   - `beforeUnmount`：在卸载之前被调用，用于清理资源，与 Vue 2 中的`beforeDestroy`类似。
   - `onBeforeUnmount`：Vue 3 中的新增生命周期钩子，也是在卸载前被调用。
   - `unmounted`：在卸载后被调用，与 Vue 2 中的`destroyed`类似。
   - `onUnmounted`：Vue 3 中的新增生命周期钩子，也是在卸载后被调用。

### created 和 mounted 这两个生命周期的区别

- **created 生命周期钩子**：
  - `created` 生命周期钩子在组件实例被创建之后立即被调用。
  - 在这个阶段，组件实例已经被创建，但它的模板还没有渲染到 DOM 中。可以在这个阶段执行一些与数据初始化和逻辑处理相关的任务，但无法访问到已经渲染的 DOM 元素。
  - 通常用于进行数据的初始化、设置初始状态、进行异步请求（例如获取数据），以及数据准备好后执行逻辑。
- **mounted 生命周期钩子**：
  - `mounted` 生命周期钩子在组件的模板已经渲染到 DOM 中后触发。
  - 在这个阶段，您可以访问和操作已经渲染的 DOM 元素。这通常用于执行需要访问 DOM 的任务，例如操作 DOM 元素、添加事件监听器、或执行与 DOM 相关的操作。
  - 通常用于执行需要等待 DOM 渲染完成后才能执行的任务，以确保可以操作已经存在的 DOM 元素。

### Vue 的父组件和子组件生命周期钩子函数执行顺序?

- **加载渲染过程**：父 `beforeCreate` -> 父 `created` -> 父 `beforeMount` -> 子 `beforeCreate` -> 子 `created` -> 子 `beforeMount` -> 子 `mounted` -> 父 `mounted`
- **子组件更新过程**：父 `beforeUpdate` -> 子 `beforeUpdate` -> 子 `updated` -> 父 `updated`
- **父组件更新过程**：父 `beforeUpdate` -> 父 `updated`
- **销毁过程**：父 `beforeDestroy` -> 子 `beforeDestroy` -> 子 `destroyed` -> 父 `destroyed`

## 问题 5：Vue 组件通信方式

- 父传子
  - props
  - $children
  - $refs
- 子传父
  - $emit
  - $parent
- 兄弟组件
  - provied
  - inject
  - eventBus
  - Vuex

## 问题 6：vue 指令和常见的修饰符有哪些？

**指令：**

- `v-if`：条件渲染指令，根据表达式的真假来决定是否渲染元素。
- `v-show`：条件显示指令，根据表达式的真假来决定元素的显示和隐藏。
- `v-for`：列表渲染指令，用于根据数据源循环渲染元素列表。
- `v-bind`：属性绑定指令，用于动态绑定元素属性到 Vue 实例的数据。
- `v-on`：事件绑定指令，用于监听 DOM 事件，并执行对应的 Vue 方法。
- `v-model`：双向数据绑定指令，用于在表单元素和 Vue 实例的数据之间建立双向绑定关系。
- `v-text`：文本插值指令，用于将数据插入到元素的文本内容中。
- `v-html`：HTML 插值指令，用于将数据作为 HTML 解析并插入到元素中。

**事件修饰符：**

- `.stop`：阻止冒泡
- `.prevent`：阻止默认事件
- `.capture`：与事件冒泡的方向相反，事件捕获由外到内；
- `.self`：只会触发自己范围内的事件，不包含子元素；
- `.once`：只会触发一次。

**表单修饰符：**

- `.lazy`：在默认情况下，`v - model` 在每次 `input` 事件触发后将输入框的值与数据进行同步，可以添加 `lazy` 修饰符
- `.number`：如果想自动将用户的输入值转为数值类型，可以给 `v - model` 添加 `number` 修饰符
- `.trim：`如果要自动过滤用户输入的首尾空白字符，可以给 `v - model` 添加 `trim` 修饰符

## 问题 7：v-html 的原理

会先移除节点下的所有节点，调用 html 方法，通过添加`innerHTML`属性，归根结底还是设置 innerHTML 为 v-html 的值。

## 问题 8：v-model 是如何实现的，语法糖实际是什么？

Vue 中数据双向绑定是一个指令 `v-model`，可以绑定一个响应式数据到视图，同时视图的变化能改变该值。

- 当作用在**表单**上：通过 `v-bind:value` 绑定数据，`v-on:input` 来监听数据变化并修改 `value`
- 当作用在**组件**上：本质上是一个父子通信语法糖，通过 `props` 和 `$emit` 实现。

## 问题 9：data 为什么是一个函数而不是对象

因为对象是一个**引用类型**，如果 data 是一个对象的情况下会造成多个组件共用一个 data，data 为一个函数，每个组件都会有自己的私有数据空间，不会干扰其他组件的运行。

## 问题 10：Vue 中 key 的作用

`key` 的作用主要是为了高效的更新虚拟 DOM，其原理是 vue 在 patch 过程中通过 key 可以精准判断两个节点是否是同一个，从而避免频繁更新不同元素，减少 DOM 操作量，提高性能。

### 为什么不建议用 index 作为 key?

如果将数组下标作为 key 值，那么当列表发生变化时，可能会导致 key 值发生改变，从而引发不必要的组件重新渲染，甚至会导致性能问题。例如，当删除列表中某个元素时，其后面的所有元素的下标都会发生改变，导致 Vue 重新渲染整个列表。

## 问题 11：路由的 hash 和 history 模式的区别

**hash 模式**：开发中默认的模式，地址栏 URL 后携带#，后面为路由。

> 原理是通过 onhashchange()事件监听 hash 值变化，在页面 hash 值发生变化后，window 就可以监听到事件改变，并按照规则加载相应的代码。hash 值变化对应的 URL 都会被记录下来，这样就能实现浏览器历史页面前进后退。

**history 模式**：history 模式中 URL 没有#，这样相对 hash 模式更好看，但是需要后台配置支持。

> history 原理是使用 HTML5 history 提供的 pushState、replaceState 两个 API，用于浏览器记录历史浏览栈，并且在修改 URL 时不会触发页面刷新和后台数据请求。

## 问题 12：watch 和 computed 有什么区别?

### computed：

- **计算属性**：`computed` 是用于创建计算属性的方式，它依赖于 Vue 的响应式系统来进行数据追踪。当依赖的数据发生变化时，计算属性会自动重新计算，而且只在必要时才重新计算。
- **缓存**：计算属性具有缓存机制，只有在它依赖的数据发生变化时，计算属性才会重新计算。这意味着多次访问同一个计算属性会返回相同的结果，而不会重复计算。
- **无副作用**：计算属性应当是无副作用的，它们只是基于数据的计算，并不会修改数据本身。
- **用于模板中**：计算属性通常用于模板中，以便在模板中显示派生数据。
- **必须同步**：只对同步代码中的依赖响应。

### watch：

- **侦听数据**：`watch` 用于监视数据的变化，你可以监视一个或多个数据的变化，以执行自定义的响应操作。
- **副作用操作**：`watch` 中的回调函数可以执行副作用操作，例如发送网络请求、手动操作 DOM，或执行其他需要的逻辑。
- **不缓存**：`watch` 中的回调函数会在依赖数据变化时立即被触发，不会像 `computed` 那样具有缓存机制。
- **用于监听数据变化**：`watch` 通常用于监听数据的变化，而不是用于在模板中显示数据。
- **支持异步**：在检测数据变化后，可进行同步或异步操作。

## 问题 13：谈谈 computed 的机制，缓存了什么?

- Vue.js 中的 `computed` 属性确实具有缓存机制，这个缓存机制实际上是指对计算属性的值进行了缓存。当你在模板中多次访问同一个计算属性时，Vue.js 只会计算一次这个属性的值，然后将结果缓存起来，以后再次访问时会直接返回缓存的结果，而不会重新计算。
- 假设你有一个计算属性 `fullName`，它依赖于 `firstName` 和 `lastName` 两个响应式数据。当你在模板中使用 `fullName` 来显示全名时，Vue.js 会自动建立依赖关系，并在 `firstName` 或 `lastName` 发生变化时，自动更新 `fullName` 的值，然后将新的值渲染到页面上。

## 问题 14：为什么 computed 不支持异步?

这个是 vue 设计层面决定的，computed 的定义是，“依赖值改变 computed 值就会改变”，所以这里必须是同步的，否则就可能“依赖值改变但 computed 值未改变了”，一旦 computed 支持异步，computed 就违背定义了，会变得不稳定。相反，watch 的定义是，“监控的数据改变后，它做某件事”，那 watch 在监听变化后，做同步异步都可以，并不违背定义。

```js
// 有效
computed: {
  async value() {
    return this.a + this.b; // 有效
  }
},
// 无效
computed: {
  async value() { // 外部接住promise
    const res = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.a + this.b);
      });
    });
    console.log(res); // 输出3
    return res;
  }
}
```

## 问题 15：以下两段代码在 vue 中分别渲染多少次? 为什么?

代码 1：

```html
<template>
  <div>{{rCount}}</div>
</template>

<script setup>
  import { ref } from 'vue'
  const count = 0
  const rCount = ref(count)
  for (let i = 0; i < 5; ++i) {
    rCount.value = i
  }
</script>
```

代码 2：

```html
<template>
  <div>{{rCount}}</div>
</template>

<script setup>
  import { ref } from 'vue'
  const count = 0
  const rCount = ref(count)
  for (let i = 0; i < 5; ++i) {
    setTimeout(() => {
      rCount.value = i
    }, 0)
  }
</script>
```

**答案**：代码 1 `1` 次，代码 2 `5` 次。

**解释**：当数据发生变化，会被 `Object.defineProperty(vue2)` 或 `new Proxy(vue3)` 监听到，监听到之后会把调用渲染函数，但渲染函数不是立即执行，而是会放到一个微任务队列中 `Promise.reslove().then() (vue3)` 或 `nextTick (vue2)` ，等待当前所有同步代码执行完成后，会调用微任务，一次过更新内容。

## 问题 16：vue3 中 ref 和 reactive 的区别

- `ref` 生成响应式对象，一般用于基础类型
- `reactive` 代理整个对象，一般用于引用类型

## 问题 17：vue3 区分 ref 和 reactive 的原因

1. **模板解包**：基础数据类型（如数字、字符串、布尔值）不是对象，因此无法直接被 `Proxy` 拦截。`Proxy` 可以拦截对象级别的操作，如属性访问、赋值、枚举等。使用 `ref` 创建的响应式引用在 Vue 模板中被自动解包。这意味着当你在模板中使用 `ref` 创建的变量时，可以直接使用而不需要每次都通过 `.value` 访问。如果使用 `Proxy` 来处理基础类型，这种自动解包可能就无法实现，从而增加了模板中的代码复杂性。
2. **API 可读性**：Vue 3 提供了 `ref` 和 `reactive` 两种方式来创建响应式数据，旨在提供一个统一和一致的 API。`ref` 主要用于基础数据类型和单个值，而 `reactive` 用于对象和数组。这种区分使得 Vue 3 的响应式系统在概念上更容易理解和使用。

## 问题 18：vue2 删除数组用 delete 和 Vue.delete 有什么区别?

**delete：**

- `delete` 是 JavaScript 的原生操作符，用于删除对象的属性。当你使用 `delete` 删除数组的元素时，元素确实会被删除，但数组的长度不会改变，被删除的元素将变成 `undefined`。
- `delete` 操作不会触发 Vue 的响应系统，因此不会引起视图的更新。

```javascript
const arr = [1, 2, 3]
delete arr[1] // 删除元素2
// 现在 arr 变成 [1, empty, 3]
```

**Vue.delete：**

- `Vue.delete` 是 Vue 2 提供的用于在响应式数组中删除元素的方法。它会将数组的长度缩短，并触发 Vue 的响应系统，确保视图与数据同步。
- 使用 `Vue.delete` 来删除数组元素，Vue 会正确追踪更改，并在视图中删除相应的元素。

```javascript
const arr = [1, 2, 3]
Vue.delete(arr, 1) // 删除元素2
// 现在 arr 变成 [1, 3]
```
