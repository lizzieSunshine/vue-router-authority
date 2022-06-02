/**
 * 首页控制器
 */

const fs = require("fs");
const path = require("path");
const config = require('../config/');
const { readFile, writeFile, exsitAndMK } = require('../libs/file');
const { timeStamp, getUUID, filterRecursion, filterRecursionByName, copy, getRootPath } = require('../libs/utils');
const { deleteFromArray } = require('../libs/array');
const { codeTemplatePath } = require('../config/index');
const compile = require('../libs/compile');

// 获取路径
const getPath = (rootPath) => {
  const { routesDir, routes } = config;

  // 路由文件夹
  const dir = path.join(rootPath, routesDir);
  // 路由文件
  const routesPath = path.join(dir, routes);
  // 缓存路由
  const cachePath = path.join(__dirname, '../_cache');

  return { dir, routesPath, cachePath };
}

// 标准路由
const standardRoute = () => {
  return {
    path: "",
    name: "",
    component: "",
    _title: "",
    group: "",
    _parentId: "",
    id: ""
  };
};

// 组装router.js
const uploadFile = (routers) => {
  let content = routers.map(item => JSON.stringify(item)).join(",");
  return `[${content}]`;
};

// 格式化路由
const formatComponent = (source) => {
  copy(source, item => {
    const { component } = item;

    // add id
    !item['id'] && (item['id'] = getUUID());

    // add parent id
    item['children'] && item.children.length > 0 && item.children.forEach(d => d['_parentId'] = item.id);

    // tranverse component's function to string
    component && (item.component = component.toString());
  });
}

// 根据物理路径获取路由
module.exports.get = async ctx => {
  // 目标文件物理路径
  const fullPath = ctx.request.query.path;

  if (!fullPath) {
    ctx.body = { code: -1, message: '参数缺失', data: [] };
  }

  // path
  const { routesDir, routes, routerConfig } = config;

  try {
    // root文件夹是否存在，不存在则创建
    const rootPath = getRootPath(fullPath);
    exsitAndMK(rootPath);

    // 路由文件夹
    const routesDirPath = path.join(rootPath, routesDir);
    exsitAndMK(routesDirPath);

    // 实例文件
    const routesPath = path.join(routesDirPath, routes);
    exsitAndMK(routesPath, true, "export default []");

    // 读文件
    let data = await readFile(routesPath, "utf-8");
    
    // 缓存文件名
    const { cachePath } = getPath(rootPath);
    const cacheFileName = `_router_${timeStamp()}.js`;
    const cacheFullPath = path.join(cachePath, cacheFileName);

    // 格式化（缓存数据）
    data = data.replace('export default', 'module.exports = ');

    // 写缓存
    await writeFile(cacheFullPath, data);

    // 引入缓存
    const result = require(cacheFullPath);

    // 格式化component
    formatComponent(result);

    // 删除缓存
    fs.unlink(cacheFullPath, err => {
      console.log(err);
    });

    ctx.body = { code: 0, message: '', data: {
      path: routesPath,
      data: result || []
    } };

  } catch (e) {
    console.log(e);
    ctx.body = { code: 1, message: '失败', data: e.message };
  }
};

// 新增
module.exports.add = async (ctx) => {
  const route = ctx.request.body.route; // 当前路由
  const parentId = ctx.request.body.parentId; // 当前路由父级ID
  const routers = ctx.request.body.routers; // 路由合集

  if (!route) {
    ctx.body = { code: 1, message: '路由缺失' };
  }

  route['id'] = getUUID();
  route['_parentId'] = parentId;

  // 新增根节点
  const addRoot = () => {
    routers.push(route);
  };

  // 新增子节点
  const addChild = () => {
    filterRecursion(routers, parentId, (routeItem) => {
      routeItem["children"]
        ? routeItem.children.push(route)
        : routeItem["children"] = [route];
    });
  };

  parentId ? addChild() : addRoot();

  ctx.body = { code: 0, message: '成功', data: routers };
};

// 编辑
module.exports.edit = async (ctx) => {
  const id = ctx.request.body.id;
  const route = ctx.request.body.route;
  const routers = ctx.request.body.routers;

  if (!id) {
    ctx.body = { code: 1, message: 'id缺失' };
  }

  const defaultRoute = standardRoute();

  filterRecursion(routers, id, (routeItem) => {
    Object.entries(route).forEach(([k, v]) => {
      // if (k in routeItem) {
      if (k in defaultRoute) {
        (k !== 'id') && (routeItem[k] = v);
      } else {
        const metaObj = {};
        metaObj[`_${k}`] = v;

        routeItem['meta']
          ? routeItem.meta[`_${k}`] = v
          : routeItem['meta'] = metaObj;
      }
    });
  });

  ctx.body = { code: 0, message: '成功', data: routers };
};

