import { NestMiddleware } from '@nestjs/common';
import { NextFunction, Request } from 'express';
export declare class JWTValidationMiddleware implements NestMiddleware {
    use(req: Request, _: Response, next: NextFunction): void;
}
