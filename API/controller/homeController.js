/**
 * 首页控制器
 */

const fs = require("fs");
const path = require("path");
// 自定义数据查询模块
// const db = require('../modules/database');

// 组装router.js
const uploadFile = (routers) => {
  let content = routers.map(item => JSON.stringify(item)).join(",");
  return `[${content}]`;
};


// 商品分类信息
module.exports.productClassify = async ctx => {

  // // 返回的数据
  // let response = [];

  // // 连接数据库查询
  // let db = require('../modules/database');
  // // 查询分类表
  // let classify = await db.query('SELECT * FROM PRO_CLASSIFY WHERE ifShow = ?', [1]);
  // console.log(classify);
  // // 查询商品表
  // let length = classify.length >= 5 ? 5 : classify.length;
  // for (let i = 0; i < length; i++) {
  //     console.log(classify[i].ID)
  //     let product = await db.query('SELECT * FROM product WHERE classifyID = ?', [classify[i].ID]);
  //     response.push({
  //         cid: classify[i].ID, // 类别id
  //         classifyName: classify[i].classifyName, // 类名
  //         classifyImg: classify[i].imgSrc,
  //         productList: product
  //     })
  // }


  // if (classify.length === 0) {
  //     ctx.body = {code: 0, message: '暂无数据', response};
  //     return;
  // }

  // console.log(response)
  let response = { msg: 'test' }
  ctx.body = { code: 1, message: '成功', response };
};

// 测试接口
module.exports.test = async ctx => {
  ctx.body = { code: 1, message: '测试连接：成功' };
}

module.exports.indexView = async (ctx, next) => {
  await ctx.render('index', {
    username: 'Lizzie',
    routers: [
      {
        name: 'index',
        path: '/index',
        component: `() => import()`
      }
    ],
    friends: {
      number: 2
    },
    link: '<a href="javascript:;">这是一个超链接</a>'
  });
};

module.exports.format = async ctx => {
  console.log(ctx.request.body);
  console.log(uploadFile(ctx.request.body));
  // console.log(typeof ctx.request.body);
  // console.log(ctx.request.body.length);
  

  // 创建文件夹
  function asyncMkdir(path) {
    return new Promise(resolve => {
      fs.mkdir(path, err => {
        if (err) {
          console.log(err);
          throw new Error("上传文件错误：创建资源文件夹失败");
        }
        console.log('suc');
        resolve();
      });
    })
  };

  const dirName = "test";

  const targetDir = path.join(__dirname);

  // await asyncMkdir(targetDir);

  fs.writeFile(targetDir + '/router.json', uploadFile(ctx.request.body), (err) => {
    if (err) {
      throw new Error("上传文件失败" + filename);
    }
  });

  ctx.body = { code: 1, message: '成功' };
};