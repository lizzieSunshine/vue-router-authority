const example = `/**
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
`;

export default {
  selected: true,
  title: '格式化路由组件',

  value: example,
  type: "code",
  example,
  description: "如果使用了本系统配套的路由管控，则component则为String，需要在vue-router中格式化为可执行函数。当然只要是component为String都可以使用该方法，或者还可以扩展另外的方法，在formatRouterComponent的回调函数中可进行扩展",
};