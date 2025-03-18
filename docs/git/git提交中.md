# git 提交中

- cz-vinyl
- commitizen

::: tip cz-vinyl

`cz-vinyl` 提供了一些预定义的提交类型和范围，也可以根据用户的实际需求进行自定义设置。

文档：[https://www.npmjs.com/package/cz-vinyl](https://www.npmjs.com/package/cz-vinyl)

:::

::: tip commitizen

`commitizen` 是一个用于帮助规范化Git提交消息的工具，使用 `commitizen` 提交时，系统会提示您在提交时填写任何必需的提交字段。不再需要等到稍后 `git commit` 钩子运行并拒绝你的提交

文档：[https://www.npmjs.com/package/commitizen](https://www.npmjs.com/package/commitizen)

:::

## cz-vinyl 的使用

### 1. 安装

```bash
npm i -D cz-vinyl@1
```

### 2. 对终端 `git cz` 命令进行汉化

::: details 新建 `.czvinylrc` 文件

```json
{
    "headerFormat": "{type}({scope}): {subject}",
    "commitTypes": [
        {
            "description": "一个新的功能",
            "value": "feat"
        },
        {
            "description": "一个BUG修复",
            "value": "fix"
        },
        {
            "description": "辅助工具更改或者无法分类的提交",
            "value": "chore"
        },
        {
            "description": "提高性能的代码更改",
            "value": "perf"
        },
        {
            "description": "不修复错误也不增加功能的重构代码",
            "value": "refactor"
        },
        {
            "description": "更新代码格式",
            "value": "style"
        },
        {
            "description": "添加测试用例",
            "value": "test"
        },
        {
            "description": "更新文档",
            "value": "docs"
        },
        {
            "description": "更新CI发版代码",
            "value": "ci"
        },
        {
            "description": "更新构建依赖等模块",
            "value": "build"
        }
    ],
    "skipScope": false,
    "skipTicketId": true,
    "subjectMaxLength": 70,
    "subjectMinLength": 3,
    "typeQuestion": "请选择一个提交类型：",
    "scopeQuestion": "请输入一个改动范围：",
    "subjectQuestion": "请输入一个提交信息：",
    "bodyQuestion": "请输入一个提交详细内容（可跳过）："
}
```

:::

## commitizen 的使用

### 1. 全局安装

```bash
npm install -g commitizen
```

### 2. 配置 package.json

```json
"config": {
  "commitizen": {
    "path": "./node_modules/cz-vinyl"
  }
}
```

### 3. 使用

用 `git cz` 命令代替 `git commit`    