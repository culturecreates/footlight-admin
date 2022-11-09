import { Radio, Modal,Form,TreeSelect,Button ,Select, message} from "antd";
import React ,{ useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DollarCircleOutlined,PlusOutlined,DeleteOutlined } from '@ant-design/icons';
import uniqid from "uniqid";
const { Option } = Select;


const RoleOrganizer = ({
  
  currentLang,
  contentLang,
  orgList,
  contibutorRoleList,
  nameTitle,
  selectedRoleList=[],
  setSelectedRoleList,
  eventDetails
}) => {
  const [payantList, setPayantList] = useState([{
    entityId:undefined,
    role:undefined,
    type:"ORGANIZATION",
    id: uniqid(),
  }]);
  
  const [priceType, setPriceType] = useState("FREE");
  const [dollarType, setDollarTpe] = useState("CAD");
  const [form] = Form.useForm();
  const { t } = useTranslation();

 
  useEffect(() => {
    console.log(selectedRoleList)
    if(eventDetails && selectedRoleList.length>0)
    {
      setPayantList(selectedRoleList.map(obj => ({ ...obj, id: uniqid() })))
    }
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventDetails,selectedRoleList]);

 const addPayant =()=>{
     setPayantList([...payantList,{
        entityId:undefined,
        role:undefined,
        type:"ORGANIZATION",
        id: uniqid(),
    }])
 }
  const handleChange = (e, option) => {
    setPriceType(e.target.value)
   
  };
  const handleDollarChange = (value) => {
    setDollarTpe(value)
   
  };
  const deletePrice=(itemPrice)=>{
    const arraynew=payantList.filter(item=>item.id !== itemPrice.id)
      setPayantList(arraynew)
      setSelectedRoleList(arraynew)
  }

  const handleInputChange = (type,id,value) => {
    const arraynew=payantList.map(item=>{
        if(item.id === id)
         item[type]=value;
        
         return item
      })
    setPayantList(arraynew)
    setSelectedRoleList(arraynew)
   console.log(type,id,value)
   
  };
  
 
  return (
   <div>
       <div style={{marginBottom:"10px",border: "1px solid #fff",
    padding: "5px"}}>
              
             
       <div className="update-select-title">
                {t(nameTitle, { lng: currentLang })}
              </div>
              {payantList.map(item=>
                <div className="flex-input" key={item.id}>
                {/* <Input addonAfter={<DollarCircleOutlined />} className="dollar-input" type="number" 
                value={item.price}
                onChange={(e)=>handleInputChange(e,"price",item.id)}/> */}
                 <Select
                  data-testid="update-two-select-dropdown"
                  placeholder={`Select Organization`}
                  key="updateDropdownKey"
                  className="search-select org-role-select"
                  optionFilterProp="children"
                  showSearch
                  width={250}
                  value={item.entityId}
                  onSelect={(value)=>handleInputChange("entityId",item.id,value)}
                  dropdownClassName="contact-select"
                  filterOption={(input, option) =>
                    option.children &&
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  
                >
                  {orgList &&
                    orgList.map((item) => (
                      <Option
                        data-testid="update-two-select-option"
                        value={item.id}
                        key={item.id}
                      >
                        {item.name[currentLang]?item.name[currentLang]:
                        currentLang==="fr"?item.name["en"]:item.name["fr"]}
                      </Option>
                    ))}
                </Select>
                <TreeSelect
                style={{ width: "100%" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                treeData={contibutorRoleList}
                value={item.role}
                className="org-role-select-tree"
                onSelect={(value)=>handleInputChange("role",item.id,value)}
                placeholder="Select Role"
              />
                {payantList.length>1 &&
                <DeleteOutlined className="delete-price" onClick={()=>deletePrice(item)}/>}
                </div>)}
                
                <Button danger type="text"
                onClick={()=>addPayant()}
                icon={ <PlusOutlined />}>
                Ajouter  {t(nameTitle, { lng: currentLang })}
    </Button>

               </div>
              
            
     
            </div>
  );
};
export default RoleOrganizer;
