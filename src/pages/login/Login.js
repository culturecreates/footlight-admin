import React ,{useState}from "react";
import "./login.css";
import { useNavigate } from "react-router-dom";
import { Form,  Input, Button, Layout, Row, Col, message,Image } from "antd";
import { adminLogin, storeCookies } from "../../utils/Utility";
import ServiceApi from "../../services/Service";
import Spinner from "../../components/Spinner";

const Login = () => {
  const [loginType, setLoginType] = useState("login") 
  const [loading,setLoading] = useState(false)
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const handleLoginSubmit = (values) => {
    console.log(values)
    setLoading(true)
    if(loginType==="login")
    ServiceApi.loginAuth(values)
    .then((response) => {
      if (response && response.data) {
       
        if(response.data.accessToken)  
        {const token = {
          token:response.data.accessToken,
          user: response.data.user
        };
        storeCookies("user_token", token);
        
        setLoading(false) 
       navigate("/admin/events");}
       else{
        setLoading(false) 
         message.error(response.data.message)
       }
       
      }
    })
    .catch((error) => {
      setLoading(false)
    });

    else if (loginType==="register")
    ServiceApi.addUser(values)
    .then((response) => {
      if (response && response.data) {
       
        setLoading(false)
        message.success("User created successfully")
        setLoginType("login")
      }
    })
    .catch((error) => {
      setLoading(false)
      message.error(error.response?.data?.message)
    });

    else if (loginType==="resetLink")
    ServiceApi.resetLink(values)
    .then((response) => {
      if (response && response.data) {
       
        setLoading(false)
        message.success("Reset link send successfully")
        setLoginType("reset")
      }
    })
    .catch((error) => {
      setLoading(false)
      message.error(error.response?.data?.message)
    });

    else if (loginType==="reset")
   {
     values.confirmPassword = undefined;
     values.oneTimePassword= Number(values.oneTimePassword)
      ServiceApi.reset(values)
    .then((response) => {
      if (response && response.data) {
       
        setLoading(false)
        message.success("Reset password successfully")
        setLoginType("login")
      }
    })
    .catch((error) => {
      setLoading(false)
      message.error(error.response?.data?.message)
    });}
   
  };

  const createSignup=()=>{
    setLoginType(loginType==="login"?"register":loginType==="resetLink"?"reset":"login")
  }
  return (
    <Layout className="login-root">
      <Row className="login-input-row">
        <Col>
     
      </Col>
      <Col className="login-input-col">
      <Layout className="login-input-root">
        <div className="footlight-logo">
      <Image
        className="logo-image"
    width={50}
    preview={false}
    src="/favicon.svg"
  />
  <div className="footlight-text-logo">FOOTLIGHT</div>
  </div>
        <div className="login-div">
          <div className="login-center-text text-center">
          { loginType==="login"?"Login":loginType==="register"?"Register":
               loginType==="reset"?"Check Your Email":"Reset Password"}
          </div>
          
          <Form onFinish={handleLoginSubmit} className="login-form"  form={form}>
            {adminLogin.filter(item=>item.type===loginType).map(item=>
            <div key={item.name}>
            <div className="login-label">{item.title}</div>
            <Form.Item
              name={item.name}
              rules={[
                { required: true, message: "Please input your"+item.name },
                {
                  message: 'Password should be same as new password',
                  validator: (_, value) => {
                      if(item.name === "confirmPassword")
                    {if (form.getFieldsValue().newPassword===value) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject('Password should be same as new password');
                    }}
                    else
                    return Promise.resolve();
                  }
                }
            
              ]}
            >
              <Input className="login-input" placeholder={" "} type={item.inputtype} />
            </Form.Item>
            </div>
           )}
            <Form.Item className="form-item-button">
              <Button type="primary" htmlType="submit" className="button-login">
               { loginType==="login"?"Login":loginType==="register"?"Sign Up":
               loginType==="reset"?"Reset Password":"Send Password Reset Link"}
              </Button>
            </Form.Item>
          </Form>
          <div className="forgot-create-div">
            <div onClick={()=>setLoginType(loginType==="resetLink"?"login":"resetLink")} style={{cursor:"pointer"}}>
            {loginType==="resetLink"?"Back to login":
            loginType==="reset"?"Send new reset code":
            "Forgot password"}
              
              </div>
            <div onClick={()=>createSignup()} style={{cursor:"pointer"}}>
              {loginType==="login"?"Create account":loginType==="resetLink"?"I already have reset code":"Back to login"}
              </div>
            </div>
        </div>
      </Layout>
      </Col>
      </Row>
      {loading && <Spinner />}
    </Layout>
  );
};

export default Login;
