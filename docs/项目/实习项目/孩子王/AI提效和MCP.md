# AI 提效和 MCP

## 背景

公司内部在推 AI Coding 开发，旨在一个小项目，例如后台页面等一些小需求，在前端/后端开发排期满的情况下，可以自行解决错误和需求的修改。

初步只是采用外部的大模型（例如 Claude Code）进行代码生成，接入 MCP 工具让 AI 生成的代码更符合企业要求，目前 AI 的缺点有：

1. 代码规范
2. 项目登录态
3. 错误需要手动 copy（例如：浏览器控制台报错）
4. 前后端联调困难（前后端定义的接口状态码、参数不一致）
5. 需求迭代，通过输入框描述，大模型会出现“乱改”情况
6. 公司内部的 sdk、组件库文档 AI 无法使用（因为获取不到文档）
7. CI/CD

![](./img/llm%20coding流程.png)

## 代码规范

通过将前端代码规范写入内部 cli 工具的 prompt 中即可

::: details prompt 示例

```md
## 开发规范

### 1. 页面开发原则

- 如果现有框架中已有组件，且适配用户需求，则优先使用封装的组件
- 优先考虑使用 Element-Plus 组件库实现

### 2. 文档管理规范

- 生成的功能文档文件，放置在新建页面组件文件夹下
- 如果页面组件文件夹下已有文档文件，则进行迭代更新
- 文档文件命名建议：`README.md` 或 `功能名称.md`
- 文档要求简洁精炼

### 3. 组件存放规范

- **业务组件**：放置在页面组件文件夹下的 `components/` 目录下
  - 路径示例：`src/views/PageName/components/BusinessComponent.vue`
  - 这些组件与特定页面业务逻辑紧密相关
- **纯组件**：放置在 `src/components/` 文件夹下
  - 路径示例：`src/components/CommonComponent.vue`
  - 这些组件是通用的、可在多个页面复用的组件
```

:::

## 项目登录态

通过 PlayWright 模拟登录，并获取登录态，再丢给大模型上下文，AI 自检的时候塞入登录态完成登录校验

::: details 具体代码

