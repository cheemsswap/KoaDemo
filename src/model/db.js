const {
    MOMGO_HOST,
    MOMGO_PORT,
    MOMGO_USER,
    MOMGO_PWD,
    MOMGO_DB,
} = require("../config/config.default")

const mongoose = require('mongoose')

console.log("正在连接数据库....请稍等");
mongoose.connect(`mongodb://${MOMGO_USER}:${MOMGO_PWD}@${MOMGO_HOST}:${MOMGO_PORT}/${MOMGO_DB}`, (err) => {
    if (err) {
        setInterval(() => {
            console.log("数据库连接失败,请检查数据库配置");
        }, 3000);
        return;
    }
    console.log("数据库连接成功");
})

module.exports = mongoose
