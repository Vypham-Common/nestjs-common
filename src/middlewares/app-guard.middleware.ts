import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { Request } from 'express'
import { IS_PUBLIC_KEY } from '../decorators'

@Injectable()
export class AppGuard implements CanActivate {
  constructor(private reflector: Reflector) { }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) {
      return true
    }
    if (!request.isAuthorization) {
      throw new UnauthorizedException()
    }
    return true
  }
}
