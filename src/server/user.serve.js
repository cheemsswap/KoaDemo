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
    //验证用户信息
    SelectUserInfo(UserInfo) {
        return new Promise((request, reject) => {
            UserModel.findOne(UserInfo).then(data => {
                request(data)
            }).catch(err => {
                reject(err)
            })
        })
    }
    //修改用户信息
    UpdateUserInfo(oldUserInfo, newUserInfo) {
        return new Promise((request, reject) => {
            UserModel.updateOne(oldUserInfo, newUserInfo).then(data => {
                request(data)
            }).catch(err => {
                reject(err)
            })
        })
    }
}

module.exports = new UserServer()