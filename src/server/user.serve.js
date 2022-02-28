const UserModel = require("../model/user.model")
class UserServer {
    InsertUser(UserInfo) {
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
                    code: 403,
                    message: err.toString().match(/: (.*)/)[1],
                    result: ""
                });
            })
        })
    }
}

module.exports = new UserServer()