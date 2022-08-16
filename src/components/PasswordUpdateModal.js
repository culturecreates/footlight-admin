import { Form, Button, Input, message, Modal } from "antd";
import {  useState } from "react";
import {
   
  CheckOutlined,
  CloseOutlined,
  
} from "@ant-design/icons";
import ServiceApi from "../services/Service";
import {  updatePasswordAdmin } from "../utils/Utility";
import Spinner from "./Spinner";

const PasswordUpdateModal = ({
  isModalVisible,
  setIsModalVisible,
  currentLang,
  
}) => {
 
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const handleOk = () => {
    

    setIsModalVisible(false);
  };
 
 

  const handleCancel = () => {
    setIsModalVisible(false);
  };
 
  const handleLoginSubmit = (values) => {
    
    setLoading(true)
    values.confirmPassword = undefined;
    ServiceApi.updatePassword(values)
    .then((response) => {
      if (response && response.data) {
       
        
        setLoading(false) 
       
         message.success(response.data.message)
         setIsModalVisible(false);
       
      }
    })
    .catch((error) => {
      setLoading(false)
      message.error(error.response?.data?.message)
    });
  }
  
  return (
    <Modal
      title= {`Change Password`}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      className="copy-modal update-password-modal"
      okText="Done"
      footer={false}
    >
       <Form onFinish={handleLoginSubmit} className="login-form"
       form={form}>
            {updatePasswordAdmin.map(item=>
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
              validateTrigger="onBlur"
            >
              <Input className="login-input" placeholder={" "} type={item.inputtype} />
            </Form.Item>
            </div>
           )}

<Form.Item className="submit-items">
          <Button
            size="large"
            icon={<CloseOutlined />}
            onClick={() => {
                setIsModalVisible(false);
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            icon={<CheckOutlined />}
          >
            { "Update Password" }
          </Button>
        </Form.Item>
      </Form>
      {loading && <Spinner />}
    </Modal>
  );
};
export default PasswordUpdateModal;
