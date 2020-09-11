import { notification, Modal } from 'antd';
import * as axios from 'axios';
import { errorInfo, showNotification } from './errorAction';

//创建/修改每日一学
export function apiDaily(obj, paramData) {
  paramData.content = paramData.content.replaceAll("'", "\"");
  axios.post(GLOBAL.baseURL.IP3 + '/api/daily', paramData)
  .then(function (response) {
      if(response.data.code == 200){
        if(response.data.msg == "OK"){
          obj.state.imgTextEditor.$txt.html('<p>请输入内容...</p>');
          obj.setState({
            knowledges: [], suggestion: [],
            content: '<p>请输入内容...</p>',
            audioURL: '', videoURL: '', imageUrl: '',
            selectSuggestionItem: [],
            selectKnowledgeItem: {type: 'add'},
            showUpdateImage: false, showUpdateAuido: false, showUpdateVideo: false
          })
          Modal.success({
            title: '提示',
            content: "数据保存成功。",
            onOk: ()=>{
              obj.props.form.resetFields();
              obj.props.history.push("/home/dailyStudy");
            }
          })
        }else {
          Modal.warning({
            title: '提示',
            content: response.data.msg,
          })
        }
      }

  }).catch(function(err){
      errorInfo(err, obj);
  })
}
//每日一学 启用/停用(OK)
export function dailyStatus(obj, paramData) {
  axios.post(GLOBAL.baseURL.IP3 + '/api/daily/status?did=' + paramData.did + '&status=' + paramData.status)
  .then(function (response) {
      if(response.data.code == 200){
        if(response.data.msg != "OK"){
          Modal.warning({
            title: '提示',
            content: response.data.msg,
          })
        }else {
          var strInfo = "启用";
          if(paramData.status == 0){
            strInfo = "停用";
          }else if(paramData.status == 1){
            strInfo = "启用";
          }
          Modal.success({
            title: '提示',
            content: "状态已经：" + strInfo,
            onOk: ()=>{
              obj.refreshData();
            }
          });
        }
      }
  }).catch(function(err){
    Modal.error({
      title: '提示',
      content: ''
    });
  })
}
//每日一学，查询列表(OK)
export function getList(obj) {
  obj.setState({tableLoading: true});
  axios.get(GLOBAL.baseURL.IP3 + '/api/daily',{params: {status: -1, page:1, size: 10000}})
  .then(function (response) {
      if(response.data.code == 200){
        const pagination = { ...obj.state.pagination };
        pagination.total = response.data.data.count;
        // pagination.pageSize = 10;

        obj.setState({tableLoading: false, data: response.data.data.data, pagination: pagination});
      }else {
        obj.setState({tableLoading: false});
      }
  }).catch(function(err){
      obj.setState({tableLoading: false});
      errorInfo(err, obj);
  })
}
//相关推荐，查询列表(OK)
export function getListByKeyword(obj, paramData) {
  obj.setState({tableLoading: true});
  axios.get(GLOBAL.baseURL.IP3 + '/api/daily',{ params: paramData })
  .then(function (response) {
      if(response.data.code == 200){
        debugger;
        const pagination = { ...obj.state.pagination };
        pagination.total = response.data.data.count;
        pagination.current = obj.state.searchObject.page;
        // pagination.pageSize = 5;

        obj.setState({tableLoading: false, data: response.data.data.data, pagination: pagination});
      }else {
        obj.setState({tableLoading: false});
      }
  }).catch(function(err){
      obj.setState({tableLoading: false});
      errorInfo(err, obj);
  })
}
