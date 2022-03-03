const Koa = require('koa');
const koaBody = require('koa-body');
const { koaSwagger } = require('koa2-swagger-ui')
const swagger = require('../util/swagger')
const app = new Koa();
const router = require('../router')
const KoaStatic = require('koa-static');
const path = require('path')
app.use(koaBody({
    multipart: true,
}));
//路由
app.use(router.routes())
//swagger
app.use(swagger.routes(), swagger.allowedMethods())
app.use(koaSwagger({
    routePrefix: '/swagger',
    swaggerOptions: {
        url: '/swagger.json'
    }
}))
//处理静态文件
app.use(KoaStatic(path.join(__dirname, `../public`)));
//处理上面没有处理的请求
app.use(async (ctx, next) => {
    ctx.status = 404
    ctx.body = "404"
})
//错误处理
app.on("error", (err, ctx) => {
    ctx.status = parseInt(ctx.code) || 500
    ctx.body = err
})

module.exports = app