```ts
import {
  createErrorResponse,
  createSuccessResponse,
  defineTool,
  ToolResponse,
  BaseBrowser
} from '../utils/index.js'
import * as playwright from 'playwright'

class BrowserAuthorization extends BaseBrowser {
  currentCookies: { [name: string]: playwright.Cookie } = {}
  private cookieChangedCallback:
    | ((cookies: { [name: string]: playwright.Cookie }) => void)
    | null = null

  public override async start(): Promise<void> {
    this.browser = await playwright.chromium.launch({
      headless: false, // 有头模式，方便用户登录
      channel: 'chrome'
    })
    this.context = await this.browser.newContext()
    this.page = await this.context.newPage()
  }

  public async run(url: string): Promise<any> {
    // 让用户登录
    await this.page?.goto(url)
    // await this.initCookie();

    // 设置cookie变化监听器
    this.setupCookieListeners()

    // 返回一个Promise，当cookie变化时resolve
    return new Promise((resolve) => {
      // 设置cookie变化的回调函数
      this.cookieChangedCallback = (cookies) => {
        resolve(cookies)
      }
    })
  }

  private setupCookieListeners() {
    // 监听响应，可能会有cookie的变化
    this.page?.on('response', async (response) => {
      if (response.headers()['set-cookie']) {
        await this.checkChanges()
      }
    })

    // 监听跳转的load事件，也可能会有cookie的变化
    this.page?.on('load', async () => {
      await this.checkChanges()
    })

    // 监听页面的请求完成事件
    this.page?.on('requestfinished', async () => {
      await this.checkChanges()
    })
  }

  /**
   * 初始化清空cookie
   */
  private async initCookie() {
    await this.page?.context().clearCookies()
  }

  /**
   * 检查cookie变化
   */
  private async checkChanges() {
    const newCookies = await this.page?.context().cookies()
    const newCookiesMap: { [name: string]: playwright.Cookie } = {}
    newCookies?.forEach((cookie) => {
      newCookiesMap[cookie.name] = { ...cookie }
    })

    // 检测变化
    let hasNewOrChangedCookie = false
    for (const [name, newCookie] of Object.entries(newCookiesMap)) {
      const oldCookie = this.currentCookies[name]
      if (!oldCookie) {
        console.log(`[Cookie 新增] ${name}=${newCookie.value}`)
        hasNewOrChangedCookie = true
      } else if (oldCookie.value !== newCookie.value) {
        console.log(
          `[Cookie 修改] ${name}: ${oldCookie.value} → ${newCookie.value}`
        )
        hasNewOrChangedCookie = true
      }
    }

    // 检测删除
    for (const [name, _oldCookie] of Object.entries(this.currentCookies)) {
      if (!newCookiesMap[name]) {
        console.log(`[Cookie 删除] ${name}`)
      }
    }

    this.currentCookies = newCookiesMap

    // 如果检测到新的或变化的cookie，并且回调函数存在，则调用回调函数
    if (hasNewOrChangedCookie && this.cookieChangedCallback) {
      this.cookieChangedCallback(newCookiesMap)
      // 清空回调函数，防止重复调用
      this.cookieChangedCallback = null
    }
  }

  public getCookies() {
    return this.currentCookies
  }
}

async function checkAuth(params: { url?: string } = {}): Promise<ToolResponse> {
  // 创建浏览器实例并启动
  const browserAuth = new BrowserAuthorization()
  try {
    await browserAuth.start()
    if (params.url) {
      // 运行浏览器并等待cookie变化
      const cookies = await browserAuth.run(params.url)
      // 成功获取到cookies后返回结果
      /**
       * 直接返回cookies对象的JSON字符串，这样其他工具可以直接使用
       * 格式：{"cookieName":{"name":"cookieName","value":"cookieValue","domain":"..."},...}
       */
      return createSuccessResponse(JSON.stringify(cookies))
    } else {
      return createErrorResponse('请提供要检查的URL')
    }
  } catch (error) {
    return createErrorResponse(
      error instanceof Error ? error.message : '未知错误'
    )
  } finally {
    await browserAuth.stop()
  }
}

export default defineTool(
  {
    name: 'check_auth',
    description:
      '该工具的作用是检查用户是否已经授权，用户的登录信息（登录态），项目的登录信息都存储在cookie中，该mcp工具会自动打开浏览器，进入项目登录页，当用户登录成功后，该mcp工具会自动获取cookie，将内容返回，并做全局存储。当发现接口返回的请求响应码中包含未登录信息，或者返回的内容是未登录、登录状态失效等内容，也需要调用该工具进行重新登录。',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: '登录态的网页URL',
          format: 'uri'
        },
        cookies: {
          type: 'string',
          description: '暴露的登录态cookie信息'
        }
      },
      required: ['url', 'cookies']
    }
  },
  checkAuth
)
```

:::

## 错误自检

MCP 工具：监控浏览器控制台报错、终端错误信息，返回给 AI，让 AI 进行错误自检

监控的事件有：

- `page.on('console')`：监听控制台消息
- `page.on('pageerror')`：捕获并记录页面抛出的 JavaScript 错误
- `page.on('requestfailed')`：监听网络请求失败事件

::: details 具体代码

