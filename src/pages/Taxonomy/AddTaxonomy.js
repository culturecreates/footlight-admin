import { Layout, Form, Input, Button, message, Select, Divider, Space, Typography } from "antd";
import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import {
 PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  
} from "@ant-design/icons";
import { adminContact, adminOrg, urlValidate } from "../../utils/Utility";
import ServiceApi from "../../services/Service";
import Spinner from "../../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchContact, fetchOrg } from "../../action";
import AddNewContactModal from "../../components/AddNewContactModal";

const { Option, OptGroup } = Select;

const AddTaxonomy = function ({ currentLang,orgDetails,isModal=false,onsuccessAdd }) {
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [contactList, setContactList] = useState([]);
  const [showAddContact,setShowAddContact]= useState(false)


  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const contactStore = useSelector((state) => state.org);

  const handleSubmit = (values) => {
    const postalObj = {
        name: {fr:values.name},
        description: {fr:values.description},
        url: {uri:values.url},
        contactPoint: values.contact ?{
            entityId: values.contact
          }:undefined,
    };
    setLoading(true)
    if (orgDetails)
    ServiceApi.updateOrg(postalObj,orgDetails.uuid)
      .then((response) => {
        if (response && response.data) {
         
            
           
            setLoading(false)  
            message.success("Organization Updated Successfully");
            navigate(`/admin/organization`);
         
        }
      })
      .catch((error) => {
        setLoading(false)
      });
      else
      ServiceApi.addOrg(postalObj)
      .then((response) => {
        if (response && response.data) {
            
            if (isModal) {
              ServiceApi.getAllOrg()
              .then((response) => {
                setLoading(false);
                if (response && response.data && response.data.data) {
                  const events = response.data.data;
                 
            
                  dispatch(fetchOrg(events));
                  onsuccessAdd()
                }
                
              })
              .catch((error) => {
                setLoading(false);
              });
            }
            
            
            else
            navigate(`/admin/organization`);
            setLoading(false) 

            message.success("Organization Created Successfully");
            
            
        }
      })
      .catch((error) => {
        setLoading(false)
      });
  };

  useEffect(() => {
    if (orgDetails) {
        console.log(orgDetails)
      setIsUpdate(true);
      form.setFieldsValue({
        name: orgDetails.name[currentLang],
        description: orgDetails.description && orgDetails.description[currentLang],
        
        url: orgDetails.url?.uri,
        contact: orgDetails.contactPoint?.entityId
        
      });
      
    } 
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

  useEffect(()=>{

    if (contactStore == null) {
      getContacts();
    } else {
      setContactList(contactStore.map(item=>{
        const obj={name:item.name["fr"],
      value:item.uuid}
      return obj;
      }));

    }
  },[contactStore])

  const getContacts = (page = 1) => {
    
    ServiceApi.getAllContacts(page, currentLang === "en" ? "EN" : "FR")
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;
          dispatch(fetchContact(response.data.data));
          
          setContactList(events.map(item=>{
            const obj={name:item.name["fr"],
          value:item.uuid}
          return obj;
          }));
        
        }
        
      })
      .catch((error) => {
        
      });
  };

  return (
    <Layout className="add-event-layout">
      <Form
        form={form}
        layout="vertical"
        className="update-status-form"
        data-testid="status-update-form"
        onFinish={handleSubmit}
      >
        {adminOrg.map((item) => (
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
                item.type === "select"?
                <Select
                style={{ width: 350 }}
                dropdownClassName="contact-select"
                placeholder="Select Contact"
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <Space align="center" style={{ padding: "0 8px 4px" }}>
                      <Typography.Link
                        onClick={() => setShowAddContact(true)}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <PlusOutlined /> Add New Contact
                      </Typography.Link>
                    </Space>
                  </>
                )}
              >
                {contactList.map((item) => (
                  <Option key={item.value} value={item.value}>{item.name}</Option>
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
      {showAddContact &&
      <AddNewContactModal isModalVisible={showAddContact} setIsModalVisible={setShowAddContact}
      type="Contact"/>
}
    </Layout>
  );
};
export default AddTaxonomy;
