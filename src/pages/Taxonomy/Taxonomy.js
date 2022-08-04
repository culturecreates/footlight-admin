import React, { useState, useEffect } from "react";
import moment from "moment";
import PropTypes from "prop-types";
import { Layout, Card, Table, Button, Modal, Avatar, Breadcrumb, Col, Row } from "antd";
import { useTranslation, Trans } from "react-i18next";
import "../AdminDashboard.css";
import { PlusOutlined, ExclamationCircleOutlined,DeleteOutlined } from "@ant-design/icons";
import { useNavigate,useLocation } from "react-router-dom";
import Spinner from "../../components/Spinner";
import ServiceApi from "../../services/Service";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrg, fetchPlace } from "../../action";
import AddTaxonomy from "./AddTaxonomy";

const { confirm } = Modal;

const Taxonomy = function ({ currentLang }) {
  const [taxonomyList, setTaxonomyList] = useState([]);
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
      title: t("Name", { lng: currentLang }),
      dataIndex: "name",
      key: "name",
      render: (e, record) => (
        <Row className="image-name">
          
          <Col flex="1 1 150px">
        {  t(record.name[currentLang], { lng: currentLang })}
         
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
        !record.header &&
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
    ServiceApi.deleteTaxonomy(id)
      .then((response) => {
        getPlaces();
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }
 

 
 

  useEffect(() => {
    if(location.pathname.includes("admin/add-taxonomy"))
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
    ServiceApi.getTaxonomyDetail(id)
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
    // ServiceApi.getAllTaxonomy()
    //   .then((response) => {
    //     if (response && response.data && response.data.data) {
    //       const events = response.data.data;
         
    //       setTaxonomyList(events);
    //     //   dispatch(fetchOrg(response.data.data));
    //         if(response.data.totalCount)
    //         setTotalPage(response.data.totalCount)
    //     }
    //     setLoading(false);
    //   })
    //   .catch((error) => {
    //     setLoading(false);
    //   });
    ServiceApi.getTaxonomy()
      .then((response) => {
        if (response && response.data && response.data.data) {
          const eventsPublic = response.data.data;
         
          ServiceApi.getTaxonomyType()
          .then((response) => {
            if (response && response.data && response.data.data) {
              const events = response.data.data;
              const data = [
                {
                  key: 1,
                  name: {fr:'audience'},
                  header: true,
                  address: 'New York No. 1 Lake Park',
                  children:eventsPublic},
                  {key: 2,
                  name: {fr:'Event Type'},
                  header: true,
                  address: 'New York No. 1 Lake Park',
                  children:events},
                ]

                setTaxonomyList(data);
            }
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
          });
        
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
        <Breadcrumb.Item onClick={()=>navigate(`/admin/taxonomy`)}>{t("Taxonomy")}</Breadcrumb.Item>
        <Breadcrumb.Item >{placeDetails?placeDetails.name[currentLang]:t("AddTaxonomy")}</Breadcrumb.Item>
      </Breadcrumb>
}
      <Row className="admin-event-header">
      {!isAdd &&
        <Col className="header-title" flex="0 1 300px">{t("Taxonomy")}</Col>
      }
        {!isAdd &&
        <Col className="flex-align">
          {/* <SemanticSearch
            onSelection={selectSemantic}
            onClearSearch={getPlaces}
            currentLang={currentLang}
          /> */}
          {/* <Button type="primary" icon={<PlusOutlined />} size={"large"}
          onClick={()=>navigate(`/admin/add-taxonomy`)}>
            {t("Taxonomy")}
          </Button> */}
        </Col>
}
      </Row>
      <Card className="segment-card">
        {!isAdd ? <Table
           
              dataSource={taxonomyList}
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
                pageSize: 20,
                total: totalPage,
                hideOnSinglePage: true,
                showSizeChanger: false
              }}
              onRow={(record, rowIndex) => {
                return {
                  onClick: (event) => {
                    event.stopPropagation()
                    // navigate(`/admin/add-organization/?id=${record.uuid}`);
                    // setSelectedProduct(record);
                  }, // click row
                };
              }}
            /> 
            :
        <AddTaxonomy currentLang={currentLang} orgDetails={placeDetails}/>
            }
      </Card>
      {loading && <Spinner />}
    </Layout>
  );
};
export default Taxonomy;

Taxonomy.propTypes = {
  currentLang: PropTypes.string,
};
