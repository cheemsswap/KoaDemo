const fs = require('fs')
const PATH = require('path')
const mkdirp = require('mkdirp')
const moment = require('moment')
const { ErrorServer } = require('../constant/errHandler')

class UploadController {
    async uploadpic(ctx, next) {
        try {
            const { path, name } = ctx.state.fileInfo
            // 创建可读流
            const reader = fs.createReadStream(path);
            //生成文件名 并设置保存地址
            const newFilename = Date.now() + '-' + Math.round(Math.random() * 1E9) + PATH.extname(name)
            const day = moment().format("YYYY_MM_DD")
            await mkdirp.sync(PATH.join(__dirname, `../public/uploads/${day}`))
            const uploadPath = PATH.join(__dirname, `../public/uploads/${day}/${newFilename}`)
            //创建可写流
            const upStream = fs.createWriteStream(uploadPath);
            // 可读流通过管道写入可写流
            reader.pipe(upStream);
            ctx.status = 200;
            ctx.body = {
                code: 200,
                message: "保存成功",
                result: {
                    url: `/uploads/${day}/${newFilename}`
                }
            }
        } catch (error) {
            ctx.app.emit('error', ErrorServer, ctx)
        }
    }
}

module.exports = new UploadController();