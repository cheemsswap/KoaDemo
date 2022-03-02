const { SelectUserInfo } = require('../server/user.serve')
const validator = require('validator')
const bcrypt = require('bcryptjs');
const { COUNTRY } = require('../config/config.default')
const {
    ErrorDefaultArguments,
    ErrorIsMobilePhone,
    ErrorIsSex,
    ErrorMobilePhoneIsRegitsered,
    ErrorMobilePhoneIsNotRegitsered,
    ErrorMobilePhoneIsDel,
    ErrorServer,
    ErrorUpdateNewpasswordIsEqual
} = require('../constant/errHandler')
class UserMiddleWare {
    async RegisterFormValidator(ctx, next) {
        //注册表单验证
        const { phone, username, password, sex } = ctx.request.body
        const sexList = ["男", "女", "保密", undefined]
        if (phone == undefined || username == undefined || username.trim() == '' || password == undefined || password.trim() == "") {
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
                const req = await SelectUserInfo({ phone })
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
        try {
            const { password, newpassword } = ctx.request.body
            if (password) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                ctx.request.body.password = hash
            }
            if (newpassword) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(newpassword, salt);
                ctx.request.body.newpassword = hash
            }
            await next()
        } catch (err) {
            ctx.app.emit("error", ErrorServer, ctx)
        }
    }
    async LoginFormValidator(ctx, next) {
        const { phone, password } = ctx.request.body
        if (phone == undefined || password == undefined || password.trim() == "") {
            ctx.app.emit("error", ErrorDefaultArguments, ctx)
        } else if (!validator.isMobilePhone(phone, "zh-CN")) {
            ctx.app.emit("error", ErrorIsMobilePhone, ctx)
        }
        else {
            try {
                const req = await SelectUserInfo({ phone })
                if (req) {
                    //数据存在该号码的信息
                    const { is_del } = req
                    if (is_del) {
                        //该手机号码停用状态
                        ctx.app.emit("error", ErrorMobilePhoneIsDel, ctx)
                    }
                    else {
                        ctx.state.userInfo = req
                        await next()
                    }
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
    async UpdateFormValidator(ctx, next) {
        const { oldpassword, newpassword } = ctx.request.body
        if (oldpassword == undefined || oldpassword.trim() == "" || newpassword == undefined || newpassword.trim() == "") {
            ctx.app.emit("error", ErrorDefaultArguments, ctx)
        } else if (oldpassword == newpassword) {
            ctx.app.emit("error", ErrorUpdateNewpasswordIsEqual, ctx)
        }
        else {
            await next()
        }
    }
}

module.exports = new UserMiddleWare()