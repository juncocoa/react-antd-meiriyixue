/**
 *
 * @authors 范可
 * @date    2019-05-06 16:42:35
 */

'use strict';
//引入样式文件(主)
import "antd/dist/antd.min.css";
import './styles/scss/app.scss';
import './store/types';
import '@babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
// 国际化配置
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';

import {createStore, applyMiddleware} from 'redux';
//路由器
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
//reducers 规则
import reducers from './reducers/reducers';
//路由列表 声明
import routes from './routes';
//thunk 中间件
import reduxThunk from 'redux-thunk';

const createStoreWithMiddleware = applyMiddleware(reduxThunk)(createStore);
const store = createStoreWithMiddleware(reducers);
// 引入单个页面（非嵌套页面）
import AsyncComponent from './pages/components/asyncComponent';
const loginForm = AsyncComponent(() => import("./pages/login/loginForm"));
const articlePreview = AsyncComponent(() => import("./pages/articlePreview"));
const multipleFileUpload = AsyncComponent(() => import("./pages/test/multipleFileUpload"));

ReactDOM.render(
    <Provider store={store}>
      <LocaleProvider locale={zh_CN}>
        <Router>
          <Switch>
            <Route path="/login" component={loginForm} breadcrumbName="登录"/>
            <Route path="/articlePreview" component={articlePreview} breadcrumbName="文章预览"/>
            <Route path="/5C9A94FF4C8D08C0DFE7FF5FB7FFA1BC" component={multipleFileUpload} breadcrumbName="多文件上传"/>
            {routes}
          </Switch>
        </Router>
      </LocaleProvider>
    </Provider>
, document.getElementById('app'));
