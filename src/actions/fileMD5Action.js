import React from 'react';
import { notification, Modal } from 'antd';
import * as axios from 'axios';
import OSS from 'ali-oss';
import moment from 'moment';
import { errorInfo, showNotification } from './errorAction';

// checkedFileMD5ByImg(obj, file)   上传图片
// checkedFileMD5ByEditorImg(obj, file)   上传图片插入编辑器
// checkedFileMD5ByCover(obj, file)   上传封面图
// checkedFileMD5ByMP4(obj, file) 上传大文件（MP4）
// checkedFileMD5ByMP3(obj, file) 上传小文件（MP3）

//图片上传插入编辑器
export function checkedFileMD5ByEditorImg(obj, file){
  var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
          chunkSize = 2097152,                             // Read in chunks of 2MB
          chunks = Math.ceil(file.size / chunkSize),
          currentChunk = 0,
          spark = new SparkMD5.ArrayBuffer(),
          fileReader = new FileReader();

      fileReader.onload = (e) => {
          spark.append(e.target.result);                   // Append array buffer
          currentChunk++;

          if (currentChunk < chunks) {
              loadNext();
          } else {
              var fileMD5 = spark.end();

              axios.get(`${GLOBAL.baseURL.IP2}/api/manage/upload/status?MD5=${fileMD5}`, {headers: {token: JSON.parse(sessionStorage.getItem("loginData")).token}})
              .then(function (response) {
                  if(response.data.code == 200){
                    let mediaInfo = response.data.data.mediaInfo;
                    if(mediaInfo.isExist){
                      //文件已存在
                      obj.state.imgTextEditor.command(null, 'insertHtml', '<img src="' + mediaInfo.url + '" style="width: 100px"/>');
                      showUploadProgress(obj);
                    }else {
                      //文件不存在，上传阿里云
                      let updateImg = OSS({
                        accessKeyId: mediaInfo.stsToken.credentials.accessKeyId,
                        accessKeySecret: mediaInfo.stsToken.credentials.accessKeySecret,
                        stsToken: mediaInfo.stsToken.credentials.securityToken,
                        bucket: mediaInfo.stsToken.bucket,
                        region: mediaInfo.stsToken.endPoint.replace('.aliyuncs.com', ''),
                        secure: true,
                        useFetch: true,
                        timeout: 120000  //120秒
                      });
                      updateImg.put(getUUID(file.name), file)
                      .then(function (result) {
                        var paramData = {
                          MD5: fileMD5,
                          url: result.res.requestUrls[0]
                        }
                        uploadImageEditor(obj, paramData);
                      }).catch(function (err) {
                        showNotification("error", "对不起，网络链接错误。", "4px solid rgb(240, 70, 52)");
                      });
                    }
                  }else if(response.data.code == 299){
                    Modal.warning({
                      title: '提示',
                      content: response.data.msg,
                      onOk: ()=>{
                        location.href = "/login";
                      }
                    })
                  }else {
                    showNotification("error", "对不起，网络链接错误。", "4px solid rgb(240, 70, 52)");
                  }
              }).catch(function(err){
                errorInfo(err, obj);
              })
          }
      }
      fileReader.onerror = (err) => {
          showNotification("error", "提示：文件读取错误。", "4px solid rgb(240, 70, 52)");
      }
      function loadNext() {
          var start = currentChunk * chunkSize,
              end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }
      loadNext();
}

