# 开发步骤

## 1、安装 koa 框架

```bash
npm i koa
```

## 2、编写最基本的app

```javascript
---src
	---main.js
	核心代码:
    const Koa = require('koa');
    const app = new Koa();

    app.use((ctx, next) => {
        ctx.body = "hello world"
    })
    
    app.listen(3000, () => {
        console.log("服务已经启动 http://127.0.0.1:3000");
    })
```

## 3、读取配置文件

### 3.1、安装 dotenv

```bash
npm i dotenv
```

### 3.2、创建 .env 文件 并编写配置文件

```
---.env
    APP_PORT=3000
```

### 3.3、创建 config.default.js 读取配置文件并暴露

```javascript
---src
	---config
		---config.default.js
		核心代码:
		
		const dotenv = require('dotenv')
		dotenv.config()
		// console.log(process.env.APP_PORT)
		module.exports = process.env
```

### 3.4、入口文件读取 配置文件信息

```javascript
---src
	---main.js
	核心代码:
	const Koa = require('koa');
	//读取配置文件
	const { APP_PORT } = require('./config/config.default')
	const app = new Koa();
	app.use((ctx, next) => {
    	ctx.body = "hello world"
	})
	//使用配置文件的信息
	app.listen(APP_PORT, () => {
   	 	console.log(`服务已经启动 http://127.0.0.1:${APP_PORT}`);
	})
```

## 4、koa-router的使用

### 4.1、安装 dotenv

```bash
npm i koa-router
```

### 4.2、简单的使用测试

```javascript
---main.js
	核心代码
	const Router = require('koa-router')
	const IndexRouter = new Router()
	IndexRouter.get('/', (ctx, next) => {
    	ctx.body = "hello index"
	})
	app.use(IndexRouter.routes())
```







