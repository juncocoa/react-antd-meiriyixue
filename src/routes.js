import React from 'react';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import { Redirect} from 'react-router';
// 按需加载框架
import AsyncComponent from './pages/components/asyncComponent';
// 框架总页面
const Home = AsyncComponent(() => import("./pages/home/index"));
// 页面未找到
const error404 = AsyncComponent(() => import("./pages/Error404"));

//每日一学模块
const dailyStudy = AsyncComponent(() => import("./pages/dailyStudy"));
const addDailyStudy = AsyncComponent(() => import("./pages/addDailyStudy"));

// 配置路由
export default (
  <Home>
    <Switch>
        <Route path="/home/dailyStudy" component={dailyStudy} breadcrumbName="每日一学列表"/>
        <Route path="/home/addDailyStudy" component={addDailyStudy} breadcrumbName="每日一学添加"/>
        <Route path="/home/404" component={error404} breadcrumbName="404 页面"/>

        <Redirect from="/home/*" to="/home/404"/>
    </Switch>
  </Home>
);

// 添加可选参数
// <Route path="/Search/:category/:keyword?" component={User}/>
// 路由 向 子路由传参
// const User = ({ match }) => {
//   return <Test router={match}/>
// }
