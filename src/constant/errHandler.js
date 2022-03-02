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
    },
    //手机号码未注册
    ErrorMobilePhoneIsNotRegitsered: {
        code: 403,
        message: "手机号未注册",
        result: ""
    },
    //手机号码处于删除状态
    ErrorMobilePhoneIsDel: {
        code: 403,
        message: "手机号已停用",
        result: ""
    },
    //密码错误
    ErrorPassword: {
        code: 403,
        message: "密码错误",
        result: ""
    },
    //token失效
    ErrorToken: {
        code: 403,
        message: "登录状态已失效",
        result: ""
    },
    //修改密码 新密码与旧密码相同
    ErrorUpdateNewpasswordIsEqual: {
        code: 403,
        message: "修改失败,新密码与旧密码相同",
        result: ""
    },
    //文件格式不正确
    ErrorFileFormat: {
        code: 403,
        message: "文件格式不正确",
        result: ""
    },
    //文件太大
    ErrorFileLarge: {
        code: 403,
        message: "文件太大",
        result: ""
    }
}