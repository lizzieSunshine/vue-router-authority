import Vue from 'vue'
import Router from 'vue-router'
import routes from "./router/index2";
import { message } from '@/libs/utils/resetElement.js';

Vue.use(Router)

// 路由故障
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};

// scroll行为
const scrollBehavior = (to, from, savedPosition) => {
  const { scrollBehavior = {} } = to['meta'] || {};
  const { disable, filter } = scrollBehavior || {};

  if (disable && to.query[filter]) return;

  return to.hash
    ? ({
      selector: to.hash,
      behavior: 'smooth',
    })
    : ({
      x: 0,
      y: 0,
      behavior: 'smooth',
    })
};


const router =  new Router({
  mode: 'hash',
  routes: [
  ],
  scrollBehavior
});

/**
* 格式化router component
* @param {Array} source 路由
* @param {Object} parent 父级
* @param {Function} cb 回调函数
*/
const formatRouterComponent = (source, parent, cb) => {
 for (let i = 0; i < source.length; i++) {
   const item = source[i];
   const { children = [] } = item;

   let obj = JSON.parse(JSON.stringify(item));

   // format component
   if (obj['component']) {
     obj.component = () => import('@/' + item.component + '.vue');
   }

   cb && typeof cb === 'function' && cb(obj);

   delete obj['children'];
   
   parent
     ? router.addRoute(parent, obj)
     : router.addRoute(obj);

   if (children && children.length > 0) {
     formatRouterComponent(children, obj.name, cb);
   }
 }
}

// 格式化router component
formatRouterComponent(routes, null, obj => {
 // todo
});


/**
* 用户自行扩展
*/

// 重定向path
const redirectPath = "/index";

// 用户角色
const role = "2";

// 路由守卫
router.beforeEach((to, from, next) => {
 const { meta = {} } = to;
 const { auth = [] } = meta || {};

 // 前置路由拦截
 const fromInterceptors = (fromName) => {
   if (meta && meta['_froms'] && meta._froms.length > 0) {
     // 刷新页面
     return !fromName
       // 是否允许自我刷新访问
       ? meta._froms.some(f => f === to.name)
       // from是否有权限进入to
       : meta._froms.some(f => f === fromName);
   };

   return true;
 }

 // 登录权限拦截
 const authInterceptors = (role) => {
   // 没有授权，默认为开放所有权限
   if (auth.length === 0) {
     return true;
   }

   return auth.some(item => item === role);
 };


 if (!to['meta']) {
   next();
   return;
 }

 // 前置路由合法性
 const fromValid = fromInterceptors(from.name);

 if (!fromValid) {
   next(redirectPath);
   return message.warning('非法跳转');
 };

 // 授权合法性
 const authValid = authInterceptors(role);
 if (!authValid) return message.warning('角色暂无权限');

 next();
});

export default router;