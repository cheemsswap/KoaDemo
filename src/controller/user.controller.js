const {
    ErrorServer,
    ErrorMobilePhoneIsNotRegitsered,
    ErrorPassword
} = require('../constant/errHandler')
const {
    RegisterUser,
    SelectUserInfo,
    UpdateUserInfo
} = require('../server/user.serve')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_TIME } = require("../config/config.default")
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
            const res = ctx.state.userInfo
            //验证密码
            if (res) {
                if (bcrypt.compareSync(password, res.password)) {
                    //token payload 包含 _id+手机号码+密码+是否删除
                    const { _id, phone, password, is_del } = res
                    ctx.status = 200
                    ctx.body = {
                        code: 200,
                        message: "登录成功",
                        result: {
                            token: jwt.sign({ _id, phone, password, is_del }, JWT_SECRET, {
                                expiresIn: JWT_TIME
                            })
                        }
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
    async updatepassword(ctx, next) {
        try {
            const { password } = ctx.state.tokenInfo
            const { oldpassword, newpassword } = ctx.request.body
            if (bcrypt.compareSync(oldpassword, password)) {
                const req = await UpdateUserInfo(ctx.state.tokenInfo, { password: newpassword })
                if (req.acknowledged) {
                    ctx.status = 200
                    ctx.body = {
                        code: 200,
                        message: "修改成功",
                        result: ""
                    }
                } else {
                    ctx.app.emit("error", ErrorServer, ctx)
                }
            }
            else {
                ctx.app.emit("error", ErrorPassword, ctx)
            }
        } catch (err) {
            ctx.app.emit("error", ErrorServer, ctx)
        }
    }
}

module.exports = new UserController()