import { Global, Module } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { TOKEN } from '../../enums'

const provideUser = {
  provide: TOKEN.USER,
  inject: [REQUEST],
  useFactory(request: Request) {
    return request?.user
  },
}

const provideTenant = {
  provide: TOKEN.TENANT,
  inject: [REQUEST],
  useFactory(request: Request) {
    return request?.user?.employee?.tenant
  },
}

@Global()
@Module({
  providers: [provideUser, provideTenant],
  exports: [provideUser, provideTenant],
})
export class GlobalModule {}
