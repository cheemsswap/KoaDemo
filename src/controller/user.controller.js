const {
    ErrorServer,
    ErrorMobilePhoneIsNotRegitsered,
    ErrorPassword
} = require('../constant/errHandler')
const {
    RegisterUser,
    SelectUserPhoneInfo
} = require('../server/user.serve')
const bcrypt = require('bcryptjs');
class UserController {
    async regitser(ctx, next) {
        try {
            const res = await RegisterUser(ctx.request.body)
            ctx.status = 200
            ctx.body = {
                code: 200,
                message: "注册成功",
                result: ""
            }
        } catch (err) {
            ctx.app.emit("error", ErrorServer, ctx)
        }
    }
    async login(ctx, next) {
        try {
            const { password } = ctx.request.body
            const res = await SelectUserPhoneInfo(ctx.request.body)
            //验证密码
            if (res) {
                if (bcrypt.compareSync(password, res.password)) {
                    ctx.status = 200
                    ctx.body = {
                        code: 200,
                        message: "登录成功",
                        result: ""
                    }
                }
                else {
                    ctx.app.emit("error", ErrorPassword, ctx)
                }
            }
            else {
                ctx.app.emit("error", ErrorMobilePhoneIsNotRegitsered, ctx)
            }
        } catch (err) {
            ctx.app.emit("error", ErrorServer, ctx)
        }
    }
}

module.exports = new UserController()