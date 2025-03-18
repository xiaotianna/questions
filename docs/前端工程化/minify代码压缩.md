# minify 代码压缩

1. 去除多余字符
2. 压缩变量名
3. 逻辑解析 合并声明

```js
// 逻辑解析 合并声明
// 转换前
const a = 1
const b = 2
// 转换后
const a = 1,b = 2
```

4. 预编译 pre-compiler

```js
// 转换前
function hello() {
  console.log('hello')
}
hello()

// 转换后
console.log('hello')
```
