import React from 'react';
import PropTypes from 'prop-types';
import { Input , Button , Form, Table, Modal, message } from 'antd';
import moment from 'moment';
import * as actions from './../../actions/dailyStudyAction';

class addRelatedSuggestion extends React.Component {
  static propTypes = {
      propsThis: PropTypes.object,
      item: PropTypes.array,
      callbackRelatedSuggestion: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.state = {
      pagination: {current: 1, pageSize:5, showSizeChanger: true, showQuickJumper: true},
      tableLoading: false,
      selectedRowItem: [],
      data: [],
      searchObject: {
        keyword: '',
        page: 1,
        size: 5
      }
    };
  }
  refreshData(keyword, page, size){
    var that = this;
    this.setState({
      pagination: {
        ...this.state.pagination,
        pageSize: size
      },
      searchObject: {
        keyword: keyword,
        page: page,
        size: size
      }
    },()=>{
      actions.getListByKeyword(that, this.state.searchObject);
    })
  }
  tablePagination(pagination, filters, sorter){
    if(pagination.pageSize == this.state.searchObject.size){
      this.refreshData(this.state.searchObject.keyword, pagination.current, pagination.pageSize);
    }else {
      this.refreshData(this.state.searchObject.keyword, 1, pagination.pageSize);
    }
  }
  searchKeyword(e){
    e.preventDefault(); var that = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        if(values.keyword != ''){
          that.refreshData(values.keyword, 1, 5)
          actions.getListByKeyword(that, paramData);
        }else {
          Modal.warning({
            title: '提示',
            content: '关键字，必须填写。',
          });
        }
      }
    });
  }
  callbackSuggestion(){
    this.props.propsThis.callbackRelatedSuggestion(this.state.selectedRowItem);
  }
  onSelectChange (id, item) {
    this.setState({selectedRowItem: item});
  }
  getCheckboxProps(record){
      var isHave = false; //var isBool = false;
      for (var i = 0; i < this.state.selectedRowItem.length; i++) {
        if(this.state.selectedRowItem[i].id == record.id){
          isHave = true; break;
        }
      }
      // if(this.state.selectedRowItem.length >= 2){
        // if(isHave == true){
        //   isBool = false;
        // }else {
        //   isBool = true;
        // }
      // }else {
      //   isBool = false;
      // }
      return(
        {
          disabled: false,
          value: record
        }
      )
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { selectedRowItem } = this.state;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    const columns = [{
      title: '封面',
      dataIndex: 'room_thumbnail',
      key: 'room_thumbnail',
      align: 'center',
      render: (val, index)=>{
        return <img src={val} style={{maxHeight: '70px'}} />
      }
    }, {
      title: '标题',
      dataIndex: 'room_name',
      key: 'room_name',
      render: (val, index)=>{
        return <div style={{cursor: 'pointer', width: '178px', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: '2', overflow: 'hidden'}} title={val}>{val}</div>
      }
    }, {
      title: '专家',
      dataIndex: 'expert_name',
      key: 'expert_name'
    }, {
      title: '发布日期',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (val, index)=>{
        var createTime = moment(val * 1000);
        return <span>{createTime.format("YYYY-MM-DD hh:mm:ss")}</span>
      }
    }, {
      title: '更新时间',
      dataIndex: 'modify_time',
      key: 'modify_time'
    }, {
      title: '状态',
      dataIndex: 'update_status',
      key: 'update_status',
      render: (val, index)=>{
        return <span>已发布</span>
      }
    }];
    const rowSelection = {
      selectedRowItem,
      onChange: this.onSelectChange.bind(this),
      hideDefaultSelections: true,
      getCheckboxProps: this.getCheckboxProps.bind(this)
    };
    return (
      <div>
        <Form layout="inline" style={{textAlign: 'center', marginBottom: '14px'}} onSubmit={this.searchKeyword.bind(this)}>
          <Form.Item label="关键字">
            {getFieldDecorator('keyword', {
              initialValue: '',
            })(
              <Input placeholder="请输入关键字..." style={{width: '340px'}} />
            )}
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" icon="search">搜 索</Button>
          </Form.Item>
        </Form>
        <Table
          rowKey="id" scroll={{ y: 512 }}
          rowSelection={rowSelection} columns={columns} dataSource={this.state.data}
          pagination={this.state.pagination}  loading={this.state.tableLoading}
          onChange={this.tablePagination.bind(this)}
        />

        <div style={{textAlign: 'right', marginTop:'10px'}}>
          <Button type="primary" style={{marginRight: '10px'}} onClick={this.callbackSuggestion.bind(this)}>提 交</Button>
          <Button onClick={()=>this.props.propsThis.btnRelatedSuggestion(false)}>取 消</Button>
        </div>
      </div>
    )
  }
}

const addRelatedSuggestionForm = Form.create({ name: 'addRelatedSuggestion' })(addRelatedSuggestion);
export default addRelatedSuggestionForm;
