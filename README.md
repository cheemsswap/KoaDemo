# 使用说明：

```javascript
使用步骤:
npm update
npm i
npm run dev
```

### 配置文件.env   

可配置运行端口号、mongodb数据库、注册手机号码的国家、Token私钥和过期时间、图片文件上传的大小

```bash
#app端口号
APP_PORT=3000
#mongodb数据库信息
MOMGO_HOST=127.0.0.1
MOMGO_PORT=27017
MOMGO_DB=demo
MOMGO_USER=admin
MOMGO_PWD=123456isMobilePhone
#手机号码注册国家 具体要修改 查看 https://github.com/validatorjs/validator.js#validators 下的 isMobilePhone 参数
COUNTRY=zh-CN
#token私钥 
JWT_SECRET=cheemsswap
#token过期时间  过期时间设置，可具体查看 https://github.com/auth0/node-jsonwebtoken#usage 
JWT_TIME = 1h
#上传图片大小 限制 单位字节
UPLOAD_MAXSIZE=104857600
```

### Swagger页面(需要一定的网络 加载swagger-ui的cdn)

```bash
http://127.0.0.1:3000/swagger
```

![](https://github.com/cheemsswap/KoaDemo/releases/download/koa/swagger.jpg)

# 文件目录结构：

```bash
│  .env                                       #配置文件
│  package-lock.json
│  package.json
│  README.md                                  #描述文件
├─node_modules
└─src
    │  main.js							      #文件入口
    │  
    ├─app
    │      index.js		
    │       
    ├─config                                  #读取配置文件并暴露供其他js文件使用
    │      config.default.js          
    │      
    ├─constant                                #配置错误请求 静态json
    │      errHandler.js		
    │      
    ├─controller                              #控制器 实现与server的业务逻辑  是路由的最后的中间件
    │      upload.controller.js                  #上传保存
    │      user.controller.js                    #用户注册 登录 修改密码
    │      
    ├─middleware							  #中间件 实现初步的验证校验操作  是路由的中间件部分
    │      auth.middleware.js					#token验证中间件 ->校验token有效性
    │      upload.middleware.js                 #上传验证中间件 ->校验文件格式大小
    │      user.middleware.js                   #表单有效性校验
    │      
    ├─model                                   #mogodb数据库模型
    │      db.js                             	#mogodb连接数据库
    │      user.model.js                        #mogodb->users表的model
    │      
    ├─public							      #静态文件资源
    │  └─uploads                                #上传文件的目录
    │      └─2022_03_03
    ├─router                                  #路由
    │      index.js                             #路由入口 -> 实现当前目录下的路由的自动引入
    │      upload.route.js                      #上传文件的路由
    │      user.route.js                        #用户路由
    │      
    ├─server								  #数据库业务层
    │      user.serve.js						#users表 增删改查 业务
    │      
    └─util									  #工具
            swagger.js						    #swagger工具
```

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
    const mongoose = require('mongoose')	 
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

## 13、增加Swagger模块

### 13.1、安装swagger-jsdoc和koa2-swagger-ui

```bash
npm install koa2-swagger-ui swagger-jsdoc --save
```

### 13.2、新建swagger.js

```javascript
---src
	---util
		---swagger.js
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
```

### 13.3、app注册

```javascript
---src
	---app
		---index.js
    const { koaSwagger } = require('koa2-swagger-ui')
    const swagger = require('../util/swagger')

    app.use(swagger.routes(), swagger.allowedMethods())
    app.use(koaSwagger({
        routePrefix: '/swagger',
        swaggerOptions: {
            url: '/swagger.json'
        }
    }))
```

### 13.4、第一次使用 为 /users/register 接口添加swagger配置

```javascript
---src
	---router
		---user.router.js
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
```

## 14、增加参数验证器 自定义中间件

![时序图1](https://github.com/cheemsswap/KoaDemo/releases/download/koa/1.png)

```javascript
---src
	---middleware
		---user.middleware.js
const { SelectUserPhoneIsBeing } = require('../server/user.serve')
const validator = require('../util/validator')
const {
    ErrorDefaultArguments,
    ErrorIsMobilePhone,
    ErrorIsSex,
    ErrorMobilePhoneIsRegitsered,
    ErrorServer
} = require('../consitant/errHandler')
class UserMiddleWare {
    async RegisterFormValidator(ctx, next) {
        //注册表单验证
        const { phone, username, password, sex } = ctx.request.body
        const sexList = ["男", "女", "保密", undefined]
        if (phone == undefined || username == undefined || password == undefined) {
            //参数缺少
            // ctx.status = 403
            // ctx.body = {
            //     code: 403,
            //     message: "参数缺少",
            //     result: ""
            // }
            ctx.app.emit("error", ErrorDefaultArguments, ctx)
        }
        else if (!validator.isMobilePhone(phone, "zh-CN")) {
            // ctx.status = 403
            // ctx.body = {
            //     code: 403,
            //     message: "手机号码不正确",
            //     result: ""
            // }
            ctx.app.emit("error", ErrorIsMobilePhone, ctx)
        }
        else if (!sexList.includes(sex)) {
            //性别参数有误
            // ctx.status = 403
            // ctx.body = {
            //     code: 403,
            //     message: "性别参数有误",
            //     result: ""
            // }
            ctx.app.emit("error", ErrorIsSex, ctx)
        }
        else {
            //判断用户是否注册
            const req = await SelectUserPhoneIsBeing({ phone })
            if (req.code == 200) {
                if (req.result) {
                    await next()
                }
                else {
                    // ctx.status = 403
                    // ctx.body = {
                    //     code: 403,
                    //     message: "手机号已被注册",
                    //     result: ""
                    // }
                    ctx.app.emit("error", ErrorMobilePhoneIsRegitsered, ctx)
                }
            }
            else {
                // ctx.status = 500
                // ctx.body = {
                //     code: 500,
                //     message: "服务器内部错误",
                //     result: ""
                // }
                ctx.app.emit("error", ErrorServer, ctx)
            }
        }

    }
}
module.exports = new UserMiddleWare()
```

## 15、封装验证失败模块

### 15.1、请求失败的参数列表 errHandler.js

```javascript
---src
	---consitant
		---errHandler.js
module.exports = {
    //默认参数错误
    ErrorDefaultArguments: {
        code: 403,
        message: "参数缺少",
        result: ""
    },
    //服务器内部错误
    ErrorServer: {
        code: 500,
        message: "服务器内部错误",
        result: ""
    },
    //错误的移动电话
    ErrorIsMobilePhone: {
        code: 403,
        message: "手机号码不正确",
        result: ""
    },
    //错误的性别
    ErrorIsSex: {
        code: 403,
        message: "性别参数有误",
        result: ""
    },
    //手机号码已被注册
    ErrorMobilePhoneIsRegitsered: {
        code: 403,
        message: "手机号已被注册",
        result: ""
    }
}
```

### 15.2、app设置全局错误处理

```javascript
---src
	---app
		---index.js
//错误处理
app.on("error", (err, ctx) => {
    ctx.status = parseInt(ctx.code) || 500
    ctx.body = err
})
```

## 16、优化代码 14-15部分的代码  并 完成 登录验证

### 16.1 添加登录表单验证 

```javascript
---src
	---middleware
		---user.middleware.js
async LoginFormValidator(ctx, next) {
    const { phone, password } = ctx.request.body
    if (phone == undefined || password == undefined) {
        ctx.app.emit("error", ErrorDefaultArguments, ctx)
    } else if (!validator.isMobilePhone(phone, "zh-CN")) {
        ctx.app.emit("error", ErrorIsMobilePhone, ctx)
    }
    else {
        try {
            const req = await SelectUserInfo({ phone })
            if (req) {
                //数据存在该号码的信息
                await next()
            }
            else {
                //数据不存在该号码的信息 登录返回-用户不存在
                ctx.app.emit("error", ErrorMobilePhoneIsNotRegitsered, ctx)
            }
        } catch (err) {
            ctx.app.emit("error", ErrorServer, ctx)
        }
    }
}
```

### 16.2、登录验证

```javascript
---src
	---controller
		---user.controller.js
async login(ctx, next) {
    try {
        const { password } = ctx.request.body
        const res = await SelectUserInfo(ctx.request.body)
        //验证密码
        if (res) {
            if (bcrypt.compareSync(password, res.password)) {
                ctx.status = 200
                ctx.body = {
                    code: 200,
                    message: "登录成功",
                    result: ""
                }
            }
            else {
                ctx.app.emit("error", ErrorPassword, ctx)
            }
        }
        else {
            ctx.app.emit("error", ErrorMobilePhoneIsNotRegitsered, ctx)
        }
    } catch (err) {
        ctx.app.emit("error", ErrorServer, ctx)
    }
}
```

### 16.3 、为登录路由添加中间件

```javascript
---src
	---router
		---user.route.js
UserRouter.post('/login', LoginFormValidator, login)
```

## 17、增加token分发

### 17.1、安装jsonwebtoken

```bash
npm i jsonwebtoken
```

### 17.2、增加token的私钥和过期时间的配置

```bash
---.env

JWT_SECRET=cheemsswap
JWT_TIME = 1h
```

### 17.3、为登录控制器添加 token的分发

```javascript
const jwt = require('jsonwebtoken')
const { JWT_SECRET, JWT_TIME } = require("../config/config.default")
---src
	---controller
		---user.controller.js
核心代码:
    async login(ctx, next) {
        try {
            const { phone, password } = ctx.request.body
            const res = await SelectUserInfo({ phone })
            //验证密码
            if (res) {
                if (bcrypt.compareSync(password, res.password)) {
                    //token payload 包含 _id+手机号码+密码+是否删除
                    const { _id, phone, password, is_del } = res
                    ctx.status = 200
                    ctx.body = {
                        code: 200,
                        message: "登录成功",
                        result: {
                            //新增代码 分发token
                            token: jwt.sign({ _id, phone, password, is_del }, JWT_SECRET, {
                                expiresIn: JWT_TIME
                            })
                        }
                    }
                }
                else {
                    ctx.app.emit("error", ErrorPassword, ctx)
                }
            }
            else {
                ctx.app.emit("error", ErrorMobilePhoneIsNotRegitsered, ctx)
            }
        } catch (err) {
            ctx.app.emit("error", ErrorServer, ctx)
        }
    }
```

## 18、完成修改密码的接口

### 18.1、增加密码表单的简单验证中间件

```javascript
---src
	---middleware
		---user.middleware.js
//简单修改密码验证中间件
    async UpdateFormValidator(ctx, next) {
        const { oldpassword, newpassword } = ctx.request.body
        if (oldpassword == undefined || oldpassword.trim() == "" 
            || newpassword == undefined || newpassword.trim() == "") {
            ctx.app.emit("error", ErrorDefaultArguments, ctx)
        } else if (oldpassword == newpassword) {
            ctx.app.emit("error", ErrorUpdateNewpasswordIsEqual, ctx)
        }
        else {
            await next()
        }
    }
```

### 18.2、增加验证token中间件

```javascript
---src
	---middleware
		---auth.middleware.js
//1、获取token 并检测token是否有效
//2、数据库查询tonken里面的参数是否正确
//3、如果token有效 -》将查询数据存放到 ctx.state.tokenInfo里面
const { SelectUserInfo } = require('../server/user.serve')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require("../config/config.default")
const {
    ErrorToken
} = require('../constant/errHandler')
class AuthMiddleware {
    //验证token
    async VerificationToken(ctx, next) {
        const { authorization } = ctx.request.header
        const token = authorization.replace("Bearer ", "")
        try {
            const tokenInfo = jwt.verify(token, JWT_SECRET)
            const { _id, phone, password, is_del } = tokenInfo
            const req = await SelectUserInfo({ _id, phone, password, is_del })
            if (req) {
                ctx.state.tokenInfo = tokenInfo
                await next()
            }
            else {
                ctx.app.emit("error", ErrorToken, ctx)
            }
        } catch (error) {
            //错误或者过期的token
            ctx.app.emit("error", ErrorToken, ctx)
        }
    }
}

module.exports = new AuthMiddleware()
```

### 18.3、修改密码加密的中间件 为其newpassword也能做到加密操作

```javascript
---src
	---middleware
		---user.middleware.js
    async EncryptionPassword(ctx, next) {
        //密码加密
        try {
            //新增部分
            const { password, newpassword } = ctx.request.body
            if (password) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(password, salt);
                ctx.request.body.password = hash
            }
            
            //新增部分
            if (newpassword) {
                const salt = bcrypt.genSaltSync(10);
                const hash = bcrypt.hashSync(newpassword, salt);
                ctx.request.body.newpassword = hash
            }
            await next()
        } catch (err) {
            ctx.app.emit("error", ErrorServer, ctx)
        }
    }
```

### 18.4、增加修改密码的server

```javascript
---src
	---server
		---user.serve.js
    //修改用户信息
    UpdateUserInfo(oldUserInfo, newUserInfo) {
        return new Promise((request, reject) => {
            UserModel.updateOne(oldUserInfo, newUserInfo).then(data => {
                request(data)
            }).catch(err => {
                reject(err)
            })
        })
    }
```

### 18.5、增加修改密码的控制器

```javascript
---src
	---controller
		---user.controller.js
    async updatepassword(ctx, next) {
        try {
            const { password } = ctx.state.tokenInfo
            const { oldpassword, newpassword } = ctx.request.body
            if (bcrypt.compareSync(oldpassword, password)) {
                const req = await UpdateUserInfo(ctx.state.tokenInfo, { password: newpassword })
                if (req.acknowledged) {
                    ctx.status = 200
                    ctx.body = {
                        code: 200,
                        message: "修改成功",
                        result: ""
                    }
                } else {
                    ctx.app.emit("error", ErrorServer, ctx)
                }
            }
            else {
                ctx.app.emit("error", ErrorPassword, ctx)
            }
        } catch (err) {
            ctx.app.emit("error", ErrorServer, ctx)
        }
    }
```

### 18.6、/users/updatepassword 路由的填充

```javascript
---src
	---router
		---user.route.js
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
```

## 19、优化 添加自动引入路由

### 19.1、在router下创建index.js 让其可以自动引入其文件夹下所有的文件

```javascript
---src
	---router
		---index.js
const fs = require('fs')
const Router = require('koa-router')
const router = new Router()
fs.readdirSync(__dirname).forEach(fileName => {
    if (fileName != 'index.js') {
        router.use(require('./' + fileName).routes())
    }
})
module.exports = router
```

### 19.2、修改app让其引入这个整合的路由

```javascript
const router = require('../router')
app.use(router.routes())
```

## 20、增加上传之图片上传功能

### 20.1、新建上传路由upload.route.js

```javascript
---src
	---router
		---upload.route.js
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
 *         description: 图片上传 默认2M大小
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
```

### 20.2、为配置文件添加图片大小限制

```bash
UPLOAD_MAXSIZE=2097152
```

### 20.3、增加图片格式和大小的验证中间件 

```javascript
---src
	---middleware
		---upload.middleware.js
//图片大小默认2M大小
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
            if (type === 'image/jpeg' ||
                type === 'image/png' ||
                type === 'image/gif') {
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
```

### 20.4、增加图片上传控制器

```javascript
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
            await mkdirp.sync(`./src/public/uploads/${day}`)
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
                    url: `/public/uploads/${day}/${newFilename}`
                }
            }
        } catch (error) {
            ctx.app.emit('error', ErrorServer, ctx)
        }
    }
}
module.exports = new UploadController();
```

## 21、增加静态文件模块

### 21.1、安装koa-static模块

```bash
npm i koa-static
```

### 21.2、注册使用这个模块

```javascript
---app
	---index.js
const KoaStatic = require('koa-static');
const path = require('path')
//处理静态文件
app.use(KoaStatic(path.join(__dirname, `../public`)));
```

