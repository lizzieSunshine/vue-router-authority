const path = require("path");
const { v4: uuidv4 } = require('uuid');
const config = require('../config/');

// 获取时间戳
const timeStamp = () => {
  const d = new Date();
  const month = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;

  return `${d.getFullYear()}${month}${d.getDate()}${d.getHours()}${d.getMinutes()}${d.getSeconds()}`;
};

module.exports.timeStamp = timeStamp;

// 获取uuid
module.exports.getUUID = () => {
  // uuidve
  // return uuidv4();
  return timeStamp();
}

module.exports.copyRecursion = (source, res) => {


  const map = (arr) => {
    let response = [];

    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      const { name = '', component, path, redirect, meta, children = [] } = item;

      let obj = {
        name,
        path,
        redirect,
        component,
        meta
      };

      if (children && children.length > 0) {
        obj.children = map(children);
      }

      res.push(obj);
    }

    return response;
  }

  map(source);

  // return response;
}

module.exports.copy = (source, cb) => {
  const recu = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      const { component, children } = item;
      cb && typeof cb === 'function' && cb(item);

      if (children && children.length > 0) {
        recu(children);
      }
    }
  }

  recu(source);
}

// module.exports.copyRecursion = copyRecursion;

module.exports.filterRecursion = (source, targetId, cb) => {
  let find = false;

  const recu = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (find) break;

      const item = arr[i];
      const { id = '', children = [] } = item;

      if (targetId === id) {
        cb && typeof cb === 'function' && cb(item);
        find = true;
        break;
      }

      if (children && children.length > 0) {
        recu(children);
      }
    }
  }

  recu(source);
}

// 根据name递归筛选
module.exports.filterRecursionByName = (source, targetName, cb) => {
  let find = false;

  const recu = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (find) break;

      const item = arr[i];
      const { name = '', children = [] } = item;

      if (targetName === name) {
        cb && typeof cb === 'function' && cb(item);
        find = true;
        break;
      }

      if (children && children.length > 0) {
        recu(children);
      }
    }
  }

  recu(source);
}

module.exports.getRootPath = fullpath => {
  if (!fullpath) return "";

  const { store } = config;
  return path.join(fullpath, store);
}