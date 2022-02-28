const { InsertUser } = require('../server/user.serve')
class UserController {
    async regitser(ctx, next) {
        try {
            const res = await InsertUser(ctx.request.body)
            ctx.status = 200
            ctx.body = res
        } catch (err) {
            ctx.status = 403
            ctx.body = err
        }
    }
    async login(ctx, next) {
        ctx.body = '登录'
    }
}

module.exports = new UserController()