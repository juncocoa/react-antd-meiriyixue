import { notification, Modal } from 'antd';
import * as axios from 'axios';
import { errorInfo, showNotification } from './errorAction';

// 账户登录
export function login(obj, paramData) {
  axios.post(GLOBAL.baseURL.IP1 + '/api/sso/login', paramData)
  .then(function (response) {
      if(response.data.code == 200){
        //效验登录权限
        var userInfo = {
          userId: response.data.data.userId,
          tel: paramData.loginId,
          token: response.data.data.token
        }
        sessionStorage.setItem("loginData", JSON.stringify(userInfo));
        obj.props.history.push("/home/dailyStudy");
      }else {
        showNotification("error", "对不起，网络链接错误。", "4px solid rgb(240, 70, 52)");
      }
  }).catch(function(err){
    if(err.response.status == 401){
      obj.setState({loading: false, statusAccount: 'error'});
    }else {
      errorInfo(err, obj);
    }
  })
}
//登出系统(OK)
export function logout(obj) {
  axios.post(GLOBAL.baseURL.IP1 + '/api/sso/logout')
  .then(function (response) {
      if(response.data.code == 200){
        sessionStorage.removeItem("loginData");
        obj.props.history.push("/login");
      }else {
        showNotification("error", "对不起，网络链接错误。", "4px solid rgb(240, 70, 52)");
      }
  }).catch(function(err){
      errorInfo(err, obj);
  })
}
