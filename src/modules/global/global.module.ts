import { Global, Module } from '@nestjs/common'
import { REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { TOKEN } from '../../enums'
import { WorkerModule } from '../worker/worker.module'

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
    return request?.tenant
  },
}

@Global()
@Module({
  imports: [WorkerModule],
  providers: [provideUser, provideTenant],
  exports: [provideUser, provideTenant, WorkerModule],
})
export class GlobalModule { }
