# vite

## vite 打包优化策略

Vite 的优化主要是围绕以下几个方面：

- 代码拆分
  - 利用动态导入 (`import()`) 实现代码分割。
  - 使用 rollupOptions 中的 output 和 input 来控制输出和输入配置，进一步优化代码拆分。
- 资源压缩
  - 使用 `Terser` 或其他插件来压缩 JavaScript。
  - 使用 `html-minifier-terser` 或类似插件压缩 HTML。
  - 使用 `imagemin` 插件来压缩图像资源。
- 缓存利用
  - Vite 内置的 HMR 和增量构建可以减少构建时间。
  - 使用 .vite 目录下的缓存文件来加速后续构建。
- 构建配置
  - 通过 rollupOptions 配置来排除不需要打包的外部依赖。
  - 调整 `chunkSizeWarningLimit` 来调整警告的 chunk 大小限制。
- 按需加载
  - 使用插件来实现第三方库的按需加载，比如 lodash-es 和 `babel-plugin-import`。
- 路径别名
  - 配置 resolve.alias 来简化和标准化模块导入路径。
- CDN 加速
  - 将一些稳定的外部依赖通过 CDN 加载，而不是打包进项目中。
- 分析工具
  - 使用 @rollup/plugin-analyzer 或类似插件来分析打包后的文件大小分布，帮助识别优化点。

## vite 依赖预构建

Vite 的依赖预构建是其性能优化的关键特性之一，以下是关于 Vite 依赖预构建的详细说明：

- **按需编译**：Vite 只会在首次加载或开发过程中首次访问某个模块时进行编译。这种按需编译的方式避免了对整个项目进行一次性编译，从而大大减少了初始启动时间。

- **缓存机制**：Vite 使用 .vite 目录来缓存预构建的依赖结果。在后续的开发过程中，如果依赖没有发生变化，则可以直接使用缓存的结果，进一步加快了构建速度。

- **ESM 优先**：Vite 原生支持 ESM（ECMAScript Module），它会尽可能地将依赖以 ESM 格式进行预构建。这不仅提高了兼容性，还使得浏览器可以直接加载这些模块，而不需要额外的打包步骤。

- **并行处理**：Vite 能够并行地对多个依赖进行预构建，充分利用多核 CPU 的性能优势，缩短了整体的构建时间。

- **插件支持**：Vite 提供了丰富的插件系统，开发者可以通过插件自定义预构建的行为，例如指定某些依赖不参与预构建或者调整预构建的顺序等。

## 指定 vite 插件构建顺序

`enforce: "pre" | "post" | undefined;`

## vite 插件常用 hook

> 说说你在开发 vite 插件，用到了哪些 vite 的钩子

- vite 独有
  - config：在解析 Vite 配置前调用
  - transformIndexHtml：转换 index.html 的专用钩子。钩子接收当前的 HTML 字符串和转换上下文
- rollup 和 vite 共用
  - options：在解析 Rollup 配置前调用
  - buildStart：在构建开始时调用

## 为什么说 vite 比 webpack 快

- 按需编译：
  - Vite：Vite 启动时不会打包整个项目，而是将代码分为**依赖**（`node_modules`，预打包为 ESM）和**源码**（按需编译）。当浏览器请求某个模块时，Vite 才实时编译并返回该模块，实现快速的冷启动和热更新。
  - Webpack：通常需要对整个项目进行一次性编译，即使只修改了一个文件，也会重新打包受影响的部分，导致较慢的开发体验。
- 原生 ESM 支持：
  - Vite：基于 ES 模块系统构建，能够直接解析和加载 ESM 文件，无需额外的打包步骤。浏览器可以直接理解这些模块，进一步提升了性能。
- 依赖预构建：
  - Vite：首次启动时会预构建第三方依赖（将 CommonJS 格式转为 ES 模块），并缓存到本地。后续开发中，依赖代码不会再重新处理；即使业务代码修改，HMR 也只需关注业务模块，不触碰依赖。
  - Webpack：第三方依赖会和业务代码一起打包，对于依赖库的处理较为耗时，尤其是在大型项目中，依赖库的打包会显著增加构建时间。
- 热更新 (HMR)：两者的 HMR 实现逻辑完全不同：
  - Vite：基于**原生 ES 模块**，开发环境下不打包，直接将代码以原生 ES 模块（import/export）的形式发送给浏览器
  - Webpack：需要通过**打包产物和中间层（HMR Runtime）** 间接处理，开发环境下也需要先将代码打包成 CommonJS/ES 模块的混合产物（依赖webpack-dev-server）
- 底层语言的差异：
  - `webpack` 是基于 Node.js 构建的，而 Vite 则是基于 esbuild 进行预构建依赖。esbuild 是采用 Go语言编写的。

## webpack 和 vite 配置为什么是在一个 js 文件

1. 可编程的 “配置”，JavaScript/TypeScript 是最自然的选择
   配置文件的本质：可编程的 “配置”，而非单纯的静态配置文件（如 JSON/XML）
2. 拥有动态性与逻辑控制（条件判断（if-else）、循环（for）、函数封装 ）
3. 模块化与复用性
