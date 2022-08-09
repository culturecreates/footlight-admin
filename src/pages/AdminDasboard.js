import React,{useState,useEffect} from "react";
import PropTypes from "prop-types";
import { Layout, Menu,Avatar,Image,Dropdown, Space} from "antd";

import "./AdminDashboard.css";
import {
    RightOutlined ,CaretUpOutlined
} from "@ant-design/icons";
import {
    Link,
    Route,
    Routes,
    useLocation,
    useNavigate
  } from "react-router-dom";
import { adminSideMenuLinks } from "../utils/Utility";
import { useTranslation,  } from "react-i18next";
import AdminEvents from "./AddEvent/AdminEvents";
import AdminContacts from "./AddContact/AdminContact";
import AdminPlaces from "./AdminPlace/AdminPlaces";
import Organization from "./AdminOrg/Organization";
import Taxonomy from "./Taxonomy/Taxonomy";
import ServiceApi from "../services/Service";
import Profile from "./Profile/Profile";

const { Content, Sider } = Layout;

const AdminDashboard = function ({  currentLang }) {
    const [routePath, setRoutePath] = useState("/admin/events");
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const sideMenuLinks= adminSideMenuLinks;
    useEffect(() => {
        setRoutePath(location.pathname);
       
      }, [location]);
      useEffect(() => {
        ServiceApi.calendarInfo()
      .then((response) => {
       
      })
      .catch((error) => {
        
      });
       
      }, []);

      const menu = (
        <Menu
        onClick={(e)=>e.key==="1"? navigate(`/`):navigate(`/admin/profile`)}
          items={[
            {
              label: "Profile",
              key: '0',
            },
            {
              label: "Logout",
              key: '1',
            },
           
          ]}
        />
      );
  return (
    <Layout className="dashboard-layout-home">
    <Sider width={250} className="dashboard-sider">
      {/* <img src={WalmartIcon} alt="logo" className="dashboard-logo" /> */}
      <div className="app-text">{ "Culture Outaouais"}</div>

      <Menu
        mode="inline"
        selectedKeys={[routePath]}
        style={{ height: "100%", borderRight: 0 }}
      >
        {sideMenuLinks.map((item) => (
          <Menu.Item key={item.link} className="side-menu-item">
            <div className="side-menu-div">
             
              <Link to={item.link}>{t(item.name, { lng: currentLang })}</Link>
              {routePath.includes(item.link) && (
                <RightOutlined className="selected-right-arrow" />
              )}
            </div>
          </Menu.Item>
        ))}
      </Menu>
      <div className="user-logout">
      <Avatar src={<Image src="https://joeschmoe.io/api/v1/random" style={{ width: 35 }} />} />
      <Dropdown overlay={menu} trigger={['click']}
       placement="topRight"
       arrow={{
         pointAtCenter: true,
       }}>
    
      <Space>
      <div style={{marginLeft:"10px",cursor:"pointer"}}>Suhail Aliyar</div>
        <CaretUpOutlined />
      </Space>
   
  </Dropdown>
         
      </div>
    </Sider>
    <Layout style={{ padding: "0 0px 0px" }}>
    
      <Content
        className="admin-content">
       
        <Routes>
          <Route path="events" element={<AdminEvents currentLang={currentLang} />} />
          <Route path="add-event" element={<AdminEvents currentLang={currentLang} />} />
          <Route path="places" element={<AdminPlaces currentLang={currentLang} />} />
          <Route path="add-place" element={<AdminPlaces currentLang={currentLang} />} />
          <Route path="contacts" element={<AdminContacts currentLang={currentLang} />} />
          <Route path="add-contact" element={<AdminContacts currentLang={currentLang} />} />
          <Route path="organization" element={<Organization currentLang={currentLang} />} />
          <Route path="add-organization" element={<Organization currentLang={currentLang} />} />
          <Route path="taxonomy" element={<Taxonomy currentLang={currentLang} />} />
          <Route path="add-taxonomy" element={<Taxonomy currentLang={currentLang} />} />
          <Route path="profile" element={<Profile currentLang={currentLang} />} />
        </Routes>
      </Content>
    </Layout>
  </Layout>
  );
};
export default AdminDashboard;

AdminDashboard.propTypes = {
  currentLang: PropTypes.string,
};
