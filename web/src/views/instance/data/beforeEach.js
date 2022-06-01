const example = `/**
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
});`;

export default {
  selected: true,
  title: '全局导航守卫beforeEach',

  value: example,
  type: "code",
  example,
  description: "全局路由守卫——beforeEach：若要配套使用路由管控，最好勾选上该选项。其中“前置路由”、“角色管控”都可以在路由管控功能中配置，如果需要建议在此处勾选上该选项",
};