```ts
import {
  createErrorResponse,
  createSuccessResponse,
  defineTool,
  ToolResponse,
  BaseBrowser
} from '../utils/index.js'
import * as playwright from 'playwright'

export type ConsoleMessage = {
  type: ReturnType<playwright.ConsoleMessage['type']> | undefined
  text: string
  toString(): string
}

class ConsoleMonitor extends BaseBrowser {
  private consoleLogs: ConsoleMessage[] = []

  constructor() {
    // 不在构造函数中启动，避免意外
    super()
  }

  public override async start(cookies: playwright.Cookie[] = []) {
    this.browser = await playwright.chromium.launch({
      headless: false, // 有头模式，方便用户登录
      channel: 'chrome'
    })
    this.context = await this.browser.newContext()
    this.page = await this.context.newPage()
    // 添加cookie
    if (this.context && cookies.length > 0) {
      await this.context.addCookies(cookies)
    }
  }

  /**
   * 页面监控
   * 该函数负责设置页面事件监听器，用于捕获和处理页面中的控制台消息
   * 和JavaScript错误。通过监听'console'和'pageerror'事件，将捕获到的
   * 消息转换为统一的格式并进行处理。
   *
   * 监听的事件类型：
   * - console: 监听控制台消息（包括log、warn、error等类型）
   * - pageerror: 监听页面未捕获的JavaScript异常
   * - requestfailed: 监听网络请求失败事件
   *
   * @param includeConsoleLogs - 是否包含控制台日志
   * @param includeErrors - 是否包含错误信息
   * @returns {Promise<void>} - 返回一个Promise，表示异步操作完成
   */
  public async run(
    includeConsoleLogs: boolean = false,
    includeErrors: boolean = true
  ): Promise<void> {
    // 监听控制台消息
    this.page?.on('console', async (event) => {
      const messageType = event.type()
      if (
        (includeErrors && messageType === 'error') ||
        (includeConsoleLogs &&
          ['log', 'info', 'warn', 'debug'].includes(messageType))
      ) {
        this.handleConsoleMessage(this.messageToConsoleMessage(event))
      }
    })

    // 捕获并记录页面抛出的JavaScript错误
    if (includeErrors) {
      this.page?.on('pageerror', async (error) =>
        this.handleConsoleMessage(this.pageErrorToConsoleMessage(error))
      )
    }

    // 监听网络请求失败事件
    if (includeErrors) {
      this.page?.on('requestfailed', async (request) => {
        const failure = request.failure()
        if (failure) {
          const message: ConsoleMessage = {
            type: 'error',
            text: `网络请求失败: ${request.url()} - ${failure.errorText}`,
            toString: () =>
              `[NETWORK] 网络请求失败: ${request.url()} - ${failure.errorText}`
          }
          this.handleConsoleMessage(message)
        }
      })
    }
  }

  /**
   * 处理控制台消息
   * @param message - 要处理的控制台消息对象
   */
  private handleConsoleMessage(message: ConsoleMessage) {
    this.consoleLogs?.push(message)
  }

  /**
   * 将Playwright的控制台消息转换为内部ConsoleMessage格式
   * @param message - Playwright的控制台消息对象
   * @returns 转换后的ConsoleMessage对象，包含类型、文本和格式化字符串表示
   */
  private messageToConsoleMessage(
    message: playwright.ConsoleMessage
  ): ConsoleMessage {
    return {
      type: message.type(),
      text: message.text(),
      // 使用统一的格式：[类型] 文本 @ URL:行号
      toString: () =>
        `[${message.type().toUpperCase()}] ${message.text()} @ ${
          message.location().url
        }:${message.location().lineNumber}`
    }
  }

  /**
   * 将页面错误转换为控制台消息对象
   * @param error - 发生的错误对象，可以是Error实例或任何其他类型的值
   * @returns 返回包含错误信息的控制台消息对象
   */
  private pageErrorToConsoleMessage(error: Error | any): ConsoleMessage {
    if (error instanceof Error) {
      return {
        type: 'error',
        text: error.message,
        toString: () => error.stack || error.message
      }
    }
    return {
      type: 'error',
      text: String(error),
      toString: () => String(error)
    }
  }

  public getLogs() {
    return this.consoleLogs || []
  }

  public getLogsToString() {
    return this.consoleLogs.join('\n') || ''
  }
}

/**
 * 解析cookie字符串，支持多种格式
 * @param cookieString - cookie字符串，可能是JSON格式或浏览器cookie格式
 * @param url - 目标URL，用于推断域名
 * @returns 返回Playwright所需的cookie对象数组
 */
function parseCookieString(
  cookieString: string,
  url?: string
): playwright.Cookie[] {
  // 首先尝试解析为JSON格式
  try {
    const parsed = JSON.parse(cookieString)
    // 如果解析后的结果有cookies属性，说明是包装格式 {"cookies": {...}}
    if (parsed.cookies) {
      return Object.values(parsed.cookies) as playwright.Cookie[]
    } else if (typeof parsed === 'object' && parsed !== null) {
      // 直接是cookie对象格式 {"cookieName": {...}, ...}
      return Object.values(parsed) as playwright.Cookie[]
    }
  } catch (error) {
    // JSON解析失败，尝试解析为浏览器cookie字符串格式
  }

  // 从URL推断域名
  let domain = '.haiziwang.com' // 默认域名
  if (url) {
    try {
      const urlObj = new URL(url)
      const hostname = urlObj.hostname
      // 如果是子域名，使用顶级域名
      if (hostname.includes('.')) {
        const parts = hostname.split('.')
        if (parts.length >= 2) {
          domain = '.' + parts.slice(-2).join('.')
        }
      } else {
        domain = hostname
      }
    } catch (error) {
      // URL解析失败，使用默认域名
    }
  }

  // 解析浏览器cookie字符串格式: "name1=value1; name2=value2; ..."
  const cookies: playwright.Cookie[] = []
  const cookiePairs = cookieString.split(';')

  for (const pair of cookiePairs) {
    const trimmedPair = pair.trim()
    if (trimmedPair) {
      const [name, value] = trimmedPair.split('=')
      if (name && value !== undefined) {
        cookies.push({
          name: name.trim(),
          value: value.trim(),
          domain: domain,
          path: '/',
          expires: -1, // 会话cookie
          httpOnly: false,
          secure: false,
          sameSite: 'Lax'
        })
      }
    }
  }

  return cookies
}

/**
 * 控制台日志
 * @returns {使用 PlayWright 监控浏览器控制台日志, 返回错误日志内容}
 */
async function console(
  params: {
    url?: string
    cookies?: string
    includeConsoleLogs?: boolean
    includeErrors?: boolean
  } = {}
): Promise<ToolResponse> {
  const monitor = new ConsoleMonitor()
  try {
    // 处理cookies参数，支持多种格式
    let cookiesArray: playwright.Cookie[] = []
    if (params.cookies) {
      try {
        cookiesArray = parseCookieString(params.cookies, params.url)
      } catch (error) {
        return createErrorResponse(`Cookie格式解析错误: ${error}`)
      }
    }

    await monitor.start(cookiesArray)
    await monitor.run(
      params.includeConsoleLogs || false,
      params.includeErrors !== false
    )

    if (params.url) {
      try {
        const page = monitor.getPageInstance()
        await page?.goto(params.url)
        // 等待一段时间以确保所有资源加载完成
        await new Promise((resolve) => setTimeout(resolve, 2000))
      } catch (error) {
        return createErrorResponse(`错误: ${error}`)
      }
    }
    const text = monitor.getLogsToString()
    return createSuccessResponse(text)
  } finally {
    await monitor.stop()
  }
}

export default defineTool(
  {
    name: 'monitor_console_log',
    description:
      '打开页面，监控浏览器控制台日志，需要监控错误的日志，捕获页面的错误信息，返回对应的错误内容。如果上个步骤，或者上文有cookie，需要写入到该mcp的参数中',
    inputSchema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: '要监控的网页URL',
          format: 'uri'
        },
        cookies: {
          type: 'string',
          description: '网站登录的Cookie信息'
        },
        includeConsoleLogs: {
          type: 'boolean',
          description: '是否包含控制台日志（console.log）',
          default: false
        },
        includeErrors: {
          type: 'boolean',
          description: '是否包含错误信息（console.error 和 pageerror）',
          default: true
        }
      },
      required: ['url', 'cookies']
    }
  },
  console
)
```

