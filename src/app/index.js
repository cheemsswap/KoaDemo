const Koa = require('koa');
const koaBody = require('koa-body');
const { koaSwagger } = require('koa2-swagger-ui')
const swagger = require('../util/swagger')
const app = new Koa();

const UserRouter = require('../router/user.route')
app.use(koaBody());
app.use(UserRouter.routes())

app.use(swagger.routes(), swagger.allowedMethods())
app.use(koaSwagger({
    routePrefix: '/swagger',
    swaggerOptions: {
        url: '/swagger.json'
    }
}))

//错误处理
app.on("error", (err, ctx) => {
    ctx.status = parseInt(ctx.code) || 500
    ctx.body = err
})

module.exports = app