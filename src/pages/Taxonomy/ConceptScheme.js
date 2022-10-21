import { Layout, Form, Input, Button, message, Modal, Tree, Checkbox } from "antd";
import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  
} from "@ant-design/icons";
import Spinner from '../../components/Spinner';
import "./Taxonomy.css"


function ConceptScheme({ isModalVisible,
  setIsModalVisible,
  currentLang,
  contentLang,
  closeWithName}) {

    const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
 
  const [formValue, setFormVaue] = useState();
  

  const { t } = useTranslation();
  const [form] = Form.useForm();
 

  useEffect(()=>{
   

  },[])
  
  
  const handleSubmit = (values) => {
    console.log(values)
    closeWithName(values.name)
    setIsModalVisible(false);
  }

  const handleOk = () => {
    

    setIsModalVisible(false);
  };
 
 

  const handleCancel = () => {
    setIsModalVisible(false);
  };

    return(
        
      <Modal
      title= {`Add Concept`}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      className="copy-modal"
      okText="Done"
      footer={false}
    >
             <Layout className="add-event-layout">
      <Form
        form={form}
        layout="vertical"
        className="update-status-form"
        data-testid="status-update-form"
        onFinish={handleSubmit}
        onFieldsChange={() => {
          setFormVaue(form.getFieldsValue());
        }}
      >
        <div>
            <div>
         <div className="update-select-title">{t("Name")} {contentLang == "bilengual" && "@fr"}</div>
            <Form.Item
              name="name"
              className="status-comment-item"
              rules={[
                {
                  required:contentLang == "bilengual"? formValue?.nameEn?.length>0?false:true :true,
                  message: "Taxonomy name required",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Enter Taxonomy Name" className="replace-input" />
            </Form.Item>
            </div>
            {/* {
              contentLang == "bilengual" &&
              <>
              <div className="update-select-title">{t("Name")} @en</div>
            <Form.Item
              name="nameEn"
              className="status-comment-item"
              rules={[
                {
                  required: formValue?.name?.length>0?false:true,
                  message: "Taxonomy name required",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Enter Taxonomy Name" className="replace-input" />
            </Form.Item>
            </>
            } */}
            </div>

           
             <Form.Item className="submit-items">
          <Button
            size="large"
            icon={<CloseOutlined />}
            onClick={() => {
             
                form.resetFields();
                
              
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
            {isUpdate ? "Update" : "Save"}
          </Button>
        </Form.Item>
      </Form>
      {loading && <Spinner />}
   
    </Layout>
 
    </Modal>
    )
}
export default ConceptScheme;