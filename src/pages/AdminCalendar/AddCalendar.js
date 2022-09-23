import { Layout, Form, Input, Button, message, Select } from "antd";
import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
 
  CheckOutlined,
  CloseOutlined,
  
} from "@ant-design/icons";
import {  adminCalendar, urlValidate } from "../../utils/Utility";
import ServiceApi from "../../services/Service";
import Spinner from "../../components/Spinner";

const { Option } = Select;
const conceptArray=[
  {
    name:"English",
    uri:"ENGLISH"
  },
  {
    name:"French",
    uri:"FRENCH"
  },
  {
    name:"Bilingual",
    uri:"BILINGUAL"
  }
]
const AddCalendar = function ({ currentLang,contentLang, orgDetails,isModal=false,onsuccessAdd,onsuccessAddById }) {
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  


  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();



  const handleSubmit = (values) => {
    const postalObj = {
        name: {[contentLang]:values.name},
        contentLanguages: values.interfaceLanguage,
        contact: values.contact
        
    };
    setLoading(true)
    if (orgDetails)
    ServiceApi.updateCalendar(postalObj,orgDetails.uuid)
      .then((response) => {
        if (response && response.data) {
         
            
           
            setLoading(false)  
            message.success("Calendar Updated Successfully");
            navigate(`/admin/calendars`);
         
        }
      })
      .catch((error) => {
        setLoading(false)
      });
      else
      ServiceApi.addCalendar(postalObj)
      .then((response) => {
        if (response && response.data) {
          
      
            navigate(`/admin/calendars`);
            setLoading(false) 

            message.success("Calendar Created Successfully");
            
            
        }
      })
      .catch((error) => {
        setLoading(false)
      });
  };

  useEffect(() => {
    if (orgDetails) {
        
      setIsUpdate(true);
      form.setFieldsValue({
        name: orgDetails.name[contentLang],
        interfaceLanguage: orgDetails.contentLanguages,
        contact:orgDetails.contact
  
        
      });
      
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgDetails]);

  function handleEnter(event) {
    if (event.keyCode === 13) {
      event.preventDefault()
      const inputs =
          Array.prototype.slice.call(document.querySelectorAll("input"))
      const index =
          (inputs.indexOf(document.activeElement) + 1) % inputs.length
      const input = inputs[index]
      input.focus()
      input.select()
  }
  }

 

 

  return (
    <Layout className="add-event-layout">
      <Form
        form={form}
        layout="vertical"
        className="update-status-form"
        data-testid="status-update-form"
        onFinish={handleSubmit}
      >
        {adminCalendar.map((item) => (
          <>
            <div className="update-select-title">{t(item.title,{ lng: currentLang })}</div>
            <Form.Item
              name={item.name}
              className="status-comment-item"
              rules={[
                {
                  required: item.required,
                  whitespace: true,
                },
                
              ]}
            >
              { 
                item.type === "select"?
                <Select
                style={{ width: 350 }}
                dropdownClassName="contact-select"
                placeholder="Select Language"
              
              >
                {conceptArray.map((item) => (
                  <Option key={item.uri} value={item.uri} title={item.name}>
                     {  t(item.name, { lng: currentLang })}{}</Option>
                ))}
              </Select>
                :
                <Input
                  placeholder={item.placeHolder}
                  className="replace-input"
                  onKeyDown={handleEnter}
                />
              }
            </Form.Item>
          </>
        ))}

        <Form.Item className="submit-items">
          <Button
            size="large"
            icon={<CloseOutlined />}
            onClick={() => {
              if(isModal)
               onsuccessAdd()
              else if (isUpdate) navigate(`/admin/calendars`);
              else {
                form.resetFields();
                
              }
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
  );
};
export default AddCalendar;
