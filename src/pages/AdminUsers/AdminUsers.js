import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Layout, Card, Table, Modal,  Breadcrumb, Col, Row,Button } from "antd";
import { useTranslation } from "react-i18next";
import "../AdminDashboard.css";
import {  ExclamationCircleOutlined,DeleteOutlined,PlusOutlined } from "@ant-design/icons";
import { useNavigate,useLocation } from "react-router-dom";
import Spinner from "../../components/Spinner";
import ServiceApi from "../../services/Service";
import moment from "moment";
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
      title: t("Joined Date", { lng: currentLang }),
      dataIndex: "hasLegacyCapability",
      key: "hasLegacyCapability",
      width: 200,
      render: (e, record) => <div>
        
        {record.joined &&
        <div>{moment(record.joined).tz("Canada/Eastern").format("DD-MM-YYYY")}</div>
        }
      </div>,
    },
    {
      title: "",
      dataIndex: "hasDependency",
      key: "hasDependency",
      width:100,
      render: (e, record) => (
        <DeleteOutlined
          style={{fontSize:"23px"}}
          onClick={(event) => handleDelete(record, event,"deactivate")}
         
        />
      ),
    },
  ];

  const eventTableHeaderInvited = [
    {
      title: t("Invited", { lng: currentLang }),
      dataIndex: "name",
      key: "name",
      render: (e, record) => (
        <Row className="image-name">
          
          <Col flex="1 1 150px">
              
          {record.firstName +" "+record.lastName }
          </Col>
        </Row>
      ),
    },
    {
      title: t("Invited by", { lng: currentLang }),
      dataIndex: "name",
      key: "name",
      render: (e, record) => (
        <Row className="image-name">
          
          <Col flex="1 1 150px">
              
          {record.invitedby}
          </Col>
        </Row>
      ),
    },
    {
      title: t("Invited Date", { lng: currentLang }),
      dataIndex: "hasLegacyCapability",
      key: "hasLegacyCapability",
      width: 200,
      render: (e, record) => <div>
        
        {record.joined &&
        <div>{moment(record.joined).tz("Canada/Eastern").format("DD-MM-YYYY")}</div>
        }
      </div>,
    },
    {
      title: "",
      dataIndex: "hasDependency",
      key: "hasDependency",
      width:100,
      render: (e, record) => (
        <div className="admin-event-header">
        <Button type="primary"  size={"medium"}
        onClick={(event)=> handleDelete(record, event,"withdraw")}>
          {t("Cancel Invitation")}
        </Button>
        </div>
      ),
    },
  ];

  const eventTableHeaderDeactive = [
    {
      title: t("Deactivated", { lng: currentLang }),
      dataIndex: "name",
      key: "name",
      render: (e, record) => (
        <Row className="image-name">
          
          <Col flex="1 1 150px">
              
          {record.firstName +" "+record.lastName }
          </Col>
        </Row>
      ),
    },
    {
      title: t("Last Login", { lng: currentLang }),
      dataIndex: "name",
      key: "name",
      render: (e, record) => <div>
        
        {record.lastLogin &&
        <div>{moment(record.lastLogin).tz("Canada/Eastern").format("DD-MM-YYYY")}</div>
        }
      </div>,
    },
    {
      title: t("Invited Date", { lng: currentLang }),
      dataIndex: "hasLegacyCapability",
      key: "hasLegacyCapability",
      width: 200,
      render: (e, record) => <div>
        
        {record.joined &&
        <div>{moment(record.joined).tz("Canada/Eastern").format("DD-MM-YYYY")}</div>
        }
      </div>,
    },
    {
      title: "",
      dataIndex: "hasDependency",
      key: "hasDependency",
      width:100,
      render: (e, record) => (
        <div className="admin-event-header">
        <Button type="primary"  size={"medium"}
        onClick={()=>handleDeleteContact(record.uuid,"reactivate")}>
          {t("Reactivate")}
        </Button>
        <DeleteOutlined
          style={{fontSize:"23px",marginLeft:"10px"}}
          onClick={(event) => handleDelete(record, event,"delete")}
         
        />
        </div>
      ),
    },
  ];
  const handleDelete = (record,event,type) => {
    event.stopPropagation()
    confirm({
      title: `Are you sure to ${type==="delete"?"delete":type==="withdraw"?"withdraw":"deactivate"}?`,
      icon: <ExclamationCircleOutlined />,
      content: ' This action cannot be undone.',
  
      onOk() {
        handleDeleteContact(record.uuid,type)
      },
  
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const handleDeleteContact=(id,type)=>{
    setLoading(true);
    ServiceApi.deleteUser(id,type)
      .then((response) => {
        getContacts();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if(location.pathname.includes("admin/add-users")||location.pathname.includes("admin/invite-users"))
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
    {  setIsProfile(false)
      getContactDetails(eventId)}
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
    ServiceApi.getSingleUser(id)
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
    <Layout className="dashboard-layout user-list-layout">
      {isAdd &&
      <Breadcrumb separator=">">
        <Breadcrumb.Item onClick={()=>isProfile?navigate(`/admin/profile`):navigate(`/admin/users`)}>{t("Users")}</Breadcrumb.Item>
        <Breadcrumb.Item >{contactDetails?contactDetails.firstName:t("Add Users")}</Breadcrumb.Item>
      </Breadcrumb>
}
      <Row className="admin-event-header">
      {!isAdd &&
        <Col className="header-title" flex="0 1 300px">{t("Users")}</Col>
      }
        {!isAdd &&
        <Col className="flex-align">
         
          <Button type="primary" icon={<PlusOutlined />} size={"large"}
          onClick={()=>navigate(`/admin/invite-users`)}>
            {t("Invite User")}
          </Button>
        </Col>
}
      </Row>
      <Card className="segment-card">
        {!isAdd ? 
        <>
        <Table
           
              dataSource={contactList.active}
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

<Table
           
           dataSource={contactList.invited}
           columns={eventTableHeaderInvited}
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
         <Table
           
           dataSource={contactList.inactive}
           columns={eventTableHeaderDeactive}
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
       </>
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
