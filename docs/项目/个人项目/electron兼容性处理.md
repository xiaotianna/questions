# electron 兼容性处理

在使用 Electron 开发跨平台应用时，Windows 和 macOS 存在诸多兼容性问题，以下为你详细介绍：

## 1. 系统菜单差异

- **表现**：Windows 和 macOS 的系统菜单样式和行为有所不同。macOS 应用菜单通常位于屏幕顶部全局菜单栏，而 Windows 应用菜单一般集成在窗口内。
- **处理方式**：利用 Electron 的 `Menu` 模块依据不同平台创建不同菜单。

```javascript
const { app, Menu } = require('electron')

const isMac = process.platform === 'darwin'

const template = [
  // ...其他菜单项
  {
    label: '编辑',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  }
]

if (isMac) {
  template.unshift({
    label: app.name,
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  })
}

const menu = Menu.buildFromTemplate(template)
Menu.setApplicationMenu(menu)
```

## 2. 文件路径格式差异

- **表现**：Windows 使用反斜杠 `\` 作为路径分隔符，macOS 使用正斜杠 `/`。并且，Windows 有盘符的概念，而 macOS 没有。
- **处理方式**：运用 Node.js 的 `path` 模块处理文件路径，而非硬编码路径分隔符。

```javascript
const path = require('path')

// 构建跨平台路径
const filePath = path.join('folder', 'subfolder', 'file.txt')
```

## 3. 窗口管理差异

- **表现**：Windows 和 macOS 的窗口管理方式不同，比如窗口的关闭、最小化、最大化按钮的位置和样式不同。
- **处理方式**：可以使用 Electron 的 `BrowserWindow` 自定义窗口样式和行为。

```javascript
const { BrowserWindow } = require('electron')

const mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  frame: false, // 隐藏默认窗口边框
  webPreferences: {
    nodeIntegration: true
  }
})

// 自定义窗口控制按钮逻辑
```

## 4. 快捷键差异

- **表现**：部分快捷键在两个平台上不同，例如复制粘贴快捷键，Windows 是 `Ctrl + C` 和 `Ctrl + V`，macOS 是 `Command + C` 和 `Command + V`。
- **处理方式**：在应用中根据不同平台设置不同的快捷键。

```javascript
const { globalShortcut } = require('electron')

const isMac = process.platform === 'darwin'

const copyShortcut = isMac ? 'Command+C' : 'Ctrl+C'
const pasteShortcut = isMac ? 'Command+V' : 'Ctrl+V'

globalShortcut.register(copyShortcut, () => {
  // 复制操作
})

globalShortcut.register(pasteShortcut, () => {
  // 粘贴操作
})
```

## 5. 权限管理差异

Mac 系统会弹出权限确认窗口，让用户决定是否允许应用访问摄像头。这是因为 Mac 的安全机制更为严格，在应用尝试访问敏感硬件（如摄像头、麦克风等）时，系统会要求用户明确授权，从而保护用户的隐私。需要在打包的时候配置 `entitlements.mac.plist` 文件，以请求摄像头权限，不然后续的摄像头操作可能会失败。

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
  <dict>
    <key>com.apple.security.cs.allow-jit</key>
    <true/>
    <key>com.apple.security.cs.allow-unsigned-executable-memory</key>
    <true/>
    <key>com.apple.security.cs.allow-dyld-environment-variables</key>
    <true/>
    <key>com.apple.security.device.audio-input</key>
    <true/>
    <key>com.apple.security.device.camera</key>
    <true/>
  </dict>
</plist>
```

```json
{
  "build": {
    "mac": {
      "target": ["dmg", "zip"],
      "entitlements": "scripts/entitlements.mac.plist",
      "hardenedRuntime": true,
      "extendInfo": {
        "NSMicrophoneUsageDescription": "请允许访问您的麦克风",
        "NSCameraUsageDescription": "请允许访问您的摄像头"
      }
    }
  }
}
```

Windows 系统的权限管理相对宽松。默认情况下，应用并不会直接获取摄像头权限。当应用尝试访问摄像头时，系统会在任务栏附近弹出一个小的提示框，提示用户应用正在请求访问摄像头，用户需要在提示框中进行确认操作，才能允许应用访问摄像头。

## 6. win 打包后包内容大小调整优化

在 windows 平台，打包完成后会有很多不需要的文件，其中 locales 是多语言的配置，36MB，我的应用不需要多语言，因此把除中文的全部排除

```js
const path = require('path')
const fs = require('fs-extra')

module.exports = async (context) => {
  if (process.platform === 'darwin') return
  const unpackedDir = path.join(context.appOutDir, 'locales')

  // 删除除 zh-CN.pak 之外的所有文件
  const files = await fs.readdir(unpackedDir)
  for (const file of files) {
    if (!file.endsWith('zh-CN.pak')) {
      await fs.remove(path.join(unpackedDir, file))
    }
  }

  // 删除特定的文件
  const filesToDelete = ['LICENSE.electron.txt', 'LICENSES.chromium.html']

  for (const fileName of filesToDelete) {
    const filePath = path.join(context.appOutDir, fileName)
    if (await fs.pathExists(filePath)) {
      await fs.remove(filePath)
    }
  }
}
```

```json
{
  "build": {
    "afterPack": "scripts/afterPack.js"
  }
}
```