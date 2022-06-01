/**
 * 配置用户相关路由
 */
const Router = require('koa-router');
const authController = require('../controller/auth');

// 路由实例
let router = new Router({ prefix: '/api/router' });

router.get('/get', authController.get);
router.post('/add', authController.add);
router.post('/edit', authController.edit);
router.post('/delete', authController.delete);
router.post('/auth', authController.auth);
router.post('/authFromRoutes', authController.authFromRoutes);
router.post('/saveRoutestoCache', authController.saveRoutestoCache);
router.post('/save', authController.save);
router.post('/validateUniqueness', authController.validateUniqueness);
router.post('/getRouteNames', authController.getRouteNames);
router.post('/formatCodetoObj', authController.formatCodetoObj);

module.exports = router;