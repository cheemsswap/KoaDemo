const { SelectUserPhoneInfo } = require('../server/user.serve')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const { COUNTRY } = require('../config/config.default')
const {
    ErrorDefaultArguments,
    ErrorIsMobilePhone,
    ErrorIsSex,
    ErrorMobilePhoneIsRegitsered,
    ErrorMobilePhoneIsNotRegitsered,
    ErrorServer
} = require('../constant/errHandler')
class UserMiddleWare {
    async RegisterFormValidator(ctx, next) {
        //注册表单验证
        const { phone, username, password, sex } = ctx.request.body
        const sexList = ["男", "女", "保密", undefined]
        if (phone == undefined || username == undefined || username.trim() == '' || password == undefined) {
            ctx.app.emit("error", ErrorDefaultArguments, ctx)
        }
        else if (!validator.isMobilePhone(phone, COUNTRY)) {
            ctx.app.emit("error", ErrorIsMobilePhone, ctx)
        }
        else if (!sexList.includes(sex)) {
            ctx.app.emit("error", ErrorIsSex, ctx)
        }
        else {
            try {
                const req = await SelectUserPhoneInfo({ phone })
                if (req) {
                    //数据存在该号码的信息
                    ctx.app.emit("error", ErrorMobilePhoneIsRegitsered, ctx)
                }
                else {
                    //数据不存在该号码的信息 继续注册
                    await next()
                }
            } catch (err) {
                ctx.app.emit("error", ErrorServer, ctx)
            }
        }
    }
    async EncryptionPassword(ctx, next) {
        //密码加密
        const { password } = ctx.request.body
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);
        ctx.request.body.password = hash
        await next()
    }
    async LoginFormValidator(ctx, next) {
        const { phone, password } = ctx.request.body
        if (phone == undefined || password == undefined) {
            ctx.app.emit("error", ErrorDefaultArguments, ctx)
        } else if (!validator.isMobilePhone(phone, "zh-CN")) {
            ctx.app.emit("error", ErrorIsMobilePhone, ctx)
        }
        else {
            try {
                const req = await SelectUserPhoneInfo({ phone })
                if (req) {
                    //数据存在该号码的信息
                    await next()
                }
                else {
                    //数据不存在该号码的信息 登录返回-用户不存在
                    ctx.app.emit("error", ErrorMobilePhoneIsNotRegitsered, ctx)
                }
            } catch (err) {
                ctx.app.emit("error", ErrorServer, ctx)
            }
        }
    }
}

module.exports = new UserMiddleWare()