import React, { useEffect, useState } from "react";
import { Avatar,Row,Col,Button  } from 'antd';
import PropTypes from "prop-types";
import "./Profile.css";
import {
  PlusOutlined,
  
   
 } from "@ant-design/icons";
import ServiceApi from "../../services/Service";
import { useTranslation } from "react-i18next";
import { adminProfile } from "../../utils/Utility";
import { useNavigate } from "react-router-dom";
import Gravatar from 'react-gravatar'


const Profile = function ({ currentLang }) {
    const [profileDate, setProfileData] = useState()
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    useEffect(()=>{
        ServiceApi.getUser()
        .then((response) => {
          if (response && response.data) {
           
            setProfileData(response.data)
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
    
    // src="https://joeschmoe.io/api/v1/random"
  >
                    {profileDate?.firstName?.charAt(0)}{profileDate?.lastName?.charAt(0)}

    </Avatar>
       {/* <Gravatar email={profileDate?.email} size={200} style={{borderRadius:"50%",margin:"25px"}}/> */}
  {
      adminProfile.map(item=>
        <div key={item.name} className="profile-keys">
        <div>{item.title}</div>
        <div>:&nbsp;{profileDate[item.name]}</div>
        </div>
        )
  }
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
