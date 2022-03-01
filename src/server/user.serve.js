const UserModel = require("../model/user.model")
class UserServer {
    //注册用户
    RegisterUser(UserInfo) {
        return new Promise((request, reject) => {
            const user = new UserModel(UserInfo)
            user.save().then(data => {
                request(data)
            }).catch(err => {
                reject(err);
            })
        })
    }
    //查询手机号码信息
    SelectUserPhoneInfo({ phone }) {
        return new Promise((request, reject) => {
            UserModel.findOne({ phone }).then(data => {
                request(data)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

module.exports = new UserServer()