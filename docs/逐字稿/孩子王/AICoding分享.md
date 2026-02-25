# AI Coding 分享

在 AI 应用的消息格式扩展需求中，由于 AI 回复的 Markdown 内容需支持丰富 UI 组件展示，重点探究了 MDX 和 Web Component 两种扩展方案。

MDX 方案借助`@mdx-js/mdx`库实现，天然支持 JSX 语法，能将 AI 回复的纯文本标签解析为 React 组件，扩展和渲染都较为便捷，且能保证 UI 统一，适配 React 框架。核心是通过 compile 编译 MDX 内容为 JavaScript 函数体，再经 run 函数结合 React 运行时环境生成可渲染的 React 组件，最终传入自定义组件配置完成渲染。

Web Component 方案则利用浏览器原生支持的自定义标签能力，让 AI 回复的 HTML 标签直接渲染为对应组件，渲染逻辑简单，但写法相对繁琐；同时考虑到 React、Vue 框架下组件库 UI 统一的需求，需规避 Shadow DOM 导致的样式隔离问题，不创建 Shadow DOM，而是在自定义元素内部创建容器节点，像挂载根组件一样挂载 React 组件（如 Antd 组件），以此保证样式和组件正常渲染。

此外，针对 AI 生成页面的前端在线运行需求，可借助 Web Containers 技术，该技术能在浏览器中运行 Node 代码，具备虚拟文件系统和终端，只需将 AI 返回的 JSON 数据转换为 Web Containers 所需的文件树结构，即可实现在不依赖后端的情况下运行项目。
