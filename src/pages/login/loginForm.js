import React from 'react';
import {withRouter} from "react-router-dom";
import { browserHistory, Link } from 'react-router';
import { Icon, Checkbox, Spin, Alert } from 'antd';
import Login from 'ant-design-pro/lib/Login';
const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;
import 'antd/dist/antd.js';
import 'ant-design-pro/dist/ant-design-pro.css';
import '../../styles/scss/login.scss';
import * as actions from './../../actions/loginAction';

class loginForm extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        loading: false,
        type: 'account',
        statusAccount: '',
        statusMobile: ''
      }
  }
  onLogin (err, values) {
    this.loginForm.props.form.validateFields(["mobile", "password"], (err, values) => {
      if(!err){
          this.setState({ statusAccount: '', statusMobile: '', loading: true });
          actions.login(this, {
            "type": "USERPASSWD", // 固定值
            "loginId": values.mobile, // 登录账号
            "passwd": values.password, // 密码明文
            "platform": "PC" // 登录平台，可选值如下
          });
      }
    });
  }
  renderMessage (content) {
    return (<Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />)
  }
  render() {
    return (
      <div className="antd-pro-layouts-user-layout-container">
        <div className="antd-pro-layouts-user-layout-content">
            <div className="antd-pro-layouts-user-layout-top">
              <div className="antd-pro-layouts-user-layout-header">
                  <img src="/src/styles/images/login.png" className="antd-pro-layouts-user-layout-logo"/>
                  <span className="antd-pro-layouts-user-layout-title">每日一学后台</span>
              </div>
            </div>
            <div className="antd-pro-pages-user-login-main">
              <div className="antd-pro-components-login-index-login">
                <Spin spinning={this.state.loading} tip="登入中...">
                    <Login
                      onSubmit={this.onLogin.bind(this)}
                      wrappedComponentRef={(form) => this.loginForm = form}>
                      {this.state.statusAccount === 'error' && this.renderMessage("账户 或 密码错误。")}
                      <Mobile
                      name="mobile"
                      placeholder="手机号"
                      maxLength={11}
                      rules={[
                        {
                          required: true,
                          message: "请输入手机号！",
                        },
                        {
                          pattern: /^1\d{10}$/,
                          message: "手机号格式错误！",
                        }
                      ]}/>

                      <Password
                      name="password"
                      placeholder="密码"
                      rules={[
                        {
                          required: true,
                          message: "密码不能为空。",
                        }, {
                          pattern: /^\w{6,16}$/,
                          message: "格式不正确（6-16 数字、字母 或 下划线）"
                        }
                      ]}
                      onPressEnter={e => {
                        e.preventDefault();
                        this.loginForm.props.form.validateFields(this.onLogin.bind(this));
                      }}/>
                      <Submit>登录</Submit>
                    </Login>
                </Spin>
              </div>
            </div>
        </div>
        <footer className="antd-pro-components-global-footer-index-globalFooter">
          <div className="antd-pro-components-global-footer-index-copyright">Copyright <Icon type="copyright"/> 2019 好呗呗网络科技有限公司</div>
        </footer>
      </div>
    );
  }
}
export default withRouter(loginForm);
