const Koa = require('koa');

const app = new Koa();

const UserRouter = require('../router/user.route')

app.use(UserRouter.routes())

module.exports = app