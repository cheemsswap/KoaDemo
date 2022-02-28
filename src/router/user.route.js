const Router = require('koa-router')

const { regitser, login } = require('../controller/user.controller')
const UserRouter = new Router({ prefix: '/users' })

//用户注册接口
UserRouter.post('/register', regitser)

//用户登录接口
UserRouter.post('/login', login)

module.exports = UserRouter