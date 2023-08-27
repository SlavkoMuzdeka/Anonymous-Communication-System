import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import styled from "styled-components";
import { useSelector } from "react-redux";
import {
  LockOutlined,
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import image from "../../assets/abstract-digital-grid-black-background.jpg";
import icon from "../../assets/icons8-group-100.png";
import { useDispatch } from "react-redux";
import { login } from "../../redux/slices/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { getLoggedUsers } from "../../redux/slices/messagingSystemSlice";

const LoginPage = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(${image});
  background-size: cover;
  flex-direction: column;
`;

const Image = styled.img`
  margin-bottom: 20px;
`;

const StyledInput = styled(Input)`
  padding: 10px 25px;
  font-size: 16px;
  border-radius: 20px;
`;

const Title = styled.h3`
  color: white;
`;

function Login() {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  const showInvalidCredentials = () => {
    messageApi.open({
      type: "error",
      content: "Incorrect username and/or password!",
    });
  };

  const showErrMess = () => {
    messageApi.open({
      type: "error",
      content: "Please enter your username and password!",
    });
  };

  const handleClick = () => {
    form
      .validateFields()
      .then((values) => {
        dispatch(login(values))
          .then(unwrapResult)
          .then(() => {
            dispatch(getLoggedUsers());
          })
          .catch(() => {
            showInvalidCredentials();
          });
      })
      .catch(() => {
        showErrMess();
      });
  };

  const handleTogglePassword = () => setShowPassword(!showPassword);

  return (
    <LoginPage>
      {contextHolder}
      <Image src={icon} />
      <Title>Login to the Messaging System</Title>
      <Form className="login-form" form={form} autoComplete="off">
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
        >
          <StyledInput
            placeholder="Username"
            prefix={<UserOutlined />}
            autoFocus
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please input your Password!" }]}
        >
          <StyledInput
            placeholder="Password"
            prefix={<LockOutlined />}
            type={showPassword ? "text" : "password"}
            suffix={
              showPassword ? (
                <EyeTwoTone
                  onClick={handleTogglePassword}
                  style={{ cursor: "pointer", color: "#bfbfbf" }}
                />
              ) : (
                <EyeInvisibleOutlined
                  onClick={handleTogglePassword}
                  style={{ cursor: "pointer", color: "#bfbfbf" }}
                />
              )
            }
          />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            style={{ width: "100%" }}
            onClick={handleClick}
            loading={loading}
          >
            Log in
          </Button>
        </Form.Item>
      </Form>
    </LoginPage>
  );
}
export default Login;
