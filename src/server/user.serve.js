const UserModel = require("../model/user.model")
class UserServer {
    //注册用户
    RegisterUser(UserInfo) {
        return new Promise((request, reject) => {
            const user = new UserModel(UserInfo)
            user.save().then(data => {
                request({
                    code: 200,
                    message: "注册成功",
                    result: {
                        phone: data.phone,
                        username: data.username,
                        create_time: data.create_time
                    }
                })
            }).catch(err => {
                reject({
                    code: 500,
                    message: "服务器内部错误",
                    result: ""
                });
            })
        })
    }
    //查询手机号码是否已经注册
    SelectUserPhoneIsBeing({ phone }) {
        return new Promise((request, reject) => {
            UserModel.findOne({ phone }).then(data => {
                if (data != null)
                    request({
                        code: 200,
                        message: "用户已注册",
                        result: false
                    })
                else
                    request({
                        code: 200,
                        message: "用户未注册",
                        result: true
                    })
            }).catch(err => {
                reject({
                    code: 403,
                    message: err.toString().match(/: (.*)/)[1],
                    result: ""
                })
            })
        })
    }
}

module.exports = new UserServer()