# 双 token 机制

> 这部分只讲述如果实现双 token 机制，具体关于双 token 的机制，可以在 JS 基础部分—jwt 中查看。

## 实现步骤

> 这里前端采用 vue3 + axios，后端采用 nest.js 实现

### 1. 创建后端登录接口

要求：登录成功返回两个 token，一个用于刷新 token(`refresh token`)，一个用于访问 token(`access token`)。

#### 1.1 创建 access、refresh token 模块

> Config 模块用来读取 `.env` 文件配置

::: code-group

```ts [jwt-access.module.ts]
import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import {
  JWT_ACCESS_EXPIRES_IN,
  JWT_ACCESS_SECRET
} from '../common/constant/env'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(JWT_ACCESS_SECRET),
        signOptions: {
          expiresIn: configService.get<string>(JWT_ACCESS_EXPIRES_IN)
        }
      })
    })
  ],
  providers: [
    {
      // 创建一个别名，方便在 auth.service.ts 中注入
      provide: 'JWT_ACCESS',
      useExisting: JwtService
    }
  ],
  exports: [JwtModule, 'JWT_ACCESS']
})
export class JwtAccessModule {}
```

```ts [jwt-refresh.module.ts]
import { Module } from '@nestjs/common'
import { JwtModule, JwtService } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import {
  JWT_REFRESH_EXPIRES_IN,
  JWT_REFRESH_SECRET
} from '../common/constant/env'

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>(JWT_REFRESH_SECRET),
        signOptions: {
          expiresIn: configService.get<string>(JWT_REFRESH_EXPIRES_IN)
        }
      })
    })
  ],
  providers: [
    {
      provide: 'JWT_REFRESH',
      useExisting: JwtService
    }
  ],
  exports: [JwtModule, 'JWT_REFRESH']
})
export class JwtRefreshModule {}
```

```base [.env]
DB_TYPE=mysql
DB_DATABASE=code-blocks-DB
JWT_ACCESS_SECRET=code-blocks-server-access-secret
JWT_ACCESS_EXPIRES_IN=30m
JWT_REFRESH_SECRET=code-blocks-server-refresh-secret
JWT_REFRESH_EXPIRES_IN=7d
```

:::

#### 1.2 在 auth.module.ts 中注入两个模块

```ts [auth.module.ts] {6,7,12,13}
import { Module } from '@nestjs/common'
import { AuthController } from '../controllers/auth.controller'
import { AuthService } from '../services/auth.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'
import { JwtAccessModule } from './jwt-access.module'
import { JwtRefreshModule } from './jwt-refresh.module'

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtAccessModule,
    JwtRefreshModule
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
```

#### 1.3 创建两个 jwt 的校验策略

> 这一步是结合后续创建的管道，来对接口的请求进行校验，例如：`@UseGuards(JwtRefreshGuard)`

> 1. 在 `PassportStrategy` 第二个参数传入 `name`，为了后续 `guard` 中进行区分
> 2. jwtFromRequest 来判断 jwt 从什么地方获取：
>
> - 从请求头中 `Authorization` 获取 ：`jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),`
> - 自定义：从请求头中获取自定义的 Refresh-Token 字段

::: code-group

```ts [jwt-access.strategy.ts] {13,22}
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JWT_ACCESS_SECRET } from '../common/constant/env'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access'
) {
  constructor(
    protected configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {
    super({
      // 从请求头中获取token
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(JWT_ACCESS_SECRET)
    })
  }

  // 对token进行校验，会在req.user上添加信息
  async validate(payload: { userId: string; phone: string }) {
    const user_info = await this.usersRepository.findOne({
      where: { id: payload.userId },
      select: ['id', 'phone', 'is_status']
    })
    if (!user_info) return false
    if (!user_info.is_status) return false
    if (user_info.phone !== payload.phone && user_info.id !== payload.userId)
      return false
    return { userId: payload.userId, phone: payload.phone }
  }
}
```

