const Router = require('koa-router')
const UploadRouter = new Router({ prefix: '/upload' })
const { VerificationToken } = require('../middleware/auth.middleware')
const { UploadPICValidator } = require('../middleware/upload.middleware')
const { uploadpic } = require('../controller/upload.controller')
//图片上传
/**
 * @swagger
 * /upload/pic: # 接口地址
 *   post:
 *     description: 图片上传 # 接口信息
 *     summary : 图片上传
 *     tags: [文件上传] # 模块名称
 *     produces: 
 *       - application/x-www-form-urlencoded # 响应内容类型
 *     parameters: # 请求参数
 *       - name: Authorization
 *         description: Authorization
 *         in: header
 *         required: true
 *         type: string
 *         default : 'Bearer '
 *       - name: file
 *         description: 图片上传
 *         in: formData 
 *         required: true
 *         type: file
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
 *               description: 上传成功
 *             result:
 *               type: 'object'
 *               description: 上传成功的URL
 *       '403':
 *         description: 被阻止的
 *       '500':
 *         description: 服务器内部错误
 */
UploadRouter.post('/pic', UploadPICValidator, VerificationToken, uploadpic)

module.exports = UploadRouter