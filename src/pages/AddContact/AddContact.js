import { Layout, Form, Input, Button, message } from "antd";
import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
 
  CheckOutlined,
  CloseOutlined,
  
} from "@ant-design/icons";
import { adminContact, urlValidate } from "../../utils/Utility";
import ServiceApi from "../../services/Service";
import Spinner from "../../components/Spinner";
import { useDispatch } from "react-redux";
import { fetchContact } from "../../action";

const AddContact = function ({ currentLang,contentLang,contactDetails,isModal=false,onsuccessAdd,onsuccessAddById }) {
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();



  const handleSubmit = (values) => {
    const postalObj = {
        
        email:values.email,
       
        telephone:values.telephone,
        url: {uri:values.url},
    };
    if(contentLang == "bilengual")
    {
      postalObj.name = {fr:values.name, en: values.nameEn};
      postalObj.description= {fr:values.description ,en:values.descriptionEn}
    }
    else{
     postalObj.name = {[contentLang]:values.name};
     postalObj.description= {[contentLang]:values.description}
    }
    setLoading(true)
    if (contactDetails)
    ServiceApi.updateContact(postalObj,contactDetails.uuid)
      .then((response) => {
        if (response && response.data) {
         
            
           
            setLoading(false)  
            message.success("Contact Updated Successfully");
            navigate(`/admin/contacts`);
         
        }
      })
      .catch((error) => {
        setLoading(false)
      });
      else
      ServiceApi.addContact(postalObj)
      .then((response) => {
        if (response && response.data) {
            setLoading(false) 
            const getId=response.data?.id
            if (isModal) {
              ServiceApi.getAllContacts()
              .then((response) => {
                setLoading(false);
                if (response && response.data && response.data.data) {
                  const events = response.data.data;
                 
                  dispatch(fetchContact(events));
                  onsuccessAddById(getId)
                
                }
               
              })
              .catch((error) => {
                setLoading(false);
              });
            }
            
            
            else
            navigate(`/admin/contacts`);
            message.success("Contact Created Successfully");
           
        }
      })
      .catch((error) => {
        setLoading(false)
      });
  };

  useEffect(() => {
    if (contactDetails) {
      setIsUpdate(true);
      form.setFieldsValue({
        name: contactDetails.name[contentLang],
        email:contactDetails.email,
        description: contactDetails.description && contactDetails.description[contentLang],
        telephone:contactDetails.telephone,
        url: contactDetails.url?.uri,
       
        
      });
      if(contentLang == "bilengual")
      {
        form.setFieldsValue({
          name: contactDetails.name?.fr,
          nameEn: contactDetails.name?.en,
          description: contactDetails.description && contactDetails.description?.fr,
          descriptionEn: contactDetails.description && contactDetails.description?.en,
        })
      }
      else{
        form.setFieldsValue({
          name: contactDetails.name[contentLang],
          description: contactDetails.description && contactDetails.description[contentLang],
        })
      }
      
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactDetails]);

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
        {adminContact.filter(item=>contentLang != "bilengual" ? item.isMulti==false :item.name !== "mmm").map((item) => (
          <>
            <div className="update-select-title">{t(item.title,{ lng: currentLang })} {((item.title == "Name" || item.title == "Description" ) && contentLang == "bilengual") && "@fr" }
           </div>
            <Form.Item
              name={item.name}
              className="status-comment-item"
              rules={[
                {
                  required: item.required,
                  whitespace: true,
                },
                item.name==="url" &&
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
              { item.type === "area"?
                <Input.TextArea
                  placeholder={item.placeHolder}
                  className="replace-input"
                  rows={4}
                />
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
             else if (isUpdate) navigate(`/admin/contacts`);
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
export default AddContact;
