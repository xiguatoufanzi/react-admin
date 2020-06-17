import React, { useState, useEffect } from "react";
import { Tabs, Form, Input, Button, Checkbox, Row, Col } from "antd";
import {
  UserOutlined,
  LockOutlined,
  MobileOutlined,
  GithubOutlined,
  WechatOutlined,
  QqOutlined,
} from "@ant-design/icons";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { login, mobileLogin } from "@redux/actions/login";
import { reqSendCode } from "@api/acl/oauth";

import "./index.less";

const { TabPane } = Tabs;

// 定义表单校验规则
const rules = [
  {
    required: true,
    // message: "请输入数据",
  },
  { max: 15, message: "输入的长度不能超过15位" },
  { min: 4, message: "输入的长度不能小于4位" },
  {
    pattern: /^[a-zA-Z0-9_]+$/,
    message: "输入内容只能包含数字、英文和下划线",
  },
];

const TOTAL_TIME = 60;
// 倒计时
let countingDownTime = TOTAL_TIME;
let timer = null;
function LoginForm({ login, history, mobileLogin }) {
  // Form表单提供form对象，对表单进行更加细致的操作
  const [form] = Form.useForm();

  const [activeKey, setActiveKey] = useState("user");
  // 是否已经发送验证码
  const [isSendCode, setIsSendCode] = useState(false);
  // 只需要更新组件的方法，不需要数据
  const [, setCountingDownTime] = useState(0);

  // 切换面板
  const handleTabChange = (key) => {
    setActiveKey(key);
  };

  // 定义公共校验规则
  const validateMessages = {
    required: "请输入${name}!",
    // types: {
    //   username: "${name} is not validate email!",
    //   password: "${name} is not a validate number!",
    // },
    // number: {
    //   range: '${label} must be between ${min} and ${max}',
    // },
  };

  const finish = async (values) => {
    if (activeKey === "user") {
      form
        .validateFields(["username", "password", "remember"])
        .then(async (values) => {
          const { username, password, remember } = values;
          const token = await login(username, password);
          if (remember) {
            localStorage.setItem("user_token", token);
          }
          // 跳转到主页
          history.replace("/");
        });
      return;
    }
    form.validateFields(["mobile", "code", "remember"]).then(async (values) => {
      const { mobile, code, remember } = values;
      const token = await mobileLogin(mobile, code);
      if (remember) {
        localStorage.setItem("user_token", token);
      }
      // 跳转到主页
      history.replace("/");
    });
  };

  // 更新倒计时
  const countingDown = () => {
    timer = setInterval(() => {
      countingDownTime--;
      if (countingDownTime <= 0) {
        clearInterval(timer);
        countingDownTime = TOTAL_TIME;
        setIsSendCode(false);
        return;
      }
      setCountingDownTime(countingDownTime);
      console.log(111);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      clearInterval(timer);
    };
  }, []);

  // 发送验证码
  const sendCode = () => {
    form.validateFields(["mobile"]).then(async ({ mobile }) => {
      // 发送请求，获取验证码~
      await reqSendCode(mobile);
      // 发送成功~
      setIsSendCode(true); // 代表已经发送过验证码
      countingDown();
    });
  };

  return (
    <div>
      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        validateMessages={validateMessages}
      >
        <Tabs onChange={handleTabChange} activeKey={activeKey}>
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
          <TabPane tab="手机号登录" key="mobile">
            <Form.Item
              name="mobile"
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
              name="code"
              rules={[
                {
                  required: true,
                  message: "请输入验证码",
                },
              ]}
            >
              <div className="login-form-phone">
                <Input placeholder="验证码" />
                <Button onClick={sendCode} disabled={isSendCode}>
                  {isSendCode
                    ? `${countingDownTime}秒后可重发`
                    : "点击发送验证码"}
                </Button>
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
          <Button type="primary" className="login-form-button" onClick={finish}>
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

export default withRouter(connect(null, { login, mobileLogin })(LoginForm));