//图片上传
export function checkedFileMD5ByImg(obj, file){
  var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
          chunkSize = 2097152,                             // Read in chunks of 2MB
          chunks = Math.ceil(file.size / chunkSize),
          currentChunk = 0,
          spark = new SparkMD5.ArrayBuffer(),
          fileReader = new FileReader();

      fileReader.onload = (e) => {
          spark.append(e.target.result);                   // Append array buffer
          currentChunk++;

          if (currentChunk < chunks) {
              loadNext();
          } else {
              var fileMD5 = spark.end();

              axios.get(`${GLOBAL.baseURL.IP2}/api/manage/upload/status?MD5=${fileMD5}`, {headers: {token: JSON.parse(sessionStorage.getItem("loginData")).token}})
              .then(function (response) {
                  if(response.data.code == 200){
                    let mediaInfo = response.data.data.mediaInfo;
                    if(mediaInfo.isExist){
                      //文件已存在
                      obj.setState({imgUpdateLoading: false, imageUrl: mediaInfo.url});
                    }else {
                      //文件不存在，上传阿里云
                      let updateImg = OSS({
                        accessKeyId: mediaInfo.stsToken.credentials.accessKeyId,
                        accessKeySecret: mediaInfo.stsToken.credentials.accessKeySecret,
                        stsToken: mediaInfo.stsToken.credentials.securityToken,
                        bucket: mediaInfo.stsToken.bucket,
                        region: mediaInfo.stsToken.endPoint.replace('.aliyuncs.com', ''),
                        secure: true,
                        useFetch: true,
                        timeout: 120000  //120秒
                      });
                      updateImg.put(getUUID(file.name), file)
                      .then(function (result) {
                        var paramData = {
                          MD5: fileMD5,
                          url: result.res.requestUrls[0]
                        }
                        uploadImageInfo(obj, paramData);
                      }).catch(function (err) {
                        obj.setState({imgUpdateLoading: false});
                        showNotification("error", "对不起，网络链接错误。", "4px solid rgb(240, 70, 52)");
                      });
                    }
                  }else if(response.data.code == 299){
                    Modal.warning({
                      title: '提示',
                      content: response.data.msg,
                      onOk: ()=>{
                        location.href = "/login";
                      }
                    })
                  }else {
                    showNotification("error", "对不起，网络链接错误。", "4px solid rgb(240, 70, 52)");
                    obj.setState({imgUpdateLoading: false});
                  }
              }).catch(function(err){
                errorInfo(err, obj);
                obj.setState({imgUpdateLoading: false});
              })
          }
      }
      fileReader.onerror = (err) => {
          showNotification("error", "提示：文件读取错误。", "4px solid rgb(240, 70, 52)");
          obj.setState({imgUpdateLoading: false});
      }
      function loadNext() {
          var start = currentChunk * chunkSize,
              end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }
      loadNext();
}
//封面图上传
export function checkedFileMD5ByCover(obj, file){
  var blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
          chunkSize = 2097152,                             // Read in chunks of 2MB
          chunks = Math.ceil(file.size / chunkSize),
          currentChunk = 0,
          spark = new SparkMD5.ArrayBuffer(),
          fileReader = new FileReader();

      fileReader.onload = (e) => {
          spark.append(e.target.result);                   // Append array buffer
          currentChunk++;

          if (currentChunk < chunks) {
              loadNext();
          } else {
              var fileMD5 = spark.end();

              axios.get(`${GLOBAL.baseURL.IP2}/api/manage/upload/status?MD5=${fileMD5}`, {headers: {token: JSON.parse(sessionStorage.getItem("loginData")).token}})
              .then(function (response) {
                  if(response.data.code == 200){
                    let mediaInfo = response.data.data.mediaInfo;
                    if(mediaInfo.isExist){
                      //文件已存在
                      obj.setState({imgUpdateCoverLoading: false, imageCoverUrl: mediaInfo.url});
                    }else {
                      //文件不存在，上传阿里云
                      let updateImg = OSS({
                        accessKeyId: mediaInfo.stsToken.credentials.accessKeyId,
                        accessKeySecret: mediaInfo.stsToken.credentials.accessKeySecret,
                        stsToken: mediaInfo.stsToken.credentials.securityToken,
                        bucket: mediaInfo.stsToken.bucket,
                        region: mediaInfo.stsToken.endPoint.replace('.aliyuncs.com', ''),
                        secure: true,
                        useFetch: true,
                        timeout: 120000  //120秒
                      });
                      updateImg.put(getUUID(file.name), file)
                      .then(function (result) {
                        var paramData = {
                          MD5: fileMD5,
                          url: result.res.requestUrls[0]
                        }
                        uploadImageCoverInfo(obj, paramData);
                      }).catch(function (err) {
                        obj.setState({imgUpdateCoverLoading: false});
                        showNotification("error", "对不起，网络链接错误。", "4px solid rgb(240, 70, 52)");
                      });
                    }
                  }else if(response.data.code == 299){
                    Modal.warning({
                      title: '提示',
                      content: response.data.msg,
                      onOk: ()=>{
                        location.href = "/login";
                      }
                    })
                  }else {
                    showNotification("error", "对不起，网络链接错误。", "4px solid rgb(240, 70, 52)");
                    obj.setState({imgUpdateCoverLoading: false});
                  }
              }).catch(function(err){
                errorInfo(err, obj);
                obj.setState({imgUpdateCoverLoading: false});
              })
          }
      }
      fileReader.onerror = (err) => {
          showNotification("error", "提示：文件读取错误。", "4px solid rgb(240, 70, 52)");
          obj.setState({imgUpdateLoading: false});
      }
      function loadNext() {
          var start = currentChunk * chunkSize,
              end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
          fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }
      loadNext();
}
// 大文件上传(MP4)
export function checkedFileMD5ByMP4(obj, file){
  let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
      chunkSize = 2097152,                             // Read in chunks of 2MB
      chunks = Math.ceil(file.size / chunkSize),
      currentChunk = 0,
      spark = new SparkMD5.ArrayBuffer(),
      fileReader = new FileReader();

      fileReader.onload = (e) => {
        spark.append(e.target.result);                   // Append array buffer
        let fileMD5 = spark.end();
        currentChunk++;

        if(currentChunk < chunks){
          loadNext();
        } else {
          axios.get(`${GLOBAL.baseURL.IP2}/api/manage/upload/status?MD5=${fileMD5}`, {headers: {token: JSON.parse(sessionStorage.getItem("loginData")).token}}).then((response)=>{
            if(response.data.code == 200){
              let mediaInfo = response.data.data.mediaInfo;
              if(mediaInfo.isExist){
                //文件已存在
                obj.setState({isShowProgress: false, progress: 0, progressStatus: "normal", videoURL: mediaInfo.url});
              } else {
                //文件不存在，上传阿里云
                let serverAccess = {
                  accessKeyId: mediaInfo.stsToken.credentials.accessKeyId,
                  accessKeySecret: mediaInfo.stsToken.credentials.accessKeySecret,
                  stsToken: mediaInfo.stsToken.credentials.securityToken,
                  bucket: mediaInfo.stsToken.bucket,
                  region: mediaInfo.stsToken.endPoint.replace('.aliyuncs.com', ''),
                }
                let updateFile = OSS({
                  ...serverAccess,
                  secure: true,
                  useFetch: true,
                  timeout: 3600000  //一个小时
                });
                updateFile.multipartUpload(getUUID(file.name), file, {
                  parallel: 4,
                  partSize: 1024 * 1024,
                  mime: file.type,
                  progress: function (p, cpt, res) {
                    obj.setState({isShowProgress: true, progress: parseInt(p*100), progressStatus: "normal"});
                    console.log(parseInt(p*100) + " %");
                  }
                }).then(function (result) {
                  // 提交转码作业
                  // obj.setState({isShowProgress: true, progress: 0, progressStatus: "normal", statusTip: <div style={{color: 'red'}}>转码中，请稍后...</div>});
                  // var url = result.res.requestUrls[0].substr(0, result.res.requestUrls[0].indexOf('?uploadId'));
                  // console.log("提交转码作业（URL）：" + url);
                  // mediaConvert(obj, result.name, serverAccess, fileMD5);
                  var paramData = {
                    MD5: fileMD5,
                    url: result.res.requestUrls[0].substr(0, result.res.requestUrls[0].indexOf('?uploadId'))
                  }
                  uploadMP4Info(obj, paramData);
                  console.log(paramData.url);
                }).catch(function (err) {
                  obj.setState({progressStatus: "exception"},()=>{
                    setTimeout(()=>{
                      obj.setState({isShowProgress: false, progress: 0, progressStatus: 'normal'});
                    }, 1800);
                  })
                  console.log(err);
                  showNotification("error", "对不起，网络链接错误。", "4px solid rgb(240, 70, 52)");
                });
              }
            }else if(response.data.code == 299){
              Modal.warning({
                title: '提示',
                content: response.data.msg,
                onOk: ()=>{
                  location.href = "/login";
                }
              })
            } else {
              obj.setState({progressStatus: "exception"},()=>{
                setTimeout(()=>{
                  obj.setState({isShowProgress: false, progress: 0, progressStatus: 'normal'});
                }, 1800);
              })
              showNotification("error", "对不起，网络链接错误。", "4px solid rgb(240, 70, 52)");
            }
          }).catch(function(err){
            errorInfo(err, obj);
            obj.setState({progressStatus: "exception"},()=>{
              setTimeout(()=>{
                obj.setState({isShowProgress: false, progress: 0, progressStatus: 'normal'});
              }, 1800);
            })
          });
        }
      }
      fileReader.onerror = (err) => {
        showNotification("error", "提示：文件读取错误。", "4px solid rgb(240, 70, 52)");
        obj.setState({progressStatus: "exception"},()=>{
          setTimeout(()=>{
            obj.setState({isShowProgress: false, progress: 0, progressStatus: 'normal'});
          }, 1800);
        })
      }
      function loadNext() {
        var start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }
      loadNext();
}
// 小文件上传(MP3)
export function checkedFileMD5ByMP3(obj, file){
  let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
      chunkSize = 2097152,                             // Read in chunks of 2MB
      chunks = Math.ceil(file.size / chunkSize),
      currentChunk = 0,
      spark = new SparkMD5.ArrayBuffer(),
      fileReader = new FileReader();

      fileReader.onload = (e) => {
        spark.append(e.target.result);                   // Append array buffer
        let fileMD5 = spark.end();
        currentChunk++;

        if(currentChunk < chunks){
          loadNext();
        } else {
          axios.get(`${GLOBAL.baseURL.IP2}/api/manage/upload/status?MD5=${fileMD5}`, {headers: {token: JSON.parse(sessionStorage.getItem("loginData")).token}}).then((response)=>{
            if(response.data.code == 200){
              let mediaInfo = response.data.data.mediaInfo;
              if(mediaInfo.isExist){
                //文件已存在
                obj.setState({isShowProgress: false, progress: 0, progressStatus: "normal", audioURL: mediaInfo.url});
              } else {
                //文件不存在，上传阿里云
                let serverAccess = {
                  accessKeyId: mediaInfo.stsToken.credentials.accessKeyId,
                  accessKeySecret: mediaInfo.stsToken.credentials.accessKeySecret,
                  stsToken: mediaInfo.stsToken.credentials.securityToken,
                  bucket: mediaInfo.stsToken.bucket,
                  region: mediaInfo.stsToken.endPoint.replace('.aliyuncs.com', ''),
                }
                let updateFile = OSS({
                  ...serverAccess,
                  secure: true,
                  useFetch: true,
                  timeout: 3600000  //一个小时
                });
                updateFile.multipartUpload(getUUID(file.name), file, {
                  parallel: 4,
                  partSize: 1024 * 1024,
                  mime: file.type,
                  progress: function (p, cpt, res) {
                    obj.setState({isShowProgress: true, progress: parseInt(p*100), progressStatus: "normal"});
                    console.log(parseInt(p*100) + " %");
                  }
                }).then(function (result) {
                  var paramData = {
                    MD5: fileMD5,
                    url: result.res.requestUrls[0].substr(0, result.res.requestUrls[0].indexOf('?uploadId'))
                  }
                  uploadMP3Info(obj, paramData);
                  console.log(paramData.url);
                }).catch(function (err) {
                  obj.setState({progressStatus: "exception"},()=>{
                    setTimeout(()=>{
                      obj.setState({isShowProgress: false, progress: 0, progressStatus: 'normal'});
                    }, 1800);
                  })
                  console.log(err);
                  showNotification("error", "对不起，网络链接错误。", "4px solid rgb(240, 70, 52)");
                });
              }
            }else if(response.data.code == 299){
              Modal.warning({
                title: '提示',
                content: response.data.msg,
                onOk: ()=>{
                  location.href = "/login";
                }
              })
            } else {
              obj.setState({progressStatus: "exception"},()=>{
                setTimeout(()=>{
                  obj.setState({isShowProgress: false, progress: 0, progressStatus: 'normal'});
                }, 1800);
              })
              showNotification("error", "对不起，网络链接错误。", "4px solid rgb(240, 70, 52)");
            }
          }).catch(function(err){
            errorInfo(err, obj);
            obj.setState({progressStatus: "exception"},()=>{
              setTimeout(()=>{
                obj.setState({isShowProgress: false, progress: 0, progressStatus: 'normal'});
              }, 1800);
            })
          });
        }
      }
      fileReader.onerror = (err) => {
        showNotification("error", "提示：文件读取错误。", "4px solid rgb(240, 70, 52)");
        obj.setState({progressStatus: "exception"},()=>{
          setTimeout(()=>{
            obj.setState({isShowProgress: false, progress: 0, progressStatus: 'normal'});
          }, 1800);
        })
      }
      function loadNext() {
        var start = currentChunk * chunkSize,
            end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;
        fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
      }
      loadNext();
}
//大文件回调存档（MP4）
function uploadMP4Info(obj, paramData){
  axios.post(`${GLOBAL.baseURL.IP2}/api/manage/upload/fileinfo`, paramData, {headers: {token: JSON.parse(sessionStorage.getItem("loginData")).token}})
  .then((response)=>{
    if(response.data.code == 200){
      obj.setState({progressStatus: "success"},()=>{
        setTimeout(()=>{
          obj.setState({isShowProgress: false, progress: 0, progressStatus: "normal", videoURL: response.data.data.url});
        }, 800)
      })
    }else if(response.data.code == 299){
      Modal.warning({
        title: '提示',
        content: response.data.msg,
        onOk: ()=>{
          location.href = "/login";
        }
      })
    }
  }).catch(function(err){
    errorInfo(err, obj);
    obj.setState({progressStatus: "exception"},()=>{
      setTimeout(()=>{
        obj.setState({isShowProgress: false, progress: 0, progressStatus: 'normal'});
      }, 1800);
    })
  });
}
//小文件回调存档（MP3）
function uploadMP3Info(obj, paramData){
  axios.post(`${GLOBAL.baseURL.IP2}/api/manage/upload/fileinfo`, paramData, {headers: {token: JSON.parse(sessionStorage.getItem("loginData")).token}})
  .then((response)=>{
    if(response.data.code == 200){
      obj.setState({progressStatus: "success"},()=>{
        setTimeout(()=>{
          obj.setState({isShowProgress: false, progress: 0, progressStatus: "normal", audioURL: response.data.data.url});
        }, 800)
      })
    }else if(response.data.code == 299){
      Modal.warning({
        title: '提示',
        content: response.data.msg,
        onOk: ()=>{
          location.href = "/login";
        }
      })
    }
  }).catch(function(err){
    errorInfo(err, obj);
    obj.setState({progressStatus: "exception"},()=>{
      setTimeout(()=>{
        obj.setState({isShowProgress: false, progress: 0, progressStatus: 'normal'});
      }, 1800);
    })
  });
}
//图片回调存档
function uploadImageEditor(obj, paramData){
  axios.post(`${GLOBAL.baseURL.IP2}/api/manage/upload/fileinfo`, paramData, {headers: {token: JSON.parse(sessionStorage.getItem("loginData")).token}})
  .then((response)=>{
    if(response.data.code == 200){
      obj.state.imgTextEditor.command(null, 'insertHtml', '<img src="' + response.data.data.url + '" style="width: 100px"/>');
      showUploadProgress(obj);
    }else if(response.data.code == 299){
      Modal.warning({
        title: '提示',
        content: response.data.msg,
        onOk: ()=>{
          location.href = "/login";
        }
      })
    }
  }).catch(function(err){
    errorInfo(err, obj);
  });
}
//图片回调存档
function uploadImageInfo(obj, paramData){
  axios.post(`${GLOBAL.baseURL.IP2}/api/manage/upload/fileinfo`, paramData, {headers: {token: JSON.parse(sessionStorage.getItem("loginData")).token}})
  .then((response)=>{
    if(response.data.code == 200){
      obj.setState({imgUpdateLoading: false, imageUrl: response.data.data.url});
    }else if(response.data.code == 299){
      Modal.warning({
        title: '提示',
        content: response.data.msg,
        onOk: ()=>{
          location.href = "/login";
        }
      })
    }
  }).catch(function(err){
    errorInfo(err, obj);
    obj.setState({imgUpdateLoading: false});
  });
}
//图片回调存档（封面图）
function uploadImageCoverInfo(obj, paramData){
  axios.post(`${GLOBAL.baseURL.IP2}/api/manage/upload/fileinfo`, paramData, {headers: {token: JSON.parse(sessionStorage.getItem("loginData")).token}})
  .then((response)=>{
    if(response.data.code == 200){
      obj.setState({imgUpdateCoverLoading: false, imageCoverUrl: response.data.data.url});
    }else if(response.data.code == 299){
      Modal.warning({
        title: '提示',
        content: response.data.msg,
        onOk: ()=>{
          location.href = "/login";
        }
      })
    }
  }).catch(function(err){
    errorInfo(err, obj);
    obj.setState({imgUpdateCoverLoading: false});
  });
}
//获取 File UUID
function getUUID(filename) {
  var mydate = new Date();
  var random = Math.floor(Math.random () * 900) + 100;
  var uuid = "file" + mydate.getDay() + mydate.getHours() + mydate.getMinutes() + mydate.getSeconds() + mydate.getMilliseconds() + random;
  //文件扩展名
  var index = filename.lastIndexOf(".");
  var suffix = filename.substr(index);
  return uuid + suffix;
}

