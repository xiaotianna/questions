# peerDependencies

`peerDependencies`：对等依赖

例子：

如果你开发一个库是一个基于dayjs开发的时间库，比如想做10分钟前，3小时前，1天前这种功能，基于dayjs做的，取名timejs，把 `peerDependencies` 里写了dayjs，那这时候，如果你有一个项目需要引入timejs，如果这个项目本身有dayjs，就不会再安装dayjs；若项目未装对应依赖，不会自动安装，npm 会抛出警告，需手动安装兼容版本。