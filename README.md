## 基于React+Webpack+ES6+antd pro的独立项目，设计模式Redux，不熟悉查询一下百度，了解一下

```js
React v16+ + Webpack v4+ + ES6 + antd pro + Redux + wangEditor（富文本）
Webpack4 迁移成功，主框架缩小 5.7 倍，所有页面采用，异步分包加载。
```
```js
优化 Webpack v4 配置: 分离产品 和 开发环境配置文件，打包实现一键清除，并打包。
```
## Redux 工作流

![](https://bkimg.cdn.bcebos.com/pic/6a600c338744ebf83681478cd0f9d72a6159a794?x-bce-process=image/watermark,image_d2F0ZXIvYmFpa2U5Mg==,g_7,xp_5,yp_5)

## 项目展示图
[项目展示图（点击查看）](https://hbb-ads.oss-cn-beijing.aliyuncs.com/file618481400839.gif){:target="_blank"}

## 使用方法

开发模式，启动本地服务。修改文件，自动编译（`不会打包输出到build文件夹，只是保存在计算机内存`），浏览器自动刷新。
```js
npm run dev or (npm start)
```

文件打包，在build文件夹下生成`main.css`、`vendor.js`、`main.js`
```js
npm run build
```
1、注意：Git 冲突的场景
情景一：多个分支代码合并到一个分支时；
情景二：多个分支向同一个远端分支推送代码时；
## 具备功能

- 开发模式监听端口8888

- 修改保存文件的同时，浏览器实时刷新。

- css文件、三方js库文件，业务js文件分别打包。

- 引入了antd 和 antd pro 本地开发的时候按需引入。

- 登录账号 13666254921，密码：123456

## 成功样式
```js
style: {
  borderLeft: '4px solid rgb(23, 168, 84)'
}
```

## 失败样式
```js
style: {
  borderLeft: '4px solid rgb(240, 70, 52)'
}
```

## 警告样式
```js
style: {
  borderLeft: '4px solid rgb(255, 191, 0)'
}
```

## 协议类型：定义
```js
0：非标准协议
1：标准协议
```
