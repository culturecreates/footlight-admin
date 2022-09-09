import React,{useState,useEffect} from "react";
import PropTypes from "prop-types";
import { Layout, Menu,Avatar,Dropdown, Space} from "antd";

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
import { adminSideMenuLinks, getCookies, removeCookies, storeCookies } from "../utils/Utility";
import { useTranslation,  } from "react-i18next";
import AdminEvents from "./AddEvent/AdminEvents";
import AdminContacts from "./AddContact/AdminContact";
import AdminPlaces from "./AdminPlace/AdminPlaces";
import Organization from "./AdminOrg/Organization";
import Taxonomy from "./Taxonomy/Taxonomy";
import ServiceApi from "../services/Service";
import Profile from "./Profile/Profile";
import AdminUsers from "./AdminUsers/AdminUsers";
import Calendars from "./AdminCalendar/Calendars";
import Spinner from "../components/Spinner";

const { Content, Sider } = Layout;

const AdminDashboard = function ({  currentLang }) {
    const [routePath, setRoutePath] = useState("/admin/events");
    const [loading, setLoading] = useState(false);
    const [calList, setCalList] = useState([]);
    const [calTitle, setCalTitle] = useState("")
    const [openKeys, setOpenKeys] = useState([])
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
        storeCookies("concept_scheme", response.data.conceptSchemes);
      })
      .catch((error) => {
        
      });
      getCalendars()
      }, []);

      const getCalendars = (page = 1) => {
        // setLoading(true);
        ServiceApi.getAllCalendar()
          .then((response) => {
            if (response && response.data && response.data.data) {
              const events = response.data.data;
             
              setCalList(events);
              
             const userCalendar= getCookies("user_calendar")
             if(userCalendar)
              setCalTitle(userCalendar?.name?.fr)
             else
             setCalTitle(events[0].name.fr) 
            }
            setLoading(false);
          })
          .catch((error) => {
            setLoading(false);
          });
      };

      const logout=()=>{
        removeCookies("user_token");
        storeCookies("user_token", null);
        navigate(`/`)
      }

      const menu = (
        <Menu
        onClick={(e)=>e.key==="1"?logout() :navigate(`/admin/profile`)}
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
      const onOpenChange = _openKeys => {
        setOpenKeys(_openKeys)
    }
    const selectCalendar =(item)=>{
      setCalTitle(item.name.fr)
      setOpenKeys([])
      storeCookies("user_calendar", item);
    }
  return (
    <Layout className="dashboard-layout-home">
    <Sider width={250} className="dashboard-sider">
      {/* <img src={WalmartIcon} alt="logo" className="dashboard-logo" /> */}
      <div className="app-text"></div>
      {/* { "Culture Outaouais"} */}
      <Menu
      mode="inline"
      openKeys={openKeys}
      className="cal-menu"
      onOpenChange={onOpenChange}>
  
  <Menu.SubMenu key="root-cal" title={
     <div style={{margin:0}} className="app-text">
       {calTitle}</div>}>
    {calList.map(item=>
    <Menu.Item key={item.uuid} onClick={()=>selectCalendar(item)}>
      <div className="cal-menu-div">{item.name.fr}
      </div></Menu.Item>
    )}
  </Menu.SubMenu>
</Menu>
      <Menu
        mode="inline"
        selectedKeys={[routePath]}
        style={{ height: "100%", borderRight: 0 }}
      >
        {sideMenuLinks.filter(item=>item.isShow===true).map((item) => (
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
      <Avatar 
      style={{backgroundColor: "#f56a00"}}
      src={getCookies("user_token")?.user?.profileImage}
       >
                {/* {getCookies("user_token")?.user?.firstName?.charAt(0)}{getCookies("user_token")?.user?.lastName?.charAt(0)} */}
                </Avatar>
                {/* <Gravatar email={getCookies("user_token")?.user?.email} size={30} 
                style={{borderRadius:"50%"}}/> */}
      <Dropdown overlay={menu} trigger={['click']}
       placement="topRight"
       arrow={{
         pointAtCenter: true,
       }}>
    
      <Space>
      <div style={{marginLeft:"10px",cursor:"pointer",maxWidth:"160px",wordBreak:"break-all"}}>
        {getCookies("user_token")?.user?.firstName}&nbsp;{getCookies("user_token")?.user?.lastName}</div>
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
          <Route path="users" element={<AdminUsers currentLang={currentLang} />} />
          <Route path="add-users" element={<AdminUsers currentLang={currentLang} />} />
          <Route path="invite-users" element={<AdminUsers currentLang={currentLang} />} />
          <Route path="profile" element={<Profile currentLang={currentLang} />} />
          <Route path="calendars" element={<Calendars currentLang={currentLang} />} />
          <Route path="add-calendar" element={<Calendars currentLang={currentLang} />} />
         
        </Routes>
      </Content>
    </Layout>
    {loading && <Spinner />}
  </Layout>
  );
};
export default AdminDashboard;

AdminDashboard.propTypes = {
  currentLang: PropTypes.string,
};
