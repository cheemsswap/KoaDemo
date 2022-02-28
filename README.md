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

## 5、创建一个user.route的router

```javascript
---src
	---router
		---user.route.js
		核心代码:
		const Router = require('koa-router')
		//添加前缀
		const UserRouter = new Router({ prefix: '/users' })
		UserRouter.get('/', (ctx, next) => {
            ctx.body = "hello users"
		})
		module.exports = UserRouter
```

## 6、main.js 使用user.router

```javascript
---src
	---main.js
	核心代码：
    const UserRouter = require('./router/user.route')
	app.use(UserRouter.routes())
```

## 7、优化目录结构:将mian.js里面的涉及koa的业务都封装到app里面

```bash
---src
	---app
		---index.js
		核心代码:
		const Koa = require('koa');
		const app = new Koa();
		const UserRouter = require('../router/user.route')
		app.use(UserRouter.routes())
		module.exports = app
---src
	---main.js
		核心代码:
		const { APP_PORT } = require('./config/config.default')
		const app = require('./app')
		app.listen(APP_PORT, () => {
    		console.log(`服务已经启动 http://127.0.0.1:${APP_PORT}`);
		})
```

## 8、路由与控制器分离

```javascript
---src
	---controller
		---user.controller.js
		核心代码:
		class UserController {
    		async regitser(ctx, next) {
        		ctx.body = '注册'
    		}
            async login(ctx, next) {
        		ctx.body = '登录'
   	 		}	
		}
		module.exports = new UserController()
---src
	---router
		---user.route.js
		核心代码:
		const Router = require('koa-router')
		const { regitser } = require('../controller/user.controller')
		const UserRouter = new Router({ prefix: '/users' })
		
		//用户注册接口
		UserRouter.post('/register', regitser)
		//用户登录接口
		UserRouter.post('/login', login)
		
		module.exports = UserRouter
```

## 9、安装使用 koa-body 中间件

### 9.1、安装koa-body中间件

```bash
npm i koa-body
```

### 9.2、引入并注册中间件

```javascript
---src
	---app
		---index.js
	const Koa = require('koa');
	//引入
	const koaBody = require('koa-body');
	const app = new Koa();

	const UserRouter = require('../router/user.route')
    //注册中间件
	app.use(koaBody());
	app.use(UserRouter.routes())
	module.exports = app
```

### 9.3、测试使用

```javascript
---src
	---controller
		---user.controller.js
	核心代码:
    class UserController {
        async regitser(ctx, next) {
            //获取请求josn数据
            console.log(JSON.stringify(ctx.request.body));
            ctx.body = '注册'
        }
        async login(ctx, next) {
            ctx.body = '登录'
        }
    }
    module.exports = new UserController()
```

## 10、安装并封装好数据库mongoose

### 10.1、设置.env 配置文件

```bash
APP_PORT=3000

MOMGO_HOST=192.168.31.66
MOMGO_PORT=27017
MOMGO_DB=demo
MOMGO_USER=admin
MOMGO_PWD=123456
```

### 10.2、连接数据库模块 db.js

```javascript
---src
	---model
		---db.js
	核心代码:
    const {
        MOMGO_HOST,
        MOMGO_PORT,
        MOMGO_USER,
        MOMGO_PWD,
        MOMGO_DB,
    } = require("../config/config.default")
    const mongoose = require('mongoose')	 mongoose.connect(`mongodb://${MOMGO_USER}:${MOMGO_PWD}@${MOMGO_HOST}:${MOMGO_PORT}/${MOMGO_DB}`, (err) => {
        if (err) {
            setInterval(() => {
                console.log("数据库连接失败,请检查数据库配置");
            }, 3000);
            return;
        }
        console.log("数据库连接成功");
    })
    module.exports = mongoose
```

### 10.3、创建user.model.js 模块

```javascript
---src
	---model
		---user.model.js
	核心代码:
    const mongoose = require('./db')
    const moment = require('../util/moment')
    const UserSchema = mongoose.Schema({
        phone: {       //手机号码
            type: String,
            required: true, //必选
            unique: true,  //唯一索引
            match: /^\d{11}$/   //11位
        },
        username: {     //用户名
            type: String,
            trim: true,  //自动处理前后空格
            required: true
        },
        password: {     //密码
            type: String,
            required: true
        },
        avatarUrl: {    //头像
            type: String,
            default: ""  //默认头像
        },
        sex: {             //性别
            type: String,
            enum: ['男', '女', '保密'],
            default: "保密"
        },
        create_time: {  //创建时间
            type: String,
            default: moment().format("YYYY年MM月DD日 HH时mm分ss秒")
        },
        is_del: {    //是否删除
            type: Boolean,
            default: false
        },
    })
    const UserModel = mongoose.model("User", UserSchema)
    module.exports = UserModel
```

## 11、创建user.serve 模块

```javascript
---src
	---server
		---user.serve.js
	核心代码:
    const UserModel = require("../model/user.model")
    class UserServer {
        InsertUser(UserInfo) {
            return new Promise((request, reject) => {
                const user = new UserModel(UserInfo)
                user.save().then(data => {
                    request({
                        code: 200,
                        message: "注册成功",
                        result: {
                            phone: data.phone,
                            username: data.username,
                            create_time: data.create_time
                        }
                    })
                }).catch(err => {
                    reject({
                        code: 403,
                        message: err.toString().match(/: (.*)/)[1],
                        result: ""
                    });
                })
            })
        }
    }
    module.exports = new UserServer()
```

## 12、创建user.controller模块

```javascript
---src
	---controller
		---user.controller.js
	核心代码:
    const { InsertUser } = require('../server/user.serve')
    class UserController {
        async regitser(ctx, next) {
            try {
                const res = await InsertUser(ctx.request.body)
                ctx.status = 200
                ctx.body = res
            } catch (err) {
                ctx.status = 403
                ctx.body = err
            }
        }
        async login(ctx, next) {
            ctx.body = '登录'
        }
    }
    module.exports = new UserController()
```



