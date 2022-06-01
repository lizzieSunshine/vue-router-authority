/**
 * 配置用户相关路由
 */
 const Router = require('koa-router');
 const homeController = require('../controller/homeController');
 
 // 路由实例
 let router = new Router();
 
 // 首页
//  router.get('/', homeController.indexView);
 router.get('/productClassify', homeController.productClassify);
 router.get('/test', homeController.test);
 router.post('/post', homeController.format);
 
 module.exports = router;