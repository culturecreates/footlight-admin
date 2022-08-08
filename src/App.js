import { Row, Layout, Col,  Switch, Image } from "antd";
import "./App.css";
import { useTranslation, Trans } from "react-i18next";
import "antd/dist/antd.min.css";
import "antd/dist/antd.less";
import React,{ useState , useEffect} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import moment from "moment";
import enUS from "antd/lib/locale/en_US";
import frCA from "antd/lib/locale/fr_CA";
import "moment/locale/fr-ca";
import AdminDashboard from "./pages/AdminDasboard";
import { useDispatch, useSelector } from "react-redux";
import { changeLang } from "./action";
import Login from "./pages/login/Login";

moment.locale("fr-ca");


const { Header, Content } = Layout;
function App() {
  const [locale, setLocale] = useState(frCA);
  const [currentLang, setCurrentLang] = useState("fr");
  const [isEnglish, setIsEnglish] = useState(false);
  const dispatch = useDispatch();

  const langStore = useSelector((state) => state.lang);

  const { t, i18n } = useTranslation();
 
 
  // const changeLocale = (e) => {
  //   const localeValue = e.target.value;
  //   setLocale(localeValue);
  //   if (!localeValue) {
  //     moment.locale("en");
  //   } else {
  //     moment.locale("fr-ca");
  //   }
  // };
  useEffect(() => {
    if( langStore)
    {
      
      onChange(langStore==="en"?true:false)
     
    }
    
  }, [langStore]);
  function onChange(checked) {
   
    setIsEnglish(checked)
    if(!checked){
      dispatch(changeLang("fr")); 
      i18n.changeLanguage("fr");
     setCurrentLang("fr")
     setLocale(frCA)
     moment.locale("fr-ca");
    }
    
    // window.location.href = '/user/capability' ;  
    else
    {
      dispatch(changeLang("en")); 
      i18n.changeLanguage("en");
     setCurrentLang("en")
     setLocale(enUS)
     moment.locale("en");
    }
   
    // window.location.href = '/admin/segment' ;
    
    
  }

  return (
    <Layout className="events-app-layout">
      {/* <Header className="app-header">
      <Row justify="space-between" className="header-links">
      <Col xs={{
        span: 12,
        offset: 0,
      }} md={{ span: 8 }} lg={{ span: 8 }}>
        <Image
        className="logo-image"
    width={200}
    preview={false}
    src="https://toutculture.ca/images/logo_header.svg"
  />
  </Col>
  <Col  xs={{
        span: 0,
        offset: 0,
      }}
      md={{ span: 8 }} lg={{ span: 8 }}>
      </Col>
        <Col xs={{
        span: 12,
        offset: 0,
      }} md={{ span: 8 }} lg={{ span: 8 }}>
      <div className="header-text">
            <div className={isEnglish?"active-admin":"active-user"}>Français</div>
            <Switch checked={isEnglish} data-testid="admin-user-switch"
           className="switch-user" onChange={onChange}  />
            <div className={!isEnglish?"active-admin":"active-user"}>English</div> </div>
            </Col>
         </Row>
      </Header> */}

      <Content className="app-content">
       
        <Router>
        <Routes>
          <Route path="/" element={<Login currentLang={currentLang} locale={locale}/>} />

          <Route path="/admin/*" element={<AdminDashboard currentLang={currentLang} locale={locale}/>} />
        </Routes>
      </Router>
      </Content>
    
    </Layout>
  );
}

export default App;
