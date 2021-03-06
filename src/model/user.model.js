const mongoose = require('./db')
const moment = require('moment')
const validator = require('validator')
const { COUNTRY } = require('../config/config.default')
const UserSchema = mongoose.Schema({
    phone: {       //手机号码
        type: String,
        required: true, //必选
        unique: true,  //唯一索引
        validate: function (phone) {
            return validator.isMobilePhone(phone, COUNTRY)
        }
    },
    username: {     //用户名
        type: String,
        trim: true,  //自动处理前后空格
        required: true
    },
    password: {     //密码
        type: String,
        required: true
    },
    avatarUrl: {    //头像
        type: String,
        default: ""  //默认头像
    },
    sex: {             //性别
        type: String,
        enum: ['男', '女', '保密'],
        default: "保密"
    },
    create_time: {  //创建时间
        type: String,
        default: moment().format("YYYY年MM月DD日 HH时mm分ss秒")
    },
    is_del: {    //是否删除
        type: Boolean,
        default: false
    },
})

const UserModel = mongoose.model("User", UserSchema)

module.exports = UserModel