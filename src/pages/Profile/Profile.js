import React, { useEffect, useState } from "react";
import { Avatar,Row,Col,Button  } from 'antd';
import PropTypes from "prop-types";
import "./Profile.css";

import ServiceApi from "../../services/Service";
import { useTranslation } from "react-i18next";
import { adminProfile, getCookies, storeCookies } from "../../utils/Utility";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { changeLang } from "../../action";


const Profile = function ({ currentLang,setStoreLang }) {
    const [profileDate, setProfileData] = useState()
    const dispatch = useDispatch();
    const {  i18n } = useTranslation();
    const { t } = useTranslation();
    const navigate = useNavigate();
    useEffect(()=>{
        ServiceApi.getUser()
        .then((response) => {
          if (response && response.data) {
           
            setProfileData(response.data)
            const lang = response.data?.interfaceLanguage;
        storeCookies("user_lang",lang=="FR"?"fr":"en" );
        dispatch(changeLang(lang=="FR"?"fr":"en")); 
        setStoreLang(lang=="FR"?"fr":"en")
          }
        })
        .catch((error) => {
         
        });
    },[])
   

    
   
  return (
    <div>
            <Row className="admin-event-header">
     
        <Col className="header-title" flex="0 1 300px">{t("Footlight Admin")}</Col>
     
       
        <Col className="flex-align">
          {/* <SemanticSearch
            onSelection={selectSemantic}
            onClearSearch={getContacts}
            currentLang={currentLang}
          /> */}
          <Button type="primary" size={"large"}
          onClick={()=>navigate(`/admin/add-users/?user=admin`)}>
            {t("Update Profile")}
          </Button>
        </Col>

      </Row>
    <div className="profile">

        {/* <div className="footlight-text-logo">Footlight Admin</div> */}
        {profileDate &&
        <>
      <Avatar
      style={{margin:"30px", backgroundColor: "#f56a00"}}
    size={{ xs: 50, sm: 75, md: 100, lg: 120, xl: 150, xxl: 150 }}
    
     src={profileDate.profileImage}
  >
                    {/* {profileDate?.firstName?.charAt(0)}{profileDate?.lastName?.charAt(0)} */}

    </Avatar>
       {/* <Gravatar email={profileDate?.email} size={200} style={{borderRadius:"50%",margin:"25px"}}/> */}
  {
      adminProfile.filter(item=>item.required).map(item=>
        <div key={item.name} className="profile-keys">
        <div>{item.title}</div>
        <div>:&nbsp;{profileDate[item.name]}</div>
        </div>
        )
  }
  <div className="profile-keys">
        <div>{"Role"}</div>
        <div>:&nbsp;{profileDate.isSuperAdmin?"Super Admin": profileDate?.roles?.find(item=>item.calendarId===getCookies("calendar-id"))?.role}</div>
        </div>
  </>
}
    </div>
    </div>
  );
};
export default Profile;

Profile.propTypes = {
  onClose: PropTypes.func,
};
