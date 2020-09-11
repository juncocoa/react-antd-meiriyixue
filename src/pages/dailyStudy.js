import React from 'react';
import { Table, Input, Form, Button, Tag, Radio, Divider, InputNumber, Modal } from 'antd';
import * as actions from '../actions/dailyStudyAction';

export default class dailyStudy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {pageSize: 10, showSizeChanger: true, showQuickJumper: true},
      tableLoading: false,
      size: 'small',
      data: []
    };
  }
  componentWillMount() {
    this.refreshData();
  }
  refreshData(){
    actions.getList(this);
  }
  addDailyStudy(){
    this.props.history.push("/home/addDailyStudy");
  }
  setTableSize(e){
    this.setState({size: e.target.value});
  }
  setTableSizeUI(){
    return(
    <div>
      <label>设置表格大小：</label>
      <Radio.Group onChange={this.setTableSize.bind(this)} value={this.state.size} style={{ marginBottom: 8 }}>
        <Radio.Button value="default">正常</Radio.Button>
        <Radio.Button value="small">缩小</Radio.Button>
      </Radio.Group>
    </div>);
  }
  setStatusInfo(item, status){
    var strInfo; var that = this;
    if(item.status == 0){
      strInfo = <span>你确定要 启用 吗？</span>;
    }else if(item.status == 1){
      strInfo = <span>你确定要 禁用 吗？</span>;
    }
    Modal.confirm({
      title: '提示',
      content: strInfo,
      onOk() {
        var paramData = {
          did: item.id,
          status: status
        }
        actions.dailyStatus(that, paramData);
      }
    });
  }
  gotoEdit(item){
    sessionStorage.setItem("tempData", JSON.stringify(item));
    this.props.history.push("/home/addDailyStudy");
  }
  tablePagination(pagination, filters, sorter){
    // debugger;
  }
  render() {
    const columns = [{
      title: '标题',
      dataIndex: 'title',
      key: 'title'
    }, {
      title: '类型',
      dataIndex: 'cat',
      key: 'cat',
      render: (val, data) => {
        var tagEl;
        if(val == "图文"){
          tagEl = <Tag color="blue">{val}</Tag>;
        }else if(val == "图片"){
          tagEl = <Tag color="#2db7f5">{val}</Tag>;
        }else if(val == "音频"){
          tagEl = <Tag color="#87d068">{val}</Tag>;
        }else if(val == "视频"){
          tagEl = <Tag color="purple">{val}</Tag>;
        }
        return tagEl;
      }
    }, {
      title: '作者',
      dataIndex: 'author',
      key: 'author'
    }, {
      title: '启用状态',
      dataIndex: 'status',
      key: 'status',
      render: (rowIndex, data) => {
        var tagEl;
        if(data.status == 1){
          tagEl = <Tag color="#2db7f5">启用</Tag>;
        }else if(data.status == 0){
          tagEl = <Tag color="red">未启用</Tag>;
        }
        return tagEl;
      }
    }, {
      title: '发布日期',
      dataIndex: 'pubdate',
      key: 'pubdate'
    }, {
      title: '操作',
      key: "options",
      render: (rowIndex, data) => {
        var statusEl;
        if(data.status == 1){
          statusEl = <a href="javascript: void(0)" style={{cursor: 'pointer'}} onClick={this.setStatusInfo.bind(this, data, 0)}>禁 用</a>
        }else if(data.status == 0){
          statusEl = <a href="javascript: void(0)" style={{cursor: 'pointer'}} onClick={this.setStatusInfo.bind(this, data, 1)}>启 用</a>
        }
        return (<span>
          {statusEl}
          <Divider type="vertical" />
          <a href="javascript: void(0)" style={{cursor: 'pointer'}} onClick={this.gotoEdit.bind(this, data)}>编 辑</a>
        </span>)
      }
    }];
    return (
      <div>
        <Table rowKey="id" className="tableClass" size={this.state.size} columns={columns} dataSource={this.state.data}
          pagination={this.state.pagination} bordered loading={this.state.tableLoading}
          footer={this.setTableSizeUI.bind(this)} onChange={this.tablePagination.bind(this)}
          title={()=><div style={{textAlign: 'right'}}><Button type="primary" icon="form" onClick={this.addDailyStudy.bind(this, true, "add")}>添加每日一学</Button></div>}
        />
      </div>);
  }
}
