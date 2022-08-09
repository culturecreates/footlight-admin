import React, { useEffect, useState } from "react";
import { Avatar  } from 'antd';
import PropTypes from "prop-types";
import "./Profile.css";

import ServiceApi from "../../services/Service";
import { useTranslation, Trans } from "react-i18next";
import { adminProfile } from "../../utils/Utility";

const Profile = function ({ currentLang }) {
    const [profileDate, setProfileData] = useState()
    const { t, i18n } = useTranslation();
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
    <div className="profile">

        <div className="footlight-text-logo">Footlight Admin</div>
        {profileDate &&
        <>
      <Avatar
      style={{margin:"30px"}}
    size={{ xs: 32, sm: 40, md: 64, lg: 80, xl: 100, xxl: 100 }}
    src="https://joeschmoe.io/api/v1/random"
  />
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
  );
};
export default Profile;

Profile.propTypes = {
  onClose: PropTypes.func,
};
