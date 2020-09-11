import React from 'react';
import {withRouter} from "react-router-dom";
import { Link } from 'react-router-dom';
// 引入Antd的导航组件
import { Menu, Icon, Layout, Breadcrumb, Badge, Dropdown, Switch } from 'antd';
const SubMenu = Menu.SubMenu;
const { Header, Footer, Sider } = Layout;
import * as actions from './../../actions/loginAction';

// 配置导航
class Home extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName: '每日一学',
            imgHeader: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
            collapsed: false,
            mode: 'inline',
            iconType: "menu-fold",
        };
    }
    componentDidMount(){
      if(sessionStorage.getItem("loginData") == null){
        this.props.history.push("/login");
      }else {
        var loginData = JSON.parse(sessionStorage.getItem("loginData")); var strName = "";
        if(loginData.name == undefined || loginData.name == ""){
          strName = loginData.tel;
        }else {
          strName = loginData.name;
        }
        this.setState({
            userName: strName,
        });
        window.onresize = () => {
            $("#divLeftMenu").css("height", (document.body.clientHeight-64)+"px");
            $("#divLeftMenu").mCustomScrollbar({theme:"minimal"});
            $(".right-box").css("height", (document.body.clientHeight-64) + "px")
        }
        window.onresize();
      }
    }
    onCollapse(collapsed){
      if(this.state.collapsed == false){
        this.setState({collapsed: true, mode: "vertical", iconType: "menu-unfold"});
      }else{
        this.setState({collapsed: false, mode: "inline", iconType: "menu-fold"});
      }
    }
    logout(){
      actions.logout(this);
    }
    bindResize(){
        window.onresize();
    }
    render() {
        const menu = (
          <Menu style={{width: '160px'}}>
            <Menu.Item key="2" onClick={this.logout.bind(this)}>
              <Icon type="logout" />退出登录
            </Menu.Item>
          </Menu>
        );
        return (
            <Layout>
                <Sider id="leftMenu" theme="light"
                    collapsed={this.state.collapsed} width="256">
                    <div className="antd-pro-menu-logo" id="logo">
                        <img src="/src/styles/images/login1.png" alt="logo" />
                        <h1>每日一学后台</h1>
                    </div>
                    <div id="divLeftMenu">
                      <Menu theme="light" mode={this.state.mode} style={{marginBottom: '30px'}}>
                        <Menu.Item>
                          <Link to="/home/dailyStudy"><Icon type="ant-design" /><span className="nav-text">每日一学</span></Link>
                        </Menu.Item>
                      </Menu>
                    </div>
                </Sider>

                <section id="rightWrap" style={{marginLeft: (this.state.mode != "vertical")?"257px":"80px"}}>
                    <header className="ant-layout-header">
                      <div className="antd-pro-components-global-header-index-header">
                        <span className="antd-pro-components-global-header-index-trigger" onClick={this.onCollapse.bind(this)}><Icon type={this.state.iconType} /></span>
                        <div className="antd-pro-components-global-header-index-right">
                          <Dropdown overlay={menu}>
                            <span className="antd-pro-components-global-header-index-action" style={{minWidth: '115px', textAlign: 'center'}}>
                                <img src={this.state.imgHeader} className="imgTopHeader"/>{this.state.userName}
                            </span>
                          </Dropdown>
                        </div>
                      </div>
                    </header>
                    <div className="right-box">
                        { this.props.children }
                        <Footer className="antd-pro-components-global-footer-index-globalFooter">
                          <div className="antd-pro-components-global-footer-index-copyright">
                            Copyright <Icon type="copyright" /> 2019 好呗呗科技有限公司
                          </div>
                        </Footer>
                    </div>
                </section>
            </Layout>
        )
    }
}
export default withRouter(Home);
