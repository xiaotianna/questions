# git 提交后

::: tip @commitlint/cli

`git commit -m "msg"` 的格式校验，按照 cz 来规范了提交风格，但是依然有小伙伴通过 git commit 按照不规范的格式提交，这个时候就可以通过 commitlint 来限制不规范提交了。

文档：[https://commitlint.js.org/guides/getting-started.html](https://commitlint.js.org/guides/getting-started.html)

:::

## 使用

### 1. 安装

```bash
npm i --save-dev @commitlint/{cli,config-conventional}
```

### 2. 终端复制即可（官网有）

```bash
echo "export default { extends: ['@commitlint/config-conventional'] };" > commitlint.config.js
echo "npx --no -- commitlint --edit \$1" > .husky/commit-msg
```

运行完成后，在 `.husky` 目录下有新增 `commit-msg` 文件

### 3. 最后

会对 `git cz` 提交进行校验，如果格式不正确，会提示错误，并且不会提交。当提交通过后，就可以 `git push` 了。