const { APP_PORT } = require('./config/config.default')

const app = require('./app')

app.listen(APP_PORT, () => {
    console.log(`服务已经启动 http://127.0.0.1:${APP_PORT}`);
})