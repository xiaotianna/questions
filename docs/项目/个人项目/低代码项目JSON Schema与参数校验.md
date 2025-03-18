# 低代码项目 JSON Schema 与 ajv、element-plus 表单校验集成

## 自定义组件如何实现 element-plus 的集成校验

主要是通过 `useFormItem` 获取到 `formItem` 对象，然后调用 `formItem.validate` 方法即可

```js
import { useFormItem } from 'element-plus'
const { formItem } = useFormItem()

const handleChange = () => {
  formItem.validate('chaneg').catch((err) => {
    console.log(err)
  })
}
```

## 使用 ajv 结合 JSON Schema 对表单提交内容进行校验

ajv 这个库主要是对 JSON Schema 进行校验的（不依赖表单验证就用 ajv）

## 项目的表单校验

项目采用两种 ajv + element-plus 的结合进行使用。

- ajv：提交按钮时对 `pinia` 中的渲染数据（`blockConfig: [] as BaseBlock[]`）进行校验
    - 实现：对 `blockConfig` 中的 `formData` 进行校验，校验不通过，根据渲染物料的id，去找到哪个物料配置不通过，去定位到不通过的表单内容
- element-plus：表单内容变化时进行校验
    - 实现：通过表单每一项的 key 值，去 物料的属性中获取 rules 字段，然后进行校验

对物料组件的 schema 配置新增字段，新增（ajv 校验字段 和 element-plus 表单校验字段）

> 为什么校验要添加到物料组件上？
>
> 1. 便于动态对 form 表单添加校验（可以传入 props 形式）
>
> 2. 便于实现每个不同物料组件的不同属性的校验规则

以 image 组件的 src 属性为例：

> 红色的为 ajv 校验字段，黄色的为 element-plus 表单校验字段

```ts
const src = Type.String({
  code: 'config-files',
  title: '图片',
  default: '',
  minLength: 1, // [!code error]
  errorMessage: { // [!code error]
    required: '请上传一个图片' // [!code error]
  }, // [!code error]
  rules: [ // [!code warning]
    { required: true, min: 1, message: '请上传一个图片', trigger: 'change' } // [!code warning]
  ] // [!code warning]
})
```

