/**
 * 配置用户相关路由
 */
 const Router = require('koa-router');
 const controller = require('../controller/enums');
 
 // 路由实例
 let router = new Router({ prefix: '/api/enums' });
 
 router.get('/get', controller.get);
 router.get('/getByName', controller.getByName);
 router.post('/save', controller.save);
 
 module.exports = router;