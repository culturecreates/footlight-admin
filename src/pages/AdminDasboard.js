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
import { useDispatch } from "react-redux";
import { fetchCal } from "../action";

const { Content, Sider } = Layout;

const AdminDashboard = function () {
    const [routePath, setRoutePath] = useState("/admin/events");
    const [loading, setLoading] = useState(false);
    const [calList, setCalList] = useState([]);
    const [calTitle, setCalTitle] = useState("")
    const [openKeys, setOpenKeys] = useState([])
    const [contentLang, setContentLang] = useState("fr")
    const [currentLang, setCurrentLang] = useState("en")
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const sideMenuLinks= getCookies("user_token")?.user?.isSuperAdmin?adminSideMenuLinks: adminSideMenuLinks.filter(item=>item.isShow===true);
    useEffect(() => {
        setRoutePath(location.pathname);
       
      }, [location]);
      useEffect(() => {
        if(getCookies("user_token")?.user?.interfaceLanguage)
        {
          const lang = getCookies("user_token")?.user?.interfaceLanguage;
         setCurrentLang(lang=="FR"?"fr":"en")
        }
      getCalendars()
      }, []);

      const getCalendars = (page = 1) => {
        setLoading(true);
        ServiceApi.getAllCalendar()
          .then((response) => {
            if (response && response.data && response.data.data) {
              const events = response.data.data;
             
              setCalList(events);
              dispatch(fetchCal(events));
              ServiceApi.getCalDetail(events[0].uuid)
              .then((response) => {
                storeCookies("concept_scheme", response.data.conceptSchemes);
              })
              .catch((error) => {
                
              });
             const userCalendar= getCookies("user_calendar")
             const contentCal = getCookies("content-lang")
             if(userCalendar && userCalendar != "null" && contentCal)
              {
                setCalTitle(userCalendar)
                setContentLang(contentCal)
                
              }
             else
              {
                storeCookies("user_calendar", events[0].name.fr);
                setCalTitle(events[0].name.fr) 
                storeCookies("calendar-id", events[0].uuid);
                setContentLang(events[0].contentLanguages==="FR"?"fr":
                events[0].contentLanguages==="BILINGUAL"?"bilengual":"en")
                storeCookies("content-lang",events[0].contentLanguages==="FR"?"fr":
                events[0].contentLanguages==="BILINGUAL"?"bilengual":
                "en");
              }

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
    
      storeCookies("user_calendar", item.name.fr);
      storeCookies("calendar-id", item.uuid);
      storeCookies("content-lang",item.contentLanguages==="FR"?"fr":
      item.contentLanguages==="BILINGUAL"?"bilengual":
                "en");
      setOpenKeys([])
      window.location.reload()
    }
  
  return (
    <Layout className="dashboard-layout-home">
    <Sider width={250} className="dashboard-sider">
      <div className="app-text"></div>
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
      <Avatar 
      style={{backgroundColor: "#f56a00"}}
      src={getCookies("user_token")?.user?.profileImage}
       >
                </Avatar>
               
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
       {!loading &&
        <Routes>
          <Route path="events" element={<AdminEvents currentLang={currentLang} contentLang={contentLang}/>} />
          <Route path="add-event" element={<AdminEvents currentLang={currentLang} contentLang={contentLang}/>} />
          <Route path="places" element={<AdminPlaces currentLang={currentLang} contentLang={contentLang} />} />
          <Route path="add-place" element={<AdminPlaces currentLang={currentLang} contentLang={contentLang} />} />
          <Route path="contacts" element={<AdminContacts currentLang={currentLang} contentLang={contentLang} />} />
          <Route path="add-contact" element={<AdminContacts currentLang={currentLang} contentLang={contentLang} />} />
          <Route path="organization" element={<Organization currentLang={currentLang} contentLang={contentLang} />} />
          <Route path="add-organization" element={<Organization currentLang={currentLang} contentLang={contentLang} />} />
          <Route path="taxonomy" element={<Taxonomy currentLang={currentLang} contentLang={contentLang} />} />
          <Route path="add-taxonomy" element={<Taxonomy currentLang={currentLang} contentLang={contentLang} />} />
          <Route path="users" element={<AdminUsers currentLang={currentLang} />} />
          <Route path="add-users" element={<AdminUsers currentLang={currentLang} />} />
          <Route path="invite-users" element={<AdminUsers currentLang={currentLang} />} />
          <Route path="profile" element={<Profile currentLang={currentLang} />} />
          <Route path="calendars" element={<Calendars currentLang={currentLang} contentLang={contentLang} />} />
          <Route path="add-calendar" element={<Calendars currentLang={currentLang} contentLang={contentLang} />} />
         
        </Routes>
}
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
