import React, { useState, useEffect } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Layout, Card, Table, Button, Modal,  Breadcrumb, Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import "../AdminDashboard.css";
import { PlusOutlined, ExclamationCircleOutlined,DeleteOutlined } from "@ant-design/icons";
import { useNavigate,useLocation } from "react-router-dom";
import Spinner from "../../components/Spinner";
import ServiceApi from "../../services/Service";
import AddOrganization from "./AddOrganization";
import { useDispatch } from "react-redux";
import { fetchOrg } from "../../action";
import { getCookies } from "../../utils/Utility";

const { confirm } = Modal;

const Organization = function ({ currentLang,contentLang }) {
  const [orgList, setOrgList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [defaultPage, setDefaultPage] = useState(1);
  const [placeDetails, setPlaceDetails] = useState()
  const navigate = useNavigate();
  const location = useLocation();

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const checkAdmin = getCookies("user_token")?.user?.roles?.find(item=>item.calendarId===getCookies("calendar-id"))


  const eventTableHeader = [
    {
      title: t("PlaceName", { lng: currentLang }),
      dataIndex: "name",
      key: "name",
      render: (e, record) => (
        <Row className="image-name">
          
          <Col flex="1 1 150px">
          {record.name[currentLang]}
          </Col>
        </Row>
      ),
    },
    {
      title: t("Created", { lng: currentLang }),
      dataIndex: "hasLegacyCapability",
      key: "hasLegacyCapability",
      width: 200,
      render: (e, record) => <div>
        <div>{record?.creator?.userName}</div>
        {record.creator?.date &&
        <div style={{fontSize:"11px"}}>{moment(record.creator?.date).tz(record.scheduleTimezone?record.scheduleTimezone:"Canada/Eastern").format("DD-MM-YYYY")}</div>
        }
      </div>,
    }, 
    {
      title: t("Modified", { lng: currentLang }),
      dataIndex: "hasLegacyCapability",
      key: "hasLegacyCapability",
      width: 200,
      render: (e, record) => <div>
      <div>{record?.modifier?.userName}</div>
      {record.modifier?.date &&
      <div style={{fontSize:"11px"}}>{moment(record.modifier?.date).tz(record.scheduleTimezone?record.scheduleTimezone:"Canada/Eastern").format("DD-MM-YYYY")}</div>
      }
    </div>,
    }, 
    {
      title: "",
      dataIndex: "hasDependency",
      key: "hasDependency",
      width:100,
      render: (e, record) => (
        getCookies("user_token")?.user?.isSuperAdmin || (checkAdmin && (checkAdmin.role === "ADMIN" || checkAdmin.role === "SUPER_ADMIN"))?
        <DeleteOutlined
          style={{fontSize:"23px"}}
          onClick={(event) => handleDelete(record, event)}
         
        />:<></>
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
    ServiceApi.deleteOrg(id)
      .then((response) => {
        getPlaces();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }
 

 
 

  useEffect(() => {
    if(location.pathname.includes("admin/add-organization"))
    {
      setIsAdd(true)
      const search = window.location.search;
    const params = new URLSearchParams(search);
    const eventId = params.get("id");
    if(eventId)
    getplaceDetails(eventId)
    }
    else
    {
      setIsAdd(false)
      getPlaces();
      setPlaceDetails()
    }
   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const getplaceDetails = (id) => {
    setLoading(true);
    ServiceApi.getOrgDetail(id)
      .then((response) => {
        if (response && response.data && response.data) {
          const events = response.data;
          setPlaceDetails(events)
          if (response.data.StatusCode !== 400) {
             
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const getPlaces = (page = 1) => {
    setLoading(true);
    ServiceApi.getAllOrg()
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;
         
          setOrgList(events);
          dispatch(fetchOrg(response.data.data));
            if(response.data.totalCount)
            setTotalPage(response.data.totalCount)
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
        <Breadcrumb.Item onClick={()=>navigate(`/admin/organization`)}>{t("Organization")}</Breadcrumb.Item>
        <Breadcrumb.Item >{placeDetails?placeDetails.name[currentLang]:t("AddOrganization")}</Breadcrumb.Item>
      </Breadcrumb>
}
      <Row className="admin-event-header">
      {!isAdd &&
        <Col className="header-title" flex="0 1 300px">{t("Organization")}</Col>
      }
        {!isAdd &&
        <Col className="flex-align">
          {/* <SemanticSearch
            onSelection={selectSemantic}
            onClearSearch={getPlaces}
            currentLang={currentLang}
          /> */}
          <Button type="primary" icon={<PlusOutlined />} size={"large"}
          onClick={()=>navigate(`/admin/add-organization`)}>
            {t("Organization")}
          </Button>
        </Col>
}
      </Row>
      <Card className="segment-card">
        {!isAdd ? <Table
           
              dataSource={orgList}
              columns={eventTableHeader}
              className={"event-table"}
              scroll={{x: 800, y: "calc(100% - 60px)" }}
              pagination={{
                onChange: page =>{
                  setDefaultPage(page)
                  getPlaces(
                    page
                  )
                },
                current: defaultPage,
                pageSize: 200,
                total: totalPage,
                hideOnSinglePage: true,
                showSizeChanger: false
              }}
              rowClassName={(record, index) =>
                getCookies("user_token")?.user?.id===record.creator?.userId ||(getCookies("user_token")?.user?.isSuperAdmin || (checkAdmin && (checkAdmin.role === "EDITOR" || checkAdmin.role === "ADMIN" || checkAdmin.role === "SUPER_ADMIN"))) ? 'enable-row' : 'disable-row'
              }
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    event.stopPropagation()
                    if(getCookies("user_token")?.user?.id===record.creator?.userId ||(getCookies("user_token")?.user?.isSuperAdmin || (checkAdmin && (checkAdmin.role === "EDITOR" || checkAdmin.role === "ADMIN" || checkAdmin.role === "SUPER_ADMIN"))))
                     navigate(`/admin/add-organization/?id=${record.uuid}`);
                    // setSelectedProduct(record);
                  }, // click row
                };
              }}
            /> 
            :
        <AddOrganization currentLang={currentLang} contentLang={contentLang} orgDetails={placeDetails}/>
            }
      </Card>
      {loading && <Spinner />}
    </Layout>
  );
};
export default Organization;

Organization.propTypes = {
  currentLang: PropTypes.string,
};
