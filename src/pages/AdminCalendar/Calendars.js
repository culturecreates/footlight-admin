import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Layout, Card, Table, Button, Modal,  Breadcrumb, Col, Row } from "antd";
import { useTranslation } from "react-i18next";
import "../AdminDashboard.css";
import { PlusOutlined, ExclamationCircleOutlined,DeleteOutlined } from "@ant-design/icons";
import { useNavigate,useLocation } from "react-router-dom";
import Spinner from "../../components/Spinner";
import ServiceApi from "../../services/Service";
import AddCalendar from "./AddCalendar";
import { getCookies } from "../../utils/Utility";

const { confirm } = Modal;

const Calendars = function ({ currentLang }) {
  const [calList, setCalList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [defaultPage, setDefaultPage] = useState(1);
  const [calendarDetails, setCalendarDetails] = useState()
  const navigate = useNavigate();
  const location = useLocation();

  const { t } = useTranslation();

  const checkAdmin = getCookies("user_token")?.user?.roles?.find(item=>item.calendarId==="CULTURE_OUTAOUAIS")


  const eventTableHeader = [
    {
      title: t("Name", { lng: currentLang }),
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
    ServiceApi.deleteCal(id)
      .then((response) => {
        getCalendars();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }
 

 
 

  useEffect(() => {
    if(location.pathname.includes("admin/add-calendar"))
    {
      setIsAdd(true)
      const search = window.location.search;
    const params = new URLSearchParams(search);
    const eventId = params.get("id");
    if(eventId)
    getCalDetails(eventId)
    }
    else
    {
      setIsAdd(false)
      getCalendars();
      setCalendarDetails()
    }
   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const getCalDetails = (id) => {
    setLoading(true);
    ServiceApi.getCalDetail(id)
      .then((response) => {
        if (response && response.data && response.data) {
          const events = response.data;
          setCalendarDetails(events)
          if (response.data.StatusCode !== 400) {
             
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const getCalendars = (page = 1) => {
    setLoading(true);
    ServiceApi.getAllCalendar()
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;
         
          setCalList(events);
         
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
        <Breadcrumb.Item onClick={()=>navigate(`/admin/calendars`)}>{t("Calendars")}</Breadcrumb.Item>
        <Breadcrumb.Item >{calendarDetails?calendarDetails.name[currentLang]:t("AddCalendar")}</Breadcrumb.Item>
      </Breadcrumb>
}
      <Row className="admin-event-header">
      {!isAdd &&
        <Col className="header-title" flex="0 1 300px">{t("Calendars")}</Col>
      }
        {!isAdd &&
        <Col className="flex-align">
          {/* <SemanticSearch
            onSelection={selectSemantic}
            onClearSearch={getPlaces}
            currentLang={currentLang}
          /> */}
          <Button type="primary" icon={<PlusOutlined />} size={"large"}
          onClick={()=>navigate(`/admin/add-calendar`)}>
            {t("Calendar")}
          </Button>
        </Col>
}
      </Row>
      <Card className="segment-card">
        {!isAdd ? <Table
           
              dataSource={calList}
              columns={eventTableHeader}
              className={"event-table"}
              scroll={{x: 800, y: "calc(100% - 60px)" }}
              pagination={{
                onChange: page =>{
                  setDefaultPage(page)
                  getCalendars(
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
                    if(getCookies("user_token")?.user?.id===record.creator?.userId ||(getCookies("user_token")?.user?.isSuperAdmin || (checkAdmin && (checkAdmin.role === "EDITOR" || checkAdmin.role === "ADMIN" || checkAdmin.role === "SUPER_ADMIN"))))
                     navigate(`/admin/add-calendar/?id=${record.name?.fr}`);
                    // setSelectedProduct(record);
                  }, // click row
                };
              }}
            /> 
            :
        <AddCalendar currentLang={currentLang} orgDetails={calendarDetails}/>
            }
      </Card>
      {loading && <Spinner />}
    </Layout>
  );
};
export default Calendars;

Calendars.propTypes = {
  currentLang: PropTypes.string,
};