:::

## 前后端联调

> 参考文档：https://juejin.cn/post/7553914841149292580

### 背景

现阶段前后端自测+联调耗时较长，经过摸底，耗时主要在以下几个方面：接口录入、接口转为前端代码、mock 数据生成。

目前存在的问题包括：

1. 接口文档维护不及时，导致前后端理解不一致；
2. 手动编写接口调用代码效率低下；
3. mock 数据缺乏真实性，无法充分验证业务逻辑；
4. 联调过程中频繁的沟通协调消耗大量时间。

这些问题不仅影响了开发效率，也降低了代码质量和项目的整体交付速度。

### 目标

通过引入 AI 能力，实现接口文档的智能生成和维护，自动化的代码生成，以及更真实的 mock 数据模拟。让前后端开发能够无缝对接，大大减少联调阶段的沟通成本和问题排查时间，最终实现开发效率的质的提升。

### 接口文档获取

在 cli 中，去拉去接口文档，解析接口参数、端点、请求示例，提取关键字段生成结构化 prompt，AI 可以根据该内容生成符合规范的接口和 Mock 数据。

> `ks pull interface` 拉取接口文档，如果项目有`prompt.md`文件，就追加，没有就生成。

::: details 示例

```ts
// 发送请求下载文件
const response = await axios.get(
  `http://mytest.kapi.haiziwang.com:3003/api/interface/get?id=${interfaceId}`,
  {
    headers: {
      Cookie: `_yapi_uid=${uid};_yapi_token=${token}`
    }
  }
)
const interfaceData = response.data.data
// 提取接口信息
const {
  title,
  path: apiPath,
  req_headers,
  req_body_other,
  method,
  res_body
} = interfaceData