//提交转码作业
function mediaConvert(obj, fileName, access, fileMD5){
  /*
  转码模板： 8d368ff132bd437b931283df76eed1c8
  管道ID： 23e158ddab1b4ef59cb83f2e5d9dcbb6  （mts-service-pipeline）
  输入bucket hbb-ads
  输出bucket
  */
  let baseURL = `https://mts.${access.region.replace('oss-', '')}.aliyuncs.com?`
  let curDateISO = moment().toISOString();
  let commonParams = {
    Format: 'JSON',
    Version: '2014-06-18',
    AccessKeyId: access.accessKeyId,
    SignatureMethod: 'HMAC-SHA1',
    Timestamp: curDateISO,
    SignatureVersion: '1.0',
    SignatureNonce: randomString(32),
    SecurityToken: access.stsToken,
  }

  // 提交转码作业参数
  let paramsObj = {
    ...commonParams,
    Action: 'SubmitJobs',
      Input: {
        "Bucket": 'hbb-ads',
        "Location": access.region,
        "Object": fileName,
      },
      OutputBucket: 'hbb-ads',
      Outputs: [{
        "OutputObject": `${fileName.substr(0, fileName.lastIndexOf('.'))}_output.mp4`,
        "TemplateId": "8d368ff132bd437b931283df76eed1c8"
      }],
      PipelineId: '23e158ddab1b4ef59cb83f2e5d9dcbb6',
      OutputLocation: access.region,
  }

  // 生成signature及url
  paramsObj = objSortByKey(paramsObj);
  let paramsStr = objToURI(paramsObj);
  let signStr = `GET&${encodeURIComponent('/')}&${encodeURIComponent(paramsStr)}`;
  let signature = encodeURIComponent(HMAC(`${access.accessKeySecret}&`, signStr));
  paramsObj.Signature = signature;
  let url = baseURL + paramsStr + `&Signature=${signature}`;

  $.ajax({
    url: url,
    method: 'GET',
    crossDomain:true,
    xhrFields: {
      withCredentials: false
    },
    success: function(response){
      //转码作业查询
      if(response.JobResultList.JobResult.length >= 1){
        var paramsData = {
          Action: 'QueryJobList',
          JobIds: response.JobResultList.JobResult[0].Job.JobId
        };
        //查询转码作业
        searchConvertJob(obj, interval, access, paramsData, fileMD5);
        var interval = setInterval(()=>{
          searchConvertJob(obj, interval, access, paramsData, fileMD5)
        }, 800);
      }
    },
    error: function (err) {
      obj.setState({isShowProgress: true, progress: 0, progressStatus: "exception", statusTip: <div style={{color: 'red'}}>视频转码：失败</div>});
      Modal.error({
        title: '提示',
        content: '视频转码：失败。',
        onOk: ()=>{
          obj.setState({isShowProgress: false, progress: 0, progressStatus: "normal"});
        }
      });
      console.log(err)
    }
  });
}

