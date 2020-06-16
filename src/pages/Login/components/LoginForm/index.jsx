import React from "react";
import { Tabs, Form, Input, Button, Checkbox, Row, Col } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  GithubOutlined,
  WechatOutlined,
  QqOutlined,
} from "@ant-design/icons";

import "./index.less";

const { TabPane } = Tabs;

// 定义表单校验规则
const rules = [
  {
    required: true,
    // message: "请输入数据"
  },
  { max: 15, message: "输入的长度不能超过15位" },
  { min: 4, message: "输入的长度不能小于4位" },
  {
    pattern: /^[a-zA-Z0-9_]+$/,
    message: "输入内容只能包含数字、英文和下划线",
  },
];

export default function LoginForm() {
  // 切换面板
  const handleTabChange = (key) => {
    console.log(key);
  };

  return (
    <div>
      <Form name="basic" initialValues={{ remember: true }}>
        <Tabs onChange={handleTabChange}>
          <TabPane tab="账户密码登录" key="user">
            <Form.Item name="username" rules={rules}>
              <Input prefix={<UserOutlined />} placeholder="用户名: admin" />
            </Form.Item>

            <Form.Item name="password" rules={rules}>
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="密码: 111111"
              />
            </Form.Item>
          </TabPane>
          <TabPane tab="手机号登录" key="phone">
            <Form.Item
              name="phone"
              rules={[
                { required: true, message: "请输入手机号" },
                {
                  pattern: /^(((13[0-9])|(14[579])|(15([0-3]|[5-9]))|(16[6])|(17[0135678])|(18[0-9])|(19[89]))\d{8})$/,
                  message: "请输入正确的手机号",
                },
              ]}
            >
              <Input prefix={<MobileOutlined />} placeholder="手机号" />
            </Form.Item>

            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "请输入验证码",
                },
              ]}
            >
              <div className="login-form-phone">
                <Input placeholder="验证码" />
                <Button>点击发送验证码</Button>
              </div>
            </Form.Item>
          </TabPane>
        </Tabs>

        <Form.Item>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>自动登陆</Checkbox>
          </Form.Item>

          <a className="login-form-forgot" href="">
            忘记密码
          </a>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            登陆
          </Button>
        </Form.Item>
        <Row justify="space-between">
          <Col>
            <Form.Item>
              <div className="login-form-icons">
                <span>其他登录方式</span>
                <GithubOutlined className="icons" />
                <WechatOutlined className="icons" />
                <QqOutlined className="icons" />
              </div>
            </Form.Item>
          </Col>
          <Col>
            <Form.Item>
              <Button type="link">注册</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}
