import React from 'react'
import { Button } from 'antd';
import Exception from 'ant-design-pro/lib/Exception';
import 'ant-design-pro/dist/ant-design-pro.css';
// 仪表盘
export default class Error404 extends React.Component {
    constructor(props) {
        super(props);
    }
    componentWillMount(){
      if(sessionStorage.getItem("loginData") == null){
        this.props.history.push("/login");
      }
    }
    backHome(){
      history.back();
    }
    render() {
        return (
          <Exception
            type="404"
            actions={<Button type="primary" onClick={this.backHome.bind(this)}>返回首页</Button>}
          />
        )
    }
}
