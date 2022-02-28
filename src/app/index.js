const Koa = require('koa');
const koaBody = require('koa-body');
const app = new Koa();

const UserRouter = require('../router/user.route')
app.use(koaBody());
app.use(UserRouter.routes())

module.exports = app