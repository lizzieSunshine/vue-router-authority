const fs = require("fs");
const path = require("path");
const {
  promisify
} = require('util');
const writeFile = promisify(fs.writeFile);

// module.exports.readFile = () => promisify(fs.readFile);
// module.exports.writeFile = () => promisify(fs.writeFile);
// const readFile = 
// const writeFile = promisify(fs.writeFile);

/**
 * 创建文件夹及文件
 * @param {string} sourcePath 参考文件路径
 * @param {string} targetDir 目标文件夹
 * @param {string} targetFileName 目标文件名（及后缀）
 * @returns 目标文件路径
 */
const mkDirandFile = (sourcePath, targetDir, targetFileName) => {
  if (!sourcePath) return "";
  if (!targetDir) return "";

  // 文件状态
  var stat = fs.statSync(sourcePath);

  // 文件夹路径
  const dirPath = path.join(sourcePath, `${stat.isFile() ? '..' : '.'}/${targetDir}`);
  // const dirPath = path.join(sourcePath, `./${targetDir}`);
  console.log('=============');
  console.log(dirPath);
  
  // 物理文件夹是否存在
  const isExistsDir = fs.existsSync(dirPath);
  !isExistsDir && fs.mkdirSync(dirPath);

  // 文件路径
  const filePath = path.join(dirPath, `/${targetFileName}`);

  return filePath;
};

/**
 * 判断文件（夹）是否存在，不存在则创建
 * @param {string} path 路径
 * @param {boolean} isFile 是否是文件
 * @param {string} content 文件内容
 * @returns 
 */
const exsitAndMK = async (path, isFile = false, content = "") => {
  if (!path) return "";

  const isExists = fs.existsSync(path);

  if (isExists) return true;

  // 创建
  try {
    !isFile ? fs.mkdirSync(path) : await writeFile(path, content);
  } catch (e) {
    console.log("exsitAndMK抛出异常：");
    console.log(e);
  }
}

module.exports = {
  readFile: promisify(fs.readFile),
  writeFile: promisify(fs.writeFile),
  mkDirandFile,
  exsitAndMK
}