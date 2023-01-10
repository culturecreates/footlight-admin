import React, { useState, useEffect } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Layout, Card, Table, Button, Switch, Avatar, Breadcrumb, Col, Row,Modal } from "antd";
import { useTranslation } from "react-i18next";
import "../AdminDashboard.css";
import { PlusOutlined, ExclamationCircleOutlined,DeleteOutlined } from "@ant-design/icons";
import { useNavigate,useLocation } from "react-router-dom";
import Spinner from "../../components/Spinner";
import ServiceApi from "../../services/Service";
import SemanticSearch from "../../components/SemanticSearch";
import AddEvent from "./AddEvent";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlace } from "../../action";
import { getCookies } from "../../utils/Utility";

const { confirm } = Modal;

const AdminEvents = function ({ currentLang,contentLang }) {
  const [eventList, setEventList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [defaultPage, setDefaultPage] = useState(1);
  const [eventDetails, setEventDetails] = useState()
  const navigate = useNavigate();
  const location = useLocation();

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const placeStore = useSelector((state) => state.place);

  const checkAdmin = getCookies("user_token")?.user?.roles?.find(item=>item.calendarId===getCookies("calendar-id"))


  useEffect(() => {
    if( placeStore==null)
    {
      getAllPlaces()
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const getAllPlaces = () => {
    ServiceApi.getAllPlaces()
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;
         
          
          dispatch(fetchPlace(events));

          //   setTotalPage(response.data.totalPage * 20)
        }
      })
      .catch((error) => {});
  };


  const eventTableHeader = [
    {
      title: t("Name", { lng: currentLang }),
      dataIndex: "name",
      key: "name",
      render: (e, record) => (
        <Row className="image-name">
          <Col flex="0 1 50px">
          <Avatar size="large" src={record?.image?.thumbnail} />
          </Col>
          <Col flex="1 1 150px">
            <div>
          {record.name[currentLang]?record.name[currentLang]:currentLang==="fr"?
          record.name["en"]:record.name["fr"]}
          </div>
          {record.eventStatus && record.eventStatus !=="SCHEDULED" &&
          <div className={record.eventStatus==="POSTPONED"?"event-status-cancelled"
          :"event-status-postponed"}>{t(record.eventStatus, { lng: currentLang })}</div>}

          </Col>
        </Row>
      ),
    },
    {
      title: t("StartDate", { lng: currentLang }),
      dataIndex: "startDate",
      key: "startDate",
      width: 200,
      render: (e, record) => (
        <div>{moment(record.startDate?record.startDate:record.startDateTime).
          // tz(record.scheduleTimezone?record.scheduleTimezone:"Canada/Eastern").
          format("DD-MM-YYYY")}</div>
      ),
      sorter: (a, b) => new Date(moment(a.startDate?a.startDate:a.startDateTime, "MMMM DD YYYY, h:mm:ss a").format("LLL")) -
      new Date(moment(b.startDate?b.startDate:b.startDateTime, "MMMM DD YYYY, h:mm:ss a").format("LLL")),
    },

    {
      title: t("Location", { lng: currentLang }),
      dataIndex: "hasLegacyCapability",
      key: "hasLegacyCapability",
      render: (e, record) => <div>{record?.location.length>0 && record?.location[0]?.name?.[currentLang]?record?.location[0]?.name?.[currentLang] :currentLang==="fr"?
      record.location[0]?.name?.["en"]:record.location[0]?.name?.["fr"]}</div>,
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
      title: t("Published", { lng: currentLang }),
      dataIndex: "hasDependency",
      key: "hasDependency",
     width:120,
      render: (e, record) => (
        <Switch
          className={checkAdmin && (checkAdmin.role === "GUEST") && record?.publishState==="Pending Review"?"pending-switch":
          record?.publishState==="Pending Review"?"pending-switch":
          "publish-switch"}
          disabled={getCookies("user_token")?.user?.isSuperAdmin || (checkAdmin && (checkAdmin.role === "ADMIN" || checkAdmin.role === "SUPER_ADMIN" || checkAdmin.role === "EDITOR"))?false:
          checkAdmin && (checkAdmin.role === "GUEST" || checkAdmin.role === "CONTRIBUTOR") && getCookies("user_token")?.user?.id===record?.creator?.userId ?false:true}
          onChange={(checked,event) => handleSwitch(checked,record, event)}
          defaultChecked={(record.publishState==="Published" ||  record.publishState==="Pending Review")?true:false}
        />
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
         
        />
        :
        <></>
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
        handleDeleteEvents(record.id)
      },
  
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  const handleDeleteEvents=(id)=>{
    setLoading(true);
    ServiceApi.deleteEvent(id)
      .then((response) => {
        getEvents();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }
  const handleSwitch = (checked,record,event) => {
    event.stopPropagation()
    setLoading(true);
    ServiceApi.publishEvents(record.id)
      .then((response) => {
        console.log(checked)
        if (response && response.data && response.data) {
          const newList= eventList.map(item=>item.id===record.id?
            {...item,publishState:checked?
              checkAdmin && (checkAdmin.role === "GUEST")?"Pending Review":"Published":"Draft"}:item)
            setEventList(newList)
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
 

  useEffect(() => {
    if(location.pathname.includes("admin/add-event"))
    {
      setIsAdd(true)
      const search = window.location.search;
    const params = new URLSearchParams(search);
    const eventId = params.get("id");
    if(eventId)
    getEventDetails(eventId)
    }
    else
    {
      setIsAdd(false)
      getEvents();
      setEventDetails()
      console.log("raseem")
    }
   
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const getEventDetails = (id) => {
    setLoading(true);
    ServiceApi.getEventDetail(id,true,false)
      .then((response) => {
        if (response && response.data && response.data) {
          const events = response.data;
          setEventDetails(events)
          if (response.data.StatusCode !== 400) {
             
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const getEvents = (page = 1, filterArray = []) => {
    setDefaultPage(page)
    setLoading(true);
    ServiceApi.eventList(page, filterArray, currentLang === "en" ? "EN" : "FR")
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;
          setEventList(events);
            if(response.data.totalCount)
            setTotalPage(response.data.totalCount)
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const selectSemantic = (selectObj) => {
    const searchArray = [selectObj];
    getEvents(1, searchArray);
  };

  return (
    <Layout className="dashboard-layout">
      {isAdd &&
       <Breadcrumb separator=">">
        <Breadcrumb.Item onClick={()=>navigate(`/admin/events`)}>{t("Events")}</Breadcrumb.Item>
        <Breadcrumb.Item >{eventDetails?(eventDetails.name[currentLang]?eventDetails.name[currentLang]:
          currentLang==="fr"?
          eventDetails.name["en"]:eventDetails.name["fr"]):t("AddEvent")}</Breadcrumb.Item>
      </Breadcrumb>
}
      <Row className="admin-event-header">
        {!isAdd &&
        <Col className="header-title" flex="0 1 300px">{t("Events")}</Col>
}
        {!isAdd &&
        <Col className="flex-align">
          <SemanticSearch
            onSelection={selectSemantic}
            onClearSearch={getEvents}
            currentLang={currentLang}
          />
          <Button type="primary" icon={<PlusOutlined />} size={"large"}
          onClick={()=>navigate(`/admin/add-event`)}>
            {t("Event")}
          </Button>
        </Col>
}
      </Row>
      <Card className="segment-card">
        {!isAdd ? <Table
           
              dataSource={eventList}
              columns={eventTableHeader}
              className={"event-table"}
              scroll={{x: 1400, y: "calc(100% - 60px)" }}
              rowKey={record => record.id}
              pagination={{
                onChange: page =>{
                  setDefaultPage(page)
                  getEvents(
                    page
                  )
                },
                current: defaultPage,
                pageSize: 20,
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
                     navigate(`/admin/add-event/?id=${record.id}`);
                    // setSelectedProduct(record);
                  }, // click row
                };
              }}
            /> 
            :
        <AddEvent currentLang={currentLang} contentLang={contentLang} eventDetails={eventDetails}/>
            }
      </Card>
      {loading && <Spinner />}
    </Layout>
  );
};
export default AdminEvents;

AdminEvents.propTypes = {
  currentLang: PropTypes.string,
};
