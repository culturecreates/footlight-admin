import { Layout, Form, Input, Button, message, Select, TreeSelect,  } from "antd";
import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
 
  CheckOutlined,
  CloseOutlined,
  
} from "@ant-design/icons";
import {  adminTaxonomy, getCookies, urlValidate } from "../../utils/Utility";
import ServiceApi from "../../services/Service";
import Spinner from "../../components/Spinner";
import AddNewContactModal from "../../components/AddNewContactModal";

const { Option } = Select;

const AddTaxonomy = function ({ currentLang,contentLang,orgDetails,isModal=false,onsuccessAdd,audienceList,typeList }) {
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [treeList, setTreeList] = useState([]);
  const [showAddContact,setShowAddContact]= useState(false)
  const [formValue, setFormVaue] = useState();


  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();

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



  const handleSubmit = (values) => {
    const postalObj = {
        name: {[contentLang]:values.name},
        
        identifier: {uri:values.url},
        broader: {uri:values.broader},
        conceptScheme: {uri:values.conceptScheme},
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
    ServiceApi.updateTaxonomy(postalObj,orgDetails.uuid)
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
        if(orgDetails.conceptScheme?.uri === getCookies("concept_scheme")?.AUDIENCE)
        setTreeList(audienceList)
        else
        setTreeList(typeList)
      setIsUpdate(true);
      form.setFieldsValue({
        name: orgDetails.name[contentLang],
        
        url: orgDetails.identifier.uri,
        broader: orgDetails.broader?.uri,
        conceptScheme: orgDetails.conceptScheme.uri,
        
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
        onFieldsChange={() => {
          setFormVaue(form.getFieldsValue());
        }}
      >
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
            {
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
            }
        {adminTaxonomy.filter(item=>contentLang != "bilengual" ? item.isMulti==false :item.name !== "mmm").map((item) => (
          <>
            <div className="update-select-title">{t(item.title,{ lng: currentLang })}
            {((item.title == "Name" ) && contentLang == "bilengual") && "@fr" }</div>
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
              else if (isUpdate) navigate(`/admin/taxonomy`);
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