```ts [jwt-refresh.strategy.ts] {13,22-28}
import { Strategy } from 'passport-jwt'
import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JWT_REFRESH_SECRET } from '../common/constant/env'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from '../entities/user.entity'
import { Repository } from 'typeorm'

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh'
) {
  constructor(
    protected configService: ConfigService,
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {
    super({
      // 从请求头中获取自定义的 Refresh-Token 字段
      jwtFromRequest: (req: Request) => {
        const refreshToken = req.headers['refresh-token']
        if (!refreshToken) {
          throw new UnauthorizedException('Refresh token is required')
        }
        return refreshToken
      },
      ignoreExpiration: false,
      secretOrKey: configService.get<string>(JWT_REFRESH_SECRET)
    })
  }

  // 对token进行校验，会在req.user上添加信息
  async validate(payload: { userId: string; phone: string }) {
    const user_info = await this.usersRepository.findOne({
      where: { id: payload.userId },
      select: ['id', 'phone', 'is_status']
    })
    if (!user_info) return false
    if (!user_info.is_status) return false
    if (user_info.id !== payload.userId) return false
    return { userId: payload.userId, phone: user_info.phone }
  }
}
```

:::

#### 1.4 全局注册策略(Strategy)

> nest 通过依赖注入的方式来实现模块之间的使用，也可以局部注册。只有注册后，全局的守卫才会生效。

::: code-group

```ts [app.module.ts] {27,28}
import { Global, Logger, Module } from '@nestjs/common'
// 不同模块
import { AuthModule } from './modules/auth.module'
import { EditModule } from './modules/edit.module'
import { UserModule } from './modules/user.module'
import { TypeOrmConfigModule } from './config/typeorm.module'
import { LogConfigModule } from './config/log.module'
import { ENV_Config_Module } from './config/config.module'
import { JwtAccessStrategy } from './strategy/jwt-access.strategy'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './entities/user.entity'
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy'

@Global()
@Module({
  imports: [
    ENV_Config_Module,
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([User]),
    LogConfigModule,
    AuthModule,
    EditModule,
    UserModule
  ],
  controllers: [],
  // 全局提供logger，从@nestjs/common进行导入。因为在main.ts中重构官方的logger实例
  // JwtAccessStrategy、JwtRefreshStrategy 策略使其在全局都能使用
  providers: [Logger, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [Logger]
})
export class AppModule {}
```

:::

#### 1.5 创建两个 jwt 的守卫

实现接口注解，`@UseGuards(JwtAccessGuard)` 和 `@UseGuards(JwtRefreshGuard)` 来实现统一校验

例如：

::: code-group

```ts [xxx.controller.ts] {3,8}
// 全局接口
@Controller('edit')
@UseGuards(JwtAccessGuard)
export class EditController {}

// 单独接口
@Get('refresh-token')
@UseGuards(JwtRefreshGuard)
async refreshToken(@Headers('Refresh-Token') refreshToken: string) {}
```

:::

实现：

::: code-group

```ts [jwt-access.guard.ts]
import { AuthGuard } from '@nestjs/passport'

/**
 * AuthGuard 默认为 jwt，也可以在 strategy/jwt.strategy.ts 中修改为其他策略
 * JwtAccessStrategy 继承的 PassportStrategy，在 PassportStrategy 第二个参数就是 name 值
 * */
export class JwtAccessGuard extends AuthGuard('jwt-access') {
  constructor() {
    super()
  }
}
```

```ts [jwt-refresh.guard.ts]
import { AuthGuard } from '@nestjs/passport'

export class JwtRefreshGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super()
  }
}
```

:::

#### 1.6 实现刷新 token 接口

> 刷新 token 接口有两种思路：
>
> 1. 接口返回两个 token，这样后续就可以保证这个 长 token（refresh token）永远不会过期。
> 2. 接口只返回短 token，长 token 会过期，例如 7 天后过期用户也会重新登录。（这里采用这种方式）
>
> token 存储方式也有几种：自行选择
>
> 1. cookie(refresh token) + localStorage(access token)
> 2. localStorage(refresh token + access token)

::: code-group

```ts [auth.controller.ts]
/**
 * 刷新token接口
 * @headers headers['Refresh-Token'] 刷新token
 */
@Get('refresh-token')
@UseGuards(JwtRefreshGuard)
    async refreshToken(@Headers('Refresh-Token') refreshToken: string) {
    const data = await this.authService.refreshToken(refreshToken);
    return {
        code: 200,
        message: '刷新token成功',
        data,
    };
}
```

