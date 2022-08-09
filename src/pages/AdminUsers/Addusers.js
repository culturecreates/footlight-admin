import { Layout, Form, Row, Col,Button,Input, message,Upload } from "antd";
import React, { useState, useEffect } from "react";
import Compressor from "compressorjs";
import { useNavigate } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import {
    FileImageOutlined,
  CheckOutlined,
  CloseOutlined,
  
} from "@ant-design/icons";
import { adminContact, adminProfile, urlValidate } from "../../utils/Utility";
import ServiceApi from "../../services/Service";
import Spinner from "../../components/Spinner";
import { useDispatch, useSelector } from "react-redux";
import { fetchContact } from "../../action";

const { Dragger } = Upload;
const getSrcFromFile = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file.originFileObj);
      reader.onload = () => resolve(reader.result);
    });
  };
const Addusers = function ({ currentLang,contactDetails,isModal=false,onsuccessAdd,onsuccessAddById }) {
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [compressedFile, setCompressedFile] = useState(null);


  const { t, i18n } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();


  const contactStore = useSelector((state) => state.contact);

  const handleSubmit = (values) => {
    const postalObj = {
        name: {fr:values.name},
        email:values.email,
        description: {fr:values.description},
        telephone:values.telephone,
        url: {uri:values.url},
    };
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
        name: contactDetails.name[currentLang],
        email:contactDetails.email,
        description: contactDetails.description && contactDetails.description[currentLang],
        telephone:contactDetails.telephone,
        url: contactDetails.url?.uri,
       
        
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

  const onChange = (info) => {
    setIsUpload(true);
    setFileList(info.fileList);
    new Compressor(info.fileList[0].originFileObj, {
      // quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
      convertSize: 200000,
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        // Use the compressed file to upload the images to your server.
        setCompressedFile(compressedResult);
        console.log();
      },
    });
  };
  const onPreview = async (file) => {
    const src = file.url || (await getSrcFromFile(file));
    const imgWindow = window.open(src);

    if (imgWindow) {
      const image = new Image();
      image.src = src;
      imgWindow.document.write(image.outerHTML);
    } else {
      window.location.href = src;
    }
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
         </Col>
            <Col className="upload-col">
            
            <Dragger
              listType="picture-card"
              className={
                fileList.length > 0 ? "event-upload" : "ant-event-upload"
              }
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              aspect="3/3"
              accept="image/*"
            >
              <p className="ant-upload-drag-icon">
                <FileImageOutlined />
              </p>
              <p className="ant-upload-text">
                {t("FileUpload", { lng: currentLang })}
              </p>
              <p className="ant-upload-hint">
                {t("DragAndDrop", { lng: currentLang })}
              </p>
            </Dragger>
            </Col>
            </Row>

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
export default Addusers;
