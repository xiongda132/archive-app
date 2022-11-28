import { memo } from "react";
// import { Form, Input, Button } from "antd";
import { Form, Input, Button } from "antd-mobile";
import styles from "./LoginFormContent.module.css";
import { TeamOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { useHistory, useLocation } from "react-router-dom";
import useAuth from "../../auth/useAuth";
import { StateBtn } from "../../components";
import { setAuthentication } from "../../utils/auth";
const { Item } = Form;
const LoginFormContent = () => {
  let history = useHistory();
  let location = useLocation();
  let auth = useAuth();

  const onFinish = (values) => {
    console.log(values);
    let { from } = location.state || { from: { pathname: "/" } };
    auth.login(values, () => {
      history.replace(from);
    });
    // setAuthentication("1");
    // location.push("/");
  };
  const onFinishFailed = () => {};

  return (
    <div className={styles.container}>
      {/* <Form
        initialValues={{}}
        onFinish={onFinish}
        size="large"
        onFinishFailed={onFinishFailed}
      >
        <Form.Item
          name="userId"
          rules={[{ required: true, message: "用户名称不能为空" }]}
        >
          <Input
            prefix={<UserOutlined className={styles.icon} />}
            placeholder="请输入用户名称"
          />
        </Form.Item>

        <Form.Item
          name="pwd"
          rules={[{ required: true, message: "登录密码不能为空" }]}
        >
          <Input.Password
            prefix={<LockOutlined className={styles.icon} />}
            placeholder="请输入登录密码"
          />
        </Form.Item>

        <Form.Item>
          <Button className={styles.loginBtn} type="primary" htmlType="submit">
            登录
          </Button>
        </Form.Item>
      </Form> */}
      <Form initialValues={{}} onFinish={onFinish}>
        <Item name="userId">
          <Input placeholder="请输入用户名"></Input>
        </Item>
        <Item name="pwd">
          <Input placeholder="请输入密码" type="password"></Input>
        </Item>
        <Item>
          <Button className={styles.loginBtn} color="primary" type="submit">
            登录
          </Button>
        </Item>
      </Form>
    </div>
  );
};

export default memo(LoginFormContent);
