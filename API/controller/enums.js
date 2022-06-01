/**
 * enums控制器
 */

const fs = require("fs");
const path = require("path");
const { readFile, writeFile, mkDirandFile, exsitAndMK } = require('../libs/file');
const compile = require('../libs/compile');
const { getRootPath } = require('../libs/utils');

// path
const config = require('../config/');
const { store, enumsConfig, enumsTemplatePath, cache, enumsDir, enums } = config;

const defaultCode = `{
  roles: []
}`;

// 获取路径
const getPath = (rootPath) => {
  // 枚举文件夹
  const dir = path.join(rootPath, enumsDir);
  // 枚举文件
  const enumsPath = path.join(dir, enums);
  // 模板
  const templatePath = path.join(__dirname, `../template/${enumsTemplatePath}`);

  return { dir, enumsPath, templatePath };
}

// 获取
module.exports.get = async ctx => {
  const fullPath = ctx.request.query.path;

  // path
  const rootPath = getRootPath(fullPath);
  exsitAndMK(rootPath);
  
  // 枚举文件夹
  const enumsDirPath = path.join(rootPath, enumsDir);
  exsitAndMK(enumsDirPath);

  // 枚举文件
  const enumsPath = path.join(enumsDirPath, enums);
  exsitAndMK(enumsPath, true, '');

  try {
    let data = await readFile(enumsPath, "utf-8");
    data = data.replace('export default ', '');

    // 读
    data = data.replace('export default ', '');
    data = data.replace(';', '');

    ctx.body = {
      code: 0, message: '成功', data: {
        path: enumsPath,
        data: data
      }
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

// 根据名称获取指定枚举
module.exports.getByName = async ctx => {
  const fullPath = ctx.request.query.path;
  const name = ctx.request.query.name;

  try {
    // path
    const rootPath = getRootPath(fullPath);
    exsitAndMK(rootPath);

    // 枚举文件夹
    const enumsDirPath = path.join(rootPath, enumsDir);
    exsitAndMK(enumsDirPath);

    // 枚举文件
    const enumsPath = path.join(enumsDirPath, enums);
    exsitAndMK(enumsPath, true, '');

    // 读数据
    let data = await readFile(enumsPath, "utf-8");
    data = data.replace('export default ', '');
    data = `module.exports = ${data}`;

    // 缓存文件路径
    const cahcePath = path.join(__dirname, '../_cache/_enums.js');

    // 写入缓存区
    await writeFile(cahcePath, data);

    // 读缓存文件
    const cacheData = require(cahcePath);

    // 删除缓存
    fs.unlink(cahcePath, err => {
      console.log(err);
    });

    ctx.body = {
      code: 0, message: '成功', data: cacheData[name] || []
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

// 保存
module.exports.save = async ctx => {
  const fullPath = ctx.request.body.path;
  const data = ctx.request.body.data;

  const rootPath = getRootPath(fullPath);
  const { enumsPath, templatePath } = getPath(rootPath);

  // write files
  try {
    // 模板数据
    const templateData = { data: data || defaultCode };

    // 生成模板
    compile(templateData, enumsPath, templatePath);

    ctx.body = { code: 0, message: '成功', data: {} };
  } catch (e) {
    ctx.body = { code: 1, message: '失败', data: 2 };
  };
};