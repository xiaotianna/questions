# wxg 二面-微信公众号面经

1、挑一个有难度的项目讲一下

- 低代码项目

2、为什么会做这个项目？

- 看了“即时设计”，感觉这个项目很棒，就想用低代码生成海报页面

3、项目实现了什么功能？

4、如何实现低代码的逻辑？

- 配置物料的 json schema

5、例如两个组件，一个组件选择后，另一个组件会根据第一个组件的配置动态变化（也就是动态表单）

- 这个项目没有，但说了一下实现方式，可以采用对象的配置形式

```js
const config = {
  type: 'el-select',
  next: [
    {
      type: 'el-input',
      next: []
    }
  ]
}
```

面试官说这个实现也可以，就是有点复杂了（好像没有答到面试官的点上）

::: tip 答案

:::

6、低代码数据是如何保存的？

7、node 方面，为什么选用 nestjs？

8、在 nestjs 中写了哪些装饰器和管道？

9、说一下 jwt 如何实现的？

10、jwt 放在 header 里的吗？为什么要放在 header 里？

- 问懵了，感觉这个东西是学的时候就是写在 header 里的

::: tip 答案

1. 安全性
   - 防止 CSRF 攻击：将 Token 放在请求头中而不是 URL 中，可以有效防止跨站请求伪造（CSRF）攻击。CSRF 攻击通常通过 URL 参数来传播 Token，而请求头中的 Token 不会被浏览器自动附加到跨域请求中。
   - 减少泄露风险：Token 放在请求头中不容易被第三方（如其他网站）通过 URL 参数获取，降低了 Token 泄露的风险。
2. 标准化
   - 遵循 HTTP 标准：将 Token 放在请求头中符合 HTTP 协议的标准做法。HTTP 请求头是设计用来传递元数据的地方，而 Token 本质上是请求的元数据之一。
   - 易于解析：服务器可以方便地从请求头中提取 Token 进行验证，而不需要解析 URL 或请求体。
3. 方便性
   - 简化前端实现：前端开发者可以在发送请求时统一设置请求头，而不需要在每个请求中手动附加 Token 到 URL 或请求体中。
   - 支持多种请求方法：无论是 GET、POST、PUT 还是 DELETE 请求，都可以通过请求头传递 Token，而不需要对不同请求方法进行特殊处理。

:::

11、如何搭建 monorepo 项目的？

12、monorepo 的优点呢？

13、vite 配置有写哪些配置？

14、物料组件库打包出来的内容是哪些文件？

15、esm 和 umd 的区别？（上一个问题说了打包的产物文件有 esm 和 umd 两种格式）

16、开始说第二个项目，说说 mini markdown 编辑器？

- 主要描述了一下项目结构和功能

17、markdown 编辑器要插入图片如何实现？

- 插入链接
- 上传图片，通过回调回传

18、markdown 渲染的样式是如何做的？

- 采用 css 变量方式写了两套

11、编译出来的样式是 style 内联还是 class？

- class

12、编译出来的产物，如果用户要使用，没有这个 class 类如何使用？

- 编辑器是打包会把 class 内置到 js 中
- （ps：没注意打包产物的样式），用的是 css-in-js，内置的样式（后来看了下打包产物：在 js 文件中采用模版字符串写的的 class）
- ast 部分将 css 文件导出后，引入使用

13、编辑器做了 xss 防范，如何实现的？

- 因为做了 html 标签的语法，主要是把 onclick 这些事件做了移除

14、在移除事件的时候，是在哪个步骤移除的？

- 在语法解析的时候移除（正则匹配过程）
- 面试官问：在 markdown 中有 onclick 吗，我说用户在写的时候当作字符串写的，不存在 onclick

15、是用 react 写的吗？vue 和 react 的区别？

16、哪个性能要好一点？

- 刚上手 vue 性能要好，顺便简单说了一下 vue、react 的原理和 diff 算法

17、看说一下第三个项目还是实习经历？说一下亮点部分？

- im 桌面端，围绕 webrtc 和 websocket 来说

18、群聊掉线重连后如何获取到数据？

- 群聊掉线重连后，需要重新获取历史消息，然后重新渲染页面。

19、假如用户发消息失败？如何处理？

- 发送不到服务器的话，本地自己方添加一个“红叉”提示

20、如何是某一方接收失败如何处理？

- 数据存储到数据库的，刷新后即可

---

> 最后问了一些基础问题

1、发送 url 后，浏览器做了什么？

2、加载 dom 树和 cssom 树是同步的吗？

3、那 js 解析顺序是同步的吗？

- 不是，答了 js 线程和 gui 线程互斥

4、缓存

- 强缓存
- 协商缓存
- 启发式缓存
- 策略缓存

5、js 方面如何实现私有类字段？

- es6 class 使用 private 关键字

6、不用 es6 如何实现？

- 使用闭包实现私有属性和方法

```js
function MyClass(privateValue) {
  // 私有属性
  var privateProperty = privateValue

  // 私有方法
  function privateMethod() {
    console.log('Private method called. Private property:', privateProperty)
  }

  // 公共方法
  this.publicMethod = function () {
    console.log('Public method called.')
    privateMethod() // 可以在公共方法中调用私有方法
  }

  // 公共属性
  this.publicProperty = 'This is a public property'
}

// 创建实例
var instance = new MyClass('Secret Value')

// 访问公共属性和方法
console.log(instance.publicProperty) // 输出: This is a public property
instance.publicMethod() // 输出: Public method called. Private method called. Private property: Secret Value

// 尝试访问私有属性和方法
console.log(instance.privateProperty) // 输出: undefined
instance.privateMethod() // 报错: instance.privateMethod is not a function
```

7、https 是怎么防止中间人获取到数据的？

- 答了 https 加密过程，顺便说了像抓包工具也是可以获取到 https 的数据的，说了中间人颁发假证书的过程

8、平时是如何关注前端新技术，和学习技术？

9、是如何学习这么多的东西？

---

反问：本次面试有哪些不足，下来如何进行查漏补缺？还有后续还要学习什么关键的技术？

面试官说：需要补全常见算法的思路和写法，多了解一下ai方面的内容
