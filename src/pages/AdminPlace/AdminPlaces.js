import React, { useState, useEffect } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Layout, Card, Table, Button, Switch, Modal, Breadcrumb, Col, Row } from "antd";
import { useTranslation, Trans } from "react-i18next";
import "../AdminDashboard.css";
import { PlusOutlined, ExclamationCircleOutlined,DeleteOutlined } from "@ant-design/icons";
import { useNavigate,useLocation } from "react-router-dom";
import Spinner from "../../components/Spinner";
import ServiceApi from "../../services/Service";
import AddPlaces from "./AddPlaces";
import { useDispatch, useSelector } from "react-redux";
import { fetchPlace } from "../../action";

const { confirm } = Modal;

const AdminPlaces = function ({ currentLang }) {
  const [placeList, setPlaceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAdd, setIsAdd] = useState(false);
  const [totalPage, setTotalPage] = useState(1);
  const [defaultPage, setDefaultPage] = useState(1);
  const [placeDetails, setPlaceDetails] = useState()
  const navigate = useNavigate();
  const location = useLocation();

  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();

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
    // {
    //   title: t("Type", { lng: currentLang }),
    //   dataIndex: "name",
    //   key: "name",
    //   render: (e, record) => (
    //     <Row className="image-name">
          
    //       <Col flex="1 1 150px">
    //       {record.isVirtual?"Virtual":""}
    //       </Col>
    //     </Row>
    //   ),
    // },
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
    ServiceApi.deletePlace(id)
      .then((response) => {
        getPlaces();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }
 
 

  useEffect(() => {
    if(location.pathname.includes("admin/add-place"))
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
   
  }, [location]);

  const getplaceDetails = (id) => {
    setLoading(true);
    ServiceApi.getPlaceDetail(id)
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
    ServiceApi.getAllPlaces(page, currentLang === "en" ? "EN" : "FR")
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data.places;
          const placeVirtual = response.data.data?.virtualLocations;
         
          dispatch(fetchPlace(response.data.data));
          if(placeVirtual)
          setPlaceList([...events,...placeVirtual.map(object => {
            return {...object, isVirtual: true};
          })]);
          else
            setPlaceList(events)
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
    getPlaces(1, searchArray);
  };

  return (
    <Layout className="dashboard-layout">
      {isAdd &&
      <Breadcrumb separator=">">
        <Breadcrumb.Item onClick={()=>navigate(`/admin/places`)}>{t("Places")}</Breadcrumb.Item>
        <Breadcrumb.Item >{placeDetails?placeDetails.name[currentLang]:t("AddPlace")}</Breadcrumb.Item>
      </Breadcrumb>
}
      <Row className="admin-event-header">
      {!isAdd &&
        <Col className="header-title" flex="0 1 300px">{t("Places")}</Col>
      }
        {!isAdd &&
        <Col className="flex-align">
          {/* <SemanticSearch
            onSelection={selectSemantic}
            onClearSearch={getPlaces}
            currentLang={currentLang}
          /> */}
          <Button type="primary" icon={<PlusOutlined />} size={"large"}
          onClick={()=>navigate(`/admin/add-place`)}>
            {t("Place")}
          </Button>
        </Col>
}
      </Row>
      <Card className="segment-card">
        {!isAdd ? <Table
           
              dataSource={placeList}
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
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    event.stopPropagation()
                    navigate(`/admin/add-place/?id=${record.uuid}`);
                    // setSelectedProduct(record);
                  }, // click row
                };
              }}
            /> 
            :
        <AddPlaces currentLang={currentLang} placeDetails={placeDetails}/>
            }
      </Card>
      {loading && <Spinner />}
    </Layout>
  );
};
export default AdminPlaces;

AdminPlaces.propTypes = {
  currentLang: PropTypes.string,
};
