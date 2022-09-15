/* eslint-disable react-hooks/exhaustive-deps */
import { Layout, Form, Row, Col,Button,Input, message, Avatar,Select,Modal, AutoComplete } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import {  adminProfile, getCookies, removeCookies, storeCookies, urlValidate } from "../../utils/Utility";
import ServiceApi from "../../services/Service";
import Spinner from "../../components/Spinner";
import PasswordUpdateModal from "../../components/PasswordUpdateModal";
import { useCallback } from "react";
import _debounce from 'lodash/debounce';

const {Option} =Select;
const { confirm } = Modal;

// const getSrcFromFile = (file) => {
//     return new Promise((resolve) => {
//       const reader = new FileReader();
//       reader.readAsDataURL(file.originFileObj);
//       reader.onload = () => resolve(reader.result);
//     });
//   };

  const conceptArray=[
    {
      name:"English",
      uri:"EN"
    },
    {
      name:"French",
      uri:"FR"
    }
  ]
const Addusers = function ({ currentLang,contactDetails,isProfile }) {
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isPassword, setIsPassword] = useState(false);
  const [roleList, setRoleList] = useState([]);
  const [searchKey, setSearchKey] = useState("")
  const [options, setOptions] = useState([]);
  // const [isUpload, setIsUpload] = useState(false);
  // const [compressedFile, setCompressedFile] = useState(null);


  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();



  const handleSubmit = (values) => {
   
    setLoading(true)
    if (contactDetails)
    {
      if(isProfile)
      {
        values.role = undefined;
        ServiceApi.updateUser(values)
      .then((response) => {
        if (response && response.data) { 
            setLoading(false)  
            message.success("Contact Updated Successfully");
            navigate(`/admin/profile`);
         
        }
      })
      .catch((error) => {
        setLoading(false)
        message.error(error.response?.data?.message)
      });}
      else{
        const obj={
          userId: contactDetails.uuid,
          role: values.role,
          calendarId: getCookies("calendar-id")
        }
        ServiceApi.modifyRole(obj,contactDetails.uuid)
      .then((response) => {
        if (response && response.data) { 
          values.role = undefined;
          ServiceApi.updateSingleUser(values,contactDetails.uuid)
        .then((response) => {
          if (response && response.data) { 
              setLoading(false)  
              message.success("Contact Updated Successfully");
              navigate(`/admin/users`);
           
          }
        })
        .catch((error) => {
          setLoading(false)
          message.error(error.response?.data?.message)
        });
         
        }
      })
      .catch((error) => {
        setLoading(false)
        message.error(error.response?.data?.message)
      });
      
       
      }
    }
      else
      {
        values.calendarId = getCookies("calendar-id")
        values.calendarName = getCookies("user_calendar")
      ServiceApi.inviteUser(values)
      .then((response) => {
        if (response && response.data) {
            setLoading(false) 
         
                
            navigate(`/admin/users`);
            message.success("Invite send Successfully");
           
        }
      })
      .catch((error) => {
        setLoading(false)
      });
    }
  };

  useEffect(() => {
    if (contactDetails) {
      setIsUpdate(true);
      const roleValue = contactDetails?.roles?.find(item=>item.calendarId===getCookies("calendar-id"))
      form.setFieldsValue({
        firstName: contactDetails.firstName,
        email:contactDetails.email,
        lastName: contactDetails.lastName,
        interfaceLanguage: contactDetails.interfaceLanguage,
        role:roleValue?.role
       
        
      });
      
    } 
   
  }, [contactDetails]);

  useEffect(()=>{
    ServiceApi.getUserRoles()
    .then((response) => {
      if (response && response.data) {
        
        setRoleList(response.data)
      }
    })
    .catch((error) => {
      setLoading(false)
    });
  },[])

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
  const handleDeleteContact=(id,type)=>{
    confirm({
      title: `Are you sure to ${type==="leave"?"Leave Calendar":type==="withdraw"?"withdraw":"deactivate"}?`,
      icon: <ExclamationCircleOutlined />,
      content: ' This action cannot be undone.',
  
      onOk() {
        setLoading(true);
        if(type==="leave")
        {
          ServiceApi.leaveCalendar()
          .then((response) => {
            removeCookies("user_token");
            storeCookies("user_token", null);
            storeCookies("user_calendar", null);
            storeCookies("calendar-id", null);
            navigate(`/`)
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
          });
        }
        else
        ServiceApi.deactivateCurrentUser()
          .then((response) => {
            removeCookies("user_token");
            storeCookies("user_token", null);
            navigate(`/`)
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
          });
      },
  
      onCancel() {
        console.log('Cancel');
      },
    });
   
  }
  const disableAdmin=(item)=>{
    const checkAdmin=  getCookies("user_token")?.user?.roles?.find(item=>item.calendarId===getCookies("calendar-id"))
    if(item ==="role")
    {
      if(getCookies("user_token")?.user?.isSuperAdmin || (checkAdmin && (checkAdmin.role === "ADMIN" || checkAdmin.role === "SUPER_ADMIN")))
      return false;
    else
      return true
    } 
      else
      return false 
  }
  // const onChange = (info) => {
  //   setIsUpload(true);
  //   setFileList(info.fileList);
  //   new Compressor(info.fileList[0].originFileObj, {
  //     // quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
  //     convertSize: 200000,
  //     success: (compressedResult) => {
  //       // compressedResult has the compressed file.
  //       // Use the compressed file to upload the images to your server.
  //       setCompressedFile(compressedResult);
  //       console.log();
  //     },
  //   });
  // };
  // const onPreview = async (file) => {
  //   const src = file.url || (await getSrcFromFile(file));
  //   const imgWindow = window.open(src);

  //   if (imgWindow) {
  //     const image = new Image();
  //     image.src = src;
  //     imgWindow.document.write(image.outerHTML);
  //   } else {
  //     window.location.href = src;
  //   }
  // };

  const onSelect = (value,options) => {
    const selectObj = {
      type: options.options,
      name: options.key,
      from:"search",
      uri:options.key,
    };
   
    const roleValue = options.options?.roles?.find(item=>item.calendarId===getCookies("calendar-id"))
    form.setFieldsValue({
      firstName: options.options.firstName,
      email:options.options.email,
      lastName: options.options.lastName,
      interfaceLanguage: options.options.interfaceLanguage,
      role:roleValue?.role
     
      
    });
   
  };
  
  const searchResult = (query,lng) =>{
        
    ServiceApi.getAllUserSearch(query)
    .then((response) => {
      if (response && response.data && response.data.data) {
        const events = response.data.data;
        // setOptions(events.active)
        const array=[
          {
              label: "Active Users",
              options: events.active.map(item=>{
                const obj=renderItem(item.firstName,item,item.uuid)
                return obj
              })
            },
            {
              label: "Invited Users",
              options: events.invited.map(item=>{
                const obj=renderItem(item.firstName,item,item.uuid)
                return obj
              })
            },
          ]
        setOptions(array.filter(item=>item.options.length!==0))
      }
    })
    .catch((error) => {
    });
}
const renderItem = (title,types,uuid="") => ({
  value: title,
  options:types,
  key: uuid,

  // key: types === "places"?uuid:title,
  label: (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      {title}
      
    </div>
  ),
});
const handleSearch = (value) => {
  setSearchKey(value)
  if(value.length === 0)
   {setOptions([])
     }
  else 
   debounceFn(value,currentLang)
};
const debounceFn = useCallback(_debounce(searchResult, 1000), []);
const handleKeyPress = (ev) => {
  
  };
  const handleInputSearch=(value)=>{
    const selectObj = {
      type: "queryString",
      name:value,
      from:"search"
    };
   
  }
  const handleClearPress = () => {
   
   
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
          <Row>
          <Col flex="0 1 450px">
        {adminProfile.map((item) => (
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
              {item.inputtype === "select"?
                <Select
                style={{ width: '100%' }}
                dropdownClassName="contact-select"
                placeholder="Select Language"
                disabled={  disableAdmin(item.name)}
                
              >

                {item.name==="role"?
                 roleList.map((item) => (
                  <Option key={item} value={item} title={item}>
                     {  t(item, { lng: currentLang })}{}</Option>
                ))
                :
                conceptArray.map((item) => (
                  <Option key={item.uri} value={item.uri} title={item.name}>
                     {  t(item.name, { lng: currentLang })}{}</Option>
                ))
                }
              </Select>
              :
              item.inputtype === "auto"?
              <AutoComplete
              dropdownMatchSelectWidth={252}
              style={{
                width: 450,
              }}
              options={options}
              onSelect={(val, option) => onSelect(val, option)}
              onSearch={handleSearch}
              onKeyPress={handleKeyPress}
              value={searchKey}
              
            >
              <Input allowClear size="large" placeholder={t("Search", { lng: currentLang })} onClear={handleClearPress}
              onSearch={handleInputSearch} value={searchKey}/>
            </AutoComplete>
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

<div>
  {isProfile &&
                <Button
                  className="add-end-date-btn"
                  onClick={() => setIsPassword(true)}
                >
                  {t("Change Password", { lng: currentLang })}
                </Button>
}
              </div>
         </Col>
         {isProfile &&
            <Col className="upload-col user-profile-img">


            <Avatar shape="square" size={150}  style={{backgroundColor: "#f56a00",marginBottom:"20px"}}
            src={contactDetails?.profileImage}>

              </Avatar>
            
         
            </Col>
}
            </Row>

        <Form.Item className="submit-items">
          {isProfile &&
          <>
        <Button
            size="large"
            type="text" danger
            onClick={() => {
              handleDeleteContact(contactDetails.id,"deactivate")
            }}
          >
            Deactivate my account
          </Button>
          <Button
            size="large"
            type="text" danger
            onClick={() => {
              handleDeleteContact(contactDetails.id,"leave")
            }}
          >
            Leave Calendar
          </Button>
          </>
}
          <Button
            size="large"
            icon={<CloseOutlined />}
            onClick={() => {
               if (isUpdate) navigate(isProfile?`/admin/profile`:`/admin/users`);
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
      {isPassword && <PasswordUpdateModal isModalVisible={isPassword} setIsModalVisible={setIsPassword}
currentLang={currentLang}
/> }
    </Layout>
  );
};
export default Addusers;
