# git

## git常用命令

1. `git init` 初始化本地仓库
2. `git add .` 将所有文件添加到暂存区
3. `git commit -m "xxx"` 将暂存区的文件提交到本地仓库
4. `git remote add origin <仓库url>` 添加远程仓库
5. `git push -u origin master` 将本地仓库推送到远程仓库
6. `git clone <仓库url>` 将远程仓库克隆到本地
7. `git clone -b <分支名> <仓库url>` 克隆指定分支代码
8. `git pull` 将远程仓库更新到本地仓库
9. `git checkout <分支名>` 切换分支
10. `git branch` 查看分支
11. `git branch -a` 查看所有分支
12. `git branch <分支名>` 创建分支
13. `git branch -m <分支名>` 重命名分支
14. `git branch -d <分支名>` 删除分支
15. `git branch -D <分支名>` 强制删除分支

::: warning 注意

`-d` 选项只会删除那些已经与当前分支合并的分支。如果该分支尚未合并，Git 会阻止你删除它，并提示你使用 `-D` 选项强制删除。

:::

16. `git merge <分支名>` 合并分支
17. `git stash save "xxx"` 暂存文件（当远程分支与本地分支文件不同时，有文件发生变化）
18. `git stash list` 查看暂存文件
19. `git stash <pop | apply>` 恢复暂存文件

::: warning 注意

`pop` 与 `apply` 的区别在于：在恢复归档后，`pop` 会将存档删除，而 `apply` 则不会删除存档。

- `git stash <pop | apply>` 命令恢复第一个存档，等价于 `git stash <pop | apply> stash@{0}`
- `git stash <pop | apply> <stash_name>` 命令恢复指定存档名的存档。

:::

20. `git stash <drop | clear>` 删除暂存文件

::: warning 注意

- `git stash drop stash_name` 命令删除指定存档名的存档。
- `git stash clear` 命令删除当前工程的所有的存档。

:::

21. `git reset --soft HEAD^` 撤销上次提交，并从提交历史中移除。
22. `git reset --soft HEAD~n` 撤销多个提交，n为要保留的提交数量。

## 面试题1：`git rebase` 和 `git merge` 的区别

`git rebase` 和 `git merge` 都是用于合并分支的 Git 命令，这两个命令都能将一个分支合并到另一个分支

- **git merge**: 将一个分支的更改合并到另一个分支，创建一个新的merge commit，将两个分支的历史合并在一起，这个merge commit会在分支历史中保留，可以清晰的看到那些分支合并到了柱分枝，合并后形成分叉结构。
- **git rebase**：两个分支在合并到时候，会将整个分支合并到另一个分支的顶端。首先找到两个分支的共同commit记录，然后提取之后所有的commit，然后将这个commit记录添加到另一个分支的最前面，两个分支合并后的commit记录就变成线性记录 

**总结：**
- `git rebase` **会改写提交历史，使其更线性和清晰**，但可能丧失上下文信息。它通常用于确保当前分支包含最新更改，并减少合并冲突。
- `git merge` **会创建合并提交，保留各分支的完整历史信息**。它用于将一个分支的更改合并到另一个分支，并保留各分支的历史。 