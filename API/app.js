const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const path = require('path');
// const render = require('koa-art-template');
const static = require('koa-static');

// 路由模块（自定义）
const homeRouter = require('./router/homeRouter');
const authRouter = require('./router/auth');
const enumsRouter = require('./router/enums');
const instanceRouter = require('./router/instance');

// 实例化
let app = new Koa();

app.use(bodyParser());
app.use(cors());
app.use(static(path.join(__dirname, './public')));;
// render(app, {
//   root: path.join(__dirname, './views'), // 视图路径
//   extname: '.html', // 文件后缀名
//   debug: process.env.NODE_ENV !== 'production' // 是否开启调试模式
// });

// 跨域处理
app.use(async (ctx, next) => {
  ctx.response.set('Access-Control-Allow-Origin', '*');
  ctx.response.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  ctx.response.set("Access-Control-Allow-Headers", 'token');
  await next();
});

// 挂载路由
app.use(homeRouter.routes()).use(homeRouter.allowedMethods());
app.use(authRouter.routes()).use(authRouter.allowedMethods());
app.use(enumsRouter.routes()).use(enumsRouter.allowedMethods());
app.use(instanceRouter.routes()).use(instanceRouter.allowedMethods());

// 监听端口
app.listen(7777, () => {
  console.log('服务器启动：7777');
});