//查询转码作业
function searchConvertJob(obj, interval, access, paramsData, fileMD5){
  let baseURL = `https://mts.${access.region.replace('oss-', '')}.aliyuncs.com?`
  let curDateISO = moment().toISOString();
  let commonParams = {
    Format: 'JSON',
    Version: '2014-06-18',
    AccessKeyId: access.accessKeyId,
    SignatureMethod: 'HMAC-SHA1',
    Timestamp: curDateISO,
    SignatureVersion: '1.0',
    SignatureNonce: randomString(32),
    SecurityToken: access.stsToken,
  }

  // 查询转码作业参数
  let paramsObj = {
    ...commonParams,
    ...paramsData
  }

  // 生成signature及url
  paramsObj = objSortByKey(paramsObj);
  let paramsStr = objToURI(paramsObj);
  let signStr = `GET&${encodeURIComponent('/')}&${encodeURIComponent(paramsStr)}`;
  let signature = encodeURIComponent(HMAC(`${access.accessKeySecret}&`, signStr));
  paramsObj.Signature = signature;
  let url = baseURL + paramsStr + `&Signature=${signature}`;

  $.ajax({
    url: url,
    method: 'GET',
    crossDomain:true,
    xhrFields: {
      withCredentials: false
    },
    success: function(response){
      if(response.JobList.Job.length >= 1){
        var job = response.JobList.Job[0];
        if(job.State == "Transcoding"){
          if(obj.state.progress < 96){
            if(obj.state.progress == 0){
              obj.state.progress = job.Percent;
              obj.setState({isShowProgress: true, progressStatus: "normal", statusTip: <div style={{color: 'red'}}>转码中，请稍后...</div>});
            }else {
              obj.state.progress = obj.state.progress + 2;
              obj.setState({isShowProgress: true, progressStatus: "normal", statusTip: <div style={{color: 'red'}}>转码中，请稍后...</div>});
            }
            console.log("转码进度：" + obj.state.progress);
          }else {
            obj.setState({isShowProgress: true, progress: 98, progressStatus: "normal", statusTip: <div style={{color: 'red'}}>转码中，请稍后...</div>});
            console.log("转码进度：" + 98);
          }
        }else if(job.State == "TranscodeSuccess"){
          obj.setState({isShowProgress: true, progress: 100, progressStatus: "normal", statusTip: <div style={{color: 'green'}}>转码成功</div>});
          clearInterval(interval); //清除定时器
          var url = `https://${job.Output.OutputFile.Bucket}.${job.Output.OutputFile.Location}.aliyuncs.com/${job.Output.OutputFile.Object}`;

          var paramData = {
            MD5: fileMD5,
            url: url
          }
          console.log("转码成功（URL）：" + url);
          checkedFileMD5ByMP4(obj, paramData);
        }else if(job.State == "Submitted"){
          //提交任务，忽略操作
        }else {
          //转码错误输出
          obj.setState({isShowProgress: true, progressStatus: "exception", statusTip: <div style={{color: 'red'}}>转码失败</div>});
          Modal.error({
            title: '提示',
            content: '视频转码：失败。',
            onOk: ()=>{
              obj.setState({isShowProgress: false, progress: 0, progressStatus: "normal"});
            }
          });
        }
      }
    },
    error: function (err) {
      console.warn('查询转码作业：失败。')
    }
  });
}

