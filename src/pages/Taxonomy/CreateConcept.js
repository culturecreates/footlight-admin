import { Layout, Form, Input, Button, message, Select, Tree, Checkbox , Modal, Card} from "antd";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import Spinner from '../../components/Spinner';
import "./Taxonomy.css"
import ServiceApi from "../../services/Service";
import ConceptScheme from "./ConceptScheme";

const { Option } = Select;
const x = 3;
const y = 2;
const z = 1;


 
const { confirm } = Modal;

function CreateConcept({ currentLang,contentLang,orgDetails}) {

    const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isUpdateConcepts, setIsUpdateConcepts] = useState(false);
  const [treeList, setTreeList] = useState([]);
  const [mappedList, setMappedList] = useState([]);
  const [showAddContact,setShowAddContact]= useState(false)
  const [formValue, setFormVaue] = useState();
  const [placeDetails, setPlaceDetails] = useState();
  const [selectedLang, setSelectedLang] = useState("fr");
  const [selectedConcept, setSelectedConcept] = useState();

  const conceptArray=["Event","Place", "Organization"]


  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
    const [gData, setGData] = useState([]);
    const [treeData, setTreeData] = useState([]);
  const [expandedKeys] = useState(['0-0', '0-0-0', '0-0-0-0']);

  useEffect(()=>{
    const obj =[
      {
      name:"Event Accessibility",
      value:"Event Accessibility"
    },
    {
      name:"audience",
      value:"Audience"
    },
    {
      name:"Event Type",
      value:"Event Type"
    }
  ]
    const map=["Event Accessibility","Audience", "Event Type","Organization Role","Performer Role", "Contributor Role","inLanguage"]
    setMappedList(map)

  },[])
  console.log(gData)
  const onDragEnter = (info) => {
    console.log(info); // expandedKeys 需要受控时设置
    // setExpandedKeys(info.expandedKeys)
  };

  const onDrop = (info) => {
    console.log(info);
    const dropKey = info.node.key;
    const dragKey = info.dragNode.key;
    const dropPos = info.node.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    const loop = (data, key, callback) => {
        for (let i = 0; i < data.length; i++) {
          if (data[i].key === key) {
            return callback(data[i], i, data);
          }
  
          if (data[i].children) {
            loop(data[i].children, key, callback);
          }
        }
      };
  
      const data = [...gData]; // Find dragObject
  
      let dragObj;
      loop(data, dragKey, (item, index, arr) => {
        arr.splice(index, 1);
        dragObj = item;
      });
      if (!info.dropToGap) {
        // Drop on the content
        loop(data, dropKey, (item) => {
          item.children = item.children || []; // where to insert 示例添加到头部，可以是随意位置
  
          item.children.unshift(dragObj);
        });
      } else if (
        (info.node.props.children || []).length > 0 && // Has children
        info.node.props.expanded && // Is expanded
        dropPosition === 1 // On the bottom gap
      ) {
        loop(data, dropKey, (item) => {
          item.children = item.children || []; // where to insert 示例添加到头部，可以是随意位置
  
          item.children.unshift(dragObj); // in previous version, we use item.children.push(dragObj) to insert the
          // item to the tail of the children
        });
      } else {
        let ar = [];
      let i;
      loop(data, dropKey, (_item, index, arr) => {
        ar = arr;
        i = index;
      });

      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        ar.splice(i + 1, 0, dragObj);
      }
    }

    setGData(data);
    setTreeData(data)
  };
  const onSelect=(selectedKeys, e)=>{
    console.log(e)
    if(e.selected)
     setSelectedConcept(e.node.key)
    else
     setSelectedConcept() 
  }
  
  const handleSubmit = (values) => {
    console.log(values)
    const obj = {
      taxonomyClass: values.taxonomyClass,
      isDynamicField: values.isDynamicField,
      mappedToField: values.isDynamicField?undefined :values.mappedToField
    }
    if(contentLang == "bilengual")
    {
      obj.name = {fr:values.name, en: values.nameEn};
    }
    else{
      if(placeDetails)
      {
        obj.name = {[contentLang]:values.name,
          [contentLang=="fr"?"en":"fr"]: placeDetails?.name[[contentLang=="fr"?"en":"fr"]]};
      
      }
      else{
        obj.name = {[contentLang]:values.name};
      }
      
    }
    if (orgDetails)
    {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const conceptId = params.get("id");
      console.log(gData)
       const conceptObj= {
        "taxonomy": conceptId,
        "concepts": formatarrayUpdate(gData)
      }
      ServiceApi.addConcepts(conceptObj,isUpdateConcepts)
      .then((response) => {
        if (response && response.data) {
            
           
            
            
        }
      })
      .catch((error) => {
      });
    ServiceApi.updateTaxonomy(obj,conceptId)
      .then((response) => {
        if (response && response.data) {
         
            
           
          navigate(`/admin/taxonomy`);
          setLoading(false) 

          message.success("Taxonomy Created Successfully");
         
        }
      })
      .catch((error) => {
        setLoading(false)
      });
    }
      else
    ServiceApi.addTaxonomy(obj)
      .then((response) => {
        if (response && response.data) {
            
           
            
            
           
            navigate(`/admin/taxonomy`);
            setLoading(false) 

            message.success("Taxonomy Created Successfully");
            
            
        }
      })
      .catch((error) => {
        setLoading(false)
      });
  }

  const handleChange = (value) => {
    console.log(value)
    if(value==="Event")
    {
    const map=["Event Accessibility","Audience", "Event Type","Organization Role","Performer Role", "Contributor Role","inLanguage"]
    setMappedList(map)
    }
    else if(value==="Place")
    {
      const map=["Place Accessibility","Region","Type"]
    setMappedList(map)
    }
    else
    {
      const map=[]
      setMappedList(map)
    }
  };

  const deleteCocept = () => {
    confirm({
      title: 'Are you sure to delete?',
      icon: <ExclamationCircleOutlined />,
      content: ' This action cannot be undone.',
  
      onOk() {
        handleDeleteContact(selectedConcept)
      },
  
      onCancel() {
        console.log('Cancel');
      },
    });
  };
  function removeByKey(arr, removingKey){
    return arr.filter( a => a.key !== removingKey).map( e => {
      return { ...e, children: removeByKey(e.children || [], removingKey)}
    });
  }
  const handleDeleteContact=(id)=>{
  const newData=  removeByKey(gData,id)
  setGData(newData)
  setTreeData(newData)
  setSelectedConcept()
  //   setLoading(true);
  //   ServiceApi.deleteConcept(id)
  //     .then((response) => {
  //       const search = window.location.search;
  //     const params = new URLSearchParams(search);
  //     const eventId = params.get("id");
  //      getConcepts(eventId)
  //     })
  //     .catch((error) => {
  //       setLoading(false);
  //     });
  }

  const addNewConcept=()=>{
    // gData
   setShowAddContact(true)
    // const findobj = formatarray(gData);


    // console.log(findobj)
  }
  const formatarray=(data,newData)=>{

    return data.map(item=>{
      const obj={
          key:item.key,
          title: item.title,
          titleBL: item.titleBL,
          isNew: item.isNew,
          children:item.key === selectedConcept?item.children?[...formatarrayTree(item.children,newData),newData]:[newData]:
          item.children?formatarrayTree(item.children,newData):undefined
      }
      
        
      return obj
    })
 
 
   }
   const formatarrayTree=(data,newData)=>{
     
     return data.map(item=>{
       const obj={
        key:item.key,
        title: item.title,
        titleBL: item.titleBL,
        isNew: item.isNew,
        children:item.key === selectedConcept?item.children?[...formatarrayTree(item.children,newData),newData]:[newData]:
        item.children?formatarrayTree(item.children,newData):undefined
      }
     
       return obj
     })
   }

   const formatarrayResponse=(data)=>{

    return data.map(item=>{
      const obj={
          key:item.uuid,
          title: contentLang == "bilengual"?item.name?.fr:item.name[contentLang],
          titleBL:contentLang == "bilengual"?item.name?.en:item.name[contentLang],
          
          children:item.children?formatarrayTreeResponse(item.children):undefined
      }
      
      return obj
    })
 
 
   }
   const formatarrayTreeResponse=(data)=>{
     
     return data.map(item=>{
       const obj={
        key:item.uuid,
        title: contentLang == "bilengual"?item.name?.fr:item.name[contentLang],
        titleBL:contentLang == "bilengual"?item.name?.en:item.name[contentLang],
        children:item.children?formatarrayTreeResponse(item.children):undefined
      }
       return obj
     })
   }

   const formatarrayUpdate=(data)=>{

    return data.map(item=>{
      const obj={
          key:item.key,
          // name: {fr:item.title},
          uuid: isUpdateConcepts?item.isNew?undefined: item.key:undefined,
          children:item.children?formatarrayTreeUpdate(item.children):undefined
      }
      if(contentLang === "bilengual")
      {
        obj.name = {fr:item.title, en: item.titleBL};
        
      }
      else{
        
        obj.name = {[contentLang]:item.title};
          
        }
      return obj
    })
 
 
   }
   const formatarrayTreeUpdate=(data)=>{
     
     return data.map(item=>{
       const obj={
        key:item.key,
        uuid: isUpdateConcepts?item.isNew?undefined: item.key:undefined,
        // name: {fr:item.title},
        children:item.children?formatarrayTreeUpdate(item.children):undefined
      }
      if(contentLang === "bilengual")
      {
        obj.name = {fr:item.title, en: item.titleBL};
        
      }
      else{
        
        obj.name = {[contentLang]:item.title};
          
        }
       return obj
     })
   }
   const closeWithId = (conceptObj) => {
    const obj= {
      "title": contentLang === "bilengual"?conceptObj.name.fr:conceptObj.name[contentLang],
      "key": contentLang === "bilengual"?conceptObj.name.fr:conceptObj.name[contentLang],
      "titleBL":contentLang === "bilengual"?conceptObj.name.en:conceptObj.name[contentLang],
      isNew: true
  }
    if(selectedConcept)
    {
    const findobj = formatarray(gData,obj);
    setGData(findobj)
    setTreeData(findobj)
    
}
else
  setGData([...gData,obj])
  setTreeData([...gData,obj])
    
  };

  useEffect(() => {
    if (orgDetails) {
        
      setIsUpdate(true);
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const eventId = params.get("id");
      getConcepts(eventId)
      handleChange(orgDetails.taxonomyClass)
      form.setFieldsValue({
        name: orgDetails.name[contentLang],
        
        isDynamicField: orgDetails.isDynamicField,
        taxonomyClass: orgDetails.taxonomyClass,
        mappedToField: orgDetails.mappedToField,
        
      });
      if(contentLang == "bilengual")
      {
        form.setFieldsValue({
          name: orgDetails.name?.fr,
          nameEn: orgDetails.name?.en,
         
        })
      }
      else{
        form.setFieldsValue({
          name: orgDetails.name[contentLang],
        })
      }
      
      setFormVaue(form.getFieldsValue());
    } 
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgDetails]);

  const getConcepts = (id) => {
    setLoading(true);
    ServiceApi.getConcepts(id)
      .then((response) => {
        if (response && response.data && response.data) {
          const events = response.data.data;
          if(events && events.length>0)
           setIsUpdateConcepts(true);
         const formatResponse = formatarrayResponse(events)
          setGData(formatResponse)
          setTreeData(formatResponse)
          if (response.data.StatusCode !== 400) {
             
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const changeLanguageConcept=(lng)=>{
    setSelectedLang(lng)
    const obj = formatarrayLng(gData,lng)
    console.log(obj,gData)
    // setGData(obj)
    setTreeData(obj)
  }

  const formatarrayLng=(data,lng)=>{

    return data.map(item=>{
      const obj={
          key:item.key,
          title: contentLang == "bilengual" ? lng==="fr"?item.title?item.title:item.titleBL
          : item.titleBL?item.titleBL:item.title
          :item.title?item.title:item.titleBL,
          titleBL:contentLang == "bilengual"?item.title:item.title,
          
          children:item.children?formatarrayTreeLng(item.children,lng):undefined
      }
      
      return obj
    })
 
 
   }
   const formatarrayTreeLng=(data,lng)=>{
     
     return data.map(item=>{
       const obj={
        key:item.key,
        title: contentLang == "bilengual" ? lng==="fr"?item.title?item.title:item.titleBL
          : item.titleBL?item.titleBL:item.title
          :item.title?item.title:item.titleBL,
        titleBL:contentLang == "bilengual"?item.title:item.title,
        children:item.children?formatarrayTreeResponse(item.children):undefined
      }
       return obj
     })
   }
    return(
        
        <div className="concept-create">
             <Layout className="add-event-layout">
      <Form
        form={form}
        layout="vertical"
        className="update-status-form"
        data-testid="status-update-form"
        onFinish={handleSubmit}
        onFieldsChange={() => {
          setFormVaue(form.getFieldsValue());
        }}
      >
        <div>
            <div>
         <div className="update-select-title">{t("Name")} {contentLang == "bilengual" && "@fr"}</div>
            <Form.Item
              name="name"
              className="status-comment-item"
              rules={[
                {
                  required:contentLang == "bilengual"? formValue?.nameEn?.length>0?false:true :true,
                  message: "Taxonomy name required",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Enter Taxonomy Name" className="replace-input" />
            </Form.Item>
            </div>
             {
              contentLang == "bilengual" &&
              <>
              <div className="update-select-title">{t("Name")} @en</div>
            <Form.Item
              name="nameEn"
              className="status-comment-item"
              rules={[
                {
                  required: formValue?.name?.length>0?false:true,
                  message: "Taxonomy name required",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Enter Taxonomy Name" className="replace-input" />
            </Form.Item>
            </>
            } 
            </div>

            <div>
                <div>
                <div className="update-select-title">{t("Class", { lng: currentLang })}</div>
            <Form.Item
              name="taxonomyClass"
              className="status-comment-item"
              rules={[
                {
                  required:contentLang == "bilengual"? formValue?.nameEn?.length>0?false:true :true,
                  message: "Taxonomy name required",
                  whitespace: true,
                },
              ]}
            >
               <Select
                style={{ width: '100%' }}
                dropdownClassName="contact-select"
                placeholder="Select Concept"
                disabled={orgDetails?true:false}
                onChange={handleChange}
              >
                {conceptArray.map((item) => (
                  <Option key={item} value={item} title={item}>
                     {  t(item, { lng: currentLang })}{}</Option>
                ))}
              </Select>
            </Form.Item>
                </div>
                <Form.Item  name="isDynamicField" valuePropName="checked">
          <Checkbox>{t("dynamicDisplay", { lng: currentLang })}</Checkbox>
        </Form.Item>
                <div>
                <div className="update-select-title">{t("mapField", { lng: currentLang })}</div>
            <Form.Item
              name="mappedToField"
              className="status-comment-item"
              rules={[
                {
                  required: formValue?.isDynamicField?false: true,
                  message: "Taxonomy map required",
                  whitespace: true,
                },
              ]}
            >
               <Select
                style={{ width: '100%' }}
                dropdownClassName="contact-select"
                placeholder="Select Mapped Field"
                disabled={formValue?.isDynamicField}
              
              >
                {mappedList.map((item) => (
                  <Option key={item} value={item} title={item}>
                     {  t(item, { lng: currentLang })}{}</Option>
                ))}
              </Select>
            </Form.Item>
                </div>
             
            </div>
<Card className="concept-card">
            <Tree
      className="draggable-tree"
      defaultExpandedKeys={expandedKeys}
      draggable
      selectable
      blockNode
      onDragEnter={onDragEnter}
      onDrop={onDrop}
      onSelect={onSelect}
      treeData={treeData}
    />
    </Card>
            <div style={{marginBottom:"10px"}}>
      <Button type="primary" icon={<PlusOutlined />} size={"large"}
      className="add-concept"
      disabled={!isUpdate}
          onClick={()=>addNewConcept()}>
            {t("Concept")}
          </Button>
          <Button type="primary"  size={"large"}
          className={selectedLang=="fr"?"add-concept":"non-selected-btn"}
          disabled={!isUpdate}
          onClick={()=>changeLanguageConcept("fr")}>
            @fr
          </Button>
          <Button type="primary"  size={"large"}
           disabled={!isUpdate}
          className={selectedLang=="en"?"add-concept":"non-selected-btn"}
          onClick={()=>changeLanguageConcept("en")}>
           @en
          </Button>
{selectedConcept &&
          <Button type="primary"  size={"large"}
      className="add-concept"
          onClick={()=>deleteCocept()}>
            {t("Delete")}
          </Button>
}
          </div>


             <Form.Item className="submit-items">
          <Button
            size="large"
            icon={<CloseOutlined />}
            onClick={() => {
             
                form.resetFields();
                
              
            }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            icon={<CheckOutlined />}
          >
            {isUpdate ? "Update" : "Save"}
          </Button>
        </Form.Item>
      </Form>
      {loading && <Spinner />}
   
    </Layout>
 
   

          {showAddContact && (
        <ConceptScheme
          isModalVisible={showAddContact}
          setIsModalVisible={setShowAddContact}
          
          currentLang={currentLang}
          contentLang={contentLang}
          closeWithName={closeWithId}
        />
      )}
        </div>
    )
}
export default CreateConcept;