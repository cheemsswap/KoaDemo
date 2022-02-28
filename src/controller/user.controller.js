class UserController {
    async regitser(ctx, next) {
        ctx.body = '注册'
    }
    async login(ctx, next) {
        ctx.body = '登录'
    }
}

module.exports = new UserController()