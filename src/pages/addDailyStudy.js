import React from 'react';
import { Input , Button , Upload, DatePicker, Select, Form, Radio, Icon, Progress, Tooltip, Modal, Row, Col, message } from 'antd';
const { TextArea } = Input;
const { Option } = Select;
import moment from 'moment';
import * as actions from './../actions/dailyStudyAction';
import * as fileActions from './../actions/fileMD5Action';
import AsyncComponent from './../pages/components/asyncComponent';
const AddKnowledgeSource = AsyncComponent(() => import("./../pages/components/addKnowledgeSource"));
const AddRelatedSuggestion = AsyncComponent(() => import("./../pages/components/addRelatedSuggestion"));

class addDailyStudy extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: null,
      confirmLoading: false,

      showUpdateCover: false,
      showUpdateImage: false,
      showUpdateAuido: false,
      showUpdateVideo: false,

      //知识点来源
      showKnowledgeSources: false,
      knowledges: [],
      selectKnowledgeItem: {type: 'add'},

      //相关推荐
      showRelatedSuggestion: false,
      suggestion: [],
      selectSuggestionItem: [],

      //富文本
      imgTextEditor: null,
      content: GLOBAL.globalStyle + '<blockquote><p>摘要：</p></blockquote><p><br></p>',

      //预览
      showPreviewArticle: false,

      //音频、视频  文件上传
      isShowProgress: false,
      progress: 0,
      progressStatus: "normal",
      statusTip: <div>音频上传中，请稍后...</div>,
      audioURL: '',
      videoURL: '',

      //图片 上传
      imgUpdateLoading: false,
      imageUrl: '',
      //封面 上传
      imgUpdateCoverLoading: false,
      imageCoverUrl: ''
    };
  }
  componentDidMount(){
    if(this.state.imgTextEditor == null){
      var that = this;
      wangEditor.config.printLog = false;
      that.state.imgTextEditor = new wangEditor('txtRichText');

      // 使用 base64 保存图片
      // that.state.imgTextEditor.config.uploadImgShowBase64 = true;
      that.state.imgTextEditor.config.hideLinkImg = true;

      // 使用阿里云
      that.state.imgTextEditor.config.uploadImgUrl = 'AliYun';
      that.state.imgTextEditor.config.uploadImgFns.onbeforeupload = (file)=>{
        //对接阿里云，文件上传
        fileActions.checkedFileMD5ByEditorImg(that, file);
        return false;
      };

      that.state.imgTextEditor.config.menus = GLOBAL.menus;
      that.state.imgTextEditor.onchange = function () {
        that.setState({
          content: this.$txt.html()
        });
      };
      that.state.imgTextEditor.create();

      //是否处于编辑状态
      if(sessionStorage.getItem("tempData") != null){
        var tempData = JSON.parse(sessionStorage.getItem("tempData"));
        sessionStorage.removeItem("tempData");

        that.setState({
          id: tempData.id,
          knowledges: tempData.source,
          suggestion: tempData.recommand,
        });

        that.props.form.setFieldsValue({
          cat: tempData.cat,
          title: tempData.title,
          author: tempData.author,
          summary: tempData.summary,
          date: moment(tempData.pubdate)
        })
        if(tempData.cat == "图文"){
          this.setState({showUpdateCover: false, showUpdateImage: false, showUpdateAuido: false, showUpdateVideo: false});
        }else if(tempData.cat == "图片"){
          this.setState({showUpdateCover: false, imageUrl: tempData.media, showUpdateImage: true, showUpdateAuido: false, showUpdateVideo: false});
        }else if(tempData.cat == "音频"){
          this.setState({showUpdateCover: true, imageCoverUrl: tempData.cover, audioURL: tempData.media, showUpdateImage: false, showUpdateAuido: true, showUpdateVideo: false});
        }else if(tempData.cat == "视频"){
          this.setState({showUpdateCover: true, imageCoverUrl: tempData.cover, videoURL: tempData.media, showUpdateImage: false, showUpdateAuido: false, showUpdateVideo: true});
        }
        var interval = setInterval(()=>{
          if(that.state.imgTextEditor != null){
            that.state.imgTextEditor.$txt.html(tempData.content);
            clearInterval(interval);
          }
        }, 50)
      }else {
        this.setState({id: null})
        that.state.imgTextEditor.$txt.html(GLOBAL.globalStyle + '<blockquote><p>摘要：</p></blockquote><p><br></p>');
      }
    }
  }
  setCatType(e){
    if(e.target.value == "图文"){
      this.setState({showUpdateCover: false, showUpdateImage: false, showUpdateAuido: false, showUpdateVideo: false});
    }else if(e.target.value == "图片"){
      this.setState({showUpdateCover: false, showUpdateImage: true, showUpdateAuido: false, showUpdateVideo: false});
    }else if(e.target.value == "音频"){
      this.setState({showUpdateCover: true, showUpdateImage: false, showUpdateAuido: true, showUpdateVideo: false});
    }else if(e.target.value == "视频"){
      this.setState({showUpdateCover: true, showUpdateImage: false, showUpdateAuido: false, showUpdateVideo: true});
    }
  }
  submitDailyStudy(e){
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        var media = ""; var cover = "";
        if(values.cat == "图片" && this.state.imageUrl == ''){
          Modal.warning({
            title: '提示',
            content: "图片 未上传。"
          });
          return;
        }else if(values.cat == "图片"){
          media = this.state.imageUrl;
        }

        if(values.cat == "音频"){
          if(this.state.audioURL != '' && this.state.imageCoverUrl != ''){
            media = this.state.audioURL;
            cover = this.state.imageCoverUrl;
          }else {
            Modal.warning({
              title: '提示',
              content: "音频 或 封面图 未上传。"
            });
            return;
          }
        }

        if(values.cat == "视频"){
          if(this.state.videoURL != '' && this.state.imageCoverUrl != ''){
            media = this.state.videoURL;
            cover = this.state.imageCoverUrl;
          }else {
            Modal.warning({
              title: '提示',
              content: "视频 或 封面图 未上传。"
            });
            return;
          }
        }

        values.media = media;
        values.cover = cover;
        values.summary = "";
        values.content = this.state.imgTextEditor.$txt.html();
        values.source = this.state.knowledges;
        values.recommand = this.state.suggestion;
        values.pubdate = values.date.format("YYYY-MM-DD");

        delete values.date;
        if(this.state.id != null){
          values.id = this.state.id;
        }
        actions.apiDaily(this, values)
      }
    });
  }
  beforeUploadByImage (file){
    if (!(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp')) {
      message.warning('您只能上传 JPG、PNG、GIF 和 BMP 文件！');
      return false;
    }

    this.setState({imgUpdateLoading: true, imageUrl: ''});
    fileActions.checkedFileMD5ByImg(this, file);
    return false;
  }
  beforeUploadByCover (file){
    if (!(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/bmp')) {
      message.warning('您只能上传 JPG、PNG、GIF 和 BMP 文件！');
      return false;
    }

    this.setState({imgUpdateCoverLoading: true, imageCoverUrl: ''});
    fileActions.checkedFileMD5ByCover(this, file);
    return false;
  }
  beforeUploadByVideo (file){
    if (!(file.type === 'video/mp4')) {
      message.warning('您只能上传 MP4 文件！');
      return false;
    }
    this.setState({isShowProgress: true, progress: 0, progressStatus: "normal", videoURL: '', statusTip: <div>音频上传中，请稍后...</div>});
    fileActions.checkedFileMD5ByMP4(this, file);
    return false;
  }
  beforeUploadByAudio (file){
    if (!(file.type === 'audio/mp3')) {
      message.warning('您只能上传 MP3 文件！');
      return false;
    }
    this.setState({isShowProgress: true, progress: 0, progressStatus: "normal", audioURL: '', statusTip: <div>视频上传中，请稍后...</div>});
    fileActions.checkedFileMD5ByMP3(this, file);
    return false;
  }
  onMobilePreview (){
    this.btnShowPreviewArticle(true)
  }
  btnShowPreviewArticle(val){
    if(val == false){
      this.setState({showPreviewArticle: val});
    }else {
      var that = this; var previewData = {};
      //装入数据
      previewData.title = this.props.form.getFieldValue("title");
      previewData.cat = this.props.form.getFieldValue("cat");
      previewData.author = this.props.form.getFieldValue("author");
      previewData.content = this.state.imgTextEditor.$txt.html();
      previewData.knowledges = this.state.knowledges;
      previewData.suggestion = this.state.suggestion;

      var date = this.props.form.getFieldValue("date");
      if(date == null){
        previewData.pubdate = moment().format("YYYY-MM-DD");
      }else {
        previewData.pubdate = date.format("YYYY-MM-DD");
      }
      if(previewData.cat == "图片"){
        previewData.media = this.state.imageUrl;
      }else if(previewData.cat == "音频"){
        previewData.media = this.state.audioURL;
      }else if(previewData.cat == "视频"){
        previewData.media = this.state.videoURL;
      }
      sessionStorage.setItem("previewData", JSON.stringify(previewData));
      this.setState({showPreviewArticle: val},()=>{
        var interval = setInterval(function(){
          if($("#previewIframe").length > 0){
              $("#previewIframe").attr("src", "/articlePreview");
              clearInterval(interval);
          }
        }, 10);
      });
    }
  }
  //添加 知识点来源
  btnKnowledgeSources(val){
    this.setState({selectKnowledgeItem: {type: 'add'}},()=>{
      this.setState({showKnowledgeSources: val});
    })
    if(val == false){
      this.formKnowledgeSource.props.form.resetFields();
    }
  }
  //知识点来源 回调
  callbackKnowledgeSource(obj){
    if(obj.type == 'add'){
      var subItem = Object.deepClone(obj);
      delete subItem.type;
      this.state.knowledges.push(subItem);
    }else if(obj.type == 'edit'){
      var paramData = {
        title: obj.title
        // link: obj.link
      }
      this.state.knowledges.splice(obj.index, 1, paramData);
    }

    this.setState({knowledges: this.state.knowledges},()=>{
      this.formKnowledgeSource.props.form.resetFields();
      this.btnKnowledgeSources(false);
    });
  }
  //编辑知识点
  btnEditKnowledges(item, index){
    var subItem = Object.deepClone(item);
    subItem.index = index; subItem.type = 'edit';
    this.setState({showKnowledgeSources: true},()=>{
      this.setState({selectKnowledgeItem: subItem});
    });
  }
  //删除知识点
  btnDeleteKnowledges(index){
    this.state.knowledges.splice(index, 1);
    this.setState({knowledges: this.state.knowledges});
  }
  //添加相关推荐
  btnRelatedSuggestion(val){
    this.setState({showRelatedSuggestion: val})
    if(val == false){
      this.formRelatedSuggestion.props.form.resetFields();
    }
  }
  callbackRelatedSuggestion(items){
    this.state.suggestion = items;

    this.setState({suggestion: this.state.suggestion},()=>{
      this.formRelatedSuggestion.props.form.resetFields();
      this.btnRelatedSuggestion(false);
    });
  }
  //删除推荐
  btnDeleteSuggestion(index){
    this.state.suggestion.splice(index, 1);
    this.setState({suggestion: this.state.suggestion});
  }
  setProgressVal(percent){
    if(percent <= 0 ){
      return "准备中"
    }else if(percent > 0 && percent < 100 ){
      return (percent + ' %')
    }else {
      return "完成"
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 15 },
      },
    };
    const uploadButton = (
      <div>
        <Icon type={this.state.imgUpdateLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const imageUrl = this.state.imageUrl;

    const uploadCoverButton = (
      <div>
        <Icon type={this.state.imgUpdateCoverLoading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">上传图片</div>
      </div>
    );
    const imageCoverUrl = this.state.imageCoverUrl;

    return (
      <div style={{marginTop: '20px', width: '940px', marginLeft: 'auto', marginRight: 'auto'}}>
        <Form {...formItemLayout} onSubmit={this.submitDailyStudy.bind(this)}>
          <Form.Item label="文章类型">
            {getFieldDecorator('cat', {
              initialValue: '图文',
              rules: [{
                required: true, message: '类型 不能为空。',
              }]
            })(
              <Radio.Group buttonStyle="solid" onChange={this.setCatType.bind(this)}>
                <Radio.Button value="图文">图文</Radio.Button>
                <Radio.Button value="图片">图片</Radio.Button>
                <Radio.Button value="音频">音频</Radio.Button>
                <Radio.Button value="视频">视频</Radio.Button>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item label="标题">
            {getFieldDecorator('title', {
              initialValue: '',
              rules: [{
                required: true, message: '标题 不能为空。',
              }]
            })(
              <Input placeholder="请输入标题..." />
            )}
          </Form.Item>
          <Form.Item label="作者">
            {getFieldDecorator('author', {
              initialValue: ''
            })(
              <Input placeholder="请输入作者..." />
            )}
          </Form.Item>
          {
            // <Form.Item label="摘要">
            //   {getFieldDecorator('summary', {
            //     initialValue: ''
            //   })(
            //     <TextArea
            //       placeholder="请输入摘要..." style={{resize: 'none'}}
            //       autosize={{ minRows: 2, maxRows: 3 }}
            //     />
            //   )}
            // </Form.Item>
          }
          {
            this.state.showUpdateImage && <Form.Item label="图片" required={true}>
              <Upload
                name='file'
                listType="picture-card"
                showUploadList={false}
                beforeUpload={this.beforeUploadByImage.bind(this)} >
                  {imageUrl ? <img src={imageUrl} style={{maxWidth: '220px', maxHeight: '250px'}} title="图片" /> : uploadButton}
              </Upload>
            </Form.Item>
          }
          {
            this.state.showUpdateAuido && <Form.Item label="音频">
              <Upload
                name='file'
                showUploadList={false}
                beforeUpload={this.beforeUploadByAudio.bind(this)} >
                  <Button>
                    <Icon type="upload" /> 选择音频
                  </Button>
              </Upload>
              {
                this.state.audioURL != '' && <audio src={this.state.audioURL} className="audioPreviewClass" controls="controls"></audio>
              }
            </Form.Item>
          }
          {
            this.state.showUpdateVideo && <Form.Item label="视频">
              <Upload
                name='file'
                showUploadList={false}
                beforeUpload={this.beforeUploadByVideo.bind(this)} >
                  <Button>
                    <Icon type="upload" /> 选择视频
                  </Button>
              </Upload>
              {
                this.state.videoURL != '' && <video src={this.state.videoURL} className="videoPreviewClass" controls="controls"></video>
              }
            </Form.Item>
          }
          {
            this.state.showUpdateCover && <Form.Item label="封面">
              <Upload
                name='file'
                listType="picture-card"
                showUploadList={false}
                beforeUpload={this.beforeUploadByCover.bind(this)} >
                  {imageCoverUrl ? <img src={imageCoverUrl} style={{maxWidth: '220px', maxHeight: '250px'}} title="图片" /> : uploadCoverButton}
              </Upload>
            </Form.Item>
          }
          <Form.Item label="内容">
            <div id="txtRichText">富文本，加载中...</div>
          </Form.Item>
          <Form.Item label="知识点来源">
            <Button type="primary" disabled={!(this.state.knowledges.length < 1)} style={{width: 100}} onClick={this.btnKnowledgeSources.bind(this, true)}>添加</Button>
          </Form.Item>
          {
            this.state.knowledges.map((item, index)=>{
              return <div key={index} className="divKnowledgesList" style={{marginTop: (index <= 0)?'-20px':'0px'}}>
                <a href="javascript:;" target="_black">{item.title}</a>
                <Icon type="edit" title="编辑" style={{color: "#1890FF"}} onClick={this.btnEditKnowledges.bind(this, item, index)} />
                <Icon type="delete" title="删除" style={{color: "#F52934"}} onClick={this.btnDeleteKnowledges.bind(this, index)} />
              </div>
            })
          }
          <Form.Item label="相关推荐">
            <Button type="primary" style={{width: 100}} onClick={this.btnRelatedSuggestion.bind(this, true)}>添加</Button>
          </Form.Item>
          {
            this.state.suggestion.map((item, index)=>{
              return <div key={index} className="divContainer">
                <div className="divSuggestionItem">
                  <div className="divContent">
                    <img src={item.room_thumbnail}/>
                    <div className="divText">
                      <div className="divTitle">{item.room_name}</div>
                      <Tooltip title={item.expert_info} placement="topRight">
                        <div className="divExpert">{item.expert_name}</div>
                      </Tooltip>
                    </div>
                  </div>
                </div>
                <Tooltip title="删除推荐">
                  <Button type="danger" shape="circle" icon="delete" style={{marginLeft: '10px'}} onClick={this.btnDeleteSuggestion.bind(this, index)}/>
                </Tooltip>
              </div>
            })
          }
          <Form.Item label="发布时间">
            {getFieldDecorator('date', {
              initialValue: undefined,
              rules: [{
                required: true, message: '日期必填',
              }]
            })(
              <DatePicker />
            )}
          </Form.Item>

          <div style={{textAlign: 'right', marginTop:'10px', marginRight: '109px'}}>
            <Button type="primary" htmlType="submit" loading={this.state.confirmLoading} icon="upload" style={{marginRight: '10px', width: '134px'}}>保存并发布</Button>
            <Button type="danger" icon="mobile" onClick={this.onMobilePreview.bind(this)} style={{marginRight: '10px', width: '100px'}}>预览</Button>
            <Button onClick={()=>{this.props.history.push("/home/dailyStudy");}}>取 消</Button>
          </div>
        </Form>
        <Modal
          title="知识点来源"
          visible={this.state.showKnowledgeSources}
          footer={null} centered={true} maskClosable={false}
          onCancel={this.btnKnowledgeSources.bind(this, false)}
          width={500}>
          <AddKnowledgeSource wrappedComponentRef={(form) => this.formKnowledgeSource = form} propsThis={this} callbackKnowledgeSource={this.callbackKnowledgeSource} item={this.state.selectKnowledgeItem}/>
        </Modal>
        <Modal
          title="相关推荐"
          visible={this.state.showRelatedSuggestion}
          footer={null} centered={true} maskClosable={false}
          onCancel={this.btnRelatedSuggestion.bind(this, false)}
          width={950}>
          <AddRelatedSuggestion wrappedComponentRef={(form) => this.formRelatedSuggestion = form} propsThis={this} callbackRelatedSuggestion={this.callbackRelatedSuggestion} item={this.state.selectSuggestionItem}/>
        </Modal>
        <Modal
          title={null}
          visible={this.state.showPreviewArticle}
          footer={null} centered={true} maskClosable={false}
          onCancel={this.btnShowPreviewArticle.bind(this, false)}
          width="auto">
          <div className="divPreviewArticle">
            <iframe id="previewIframe" src="" />
          </div>
        </Modal>
        {
          this.state.isShowProgress && <div className="divUpdateFile">
            <div className="divUpdateContent">
              <Progress type="circle" status={this.state.progressStatus} percent={this.state.progress} format={this.setProgressVal.bind(this)} />
              {this.state.statusTip}
            </div>
          </div>
        }
      </div>
    )
  }
}

const addDailyStudyForm = Form.create({ name: 'addDailyStudy' })(addDailyStudy);
export default addDailyStudyForm;
