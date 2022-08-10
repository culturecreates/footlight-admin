import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Layout, Card, Table, Modal,  Breadcrumb, Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import "../AdminDashboard.css";
import {  ExclamationCircleOutlined,DeleteOutlined } from "@ant-design/icons";
import { useNavigate,useLocation } from "react-router-dom";
import Spinner from "../../components/Spinner";
import ServiceApi from "../../services/Service";

import Addusers from "./Addusers";

const { confirm } = Modal;

const AdminUsers = function ({ currentLang }) {
  const [contactList, setContactList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [isProfile, setIsProfile] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [defaultPage, setDefaultPage] = useState(1);
  const [contactDetails, setContactDetails] = useState()
  const navigate = useNavigate();
  const location = useLocation();

  const { t } = useTranslation();

  const eventTableHeader = [
    {
      title: t("First Name", { lng: currentLang }),
      dataIndex: "name",
      key: "name",
      render: (e, record) => (
        <Row className="image-name">
          
          <Col flex="1 1 150px">
              
          {record.firstName}
          </Col>
        </Row>
      ),
    },
    {
      title: t("Last Name", { lng: currentLang }),
      dataIndex: "name",
      key: "name",
      render: (e, record) => (
        <Row className="image-name">
          
          <Col flex="1 1 150px">
              
          {record.lastName}
          </Col>
        </Row>
      ),
    },
    {
      title: t("Email", { lng: currentLang }),
      dataIndex: "name",
      key: "name",
      render: (e, record) => (
        <Row className="image-name">
          
          <Col flex="1 1 150px">
              
          {record.email}
          </Col>
        </Row>
      ),
    },
    {
      title: "",
      dataIndex: "hasDependency",
      key: "hasDependency",
      width:100,
      render: (e, record) => (
        <DeleteOutlined
          style={{fontSize:"23px"}}
          onClick={(event) => handleDelete(record, event)}
         
        />
      ),
    },
  ];

  const handleDelete = (record,event) => {
    event.stopPropagation()
    confirm({
      title: 'Are you sure to delete?',
      icon: <ExclamationCircleOutlined />,
      content: ' This action cannot be undone.',
  
      onOk() {
        handleDeleteContact(record.uuid)
      },
  
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const handleDeleteContact=(id)=>{
    setLoading(true);
    ServiceApi.deleteUser(id)
      .then((response) => {
        getContacts();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if(location.pathname.includes("admin/add-users"))
    {
      setIsAdd(true)
      const search = window.location.search;
    const params = new URLSearchParams(search);
    const eventId = params.get("id");
    
     const user = params.get("user"); 
     if(user)
     {
      setIsProfile(true)
        getUserAdmin()
    }
     else if(eventId)
     getContactDetails(eventId)
    }
    else
    {
      setIsAdd(false)
      getContacts();
      setContactDetails()
    }
   
  }, [location]);

  const getContactDetails = (id) => {
    setLoading(true);
    ServiceApi.getContactDetail(id)
      .then((response) => {
        if (response && response.data && response.data) {
          const events = response.data;
          setContactDetails(events)
          if (response.data.StatusCode !== 400) {
             
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const getUserAdmin = () => {
    setLoading(true);
    ServiceApi.getUser()
        .then((response) => {
          if (response && response.data) {
           
            setContactDetails(response.data)
            setTotalPage(1)
            setLoading(false);
          }
        })
        
      .catch((error) => {
        setLoading(false);
      });
  };
  const getContacts = (page = 1) => {
    setLoading(true);
    ServiceApi.getAllUser()
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;
         
          // dispatch(fetchContact(response.data.data));
          setContactList(events);
        
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  

  return (
    <Layout className="dashboard-layout">
      {isAdd &&
      <Breadcrumb separator=">">
        <Breadcrumb.Item onClick={()=>navigate(`/admin/profile`)}>{t("Users")}</Breadcrumb.Item>
        <Breadcrumb.Item >{contactDetails?contactDetails.firstName:t("Add Users")}</Breadcrumb.Item>
      </Breadcrumb>
}
      <Row className="admin-event-header">
      {!isAdd &&
        <Col className="header-title" flex="0 1 300px">{t("Users")}</Col>
      }
        {/* {!isAdd &&
        <Col className="flex-align">
         
          <Button type="primary" icon={<PlusOutlined />} size={"large"}
          onClick={()=>navigate(`/admin/add-users`)}>
            {t("User")}
          </Button>
        </Col>
} */}
      </Row>
      <Card className="segment-card">
        {!isAdd ? 
        <Table
           
              dataSource={contactList}
              columns={eventTableHeader}
              className={"event-table"}
              scroll={{x: 900, y: "calc(100% - 60px)" }}
              pagination={{
                onChange: page =>{
                  setDefaultPage(page)
                  getContacts(
                    page
                  )
                },
                current: defaultPage,
                pageSize: 200,
                total: totalPage,
                hideOnSinglePage: true,
                showSizeChanger: false
              }}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    event.stopPropagation()
                    // navigate(`/admin/add-users/?id=${record.uuid}`);
                    
                  }, 
                };
              }}
            /> 
       
            :
           
        <Addusers currentLang={currentLang} contactDetails={contactDetails} isProfile={isProfile}/>
            }
      </Card>
      {loading && <Spinner />}
    </Layout>
  );
};
export default AdminUsers;

AdminUsers.propTypes = {
  currentLang: PropTypes.string,
};
