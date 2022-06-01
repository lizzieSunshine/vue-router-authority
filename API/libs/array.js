/**
 * 删除数组指定项
 * @param {Array} list 原始列表
 * @param {Function} condition 条件函数
 * @param {boolean} once 是否只删除第一条数据
 */
module.exports.deleteFromArray = (list, condition, once = true) => {
  // 只执行一次
  const deleteOnce = () => {
    for (let i = 0; i < list.length; i++) {
      if (condition(list[i])) {
        list.splice(i, 1);
        break;
      }
    }
  };

  if (once) {
    deleteOnce();
  } else {
    // todo
  }
};