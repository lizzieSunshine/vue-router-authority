/**
 * instance控制器
 */

const fs = require("fs");
const path = require("path");
const config = require('../config/');
const { promisify } = require('util');
const handlebars = require('handlebars');
const writeFile = promisify(fs.writeFile);
const { getRootPath } = require('../libs/utils');
const {
  readFile,
  mkDirandFile,
  exsitAndMK
} = require('../libs/file');

// 格式化模板数据
const parseData = data => {
  const result = {};

  Object.entries(data).forEach(([k, v]) => {
    v['selected'] && (result[k] = v['value']);
  });

  return result;
};

// 获取路径
const getPath = (rootPath) => {
  const { routerDir, router, routerConfig, routerTemplatePath } = config;

  // 实例文件夹
  const dir = path.join(rootPath, routerDir);
  // 实例文件
  const instance = path.join(dir, router);
  // 实例配置
  const cfg = path.join(dir, routerConfig);
  // 模板文件
  const hbsPath = path.join(__dirname, `../template/${routerTemplatePath}`);

  return { dir, instancePath: instance, instanceCfgPath: cfg, hbsPath };
}

/**
 * 编译模板文件
 * @parm {object} meta 数据定义
 * @parm {string} filePath 目标文件路径
 * @parm {string} templatePath 模板文件路径
 */
const compile = (meta, filePath, templatePath) => {
  if (fs.existsSync(templatePath)) {
    const content = fs.readFileSync(templatePath).toString();
    const result = handlebars.compile(content)(meta);
    fs.writeFileSync(filePath, result);
  }
}

// 获取文件
module.exports.get = async ctx => {
  const fullPath = ctx.request.query.path;

  // path
  const { routerDir, router, routerConfig } = config;

  try {
    // root文件夹是否存在，不存在则创建
    const rootPath = getRootPath(fullPath);
    exsitAndMK(rootPath);

    // 实例文件夹
    const instanceDirPath = path.join(rootPath, routerDir);
    exsitAndMK(instanceDirPath);

    // 实例文件
    const instancePath = path.join(instanceDirPath, router);
    exsitAndMK(instancePath, true, "");

    // 实例配置文件
    const instanceCfgPath = path.join(instanceDirPath, routerConfig);
    exsitAndMK(instanceCfgPath, true, `export default { }`);

    // 读配置文件
    let data = await readFile(instanceCfgPath, "utf-8");
    data = data.replace('export default ', '');

    ctx.body = {
      code: 0, message: '成功', data: {
        path: instanceCfgPath,
        data: JSON.parse(data)
      }
    };
  } catch (e) {
    console.log(e);
    ctx.body = {
      code: 1,
      message: '失败',
      data: 2
    };
  }
};

// 获取默认数据
module.exports.getDefault = async ctx => {
  const getDefaultData = require('../dataset/instance/index');
  ctx.body = { code: 0, message: '成功', data: getDefaultData() };
};

// 保存
module.exports.save = async ctx => {
  const fullPath = ctx.request.body.path;
  const data = ctx.request.body.data;

  // root文件夹
  const rootPath = getRootPath(fullPath);

  // 实例、实例配置文件路径
  const { instancePath, instanceCfgPath, hbsPath } = getPath(rootPath);

  // write files
  try {
    const content = `export default ${JSON.stringify(data)}`;

    // 写配置文件
    await writeFile(instanceCfgPath, content);

    // 模板数据
    const templateData = parseData(data);

    // 生成模板
    compile(templateData, instancePath, hbsPath);

    ctx.body = {
      code: 0,
      message: '成功',
      data: {}
    };
  } catch (e) {
    console.log(e);
    ctx.body = {
      code: 1,
      message: '失败',
      data: 2
    };
  };
};

// 保存 client
// module.exports.saveClient = async ctx => {
//   const data = ctx.request.body.data;

//   // path
//   const { routerTemplatePath } = config;
//   const instancePath = path.join(__dirname, `../_cache/_instance.js`);
//   const hbsPath = path.join(__dirname, `../template/${routerTemplatePath}`);

//   try {
//     const templateData = parseData(data);

//     // 生成模板
//     compile(templateData, instancePath, hbsPath);

//     // 下载
//     // const fileName = "test123.js";
//     // ctx.attachment(fileName);
//     // await send(ctx, `public/_cache/_instance.js`);

//     // let file = await fs.readFileSync(instancePath);
//     // // const path1 = `public/_cache/_instance.js`;
//     // ctx.attachment('123.js');
//     // ctx.body = file;
//     // // await send(ctx, path1);

//     // ctx.set('Content-Type', 'text/csv; charset=utf-8')
//     // ctx.set(
//     //   'Content-Disposition',
//     //   `attachment; filename=${encodeURIComponent('123')}.js`
//     // )
//     // ctx.body = new stream.Readable(file)

//     // await send(ctx, path.join(__dirname, `../_cache/`));
//     // const Path1 = path.join(__dirname, `../_cache/`);
//     // const Name = "test123";
//     // const Size = fs.statSync(Path1).size;
//     // const createReadStream = await fs.createReadStream(path1)
//     // ctx.set('Content-disposition', 'attachment; filename=' + '123.js')
//     // ctx.set('Content-type', 'application/force-download')
//     // ctx.set('Content-Length', Size)
//     // ctx.body = await fs.createReadStream(path1);

//     ctx.body = { code: 0, message: '成功', data: instancePath };

//   } catch (e) {
//     console.log(e);
//     ctx.body = { code: 1, message: '失败', data: {} };
//   }
// };
