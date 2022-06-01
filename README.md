# vue-router-authority
vue路由授权



## 框架配置

- vue2
- koa



## 目录结构

### API 

API接口项目

```shell
├─_chache # 缓存
├─config # 输出文件配置
├─controller # 控制器
├─dataset # 默认数据集
├─libs # 公用库
├─router # 路由
├─template # hbs模板
└─app.js # 项目入口
```



### web

授权操作界面，与常规vue2项目一致



## 快速开始

1. 配置需授权的项目地址：在`web/config/index.js`中配置target地址为router的根目录，后续创建的文件就会在这个目录下

```js
window.global = {
  target: `E:/demo/demo_20220526/src/router`,
}
```



2. 配置接口地址：系统默认API端口是7777，如需改变，需在`web/config/index.js`和`API/app.js`中进行更换



3. 运行项目

```shell
# 前端项目
npm run serve

# 后端项目
node app.js
```



## 使用

1. 系统会在需要授权的项目中指定路由文件夹下创建`_larstore`的文件夹，用于存放各种文件

```shell
├─_enums # 枚举配置
├─_router # router实例
│  ├─_router.config.js # 实例配置文件
│  └─_router.js # 实例文件
└─_routes # routes路由
```



2. 在原项目中，在引入router实例的地方，将引入对象改为`_larstore/_router/_router.js`

```js
// main.js
// import router from './router';
import router from './router/_larstore/_router/_router';
```

