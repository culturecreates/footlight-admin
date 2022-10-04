import {  Modal } from "antd";
import AddContact from "../pages/AddContact/AddContact";
import AddPlaces from "../pages/AdminPlace/AddPlaces";
import AddOrganization from "../pages/AdminOrg/AddOrganization";

const AddNewContactModal = ({
  isModalVisible,
  setIsModalVisible,
  currentLang,
  contentLang,
  closeWithId,
  type
}) => {
  
  const handleOk = () => {
    

    setIsModalVisible(false);
  };
  const handleOkById = (id) => {
    closeWithId(id)
  };
 

  const handleCancel = () => {
    setIsModalVisible(false);
  };
 

  
  return (
    <Modal
      title= {`Add ${type}`}
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      className="copy-modal"
      okText="Done"
      footer={false}
    >
      {type==="Contact"?
      <AddContact currentLang={currentLang} contentLang={contentLang} contactDetails={null} isModal onsuccessAdd={handleOk}
      onsuccessAddById={handleOkById}/>
      :
      type==="Location"?
      <AddPlaces currentLang={currentLang} contentLang={contentLang} contactDetails={null} isModal onsuccessAdd={handleOk}
      onsuccessAddById={handleOkById}/>
      :
      <AddOrganization currentLang={currentLang} contentLang={contentLang} contactDetails={null} isModal onsuccessAdd={handleOk}
      onsuccessAddById={handleOkById}/>

  }

      
    </Modal>
  );
};
export default AddNewContactModal;