// 删除
module.exports.delete = async ctx => {
  const id = ctx.request.body.id;
  const _parentId = ctx.request.body.parentId;
  const list = ctx.request.body.list;

  if (!_parentId) {
    // 删除根节点
    deleteFromArray(list, item => item.id === id);
  } else {
    // 删除子节点
    filterRecursion(list, _parentId, item => {
      const { children = [] } = item;
      deleteFromArray(children, (item) => item.id === id);
    });
  }

  ctx.body = { code: 0, message: '成功', data: list };
};

// 角色授权
module.exports.auth = async = ctx => {
  const id = ctx.request.body.id;
  const roles = ctx.request.body.roles;
  const list = ctx.request.body.list;

  if (!id) {
    ctx.body = { code: 1, message: '缺失id' };
    return;
  }

  filterRecursion(list, id, routeItem => {
    routeItem['meta']
      ? routeItem.meta['auth'] = roles
      : routeItem['meta'] = { auth: roles };
  });

  ctx.body = { code: 0, message: '成功', data: list };
};

// 用户类型授权
module.exports.authUserType = async = ctx => {
  const id = ctx.request.body.id;
  const roles = ctx.request.body.roles;
  const list = ctx.request.body.list;

  if (!id) {
    ctx.body = { code: 1, message: '缺失id' };
    return;
  }

  filterRecursion(list, id, routeItem => {
    routeItem['meta']
      ? routeItem.meta['_userType'] = roles
      : routeItem['meta'] = { _userType: roles };
  });

  ctx.body = { code: 0, message: '成功', data: list };
};

// from路由授权
module.exports.authFromRoutes = async ctx => {
  const id = ctx.request.body.id;
  const froms = ctx.request.body.froms;
  const list = ctx.request.body.list;

  if (!id) {
    ctx.body = { code: 1, message: '缺失id' };
    return;
  }

  filterRecursion(list, id, routeItem => {
    routeItem['meta']
      ? routeItem.meta['_froms'] = froms
      : routeItem['meta'] = { _froms: froms };
  });

  ctx.body = { code: 0, message: '成功', data: list };
};

module.exports.saveRoutestoCache = async ctx => {
  // get routers
  const routers = ctx.request.body.list;

  // write files
  try {
    // 写出路径
    const targetPath = path.join(__dirname, './');

    // 写
    await writeFile(targetPath + '/test.txt', routers);

    ctx.body = { code: 0, message: '成功', data: 1 };
  } catch (e) {
    console.log(e);
    ctx.body = { code: 1, message: '失败', data: 2 };
  }



  // ctx.body = { code: 1, message: '成功' };
};

// 保存
module.exports.save = async ctx => {
  const fullPath = ctx.request.body.path;
  const routers = ctx.request.body.list;

  // root文件夹
  const rootPath = getRootPath(fullPath);

  // 实例、实例配置文件路径
  const { routesPath } = getPath(rootPath);

  // write files
  try {
    const content = `export default ${JSON.stringify(routers)}`;

    // 写
    await writeFile(routesPath, content);

    ctx.body = { code: 0, message: '成功', data: {} };
  } catch (e) {
    console.log(e);
    ctx.body = { code: 1, message: '失败', data: 2 };
  }
};

// 验证路由名唯一性
module.exports.validateUniqueness = async ctx => {
  // 路由列表
  const routers = ctx.request.body.list;
  // 路由名
  const routeName = ctx.request.body.name;

  if (!routeName) {
    ctx.body = { code: 1, message: '成功', data: true };
    return;
  }

  let unique = true;

  filterRecursionByName(routers, routeName, () => unique = false);

  ctx.body = { code: 1, message: '成功', data: unique };
};

// 获取路由名数组
module.exports.getRouteNames = async ctx => {
  // 路由列表
  const list = ctx.request.body.list;

  if (!list || list.length === 0) {
    ctx.body = { code: 0, message: '成功', data: [] };
    return;
  }

  let routes = [];

  copy(list, (item) => {
    item['name'] && routes.push({
      value: item.name,
      label: item.name
    });
  });

  ctx.body = { code: 0, message: '成功', data: routes };
};

// 格式化codeMirror代码为对象
module.exports.formatCodetoObj = async ctx => {
  const content = ctx.request.body.content;

  // 缓存文件路径
  const cahcePath = path.join(__dirname, '../_cache/_code.js');


  // 模板路径
  const templatePath = path.join(__dirname, `../template/${codeTemplatePath}`);

  try {
    // 物理文件是否存在
    const isExists = fs.existsSync(cahcePath);

    // 写缓存文件文件
    if (!isExists) {
      await writeFile(cahcePath, '');
    }

    // 模板数据
    const templateData = { code: `module.exports = ${content}` };

    // 生成缓存数据
    compile(templateData, cahcePath, templatePath);

    // 读缓存
    const cahceData = require(cahcePath);

    // 清空缓存
    compile({ code: '' }, cahcePath, templatePath);

    ctx.body = { code: 0, message: '成功', data: cahceData };
  } catch (e) {
    console.log(e);
    ctx.body = { code: 1, message: '失败', data: null };
  }

  // // 写入缓存区
  // await writeFile(cahcePath, data);




  // compile(templateData, cahcePath, templatePath);



};