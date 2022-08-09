import { Layout, Form, Input, Button, message, Select, TreeSelect, Space, Typography } from "antd";
import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import {
 PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  
} from "@ant-design/icons";
import {  adminTaxonomy, getCookies, urlValidate } from "../../utils/Utility";
import ServiceApi from "../../services/Service";
import Spinner from "../../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchContact, fetchOrg } from "../../action";
import AddNewContactModal from "../../components/AddNewContactModal";

const { Option, OptGroup } = Select;

const AddTaxonomy = function ({ currentLang,orgDetails,isModal=false,onsuccessAdd,audienceList,typeList }) {
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [treeList, setTreeList] = useState([]);
  const [showAddContact,setShowAddContact]= useState(false)


  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const conceptArray=[
    {
      name:"audience",
      uri:getCookies("concept_scheme")?.AUDIENCE
    },
    {
      name:"Event Type",
      uri:getCookies("concept_scheme")?.EVENT_ADDITIONAL_TYPES
    }
  ]


  const contactStore = useSelector((state) => state.org);

  const handleSubmit = (values) => {
    const postalObj = {
        name: {fr:values.name},
        
        identifier: {uri:values.url},
        broader: {uri:values.broader},
        conceptScheme: {uri:values.conceptScheme},
    };
    setLoading(true)
    if (orgDetails)
    ServiceApi.addTaxonomy(postalObj,orgDetails.uuid)
      .then((response) => {
        if (response && response.data) {
         
            
           
          navigate(`/admin/taxonomy`);
          setLoading(false) 

          message.success("Taxonomy Created Successfully");
         
        }
      })
      .catch((error) => {
        setLoading(false)
      });
      else
      ServiceApi.addTaxonomy(postalObj)
      .then((response) => {
        if (response && response.data) {
            
           
            
            
           
            navigate(`/admin/taxonomy`);
            setLoading(false) 

            message.success("Taxonomy Created Successfully");
            
            
        }
      })
      .catch((error) => {
        setLoading(false)
      });
  };

  const handleChange = (value,option) => {
    console.log(value,option)
    if(option.title ==="audience")
    {
      setTreeList(audienceList)
    }
    else
     setTreeList(typeList)
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

 

  
  return (
    <Layout className="add-event-layout">
      <Form
        form={form}
        layout="vertical"
        className="update-status-form"
        data-testid="status-update-form"
        onFinish={handleSubmit}
      >
        {adminTaxonomy.map((item) => (
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
              { item.type === "Treeselect"?
                 <TreeSelect
                 style={{ width: '100%' }}
                //  value={value}

                 dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                 treeData={treeList}
                
                 placeholder="Please select"
                //  treeDefaultExpandAll
               
               />
                :
                item.type === "select"?
                <Select
                style={{ width: '100%' }}
                dropdownClassName="contact-select"
                placeholder="Select Concept"
                onChange={handleChange}
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
