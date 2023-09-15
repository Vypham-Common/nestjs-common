import { ArgumentsHost, CallHandler, ExceptionFilter, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Observable } from 'rxjs';
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly httpAdapterHost;
    constructor(httpAdapterHost: HttpAdapterHost);
    catch(exception: any, host: ArgumentsHost): void;
}
export declare class TransformResponse implements NestInterceptor {
    intercept(_: ExecutionContext, next: CallHandler): Observable<any>;
}
