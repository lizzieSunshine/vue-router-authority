const fs = require("fs");
const handlebars = require('handlebars');

/**
 * 编译模板文件
 * @parm {object} meta 数据定义
 * @parm {string} filePath 目标文件路径
 * @parm {string} templatePath 模板文件路径
 */
module.exports = (meta, filePath, templatePath) => {
  if (fs.existsSync(templatePath)) {
    const content = fs.readFileSync(templatePath).toString();
    const result = handlebars.compile(content)(meta);
    fs.writeFileSync(filePath, result);
  }
};