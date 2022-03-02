const { SelectUserInfo } = require('../server/user.serve')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../config/config.default")
const {
    ErrorToken
} = require('../constant/errHandler')
class AuthMiddleware {
    //验证token
    async VerificationToken(ctx, next) {
        const { authorization } = ctx.request.header
        const token = authorization.replace("Bearer ", "")
        try {
            const tokenInfo = jwt.verify(token, JWT_SECRET)
            const { _id, phone, password, is_del } = tokenInfo
            const req = await SelectUserInfo({ _id, phone, password, is_del })
            if (req) {
                ctx.state.tokenInfo = tokenInfo
                await next()
            }
            else {
                ctx.app.emit("error", ErrorToken, ctx)
            }
        } catch (error) {
            //错误或者过期的token
            ctx.app.emit("error", ErrorToken, ctx)
        }
    }
}

module.exports = new AuthMiddleware()