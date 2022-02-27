const Koa = require('koa');
const Router = require('koa-router')
const { APP_PORT } = require('./config/config.default')

const app = new Koa();

const IndexRouter = new Router()
IndexRouter.get('/', (ctx, next) => {
    ctx.body = "hello index"
})
app.use(IndexRouter.routes())


app.listen(APP_PORT, () => {
    console.log(`服务已经启动 http://127.0.0.1:${APP_PORT}`);
})