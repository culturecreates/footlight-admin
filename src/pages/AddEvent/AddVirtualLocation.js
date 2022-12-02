import { Layout, Form, Input, Button, message, Select, Divider, Space, Typography, TreeSelect } from "antd";
import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
 PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  
} from "@ant-design/icons";
import ServiceApi from "../../services/Service";
import Spinner from "../../components/Spinner";
import { urlValidate } from "../../utils/Utility";


const { Option } = Select;

const AddVirtualLocation = function ({ currentLang,contentLang,orgDetails,isModal=false,onsuccessAdd,onsuccessAddById }) {
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [contactList, setContactList] = useState([]);
  const [showAddContact,setShowAddContact]= useState(false)
  const [formValue, setFormVaue] = useState();
  const [typeList, setTypeList] = useState([]);
  const [dynamicList, setDynamicList] = useState([]);

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  

  const formatarray = (data) => {
    
    return data.map((item) => {
      const obj = {
        value: item.id,
        title: item.name[currentLang]?item.name[currentLang]:
        currentLang==="fr"?item.name["en"]:item.name["fr"],
        children: item.children ? formatarrayTree(item.children) : undefined,
      };
      return obj;
    });
  };
  const formatarrayTree = (data) => {
    return data.map((item) => {
      const obj = {
        value: item.id,
        title: item.name[currentLang]?item.name[currentLang]:
        currentLang==="fr"?item.name["en"]:item.name["fr"],
        children: item.children ? formatarrayTree(item.children) : undefined,
      };
      return obj;
    });
  };

  const handleSubmit = (values) => {
    const dynamicField =  dynamicList.map(item=>{
      const obj ={
        conceptIds: values[item?.id],
        taxonomyId: item.id,
       
      }
      return obj;
    })
    const postalObj = {
        
        url: {uri:values.url},
        // contactPoint: values.contact ?{
        //     entityId: values.contact
        //   }:undefined,
        
        dynamicFields:dynamicField,
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
    
      ServiceApi.addVirtualLocation(postalObj)
      .then((response) => {
        if (response && response.data) {
          const getId=response.data?.id
            
            
            
           
            setLoading(false) 

            message.success("Virtual Location Created Successfully");
            onsuccessAddById()
            
            
        }
      })
      .catch((error) => {
        setLoading(false)
      });
  };

  

 



  useEffect(()=>{

    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

 
  useEffect(()=>{
   
    getPublics();
  },[])

  const getPublics = () => {
    
    ServiceApi.getFieldConcepts("VIRTUAL_LOCATION")
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;
          setDynamicList(events.filter(item=>(item?.isDynamicField)))
         
          setTypeList(formatarray(events.filter(item => !(item.isDynamicField)).find(item => item.mappedToField === "Type")?.concept?
          events.filter(item => !(item.isDynamicField)).find(item => item.mappedToField === "Type")?.concept:[]));
          
          // dispatch(fetchAudience(response.data.data));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
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
                  message: "Org name required",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Enter Org Name" className="replace-input" />
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
                  message: "Org name required",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Enter org Name" className="replace-input" />
            </Form.Item>
            </>
            }

<div className="update-select-title">{t("Description")} {contentLang == "bilengual" && "@fr"}</div>
            <Form.Item
              name="description"
              className="status-comment-item"
              rules={[
                {
                  required:false,
                  message: "description required",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Enter description" className="replace-input" />
            </Form.Item>
            {
              contentLang == "bilengual" &&
              <>
              <div className="update-select-title">{t("Description")} @en</div>
            <Form.Item
              name="descriptionEn"
              className="status-comment-item"
              rules={[
                {
                  required: false,
                  message: "description required",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Enter description" className="replace-input" />
            </Form.Item>
            </>
            }
<div className="update-select-title">{t("Url")} </div>
            <Form.Item
              name="url"
              className="status-comment-item"
              rules={[
                {
                  required: true,
                  whitespace: true,
                
                  
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
              <Input placeholder="Enter org Name" className="replace-input" />
            </Form.Item>
 <div className="update-select-title">
              {t("Type", { lng: currentLang })}
            </div>
            <Form.Item name={"type"} rules={[{ required: false }]}>
              <TreeSelect
              showSearch
                style={{ width: "100%" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                treeData={typeList}
                multiple
                placeholder="Please select"
                treeNodeFilterProp="label"
                filterTreeNode={(search, item) => {
                  return item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                }}
              />
            </Form.Item>

{    dynamicList.length>0 &&
  dynamicList.map(item=>
    <div key={item.id}>
            <div className="update-select-title">
              {t(item?.name?.fr, { lng: currentLang })}
            </div>

            <Form.Item name={item.id} rules={[{ required: false }]}>
            <TreeSelect
                style={{ width: "100%" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                treeData={formatarray(item.concept)}
                multiple
                placeholder="Please select"
                showSearch
              treeNodeFilterProp="label"
              filterTreeNode={(search, item) => {
                return item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
              }}
              />
            </Form.Item>
            </div>
)}
        <Form.Item className="submit-items">
          <Button
            size="large"
            icon={<CloseOutlined />}
            onClick={() => {
              if(isModal)
               onsuccessAdd()
        
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
export default AddVirtualLocation;
