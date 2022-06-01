const fs = require("fs");
const handlebars = require('handlebars');

// router.base系统参数处理
const instanceFormatBase = (baseVal) => {
  return baseVal.indexOf('process.env') === 0
	? baseVal
	: new handlebars.SafeString(`'${baseVal}'`);
};

// 注册Helper
handlebars.registerHelper({
  instanceFormatBase
});

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