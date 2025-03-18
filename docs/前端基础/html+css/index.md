# HTML

## 问题 1：什么是重绘，什么是回流？如何减少回流？

- **重绘（Repaint）：**

重绘是指当元素样式发生改变，但不影响其布局的情况下，浏览器重新绘制元素的过程。例如，修改元素的背景颜色、字体颜色等。

- **回流（Reflow）：**

回流是指当元素的布局属性发生改变，需要重新计算元素在页面中的布局位置时，浏览器重新进行布局的过程。例如，修改元素的宽度、高度、位置等。

回流的成本比重绘高得多，因为它涉及重新计算元素的几何属性和页面布局。而重绘只需要重新绘制已计算好的元素样式。

- **如何减少：**
  - **使用 CSS 动画代替 JavaScript 动画**：CSS 动画利用 GPU 加速，在性能方面通常比 JavaScript 动画更高效。使用 CSS 的 `transform` 和 `opacity` 属性来创建动画效果，而不是改变元素的布局属性，如宽度、高度等。
  - **使用 `translate3d` 开启硬件加速**：将元素的位移属性设置为 `translate3d(0, 0, 0)`，可以强制使用 GPU 加速。这有助于避免回流，并提高动画的流畅度。
  - **避免频繁操作影响布局的样式属性**：当需要对元素进行多次样式修改时，可以考虑将这些修改合并为一次操作。通过添加/移除 CSS 类来一次性改变多个样式属性，而不是逐个修改。
  - **使用 `requestAnimationFrame`**：通过使用 `requestAnimationFrame` 方法调度动画帧，可以确保动画在浏览器的重绘周期内执行，从而避免不必要的回流。这种方式可确保动画在最佳时间点进行渲染。
  - **使用文档片段（Document Fragment）**：当需要向 DOM 中插入大量新元素时，可以先将这些元素添加到文档片段中，然后再将整个文档片段一次性插入到 DOM 中。这样做可以减少回流次数。(虚拟 dom vue 的方式)
  - **让元素脱离文档流**：position:absolute / position:fixed / float:left，（只是减少回流，不是避免回流。）
  - **使用 `visibility: hidden` 替代 `display: none`**：`visibility: hidden` 不会触发回流，因为元素仍然占据空间，只是不可见。而使用 `display: none` 则会将元素从渲染树中移除，引起回流。

## 问题 2：Margin 塌陷问题如何解决？BFC 是什么？怎么触发？

```html
<html>
  <head>
    <style type="text/css">
      .box {
        width: 100px;
        height: 100px;
        background-color: red;
      }
      #box1 {
        margin-bottom: 200px;
      }
      #box2 {
        margin-top: 100px;
      }
    </style>
  </head>
  <body>
    <div
      id="box1"
      class="box"
    ></div>
    <div
      id="box2"
      class="box"
    ></div>
  </body>
</html>
```

- **margin 塌陷问题**：上面例子两个 div 的间隔为 200px，取 margin 重叠部分的更大值（这是正常情况，符合 CSS 的外边距合并规则），如果希望间隔 300px，可为每个 div 触发 BFC。
- **BFC 定义**：全称叫块级格式化上下文（Block Formatting Context），一个独立的渲染区域，有自己的渲染规则，与外部元素不会互相影响。
- **BFC 触发方式**：
  - 设置了 float 属性（值不为 none）
  - 设置了 position 属性为 absolute 或 fixed
  - 设置了 display 属性为 inline-block
  - 设置了 overflow 属性（值不为 visible）

## 问题 3：如何隐藏一个元素

| 方式                              | 占位 | 点击事件 |
| --------------------------------- | ---- | -------- |
| `display: none`                   | ❌   | ❌       |
| `opacity: 0`                      | ✅   | ✅       |
| `visibility: hidden`              | ✅   | ❌       |
| `clip-path: circle(0)`            | ✅   | ❌       |
| `position:absolute; top: -999px;` | ❌   | ✅       |

## 问题 4：overflow 不同值的区别

| 属性值    | 效果                                                                                                                                     |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `visible` | 内容溢出容器时，会呈现在容器之外，不会被隐藏或截断。这意味着溢出的内容会覆盖其他元素。                                                   |
| `hidden`  | 内容溢出容器时，会被隐藏，不可见。这意味着超出容器的部分将被截断并隐藏。                                                                 |
| `scroll`  | 如果内容溢出容器，将会显示滚动条以便查看溢出内容。用户可以滚动内容以查看被隐藏的部分。即使内容没有溢出，也会显示滚动条，但它们会被禁用。 |
| `auto`    | 与 `scroll` 类似，如果内容溢出容器，会显示滚动条。但与 `scroll` 不同的是，滚动条仅在内容溢出时才会出现，否则会被禁用。                   |
| `inherit` | 继承父元素的 `overflow` 值。                                                                                                             |

