/* eslint-disable react-hooks/exhaustive-deps */
import { Layout, Form, Row, Col,Button,Input, message, Avatar,Select } from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  CheckOutlined,
  CloseOutlined,
  
} from "@ant-design/icons";
import {  adminProfile, urlValidate } from "../../utils/Utility";
import ServiceApi from "../../services/Service";
import Spinner from "../../components/Spinner";
import PasswordUpdateModal from "../../components/PasswordUpdateModal";

const {Option} =Select;
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
  // const [fileList, setFileList] = useState([]);
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
      });
      else{
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
    }
      else
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
  };

  useEffect(() => {
    if (contactDetails) {
      setIsUpdate(true);
      form.setFieldsValue({
        firstName: contactDetails.firstName,
        email:contactDetails.email,
        lastName: contactDetails.lastName,
        interfaceLanguage: contactDetails.interfaceLanguage
       
        
      });
      
    } 
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
