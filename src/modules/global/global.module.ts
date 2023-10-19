import { Global, Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR, REQUEST } from '@nestjs/core'
import { Request } from 'express'
import { TOKEN } from '../../enums'
import { AllExceptionsFilter, TransformResponse } from '../../utils'
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

const provideMiddleware = [
  {
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: TransformResponse,
  },
]

@Global()
@Module({
  imports: [WorkerModule],
  providers: [provideUser, provideTenant, ...provideMiddleware],
  exports: [provideUser, provideTenant, WorkerModule],
})
export class GlobalModule { }
