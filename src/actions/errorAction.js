import { notification, Modal } from 'antd';
//统一错误信息
export function errorInfo(err, obj){
  if(err.response == undefined){
    showNotification("error", "对不起，网络链接错误。", "4px solid rgb(240, 70, 52)");
  }else {
    if(err.response.status == 400){
      Modal.warning({
        title: '提示：',
        content: err.response.data.msg,
        onOk: ()=>{
          if(err.response.data.msg == "登录已过期" || err.response.data.msg == "您的权限发生改变，请重新登录"){
            location.href = "/login";
          }
        }
      })
    }else {
      showNotification("error", "对不起，网络链接错误。", "4px solid rgb(240, 70, 52)");
    }
  }
}
//1：success，2：info，3：warning，4：error
export function showNotification(type, content, borderLeft){
  notification[type]({
      placement: 'bottomRight',
      message: '提示：',
      description: content,
      style: {
        borderLeft: borderLeft
      }
  });
}
