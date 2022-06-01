// const example = `/**
// * 用户自行扩展
// */

// // 重定向path
// const redirectPath = "/index";

// // 用户角色
// const role = "2";

// // 路由守卫
// router.beforeEach((to, from, next) => {
//  const { meta = {} } = to;
//  const { auth = [] } = meta || {};

//  // 前置路由拦截
//  const fromInterceptors = (fromName) => {
//    if (meta && meta['_froms'] && meta._froms.length > 0) {
//      // 刷新页面
//      return !fromName
//        // 是否允许自我刷新访问
//        ? meta._froms.some(f => f === to.name)
//        // from是否有权限进入to
//        : meta._froms.some(f => f === fromName);
//    };

//    return true;
//  }

//  // 登录权限拦截
//  const authInterceptors = (role) => {
//    // 没有授权，默认为开放所有权限
//    if (auth.length === 0) {
//      return true;
//    }

//    return auth.some(item => item === role);
//  };


//  if (!to['meta']) {
//    next();
//    return;
//  }

//  // 前置路由合法性
//  const fromValid = fromInterceptors(from.name);

//  if (!fromValid) {
//    next(redirectPath);
//    return Message.warning('非法跳转');
//  };

//  // 授权合法性
//  const authValid = authInterceptors(role);
//  if (!authValid) return Message.warning('角色暂无权限');

//  next();
// });`;

const example = `/**
 * 路由守卫
 */

// 路由守卫配置
const beforeEachCfg = {
  /**
   * 前置路由拦截
   * @param {string} fromName from路由名
   * @param {object} to router.to
   * @returns 是否需要拦截
   */
  fromInterceptor: (fromName, to) => {
    const { meta = {} } = to;
    const { _froms = [] } = meta;

    // 是否需要拦截
    const needsInterceptors = meta && _froms && _froms.length > 0;

    // 放行
    if (!needsInterceptors) return true;
    
    return !fromName
      // 是否允许自我刷新访问
      ? _froms.some(f => f === to.name)
      // from是否有权限进入to
      : _froms.some(f => f === fromName);
  },

  /**
   * 角色路由拦截
   * @param {string} role 当前角色
   * @param {Array} auth 可访问权限
   */
  roleInterceptor: (role, auth) => {
    // 没有授权项，默认为开放所有权限
    if (auth.length === 0) return true;

    return auth.some(item => item === role);
  },

  /**
   * 非指定路由不能访问拦截
   * @description 对于必须登录才能访问的网站，部分路由可非登录访问（如：登录、注册等等），其余的需通过token验证成功才可访问
   * @param {object} to router.to
   * @param {Array} noCheckRoute 非登录状态也可访问的路由（名）集合
   */
  checkedAuthInterceptor: (to, noCheckRoute) => {
    return noCheckRoute.some(n => n === to.name);
    // if (noCheckRoute.some(n => n === to.name)) {
    //   next();
    // } else {
    //   cb && typeof cb === 'function' && cb();
    //   // CAS.checkToken(false) ? next() : CAS.gotoLogin();
    // }
  }
};

// 重定向path
const redirectPath = "/index";

// 用户角色
const role = "2";

// 路由守卫
router.beforeEach((to, from, next) => {
  const { meta = {} } = to;
  const { auth = [] } = meta || {};

  if (!to['meta']) {
    next();
    return;
  }

  // 前置路由合法性
  const fromValid = beforeEachCfg.fromInterceptor(from.name, to);
  if (!fromValid) {
    next(redirectPath);
    return Message.warning('非法跳转');
  };

  // 授权合法性
  const roleValid = beforeEachCfg.roleInterceptor(role, auth);
  if (!roleValid) return Message.warning('角色暂无权限');

  // token有效性
  const noCheckRoute = [];
  const checkedValid = beforeEachCfg.checkedAuthInterceptor(to, noCheckRoute);
  console.log(checkedValid);
  // checkedValid ? next() : CAS.checkToken(false) ? next() : CAS.gotoLogin();

  next();
});`;

module.exports = {
  selected: true,
  title: '全局导航守卫beforeEach',

  value: example,
  type: "code",
  example,
  description: "全局路由守卫——beforeEach：若要配套使用路由管控，最好勾选上该选项。其中“前置路由”、“角色管控”都可以在路由管控功能中配置，如果需要建议在此处勾选上该选项",
};