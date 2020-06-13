import React, { Component } from "react";
import {
  Button,
  // as 重命名
  Upload as AntdUpload,
  message,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import * as qiniu from "qiniu-js";
import { nanoid } from "nanoid"; // 用来生成唯一id

import { reqGetUploadToken } from "@api/edu/upload";

import qiniuConfig from "@conf/qiniu";

const MAX_VIDEO_SIZE = 35 * 1024 * 1024; // 35mb
export default class Upload extends Component {
  // 从本地读取UploadToken
  getUploadToken = () => {
    try {
      const { uploadToken, expires } = JSON.parse(
        localStorage.getItem("upload_token")
      );
      // 判断本地token是否过期
      if (!this.isValidUploadToken(expires)) {
        throw new Error("uploadToken过期了~");
      }

      return {
        uploadToken,
        expires,
      };
    } catch {
      return {
        uploadToken: "",
        expires: 0,
      };
    }
  };

  state = {
    ...this.getUploadToken(),
    isUploadSuccess: false,
  };

  // 获取并保存Token
  fetchUploadToken = async () => {
    const { uploadToken, expires } = await reqGetUploadToken();
    this.saveUploadToken(uploadToken, expires);
  };

  // 保存UploadToken
  saveUploadToken = (uploadToken, expires) => {
    const data = {
      uploadToken,
      expires: Date.now() + expires * 1000 - 5 * 60 * 1000,
    };
    this.setState(data);
    // 持久化储存
    localStorage.setItem("upload_token", JSON.stringify(data));
  };

  // 判断UploadToken是否有效
  isValidUploadToken = (expires) => {
    return expires > Date.now();
  };

  // 上传之前触发的回调
  beforeUpload = (file, fileList) => {
    return new Promise(async (resolve, reject) => {
      if (file.size > MAX_VIDEO_SIZE) {
        message.warn("上传视频不能超过35mb");
        return reject();
      }

      const { expires } = this.state;
      if (!this.isValidUploadToken(expires)) {
        // 过期了，重新请求
        await this.fetchUploadToken();
      }

      resolve(file);
    });
  };

  // 自定义上传视频方案
  customRequest = ({ file, onProgress, onSuccess, onError }) => {
    const { uploadToken } = this.state;
    const key = nanoid(10);

    const putExtra = {
      fname: "", // 文件原名称
      // params: {}, // 用来放置自定义变量
      mimeType: ["video/mp4"], // 用来限定上传文件类型
    };

    const config = {
      region: qiniuConfig.region,
    };

    // 创建上传文件对象
    const observable = qiniu.upload(
      file, // 上传的文件
      key, // 上传的文件新命名（保证唯一性）
      uploadToken, // 上传凭证
      putExtra,
      config
    );
    const observer = {
      //上传过程中触发的回调函数
      next(res) {
        const percent = res.total.percent.toFixed(2);
        onProgress({ percent }, file);
      },
      // 上传失败触发的回调函数
      error(err) {
        onError(err);
        message.error("上传视频失败~");
      },
      // 上传成功（全部数据上传完毕）触发的回调函数
      complete: (res) => {
        onSuccess(res);
        message.success("上传视频成功~");

        const video = qiniuConfig.prefix_url + res.key;
        this.props.onChange(video);
        // 隐藏按钮
        this.setState({
          isUploadSuccess: true,
        });
      },
    };
    this.subscription = observable.subscribe(observer); // 上传开始
  };

  componentWillUnmount() {
    // 上传取消
    this.subscription && this.subscription.unsubscribe();
  }

  remove = () => {
    this.subscription && this.subscription.unsubscribe();
    this.props.onChange("");
    // 显示按钮
    this.setState({
      isUploadSuccess: false,
    });
  };

  render() {
    const { isUploadSuccess } = this.state;
    return (
      <AntdUpload
        listType="picture"
        accept="video/mp4"
        beforeUpload={this.beforeUpload}
        customRequest={this.customRequest}
        onRemove={this.remove}
      >
        {isUploadSuccess ? null : (
          <Button>
            <UploadOutlined /> 上传视频
          </Button>
        )}
      </AntdUpload>
    );
  }
}
