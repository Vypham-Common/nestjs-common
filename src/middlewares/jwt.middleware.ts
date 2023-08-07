import { NestMiddleware } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { NextFunction, Request } from 'express'

const publicKey = Buffer.from(global.GlobalConfig.PUBLIC_KEY, 'base64').toString('ascii')

export class JWTValidationMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const jwtService = new JwtService()
    try {
      const [type, token] = req.headers.authorization?.split(' ') ?? []
      if (type !== 'Bearer') {
        throw Error
      }
      const payload = jwtService.verify(token, {
        algorithms: ['RS256'],
        publicKey,
      }) as JWTPayload

      req.user = payload
      req.tenant = payload.employee.tenant
      req.isAuthorization = true
      req.user.jwt = token
    } catch (error) {
      try {
        const [type, token] = req.headers.authorization?.split(' ') ?? []
        if (type !== 'Bearer') {
          throw Error
        }
        const payload = jwtService.verify(token, { secret: global.GlobalConfig.JWT_SECRET }) as JWTPayload
        req.user = payload
        req.tenant = payload.employee.tenant
        req.isAuthorization = true
        req.user.jwt = token
      } catch (error) {
        const user = { employee: { tenant: '' } }
        if (req?.body?.tenant) {
          user.employee.tenant = req.body.tenant
        }
        if (req?.query?.tenant) {
          user.employee.tenant = req.query.tenant as string
        }
        req.user = user as unknown as JWTPayload
        req.isAuthorization = false
      }
    }
    req.tenant = req.user.employee.tenant
    next()
  }
}
