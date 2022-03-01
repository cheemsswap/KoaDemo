const { SelectUserPhoneIsBeing } = require('../server/user.serve')
const validator = require('../util/validator')
const {
    ErrorDefaultArguments,
    ErrorIsMobilePhone,
    ErrorIsSex,
    ErrorMobilePhoneIsRegitsered,
    ErrorServer
} = require('../consitant/errHandler')
class UserMiddleWare {
    async RegisterFormValidator(ctx, next) {
        //注册表单验证
        const { phone, username, password, sex } = ctx.request.body
        const sexList = ["男", "女", "保密", undefined]
        if (phone == undefined || username == undefined || password == undefined) {
            //参数缺少
            // ctx.status = 403
            // ctx.body = {
            //     code: 403,
            //     message: "参数缺少",
            //     result: ""
            // }
            ctx.app.emit("error", ErrorDefaultArguments, ctx)
        }
        else if (!validator.isMobilePhone(phone, "zh-CN")) {
            // ctx.status = 403
            // ctx.body = {
            //     code: 403,
            //     message: "手机号码不正确",
            //     result: ""
            // }
            ctx.app.emit("error", ErrorIsMobilePhone, ctx)
        }
        else if (!sexList.includes(sex)) {
            //性别参数有误
            // ctx.status = 403
            // ctx.body = {
            //     code: 403,
            //     message: "性别参数有误",
            //     result: ""
            // }
            ctx.app.emit("error", ErrorIsSex, ctx)
        }
        else {
            //判断用户是否注册
            const req = await SelectUserPhoneIsBeing({ phone })
            if (req.code == 200) {
                if (req.result) {
                    await next()
                }
                else {
                    // ctx.status = 403
                    // ctx.body = {
                    //     code: 403,
                    //     message: "手机号已被注册",
                    //     result: ""
                    // }
                    ctx.app.emit("error", ErrorMobilePhoneIsRegitsered, ctx)
                }
            }
            else {
                // ctx.status = 500
                // ctx.body = {
                //     code: 500,
                //     message: "服务器内部错误",
                //     result: ""
                // }
                ctx.app.emit("error", ErrorServer, ctx)
            }
        }

    }
}

module.exports = new UserMiddleWare()