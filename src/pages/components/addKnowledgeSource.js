import React from 'react';
import PropTypes from 'prop-types';
import { Input , Button , Form, message } from 'antd';
import debounce from 'lodash/debounce';

class addKnowledgeSource extends React.Component {
  static propTypes = {
      propsThis: PropTypes.object,
      item: PropTypes.object,
      callbackKnowledgeSource: PropTypes.func
  }
  constructor(props) {
    super(props);
    this.state = {};
  }
  submitSource(e){
    e.preventDefault(); var that = this;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.type = that.props.item.type;

        if(that.props.item.type == 'add'){
          that.props.propsThis.callbackKnowledgeSource(values);
        }else {
          values.index = that.props.item.index;
          that.props.propsThis.callbackKnowledgeSource(values);
        }
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
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

    return (
      <Form {...formItemLayout} onSubmit={this.submitSource.bind(this)}>
          <Form.Item label="标题">
            {getFieldDecorator('title', {
              initialValue: (this.props.item.title)?this.props.item.title:'',
              rules: [{
                required: true, message: '标题 不能为空。',
              }]
            })(
              <Input placeholder="请输入标题..." />
            )}
          </Form.Item>
          {
            // <Form.Item label="链接">
            //   {getFieldDecorator('link', {
            //     initialValue: (this.props.item.link)?this.props.item.link:'',
            //     rules: [{
            //       required: true, message: '链接 不能为空。',
            //     },{
            //       type: 'url', message: '链接格式 错误（请已 http:// 或 https:// 开头）。'
            //     }]
            //   })(
            //     <Input placeholder="请输入链接..." />
            //   )}
            // </Form.Item>
          }

          <div style={{textAlign: 'right', marginTop:'10px'}}>
            <Button type="primary" htmlType="submit" style={{marginRight: '10px'}}>提 交</Button>
            <Button onClick={()=>this.props.propsThis.btnKnowledgeSources(false)}>取 消</Button>
          </div>
      </Form>
    )
  }
}

const addKnowledgeSourceForm = Form.create({ name: 'addKnowledgeSource' })(addKnowledgeSource);
export default addKnowledgeSourceForm;
