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

module.exports = app