import React from 'react';
import { Divider } from 'antd';

export default class articlePreview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      details: {
        knowledges: [],
        suggestion: []
      }
    };
  }
  componentDidMount() {
    if(sessionStorage.getItem("previewData") != null){
      var previewData = JSON.parse(sessionStorage.getItem("previewData"));
      sessionStorage.removeItem(previewData);
      this.setState({details: previewData});
    }
  }
  render() {
    var mediaEl;
    if(this.state.details.cat != undefined){
      if(this.state.details.cat == "图片"){
        mediaEl = <img src={this.state.details.media} className="imgPreview" />
      }else if(this.state.details.cat == "音频"){
        mediaEl = <audio src={this.state.details.media} className="audioPreview" controls="controls"></audio>
      }else if(this.state.details.cat == "视频"){
        mediaEl = <video src={this.state.details.media} className="videoPreview" controls="controls"></video>
      }
    }
    return (
      <div className="divPreview">
        {mediaEl}
        <div className="divTitle">{this.state.details.title}</div>
        <div className="divSubTitle">
          作者<span className="spanAuthor">{this.state.details.author}</span>
          <Divider type="vertical"/>
          {this.state.details.pubdate}
        </div>
        <div className="divContent" dangerouslySetInnerHTML={{__html: this.state.details.content}}></div>
        {
          this.state.details.knowledges.map((item, index)=>{
            return (<a key={"a_" + index} href={item.link} style={{marginLeft: '5px'}}>{item.title}</a>)
          })
        }
        {
          this.state.details.suggestion.map((item, index)=>{
            return <div key={"div_" + index} className="divContainer1">
              <div className="divSuggestionItem">
                <div className="divContent">
                  <img src={item.room_thumbnail}/>
                  <div className="divText">
                    <div className="divTitle1">{item.room_name}</div>
                    <div className="divExpert">{item.expert_name}</div>
                  </div>
                </div>
              </div>
            </div>
          })
        }
      </div>);
  }
}
