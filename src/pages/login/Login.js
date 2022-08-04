import React from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { Form,  Input, Button, Layout, Row, Col } from "antd";

const Login = () => {
  const navigate = useNavigate();
  const handleLoginSubmit = () => {
    navigate("/admin/events");
  };
  return (
    <Layout className="login-root">
      <Row className="login-input-row">
        <Col>
     
      </Col>
      <Col className="login-input-col">
      <Layout className="login-input-root">
        <div className="login-div">
          <div className="login-center-text text-center">
          Welcome to the Footlight calendar
          </div>
          
          <Form onFinish={handleLoginSubmit} className="login-form">
            <div className="login-label">Username</div>
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Please input your username!" },
              ]}
            >
              <Input className="login-input" placeholder="Enter username" />
            </Form.Item>
            <div className="login-label">Password</div>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input
                className="login-input"
                type="password"
                placeholder="Password"
              />
            </Form.Item>
            <Form.Item className="form-item-button">
              <Button type="primary" htmlType="submit" className="button-login">
                Sign in
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Layout>
      </Col>
      </Row>
    </Layout>
  );
};

export default Login;
