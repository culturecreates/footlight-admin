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
        
        contentLanguage: values.contentLanguage,
        contact: values.contact,
        namespace: values.namespace
        
    };
    if(contentLang == "bilengual")
    {
      postalObj.name = {fr:values.name, en: values.nameEn};
    }
    else{
      if(orgDetails)
      postalObj.name = {[contentLang]:values.name,
        [contentLang=="fr"?"en":"fr"]: orgDetails?.name[[contentLang=="fr"?"en":"fr"]]};
        else
     postalObj.name = {[contentLang]:values.name};
    }
    setLoading(true)
    if (orgDetails)
    ServiceApi.updateCalendar(postalObj,orgDetails.id)
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
        contentLanguage: orgDetails.contentLanguage,
        contact:orgDetails.contact,
        namespace: orgDetails.namespace
        
      });
      
      if(contentLang == "bilengual")
      {
        form.setFieldsValue({
          name: orgDetails.name?.fr,
          nameEn: orgDetails.name?.en,
        
        })
      }
      else{

        form.setFieldsValue({
          name: orgDetails.name[contentLang],
        })
      }
      
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
        {adminCalendar.filter(item=>contentLang != "bilengual" ? item.isMulti==false :item.name !== "mmm").map((item) => (
          <>
            <div className="update-select-title">{t(item.title,{ lng: currentLang })} {((item.name == "name" || item.title == "Description" ) && contentLang == "bilengual") && "@fr" }
            {((item.name == "nameEn" ) && contentLang == "bilengual") && "@en" }</div>
            <Form.Item
              name={item.name}
              className="status-comment-item"
              rules={[
                {
                  required:contentLang == "bilengual"?(item.name=="name"?(form.getFieldsValue()?.nameEn?.length>0)?false:
                  item.name=="nameEn"?(form.getFieldsValue()?.name?.length>0)?false: item.required :item.required:item.required):
                  item.required,
                  whitespace: true,
                },
                item.name==="namespace" &&
                {
                  
                  message: 'Enter valid url.',
                  validator: (_, value) => {

                    if (urlValidate(value)) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject('Enter valid url.');
                    }
                  }
                }
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
                  <Option key={item.uri} value={item.uri}>
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
