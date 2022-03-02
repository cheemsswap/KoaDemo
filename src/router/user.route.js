const Router = require('koa-router')
const {
    regitser,
    login,
    updatepassword
} = require('../controller/user.controller')
const {
    RegisterFormValidator,
    EncryptionPassword,
    LoginFormValidator,
    UpdateFormValidator
} = require('../middleware/user.middleware')
const {
    VerificationToken
} = require("../middleware/auth.middleware")
const UserRouter = new Router({ prefix: '/users' })

/**
 * @swagger
 * /users/register: # 接口地址
 *   post: # 请求体
 *     description: 用户注册 # 接口信息
 *     summary : 用户注册
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
 *       '500':
 *         description: 服务器内部错误
 */
UserRouter.post('/register', RegisterFormValidator, EncryptionPassword, regitser)

/**
 * @swagger
 * /users/login: # 接口地址
 *   post: # 请求体
 *     description: 用户登录 # 接口信息
 *     summary : 用户登录
 *     tags: [用户模块] # 模块名称
 *     produces: 
 *       - application/x-www-form-urlencoded # 响应内容类型
 *     parameters: # 请求参数
 *       - name: phone
 *         description: 手机号码
 *         in: formData 
 *         required: true
 *         type: string
 *       - name: password
 *         description: 密码
 *         in: formData
 *         required: true
 *         type: string 
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
 *               description: 登录成功
 *             result:
 *               type: 'object'
 *               description: 登录返回的Token
 *       '403':
 *         description: 被阻止的
 *       '500':
 *         description: 服务器内部错误
 */
UserRouter.post('/login', LoginFormValidator, login)

/**
 * @swagger
 * /users/updatepassword: # 接口地址
 *   patch: # 请求体
 *     description: 修改密码 # 接口信息
 *     summary : 修改密码
 *     tags: [用户模块] # 模块名称
 *     produces: 
 *       - application/x-www-form-urlencoded # 响应内容类型
 *     parameters: # 请求参数
 *       - name: Authorization
 *         description: Authorization
 *         in: header
 *         required: true
 *         type: string
 *         default : 'Bearer '
 *       - name: oldpassword
 *         description: 旧密码
 *         in: formData
 *         required: true
 *         type: string 
 *       - name: newpassword
 *         description: 新密码
 *         in: formData
 *         required: true
 *         type: string 
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
 *               description: 修改成功
 *             result:
 *               type: 'object'
 *               description: 
 *       '403':
 *         description: 被阻止的
 *       '500':
 *         description: 服务器内部错误
 */
UserRouter.patch("/updatepassword", UpdateFormValidator, VerificationToken, EncryptionPassword, updatepassword)
module.exports = UserRouter