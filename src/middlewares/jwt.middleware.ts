import { NestMiddleware } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { NextFunction, Request } from 'express'


export class JWTValidationMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const jwtService = new JwtService()
    try {
      const [type, token] = req.headers.authorization?.split(' ') ?? []
      if (type !== 'Bearer') {
        throw Error
      }
      const payload = jwtService.verify(token, { secret: global.GlobalConfig.JWT_SECRET }) as JWTPayload
      req.user = payload
      req.tenant = payload.tenant
      req.isAuthorization = true
      req.jwt = token
    } catch (error) {
      if (req?.body?.tenant) {
        req.tenant = req.body.tenant
      }
      if (req?.query?.tenant) {
        req.tenant = req.query.tenant as string
      }
      req.isAuthorization = false
    }
    next()
  }
}
