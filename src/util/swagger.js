const path = require('path')
const router = require('koa-router')() //引入路由函数
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerDefinition = {
    //swagger-ui显示的基本信息，如标题、版本、描述
    info: {
        title: '接口文档',
        version: '1.0.0',
        description: 'API文档',
    },
    schemes: ['http'],
}
const options = {
    swaggerDefinition,
    apis: [path.join(__dirname, '../router/*.js')],
};
const swaggerSpec = swaggerJSDoc(options)
// 通过路由获取生成的注解文件
router.get('/swagger.json', async function (ctx) {
    ctx.set('Content-Type', 'application/json');
    ctx.body = swaggerSpec;
})
module.exports = router
