const { UPLOAD_MAXSIZE = 2097152 } = require('../config/config.default')
const {
    ErrorFileFormat,
    ErrorFileLarge,
    ErrorServer
} = require('../constant/errHandler')
class UploadMiddleWare {
    async UploadPICValidator(ctx, next) {
        //图片校验格式 和 大小
        try {
            const { type, size } = ctx.request.files.file
            const fileType = ['image/jpeg', 'image/png', 'image/gif']
            if (fileType.includes(type)) {
                if (size <= UPLOAD_MAXSIZE) {
                    ctx.state.fileInfo = ctx.request.files.file
                    await next()
                }
                else {
                    ctx.app.emit('error', ErrorFileLarge, ctx);
                }
            }
            else
                ctx.app.emit('error', ErrorFileFormat, ctx)
        } catch (error) {
            ctx.app.emit('error', ErrorServer, ctx)
        }
    }
}

module.exports = new UploadMiddleWare()