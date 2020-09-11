import * as axios from 'axios';
window.GLOBAL = {};
//服务器请求地址
GLOBAL.baseURL = {
  IP1: 'https://castest.hbbclub.com', //登录接口
  IP2: 'http://screentest.hbbclub.com', //彭博文件校验(阿里云)
  IP3: 'http://39.108.94.46:4081' //业务逻辑用(每一月学)
}
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=utf-8';
//日期格式化
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1, //月份
        "d+": this.getDate(), //日
        "h+": this.getHours(), //小时
        "m+": this.getMinutes(), //分
        "s+": this.getSeconds(), //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
    if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//数组是否包含 val 值
Array.prototype.contains = function ( val ) {
  for (var i = 0; i < this.length; i++) {
      if(this[i] == val){
          return false;
          break;
      }
  }
  return true;
}
//对象深拷贝
Object.deepClone = function( obj ){
  var result = Array.isArray(obj) ? [] : {};
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object') {
        result[key] = Object.deepClone(obj[key]);   //递归复制
      } else {
        result[key] = obj[key];
      }
    }
  }
  return result;
}
//每个接口授权认证
GLOBAL.Authenticate = () => {
  if(sessionStorage.getItem("loginData") != null){
    var loginData = JSON.parse(sessionStorage.getItem("loginData"));
    if(loginData.token != undefined){
      axios.defaults.headers.common['token'] = loginData.token;
      return true;
    }else {
      location.href = "/login";
      return false;
    }
  }else {
    location.href = "/login";
    return false;
  }
}
Array.prototype.unique = function(){
     let result = {};
     let finalResult = [];
     for(let i = 0; i < this.length; i++){
         result[this[i].date] = this[i];
     }
     for(item in result){
         finalResult.push(result[item]);
     }
     return finalResult;
}
String.prototype.bool = function() {
    return (/^true$/i).test(this);
};
String.prototype.replaceAll = function(s1,s2){
  return this.replace(new RegExp(s1,"gm"),s2);
}
//富文本配置信息
GLOBAL.menus = [
    'source',
    '|',
    'bold',
    'underline',
    'italic',
    'strikethrough',
    'eraser',
    'forecolor',
    'bgcolor',
    '|',
    'link',
    'unlink',
    '|',
    'img',
    'table',
    'emotion',
    '|',
    'quote',
    'fontfamily',
    'fontsize',
    'unorderlist',
    'alignleft',
    'aligncenter',
    'alignright',
    '|',
    'lineheight',
    'indent',
    '|',
    'undo',
    'redo',
    'fullscreen'
];
GLOBAL.globalStyle = `<style>
@font-face {
  font-family: NotoSans CJK;
  src: url(http://meiriyixuehoutai.hbbclub.com/fonts/SourceHanSansCN-Regular.otf?v=4.3.0) format(opentype);
  font-weight: normal; font-style: normal;
}
@font-face {
  font-family: PingFangSC-Regular;
  src: url(http://meiriyixuehoutai.hbbclub.com/fonts/PingFangSC-Regular.ttf?v=4.3.0) format(truetype);
  font-weight: normal; font-style: normal;
}
blockquote {display: block;padding: 5px 10px;
margin: 10px 0;line-height: 1.4;
font-size: 100%;background-color: #f5f5f5;
border-radius: 5px;}
table {border: none;border-collapse: collapse;}
table td,
table th {
border: 1px solid #999;padding: 3px 5px;
min-width: 50px;height: 20px;}
</style>`