// 计算签名HMAC值【HMAC-SHA1】
function HMAC(k,d,_p,_z){
  // heavily optimized and compressed version of http://pajhome.org.uk/crypt/md5/sha1.js
  // _p = b64pad, _z = character size; not used here but I left them available just in case
  if(!_p){_p='=';}if(!_z){_z=8;}function _f(t,b,c,d){if(t<20){return(b&c)|((~b)&d);}if(t<40){return b^c^d;}if(t<60){return(b&c)|(b&d)|(c&d);}return b^c^d;}function _k(t){return(t<20)?1518500249:(t<40)?1859775393:(t<60)?-1894007588:-899497514;}function _s(x,y){var l=(x&0xFFFF)+(y&0xFFFF),m=(x>>16)+(y>>16)+(l>>16);return(m<<16)|(l&0xFFFF);}function _r(n,c){return(n<<c)|(n>>>(32-c));}function _c(x,l){x[l>>5]|=0x80<<(24-l%32);x[((l+64>>9)<<4)+15]=l;var w=[80],a=1732584193,b=-271733879,c=-1732584194,d=271733878,e=-1009589776;for(var i=0;i<x.length;i+=16){var o=a,p=b,q=c,r=d,s=e;for(var j=0;j<80;j++){if(j<16){w[j]=x[i+j];}else{w[j]=_r(w[j-3]^w[j-8]^w[j-14]^w[j-16],1);}var t=_s(_s(_r(a,5),_f(j,b,c,d)),_s(_s(e,w[j]),_k(j)));e=d;d=c;c=_r(b,30);b=a;a=t;}a=_s(a,o);b=_s(b,p);c=_s(c,q);d=_s(d,r);e=_s(e,s);}return[a,b,c,d,e];}function _b(s){var b=[],m=(1<<_z)-1;for(var i=0;i<s.length*_z;i+=_z){b[i>>5]|=(s.charCodeAt(i/8)&m)<<(32-_z-i%32);}return b;}function _h(k,d){var b=_b(k);if(b.length>16){b=_c(b,k.length*_z);}var p=[16],o=[16];for(var i=0;i<16;i++){p[i]=b[i]^0x36363636;o[i]=b[i]^0x5C5C5C5C;}var h=_c(p.concat(_b(d)),512+d.length*_z);return _c(o.concat(h),512+160);}function _n(b){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",s='';for(var i=0;i<b.length*4;i+=3){var r=(((b[i>>2]>>8*(3-i%4))&0xFF)<<16)|(((b[i+1>>2]>>8*(3-(i+1)%4))&0xFF)<<8)|((b[i+2>>2]>>8*(3-(i+2)%4))&0xFF);for(var j=0;j<4;j++){if(i*8+j*6>b.length*32){s+=_p;}else{s+=t.charAt((r>>6*(3-j))&0x3F);}}}return s;}function _x(k,d){return _n(_h(k,d));}return _x(k,d);
}

// 创建随机字符串
function randomString(len){
  len = len || 32;
  let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  let maxPos = $chars.length;
  let str = '';
  for (let i = 0; i < len; i++) {
    str += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return str;
}

// 数组按键名排序
function objSortByKey(obj){
  let key = Object.keys(obj).sort();
  let newObj = {};
  for(let i=0; i<key.length; i++){
    newObj[key[i]] = obj[key[i]];
  }
  return newObj;
}

// 对象拼接为URL并URI转码
function objToURI(obj){
  let str = '';
  Object.keys(obj).map(key => {
    if(obj[key] instanceof Object){
      str += `${key}=${encodeURIComponent(JSON.stringify(obj[key]))}&`;
    } else {
      str += `${key}=${encodeURIComponent(obj[key])}&`;
    }
  })
  return str.slice(0, str.length - 1);
}

function showUploadProgress(that){
  that.state.imgTextEditor.currentProgress += that.state.imgTextEditor.step;

  if(that.state.imgTextEditor.currentProgress < 100){
    that.state.imgTextEditor.showUploadProgress(that.state.imgTextEditor.currentProgress);
  }else {
    that.state.imgTextEditor.showUploadProgress(100);
    var timeout = setTimeout(()=>{
      that.state.imgTextEditor.hideUploadProgress();
      clearTimeout(timeout);
    }, 500)
  }
}