// 生成markdown内容
const markdownContent = generateMarkdown({
  title,
  path: apiPath,
  method,
  req_headers,
  req_body_other,
  res_body
})

// 生成markdown文档的函数
function generateMarkdown(data) {
  const { title, path, method, req_headers, req_body_other, res_body } = data

  let markdown = `# ${title}\n\n`

  // 基本信息
  markdown += `## 基本信息\n\n`
  markdown += `- **接口路径**: \`${path}\`\n`
  markdown += `- **请求方法**: \`${method}\`\n\n`

  // 请求头
  if (req_headers && req_headers.length > 0) {
    markdown += `## 请求头\n\n`
    markdown += `| 参数名 | 示例值 | 必填 | 说明 |\n`
    markdown += `|--------|--------|------|------|\n`
    req_headers.forEach((header) => {
      markdown += `| ${header.name || ''} | ${header.value || ''} | ${
        header.required === '1' ? '是' : '否'
      } | ${header.desc || ''} |\n`
    })
    markdown += `\n`
  }

  // 请求参数
  if (req_body_other) {
    markdown += `## 请求参数\n\n`
    markdown += `\`\`\`json\n`
    markdown += `${req_body_other}\n`
    markdown += `\`\`\`\n\n`
  }

  // 返回数据
  if (res_body) {
    markdown += `## 返回数据\n\n`
    markdown += `\`\`\`json\n`
    markdown += `${res_body}\n`
    markdown += `\`\`\`\n\n`
  }

  // 生成时间
  markdown += `---\n\n`
  markdown += `> 文档生成时间: ${new Date().toLocaleString('zh-CN')}\n`

  return markdown
}
```

:::

## 需求迭代

通过 cli 生成了`prompt.md`文件，里面会记录需求信息，如果有新的需求继续添加即可。

后续可以通过需求发布平台去拉取，避免手动维护的麻烦。
