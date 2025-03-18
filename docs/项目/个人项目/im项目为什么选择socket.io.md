# 项目为什么选择socket.io

在使用第三方 websocket 库的时候，有 ws 和 socket.io 两种选择。

**优缺点对比：**

- ws客户端不支持浏览器，需要用户自行封装websocket。
- socket.io 前后端都支持，分别有对应的包。
- socket.io客户端封装的websocket请求自带id，服务器可以根据id区分客户端，进行精准推送。
- socket.io 会自动重连（心跳、保活）；当浏览器不支持websocket时，会自动降级为轮询。
