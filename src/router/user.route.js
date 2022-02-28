const Router = require('koa-router')


const { regitser, login } = require('../controller/user.controller')
const UserRouter = new Router({ prefix: '/users' })

/**
 * @swagger
 * /users/register: # 接口地址
 *   post: # 请求体
 *     description: 用户注册 # 接口信息
 *     tags: [用户模块] # 模块名称
 *     produces: 
 *       - application/x-www-form-urlencoded # 响应内容类型
 *     parameters: # 请求参数
 *       - name: phone
 *         description: 手机号码
 *         in: formData 
 *         required: true
 *         type: string
 *       - name: username
 *         description: 用户名
 *         in: formData
 *         required: true
 *         type: string 
 *       - name: password
 *         description: 密码
 *         in: formData
 *         required: true
 *         type: string 
 *       - name: sex
 *         description: 性别
 *         in: formData
 *         type: string
 *         default: 保密
 *         enum: ["男", "女", "保密"]
 *     responses:
 *       '200':
 *         description: Ok
 *         schema: # 返回体说明
 *           type: 'object'
 *           properties:
 *             code:
 *               type: 'number'
 *             message:
 *               type: 'string'
 *               description: 注册成功
 *             result:
 *               type: 'object'
 *               description: 返回注册成功的参数
 *       '403':
 *         description: 被阻止的
 */
UserRouter.post('/register', regitser)

UserRouter.post('/login', login)

module.exports = UserRouter