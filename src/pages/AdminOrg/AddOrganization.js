import { Layout, Form, Input, Button, message, Select, Divider, Space, Typography, TreeSelect } from "antd";
import React, { useState, useEffect } from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
 PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  
} from "@ant-design/icons";
import {  adminOrg, urlValidate } from "../../utils/Utility";
import ServiceApi from "../../services/Service";
import Spinner from "../../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchContact, fetchOrg } from "../../action";
import AddNewContactModal from "../../components/AddNewContactModal";

const { Option } = Select;

const AddOrganization = function ({ currentLang,contentLang,orgDetails,isModal=false,onsuccessAdd,onsuccessAddById }) {
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [contactList, setContactList] = useState([]);
  const [showAddContact,setShowAddContact]= useState(false)
  const [formValue, setFormVaue] = useState();
  const [placeList, setPlaceList] = useState([]);
  const [dynamicList, setDynamicList] = useState([]);

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const contactStore = useSelector((state) => state.org);

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
        conceptIds: values[item.taxonomy?.entityId],
        taxonomyId: item.taxonomy?.entityId,
       
      }
      return obj;
    })
    const postalObj = {
        
        url: {uri:values.url},
        contactPoint: values.contact ?{
            entityId: values.contact
          }:undefined,
        place:values.place? {
          entityId: values.place
        }:undefined ,
        dynamicFields:dynamicField,
    };
    if(contentLang == "bilengual")
    {
      postalObj.name = {fr:values.name, en: values.nameEn};
      postalObj.description= {fr:values.description ,en:values.descriptionEn}
    }
    else{
      if(orgDetails)
      {
        postalObj.name = {[contentLang]:values.name,
          [contentLang=="fr"?"en":"fr"]: orgDetails?.name[[contentLang=="fr"?"en":"fr"]]};
        postalObj.description= {[contentLang]:values.description,
          [contentLang=="fr"?"en":"fr"]: orgDetails?.description[[contentLang=="fr"?"en":"fr"]]}
      }
      else
      {
        postalObj.name = {[contentLang]:values.name};
        postalObj.description= {[contentLang]:values.description}
      }
     
    }
    setLoading(true)
    if (orgDetails)
    ServiceApi.updateOrg(postalObj,orgDetails.id)
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
          const getId=response.data?.id
            if (isModal) {
              ServiceApi.getAllOrg()
              .then((response) => {
                setLoading(false);
                if (response && response.data && response.data.data) {
                  const events = response.data.data;
                 
            
                  dispatch(fetchOrg(events));
                  onsuccessAddById(getId)                }
                
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
        name: orgDetails.name[contentLang],
        description: orgDetails.description && orgDetails.description[contentLang],
        
        url: orgDetails.url?.uri,
        contact: orgDetails.contactPoint?.entityId,
        place: orgDetails.place?.entityId
        
      });

      if(contentLang == "bilengual")
      {
        form.setFieldsValue({
          name: orgDetails.name?.fr,
          nameEn: orgDetails.name?.en,
          description: orgDetails.description && orgDetails.description?.fr,
          descriptionEn: orgDetails.description && orgDetails.description?.en,
        })
      }
      else{
        form.setFieldsValue({
          name: orgDetails.name[contentLang],
          description: orgDetails.description && orgDetails.description[contentLang],
        })
      }
      
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgDetails]);

  useEffect(()=>{

    if(orgDetails && orgDetails.dynamicFields && dynamicList.length>0)
    {
      const eventDynamic = orgDetails.dynamicFields;
      if(Array.isArray(eventDynamic))
      for (let i = 0; i <= eventDynamic.length; i++) {
       
        if(eventDynamic[i]?.taxonomyId)
        form.setFieldsValue({
          [eventDynamic[i].taxonomyId]:eventDynamic[i].conceptIds
        })
    }
      
      
    }
  },[orgDetails,dynamicList])

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
      value:item.id}
      return obj;
      }));

    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[contactStore])

  const getContacts = (page = 1) => {
    
    ServiceApi.getAllContacts(page, currentLang === "en" ? "EN" : "FR")
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;
          dispatch(fetchContact(response.data.data));
          
          setContactList(events.map(item=>{
            const obj={name:item.name["fr"],
          value:item.id}
          return obj;
          }));
        
        }
        
      })
      .catch((error) => {
        
      });
  };

  useEffect(()=>{
    getPlaces();
    getPublics();
  },[])

  const getPublics = () => {
    
    ServiceApi.getFieldConcepts("ORGANIZATION")
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;
          console.log(events,events.filter(item=>(item?.isDynamicField)))
          setDynamicList(events.filter(item=>(item?.isDynamicField)))
         
          
          
          // dispatch(fetchAudience(response.data.data));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const getPlaces = (page = 1) => {
    // setLoading(true);
    ServiceApi.getAllPlaces(page, currentLang === "en" ? "EN" : "FR")
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;
          const placeVirtual = response.data.data?.virtualLocations;
         
          
          if(placeVirtual)
          setPlaceList([...events,...placeVirtual.map(object => {
            return {...object, isVirtual: true};
          })]);
          else
            setPlaceList(events)
           
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
        {adminOrg.filter(item=>contentLang != "bilengual" ? item.isMulti==false :item.name !== "mmm").map((item) => (
          <>
            <div className="update-select-title">{t(item.title,{ lng: currentLang })}
             {((item.title == "Name" || item.title == "Description" ) && contentLang == "bilengual") && "@fr" }</div>
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
                item.name==="contact"?
                <Select
                style={{ width: 350 }}
                dropdownClassName="contact-select"
                placeholder="Select Contact"
                showSearch
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
              <Select
                style={{ width: 350 }}
                dropdownClassName="contact-select"
                placeholder="Select Place"
                showSearch
              
              >
                {placeList.map((item) => (
                  <Option key={item.id} value={item.id}>{item.name[currentLang]?item.name[currentLang]:
                    currentLang==="fr"?
                    item.name["en"]:item.name["fr"]}</Option>
                
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
              else if (isUpdate) navigate(`/admin/organization`);
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
export default AddOrganization;
