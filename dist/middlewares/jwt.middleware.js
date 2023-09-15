"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTValidationMiddleware = void 0;
const jwt_1 = require("@nestjs/jwt");
const publicKey = Buffer.from(global.GlobalConfig.PUBLIC_KEY, 'base64').toString('ascii');
class JWTValidationMiddleware {
    use(req, _, next) {
        const jwtService = new jwt_1.JwtService();
        try {
            const [type, token] = req.headers.authorization?.split(' ') ?? [];
            if (type !== 'Bearer') {
                throw Error;
            }
            const payload = jwtService.verify(token, {
                algorithms: ['RS256'],
                publicKey,
            });
            req.user = payload;
            req.tenant = payload.employee.tenant;
            req.isAuthorization = true;
            req.user.jwt = token;
        }
        catch (error) {
            try {
                const [type, token] = req.headers.authorization?.split(' ') ?? [];
                if (type !== 'Bearer') {
                    throw Error;
                }
                const payload = jwtService.verify(token, { secret: global.GlobalConfig.JWT_SECRET });
                req.user = payload;
                req.tenant = payload.employee.tenant;
                req.isAuthorization = true;
                req.user.jwt = token;
            }
            catch (error) {
                const user = { employee: { tenant: '' } };
                if (req?.body?.tenant) {
                    user.employee.tenant = req.body.tenant;
                }
                if (req?.query?.tenant) {
                    user.employee.tenant = req.query.tenant;
                }
                req.user = user;
                req.isAuthorization = false;
            }
        }
        req.tenant = req.user.employee.tenant;
        next();
    }
}
exports.JWTValidationMiddleware = JWTValidationMiddleware;