## 问题 5：iframe 有哪些优缺点及使用场景

`<iframe>`（内联框架）是 HTML 中的一个标签，用于在当前页面中嵌入另一个页面。

**优点：**

- **分离内容**：`<iframe>` 允许将不同来源或不同内容的页面嵌套在一起。这有助于将内容分隔开，允许不同团队或服务提供商提供各自的内容。
- **实现跨域通信**：`<iframe>` 可用于实现跨域通信，例如在父页面和嵌套的 `<iframe>` 页面之间传递数据，从而创建丰富的嵌入式应用程序。
- **安全性**：`<iframe>` 可以提高安全性，因为它可以将来自不受信任的来源的内容隔离在一个独立的沙盒中，以防止对主页面的恶意攻击。
- **无需刷新**：`<iframe>` 允许在不刷新整个页面的情况下加载新内容，这对于实现动态加载内容或应用程序非常有用。

**缺点：**

- **性能问题**：每个 `<iframe>` 都会加载一个新页面，这可能会导致性能问题，特别是在多个嵌套的 `<iframe>` 页面存在时。
- **可访问性问题**：`<iframe>` 可能会导致可访问性问题，因为屏幕阅读器可能不会正确处理嵌套的页面。确保提供替代文本和合适的 ARIA 标记以提高可访问性。
- **不利于 SEO**：搜索引擎通常不会索引嵌套在 `<iframe>` 中的内容，这可能对网站的搜索引擎优化（SEO）产生负面影响。
- **兼容性问题**：某些浏览器和设备可能不正确支持 `<iframe>`，或者可能需要特殊处理以确保它们正确显示。

**使用场景：**

- **嵌入外部内容**：例如，将 YouTube 视频、Google 地图或社交媒体小部件嵌入网页。
- **分离组件**：将不同部分的网页分开以进行模块化开发。这对于大型应用程序或团队协作非常有用。
- **安全沙盒**：将不受信任的内容隔离在一个沙盒中，以提高安全性。
- **跨域通信**：在不同源的页面之间进行数据交换，以创建富客户端应用程序。

## 问题 6：CSS 中选择器的优先级和权重计算方式

1. **!important 规则**：如果有 `!important` 声明，那么该规则具有最高的优先级。

2. **特定性**：特定性值的大小来排序，特定性值较大的规则具有更高的优先级，权重计算方式如下：

- **内联样式**：每个内联样式规则的特定性为 `1000`。
- **ID 选择器**：每个 ID 选择器的特定性为 `100`。
- **类选择器、属性选择器和伪类选择器**：每个类选择器、属性选择器和伪类选择器的特定性为 `10`。
- **元素选择器和伪元素选择器**：每个元素选择器和伪元素选择器的特定性为 `1`。

案例：

- `#header`：特定性值为 100（1 个 ID 选择器）。
- `.menu-item`：特定性值为 10（1 个类选择器）。
- `ul li`：特定性值为 2（2 个元素选择器）。

3. **覆盖规则**：如果两个规则具有相同的特定性，后面定义的规则将覆盖先前定义的规则，因此后定义的规则具有更高的优先级。

## 问题 7：什么是浮动，浮动会引起什么问题，有何解决方案？

浮动（float）是 CSS 中的一种布局属性，用于控制元素在其父元素中的位置，使元素可以浮动到其父元素的左侧或右侧。浮动通常用于实现文本环绕图片、创建多列布局等效果。

**导致问题：**

- 高度塌陷（Collapsing）：浮动元素会导致其父元素的高度塌陷，使父元素无法自动适应浮动元素的高度。
- 元素重叠（Overlapping）：浮动元素可能会重叠在一起，导致布局混乱。

**解决方案：**

- 清除浮动（Clearing Floats）：在包含浮动元素的父元素之后，可以使用 `clear` 属性来清除浮动。

```css
.clearfix::after {
  content: '';
  display: table;
  clear: both;
}
```

- 使用 `display: inline-block`：将需要浮动的元素设置为 `display: inline-block`，可以模拟浮动效果，但不会导致高度塌陷，因为 `inline-block` 元素会受到文本行的影响。

- 使用 `position: absolute`：在某些情况下，`position: absolute` 也可以替代浮动，但需要搭配适当的定位属性来控制元素的位置。

- 使用 `overflow: hidden`：在包含浮动元素的父元素上添加 `overflow: hidden` 可以清除浮动，但可能会剪切内容，因此需谨慎使用。

