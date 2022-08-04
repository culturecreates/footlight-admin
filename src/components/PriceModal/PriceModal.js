import { Radio, Modal,Form,Input,Button ,Select, message} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { DollarCircleOutlined,PlusOutlined,DeleteOutlined } from '@ant-design/icons';
import { priceDollarType, urlValidate } from "../../utils/Utility";
import uniqid from "uniqid";
import "./PriceModal.css"
import ServiceApi from "../../services/Service";
const { Option } = Select;


const PriceModal = ({
  isModalVisible,
  setIsModalVisible,
  currentLang,
  closePriceModal,
  offerConfig
}) => {
  const [payantList, setPayantList] = useState([{
      desc:"",
      dollar:"",
      id: uniqid(),
  }]);
  const [priceList, setPriceList] = useState([]);
  const [priceType, setPriceType] = useState("FREE");
  const [dollarType, setDollarTpe] = useState("CAD");
  const [form] = Form.useForm();
  const { t, i18n } = useTranslation();

  const handleOk = () => {

    setIsModalVisible(false);
    
  };

 
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  useEffect(() => {
    console.log(offerConfig)
    if(offerConfig)
    {
      if(offerConfig.category === "PAYING")
      {
        setPriceType("PAYING")
        setPayantList(offerConfig.prices)
      }
      
      form.setFieldsValue({
        name:offerConfig.name?.fr,
        url:offerConfig.url?.uri
      })
    }
  }, [offerConfig]);

 const addPayant =()=>{
     setPayantList([...payantList,{
        desc:"",
        price:"",
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
      setPayantList(payantList.filter(item=>item.id !== itemPrice.id))
  }

  const handleInputChange = (e,type,id) => {
    setPayantList(payantList.map(item=>{
      if(item.id === id)
       item[type]=e.target.value;
      
       return item
    }))
   console.log(e,type)
   
  };
  const handleSubmit = (values) => {
  if(priceType==="PAYING")
  {
    const checkprice = payantList.filter(item=>item.price==="" || item.price===0 || item.price===undefined)
    console.log(payantList,checkprice)
    if(checkprice.length>0)
    {
      message.warn("Please enter price")
      return
    }
  }
    const payload={
      category:priceType,
      name: {fr:values.name},
      url: {
        uri: values.url
      },
      priceCurrency:dollarType,
      prices: priceType==="PAYING" ?payantList.map(item=>{
        const obj={
          price:item.price,
          name:{fr:item.desc}
        }
        return obj
      }):undefined
    }

    const payloadSend={
      category:priceType,
      name: {fr:values.name},
      url: {
        uri: values.url
      },
      priceCurrency:dollarType,
      prices: priceType==="PAYING" ?payantList.map(item=>{
        const obj={
          price:item.price,
          desc:item.desc,
          id:item.id
        }
        return obj
      }):undefined
    }

    ServiceApi.addOffer(
      payload
    )
      .then((response) => {
        closePriceModal(payloadSend,response.data.id)
        setIsModalVisible(false);
      })
      .catch((error) => {});

    console.log(payload)
  }
 
  return (
    <Modal
      title="Price/Prix"
      visible={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      className="price-modal"
      footer={null}
    >
       <div style={{marginBottom:"10px"}}>
              <Radio.Group
                name="radiogroup"
                className="price-radio"
                value={priceType}
                onChange={(e, i) => handleChange(e, i)}
              >
                <Radio value={"FREE"}>
                  {t("Gratuit", { lng: currentLang })}
                </Radio>
                <Radio value={"PAYING"}>
                  {t("Payant", { lng: currentLang })}
                </Radio>
                {/* <Radio value={"Contribution"}>
                  {t("Contribution Volonataire", { lng: currentLang })}
                </Radio> */}
              </Radio.Group>
              {priceType !=="FREE"&&
              <div className="radio-price-content">
              {priceType==="Contribution"&&
              <div className="flex-input">
              <div className="contr-text">Contribution Suggerre</div><Input addonAfter={<DollarCircleOutlined />} className="dollar-input" type="number" />
              
              </div>
}
              {priceType==="PAYING"&&
              <>
              {payantList.map(item=>
                <div className="flex-input" key={item.id}>
                <Input addonAfter={<DollarCircleOutlined />} className="dollar-input" type="number" 
                value={item.price}
                onChange={(e)=>handleInputChange(e,"price",item.id)}/>
                <Input  placeholder="Description"
                value={item.desc} onChange={(e)=>handleInputChange(e,"desc",item.id)}/>
                {payantList.length>1 &&
                <DeleteOutlined className="delete-price" onClick={()=>deletePrice(item)}/>}
                </div>)}
                
                <Button danger type="text"
                onClick={()=>addPayant()}
                icon={ <PlusOutlined />}>
                Ajouter un prix
    </Button>

                </>}
              
              <div className="text-align-end">
              <Select
                  value={dollarType}
                  className="time-zone-select"
                  bordered={false}
                  onChange={handleDollarChange}
                >
                  {priceDollarType.map((item) => (
                    <Option value={item.value} key={item.value}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
                </div>
                </div>
}
            </div>
            <div>
            <Form
        form={form}
        layout="vertical"
        className="update-status-form"
        data-testid="status-update-form"
        onFinish={handleSubmit}
       
      >
          <div className="update-select-title">
              {t("Notes", { lng: currentLang })} 
            </div>
            <Form.Item
              name="name"
              className="status-comment-item"
              rules={[
                {
                  required: false,
                  message: "Notes required",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Enter Notes" className="replace-input" />
            </Form.Item>
            <div className="update-select-title">
              {t("Site web de la billeteria", { lng: currentLang })}
            </div>
            <Form.Item
              name="url"
              className="status-comment-item"
              rules={[
                {
                  required: false,
                  message: "Url required",
                  whitespace: true,
                },
                {
                  message: 'Enter valid url.',
                  validator: (_, value) => {
                    if (urlValidate(value)) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject('Enter valid url.');
                    }
                  }
                }
              ]}
              validateTrigger="onBlur"
            >
              <Input placeholder="Enter Site Url" className="replace-input" />
            </Form.Item>
            <Form.Item className="submit-items">
          <Button
            size="large"
            
            onClick={()=>handleCancel()}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
           
          >
            Done
          </Button>
        </Form.Item>
          </Form>
            </div>
     
    </Modal>
  );
};
export default PriceModal;
