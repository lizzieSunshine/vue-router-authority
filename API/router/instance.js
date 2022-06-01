/**
 * 配置用户相关路由
 */
 const Router = require('koa-router');
 const controller = require('../controller/instance');
 
 // 路由实例
 let router = new Router({ prefix: '/api/instance' });
 
 router.get('/get', controller.get);
 router.get('/getDefault', controller.getDefault);
//  router.post('/edit', authController.edit);
//  router.post('/delete', authController.delete);
//  router.post('/auth', authController.auth);
//  router.post('/authFromRoutes', authController.authFromRoutes);
//  router.post('/saveRoutestoCache', authController.saveRoutestoCache);
//  router.post('/saveRoutes', authController.save);
 router.post('/save', controller.save);
//  router.post('/saveClient', controller.saveClient);
//  router.post('/getRouteNames', authController.getRouteNames);
 
 module.exports = router;