## 问题 8：设置一个元素的背景颜色会填充的区域

- **内容区域**：背景颜色会填充元素的内容区域，即文本和内联元素所在的区域。
- **内边距区域**：如果元素具有内边距（通过 `padding` 属性设置），背景颜色也会填充内边距区域。
- **边框区域**：如果元素具有边框（通过 `border` 属性设置），且背景颜色为 `transparent`，也会填充边框区域。

背景颜色不会填充元素的外边距区域。外边距是元素与其他元素之间的间距，背景颜色通常不会扩展到外边距。这意味着背景颜色将覆盖元素的内容、内边距和边框，但不会覆盖外边距。这是 CSS 中背景颜色的标准行为。

> 也就是只有 `margin` 不会被填充，其余都会被填充背景色。

## 问题 9：Less 和 Sass 的区别

1. 编译

- Less：可通过 JavaScript 在客户端或 Node.js 在服务器端编译。
- Sass：通常通过 Ruby 或 LibSass（C/C++ 实现）编译，速度较快。

2. 功能

- Sass 比 Less 更强大，它支持嵌套、变量、混合（mixins）、导入（imports）、函数等。

3. 总结

- Less：适合初学者或小型项目。
- Sass：功能更强大，适合复杂项目。

## 问题 10：link 标签和 import 标签的区别？

`<link>` 标签和 `@import` 规则都用于引入外部 CSS 文件，区别如下：

- **语法和用法**：

  - `<link>` 标签是 HTML 标记，用于在 HTML 文档的`<head>`部分中引入外部 CSS 文件。它具有自己的属性，例如 `rel`（关系）、`href`（资源链接）、`type`（MIME 类型）等。

  ```html
  <link
    rel="stylesheet"
    type="text/css"
    href="styles.css"
  />
  ```

  - `@import` 是 CSS 规则，用于在 CSS 样式表中引入外部 CSS 文件。它必须位于 CSS 样式表中，通常放在样式表的顶部，可以用于导入其他 CSS 文件。

  ```css
  @import url('styles.css');
  ```

- **加载方式**：

  - `<link>` 标签会在页面加载过程中同时加载 CSS 文件，这可以并行进行，不会阻止页面的渲染。
  - `@import` 规则只能在当前 CSS 文件加载完成后才会加载引入的外部 CSS 文件，这会导致页面渲染的延迟，因为它会阻止页面的渲染。

- **兼容性**：

  - `<link>` 标签的支持广泛，可以用于所有 HTML 版本。
  - `@import` 规则是 CSS2 引入的特性，较旧的浏览器可能不支持，尤其是在 CSS1 规范中并没有这个特性。但在现代浏览器中，它通常能够正常工作。

- **维护和管理**：

  - 使用 `<link>` 标签更容易维护和管理，因为它与 HTML 文档分开，并且可以在文档的 `<head>` 部分中轻松找到。
  - 使用 `@import` 规则时，CSS 代码和引入的 CSS 文件混在一起，可能会导致维护复杂度增加，特别是在大型项目中。

## 问题 11：块元素、行元素、置换元素的区别

在 HTML 和 CSS 中，元素可以根据它们的行为和显示方式分为：

1. 块级元素（Block-level Elements）
2. 内联元素（Inline Elements）
3. 置换元素（Replaced Elements）

**块级元素（Block-level Elements）：**

- 块级元素通常以新行开始，占据父元素可用宽度的整个宽度。
- 块级元素可以包含其他块级元素和内联元素。
- 常见的块级元素包括 `<div>`、`<p>`、`<h1>` - `<h6>`、`<ul>`、`<ol>`、`<li>` 等。

**内联元素（Inline Elements）：**

- 内联元素通常不会导致新行的开始，它们只占据它们的内容宽度。
- 内联元素通常包含在块级元素内部，可以与其他内联元素在同一行上。
- 常见的内联元素包括 `<span>`、`<a>`、`<strong>`、`<em>`、`<img>`、`<br>` 等。

**置换元素（Replaced Elements）：**

- 置换元素是一种特殊类型的元素，其内容通常由外部资源（如图像、视频或浏览器默认样式）来替代。
- 置换元素的尺寸和外观通常由外部资源定义，而不是 CSS 样式。
- 常见的置换元素包括 `<img>`、`<video>`、`<iframe>` 等。

**注意**：这些术语描述了元素的默认行为，但 CSS 可以用于修改元素的显示方式。例如，可以使用 CSS 将内联元素转换为块级元素，或者使用 `display` 属性将块级元素转换为内联元素。置换元素的行为通常是固定的，但也可以通过 CSS 进行一些控制。这些概念对于理解和掌握 HTML 和 CSS 的布局和显示方式非常重要，因为它们影响到页面结构和样式的创建和控制。

