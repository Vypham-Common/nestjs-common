import {
  ArgumentsHost,
  CallHandler,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { Observable, map } from 'rxjs'
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) { }

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost

    const ctx = host.switchToHttp()

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR

    const message = exception?.message || 'Internal Server Error'

    const responseBody =
      exception instanceof HttpException
        ? exception.getResponse()
        : {
          statusCode: httpStatus,
          message,
          timestamp: new Date().toISOString(),
          path: httpAdapter.getRequestUrl(ctx.getRequest()),
        }

    httpAdapter.reply(
      ctx.getResponse(), responseBody, httpStatus
    )
  }
}


@Injectable()
export class TransformResponse implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(map((data) => ({ statusCode: 200, ...data })))
  }
}
