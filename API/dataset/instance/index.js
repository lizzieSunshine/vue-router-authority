const mode = require('./mode');
const base = require('./base');
const failuresRepeat = require('./failuresRepeat');
const scroll = require('./scroll');
const formatComponent = require('./formatComponent');
const beforeEach = require('./beforeEach');

// 获取router实例默认配置
module.exports = () => {
  return [
    { key: 'mode', ...mode },
    { key: 'base', ...base },
    { key: 'failuresRepeat', ...failuresRepeat },
    { key: 'scroll', ...scroll },
    { key: 'formatComponent', ...formatComponent },
    { key: 'beforeEach', ...beforeEach },
  ];
};
