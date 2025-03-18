# git 提交前

- husky
- lint-staged

---

`husky` 是一个用于在 git 进程的不同阶段运行脚本的工具，例如 add、commit、push 等。我们希望能够设置某些条件，并且只有在我们的代码满足这些条件时才允许提交和推送之类的事情成功，假设这表明我们的项目质量是可以接受的。

::: tip husky 文档

[https://typicode.github.io/husky/zh/](https://typicode.github.io/husky/zh/)

:::

---

`lint-staged` 提交前对代码进行 eslint 校验

## husky 的使用

### 1. 安装

```bash
npm i husky -D
```

### 2. 初始化

```bash
npx husky init
```

`init` 命令简化了项目中的 `husky` 设置。根目录下会有 `.husky` 目录，它会在 `.husky` 中创建 `pre-commit` 脚本，并更新 `package.json` 中的 `prepare` 脚本。随后可根据你的工作流进行修改。

```json
// package.json 自动新增脚本
"scripts": {
    "prepare": "husky",
}
```

```bash
- .husky 目录文件：
  - _ # 包含git信息，如果项目没有绑定git仓库，在最后 commitlint 检查时不会进行校验
  - pre-commit
```

### 3. 在 pre-commit 中添加内容

> `pre-commit` 文件：提交前执行

```bash
# 该代码是下面 lint-staged 要使用的，执行 husky 会调用该代码，进行 eslint 检查
npx lint-staged
# pnpm
pnpm exec lint-staged
```

## lint-staged 的使用

### 1. 安装

```bash
npm i lint-staged -D

# 安装 eslint
npm i eslint -D
```

### 2. 配置

```json
"scripts": {
    "prepare": "husky",
    "lint": "eslint . --ext .vue,.js,.jsx,.cjs,.mjs,.ts,.tsx,.cts,.mts --fix --ignore-path .gitignore"
}
"lint-staged": {
  // 命中的文件格式：提交时哪些文件需要做eslint格式校验
  "*.{js,ts,vue}": "npm run lint" // 执行的是上面scripts的lint命令
}
```
