const example = `const originalPush = Router.prototype.push;
const originalReplace = Router.prototype.replace;

Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err);
};
Router.prototype.replace = function push (location, onResolve, onReject) {
  if (onResolve || onReject) return originalReplace.call(this, location, onResolve, onReject)
  return originalReplace.call(this, location).catch(err => err)
}`;

module.exports = {
  selected: true,
  title: '路由故障（重复跳转）',

  value: example,
  type: "code",
  example,
  description: "router.base为路由前缀，可设置为process.env.BASE_URL，需配合vue.config.js配置BASE_URL选项",
};