```ts [auth.service.ts]
import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { Repository } from 'typeorm'
import { InjectRepository } from '@nestjs/typeorm'
import { RegisterDto } from '../dto/user/register.dto'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    // 使用 @Inject 手动注入依赖，通过在 1.1 中注入的内容实现
    @Inject('JWT_ACCESS') private readonly jwtAccess: JwtService,
    @Inject('JWT_REFRESH') private readonly jwtRefresh: JwtService
  ) {}

  /**
   * 刷新token
   */
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    const payload = this.jwtRefresh.decode(refreshToken)
    const user = await this.usersRepository.findOne({
      where: { id: payload.userId },
      select: ['id', 'phone']
    })
    if (!user) {
      throw new NotFoundException('用户不存在')
    }
    const accessToken = await this.jwtAccess.signAsync({
      userId: user.id,
      phone: user.phone
    })
    return { accessToken }
  }
}
```

:::

### 2. 前端登录

#### 2.1 新增刷新 token 接口

```ts
export const reqRefreshToken = () =>
  request<any, RefreshTokenResponse>({
    url: API.refreshToken,
    method: 'get',
    headers: { 'Refresh-Token': getRefreshToken() }
  })
```

#### 2.2 配置请求响应拦截器

需要注意的点：

1. 在携带 access token 的接口，返回 401 时，就需要发送 reqRefreshToken 来刷新 token
2. 在页面多个并发请求时，需要创建一个请求队列，当 token 刷新后重新发送请求

```ts {26-38,42-83}
import axios, { type AxiosRequestConfig } from 'axios'
import router from '@/router/index'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'
import { baseUrl } from '@/common/baseUrl'
import { API as AuthAPI, reqRefreshToken } from './auth'

const user = useUserStore()

const request = axios.create({
  baseURL: baseUrl,
  timeout: 300000
})

request.interceptors.request.use(
  (config) => {
    const user = useUserStore()
    if (user.token) config.headers['Authorization'] = 'Bearer ' + user.token
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 已经处理过的错误码
const hasErrorCode = [401, 403]
// 在刷新token时，如果页面上有多个请求，当token过期后，那这几个请求都会触发 reqRefreshToken 来刷新token
/**
 * 1. 需要定义一个变量来标记当前是否刷新中，避免重复刷新token
 * 2. 创建一个请求队列，当刷新token成功后，需要把队列中的请求重新发送
 */
let isRefreshing = false
interface PendingTask {
  config: AxiosRequestConfig
  resolve: (value?: any) => void
}
const requestQueue: PendingTask[] = []

request.interceptors.response.use(
  async (response) => {
    if (
      response.data?.code === 401 &&
      !response.config.url?.includes(AuthAPI.refreshToken)
    ) {
      if (!isRefreshing) {
        // 第一个触发 401 的请求，刷新 token 并重新发送队列中的请求
        isRefreshing = true
        const res = await reqRefreshToken()
        isRefreshing = false
        if (res.code === 200) {
          const accessToken = res.data.accessToken
          // 更新accessToken
          user.refresh(accessToken)
          // 重新请求
          requestQueue.forEach(({ config, resolve }) => {
            config.headers!['Authorization'] = 'Bearer ' + accessToken
            resolve(request(config))
          })
          requestQueue.length = 0
          /**
           * 如果同时多个请求，在其他几个请求中，有一个先返回响应，先响应的回执行 requestQueue.forEach，
           * 此时这个 requestQueue 没有当前请求，则需要返回当前这个请求，重新去执行
           * （返回一个Promise会直接去执行）
           */
          return request(response.config)
        } else {
          // refreshToken过期
          user.clearInfo()
          router.replace('/login')
          ElMessage.error('登录已过期，请重新登录')
        }
      } else {
        // 当前请求不是第一个触发 401 的请求，则将当前为401（token过期的请求）添加到请求队列中
        return new Promise((resolve) => {
          requestQueue.push({
            config: response.config,
            resolve
          })
        })
      }
      return
    }

    if (response.data?.code === 403) {
      user.clearInfo()
      router.replace('/login')
      ElMessage.error('无权限')
      return
    }

    if (response.data?.code === 200) {
      response.data['status'] = true
    }

    if (
      !response.data['status'] &&
      !hasErrorCode.includes(response.data?.code)
    ) {
      ElMessage.error(response.data.message)
    }

    return response.data
  },
  (error) => {
    return Promise.reject(error)
  }
)

export default request
```
