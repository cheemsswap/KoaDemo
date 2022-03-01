const { RegisterUser, SelectUserPhoneIsBeing } = require('../server/user.serve')
class UserController {
    async regitser(ctx, next) {
        try {
            const res = await RegisterUser(ctx.request.body)
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
    async SelectUserPhoneIsBeing(ctx, next) {
        try {
            const { phone } = ctx.query
            const res = await SelectUserPhoneIsBeing({ phone })
            ctx.status = 200
            ctx.body = res
        } catch (err) {
            ctx.status = 403
            ctx.body = err
        }
    }
}

module.exports = new UserController()