## 问题 12：响应式和自适应

- **响应式设计：**
  - 使用 CSS 媒体查询（Media Queries）和流式布局（Fluid Grids）来<u>根据屏幕尺寸动态调整页面布局</u>。
  - 页面元素的大小和位置会随着浏览器窗口的变化而自动调整。
  - 通常使用`百分比`、`em`、`rem`等相对单位来定义尺寸。
- **自适应设计：**
  - 为不同的设备或屏幕尺寸设计多个固定的布局版本。
  - 使用服务器端或客户端检测设备类型，然后加载相应的布局。
  - 页面布局在特定设备上是固定的，不会随窗口大小变化而动态调整。

## 问题 13：BFC

### 1. 定义

BFC：块级格式化上下文，就是一个独立的布局环境，BFC 里面的元素跟外面互不影响

### 2. BFC 的布局规则（特性）

1. 垂直方向上的距离由 `margin` 决定，在同一个 BFC 里的相邻的两个块的 `margin` 会重叠

2. 开启了 `BFC` 的块和浮动元素不会重叠，会挨着浮动元素显示。

> 一般情况下，两个元素，一个开启了浮动的元素，会盖住另一个未浮动的元素。

3. 计算 `BFC` 高度的时候，浮动的子元素也参与计算。

> 这就是 `overflow: hidden;` 可以解决浮动后，父容器高度为 0 的问题。

### 3. 如何开启 BFC

有两种情况：

1. 手动开启，如：
   - 浮动的元素（给元素添加浮动）
   - 定位的元素（position 值为 `absolute` 或 `fixed`）
   - display 为 `inline-block`、`flex`、`inline-flex`、`grid` 或 `inline-grid`
   - overflow 除 `visible` 外的值
2. 默认开启，如：`html根元素`

### 4. 解决的问题

1. margin 重叠问题：

例如：如下两个盒子的 `margin` 为 `200px`（因为 `html根元素` 天生就是一个 BFC）

> 会取值较大值

```html {15,21,26,27}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Document</title>
    <style>
      .box1 {
        width: 200px;
        height: 200px;
        background-color: red;
        margin-bottom: 50px;
      }
      .box2 {
        width: 200px;
        height: 200px;
        background-color: blue;
        margin-top: 200px;
      }
    </style>
  </head>
  <body>
    <div class="box1"></div>
    <div class="box2"></div>
  </body>
</html>
```

解决方法：用 `BFC` 元素包裹住其中一个

```html {25}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Document</title>
    <style>
      .box1 {
        width: 200px;
        height: 200px;
        background-color: red;
        margin-bottom: 50px;
      }
      .box2 {
        width: 200px;
        height: 200px;
        background-color: blue;
        margin-top: 200px;
      }
    </style>
  </head>
  <body>
    <div class="box1"></div>
    <div style="overflow: hidden;">
      <div class="box2"></div>
    </div>
  </body>
</html>
```

3. 浮动元素，父元素高度坍塌问题：

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Document</title>
    <style>
      .box1 {
        width: 100px;
        height: 100px;
        background-color: red;
        float: left;
      }
    </style>
  </head>
  <body>
    <div style="background-color: blue;">
      <div class="box1"></div>
    </div>
  </body>
</html>
```

解决办法：

给父元素设置 `overflow: hidden;`

```html {1}
<div style="overflow: hidden; background-color: blue;"></div>
```

2. 浮动元素和普通元素重叠问题：

> 给 box1 设置浮动，会盖住下面的 box2

```html {15}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Document</title>
    <style>
      .box1 {
        width: 300px;
        height: 300px;
        background-color: red;
        float: left;
      }
      .box2 {
        width: 400px;
        height: 400px;
        background-color: blue;
      }
    </style>
  </head>
  <body>
    <div class="box1"></div>
    <div class="box2"></div>
  </body>
</html>
```

解决方法：

将 box2 也设置为 bfc

```html {15,21}
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0"
    />
    <title>Document</title>
    <style>
      .box1 {
        width: 300px;
        height: 300px;
        background-color: red;
        float: left;
      }
      .box2 {
        width: 400px;
        height: 400px;
        background-color: blue;
        overflow: hidden;
      }
    </style>
  </head>
  <body>
    <div class="box1"></div>
    <div class="box2"></div>
  </body>
</html>
```

## 问题 14：如何画一条 0.5px 的线？

```css {4}
.thin-line {
  height: 1px;
  background: #000;
  transform: scaleY(0.5); /* 使用scale缩放高度为0.5，模拟较细的线 */
}
```
