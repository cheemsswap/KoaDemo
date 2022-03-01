module.exports = {
    //默认参数错误
    ErrorDefaultArguments: {
        code: 403,
        message: "参数缺少",
        result: ""
    },
    //服务器内部错误
    ErrorServer: {
        code: 500,
        message: "服务器内部错误",
        result: ""
    },
    //错误的移动电话
    ErrorIsMobilePhone: {
        code: 403,
        message: "手机号码不正确",
        result: ""
    },
    //错误的性别
    ErrorIsSex: {
        code: 403,
        message: "性别参数有误",
        result: ""
    },
    //手机号码已被注册
    ErrorMobilePhoneIsRegitsered: {
        code: 403,
        message: "手机号已被注册",
        result: ""
    }
}