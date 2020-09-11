import React from 'react';
import { Upload, Icon, message } from 'antd';
import moment from 'moment';
import * as fileActions from './../../actions/fileMD5Action';
const { Dragger } = Upload;

export default class multipleFileUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }
  componentDidMount(){
    $("title").text("多文件上传");
  }
  clearAll(){
    this.setState({list: []});
  }
  onChange(info){
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log("上传中：" + info.file.name);
    }
    if (status === 'done') {
      var item = {
        name: info.file.response.data.fileName,
        url: info.file.response.data.url
      }
      this.state.list.push(item);
      this.setState({list: this.state.list});
    } else if (status === 'error') {
      message.error(`上传失败：${info.file.name}`);
    }
  }
  render() {
    return (<div>
        <Dragger
          multiple={true}
          directory={false}
          showUploadList={false}
          action="https://appupload.hbbclub.com/api/oss/upload"
          name="file"
          onChange={this.onChange.bind(this)}>
          <p className="ant-upload-drag-icon">
            <Icon type="inbox" />
          </p>
          <p className="ant-upload-text">单击 或 拖动文件 到该区域，自动上传阿里云</p>
          <p className="ant-upload-hint">
            支持 单次 或 批量上传。
          </p>
        </Dragger>
        <div id="divResult" style={{marginTop: '5px', overflowY: 'auto', maxHeight:'429px'}}>
          {
            this.state.list.map((item, index)=>{
              return (<div key={index} style={{marginLeft: '10px', lineHeight: '33px'}}>
                {item.name + "," + item.url}
              </div>)
            })
          }
        </div>
        <div style={{borderBottom: '1px dashed gray'}}></div>
        <button onClick={this.clearAll.bind(this)} style={{marginLeft: '10px', marginTop: '5px'}}>清除所有数据</button>
      </div>
    )
  }
}
