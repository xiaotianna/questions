# VNode 代替 v-html

## 背景一：文本换行

写业务的时候遇到了后端给我返回的字符串数据中带有 `\n\n`  标识换行，前端我需要做换行效果，起初使用  `white-space: pre-line;` 这个 css 属性就能解决，但是需要添加分割线，这个属性就解决不了我的问题了。
我的思路是获取到内容后，通过切割，将 `\n\n`  的标识符做切割，返回动态拼接一个分割线 dom（`<div class="line" />`，然后通过 `v-html` 进行渲染。

但是元素的样式如果使用了`scoped`的话就不会生效，因为这个样式只能应用到当前组件模板中的元素，而不能应用到通过 v-html 动态插入的内容。

::: details 具体代码

1. 利用`h`函数，将内容转为 vnode

```ts
const formatScriptText = (text?: string) => {
  if (!text) return
  const paragraphs = text!.split('\n\n')
  const vnode = paragraphs
    .map((p, index) => {
      if (index < paragraphs.length - 1) {
        return [h('div', { class: 'content' }, p), h('div', { class: 'line' })]
      } else {
        // 最后一段只返回内容，不添加分隔线
        return [h('div', { class: 'content' }, p)]
      }
    })
    .flat() // flat编排化数组
  return vnode
}
```

2. 渲染 vnode

**方法 1**：通过动态组件去渲染

```vue
<template v-for="(node, idx) in formatScriptText(xxx)" :key="idx">
  <component :is="node" />
</template>
```

**方法 2**：定义一个组件，通过 render 函数渲染

```vue
<template>
  <VNodeRenderer :nodes="formatScriptText(xxx)" />
</template>

<script lang="ts" setup>
// 创建一个渲染 vnode 数组的组件
const VNodeRenderer = defineComponent({
  props: {
    nodes: {
      type: Array as PropType<VNode[]>,
      required: true
    }
  },
  render() {
    return this.nodes
  }
})
</script>
```

:::

## 背景二：违禁词替换

主要是通过正则匹配到违禁词，然后将违禁词替换成带样式的 vnode

> 使用 `v-html` 处理不方便，同时样式用不了`scope`的话会污染全局。

```ts
const renderContent = computed(() => {
  const contentArr = content_str.value.split('\n').filter(Boolean)
  const vnodes = contentArr.map((item, index) => {
    const nodes = []
    // 处理文本内容，将违禁词包装成带样式的 vnode
    const contentVNodes = []
    let text = item
    const prohibitedWords = result.value
    if (prohibitedWords.length > 0) {
      // 对每个关键词进行转义，处理特殊字符
      // .、*、?、$ 等进行转义，防止在构造正则表达式时出错
      const regexProhibitedWords = prohibitedWords.map((word) =>
        word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      )
      const regex = new RegExp(`(${regexProhibitedWords.join('|')})`)
      const parts = text.split(regex)
      parts.forEach((part) => {
        if (part && prohibitedWords.includes(part)) {
          // 违禁词使用 error-text 样式
          contentVNodes.push(h('span', { class: 'error-text' }, part))
        } else if (part) {
          // 普通文本
          contentVNodes.push(part)
        }
      })
    } else {
      // 没有违禁词时直接显示文本
      contentVNodes.push(text)
    }

    nodes.push(h('div', { class: 'content' }, contentVNodes))
    if (index !== contentArr.length - 1) {
      nodes.push(h('div', { class: 'gap-line' }))
    }
    return nodes
  })
  // 拍平
  return vnodes.flat()
})
```

渲染

```vue
<template>
  <div
    v-for="(node, index) in renderContent"
    :key="index"
    class="pb-[150px]"
  >
    <component :is="node" />
  </div>
</template>
```
