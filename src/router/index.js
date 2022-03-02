const fs = require('fs')
const Router = require('koa-router')
const router = new Router()
fs.readdirSync(__dirname).forEach(fileName => {
    if (fileName != 'index.js') {
        router.use(require('./' + fileName).routes())
    }
})

module.exports = router
