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


  const objDefault=[
    {
        "title": "0-0",
        "key": "0-0",
        "children": [
            {
                "title": "0-0-0",
                "key": "0-0-0",
                "children": [
                    {
                        "title": "0-0-0-0",
                        "key": "0-0-0-0"
                    },
                    {
                        "title": "0-0-0-1",
                        "key": "0-0-0-1"
                    },
                   
                ]
            },
            {
                "title": "0-0-1",
                "key": "0-0-1",
                "children": [
                    {
                        "title": "0-0-1-0",
                        "key": "0-0-1-0"
                    },
                    
                ]
            },
            {
                "title": "0-0-2",
                "key": "0-0-2"
            }
        ]
    },
    {
        "title": "0-1",
        "key": "0-1",
        "children": [
            {
                "title": "0-1-0",
                "key": "0-1-0",
                "children": [
                    {
                        "title": "0-1-0-0",
                        "key": "0-1-0-0"
                    },
                    
                ]
            },
            {
                "title": "0-1-1",
                "key": "0-1-1",
                "children": [
                    {
                        "title": "0-1-1-0",
                        "key": "0-1-1-0"
                    },
                    {
                        "title": "0-1-1-1",
                        "key": "0-1-1-1"
                    },
                    {
                        "title": "0-1-1-2",
                        "key": "0-1-1-2"
                    }
                ]
            },
            {
                "title": "0-1-2",
                "key": "0-1-2"
            }
        ]
    },
    {
        "title": "0-2",
        "key": "0-2"
    }
]
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

  const conceptArray=["Event","Place", "Organization","Event - Organization role"]

 const raseem= {
    "title": "raseem",
    "key": "ayatt"
}

  const { t } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
    const [gData, setGData] = useState([]);
  const [expandedKeys] = useState(['0-0', '0-0-0', '0-0-0-0']);

  useEffect(()=>{
    const map=["Event Accessibility","Audience", "Event Type"]
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
      mappedToField: values.mappedToField
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

  const handleChange = (value,option) => {
    console.log(value,option)
    if(value==="Event")
    {
    const map=["Event Accessibility","Audience", "Event Type"]
    setMappedList(map)
    }
    else if(value==="Place")
    {
      const map=["Place Accessibility"]
    setMappedList(map)
    }
    else
    {
      const map=["Organization Role","Performer Role", "Contributor Role"]
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
          title: item.name?.fr,
          
          children:item.children?formatarrayTreeResponse(item.children):undefined
      }
      return obj
    })
 
 
   }
   const formatarrayTreeResponse=(data)=>{
     
     return data.map(item=>{
       const obj={
        key:item.uuid,
        title: item.name?.fr,
        children:item.children?formatarrayTreeResponse(item.children):undefined
      }
       return obj
     })
   }

   const formatarrayUpdate=(data)=>{

    return data.map(item=>{
      const obj={
          key:item.key,
          name: {fr:item.title},
          
          children:item.children?formatarrayTreeUpdate(item.children):undefined
      }
      return obj
    })
 
 
   }
   const formatarrayTreeUpdate=(data)=>{
     
     return data.map(item=>{
       const obj={
        key:item.key,
        name: {fr:item.title},
        children:item.children?formatarrayTreeUpdate(item.children):undefined
      }
       return obj
     })
   }
   const closeWithId = (name) => {
    const obj= {
      "title": name,
      "key": name
  }
    if(selectedConcept)
    {
    const findobj = formatarray(gData,obj);
    setGData(findobj)
    
}
else
  setGData([...gData,obj])
    
  };

  useEffect(() => {
    if (orgDetails) {
        
      setIsUpdate(true);
      const search = window.location.search;
      const params = new URLSearchParams(search);
      const eventId = params.get("id");
      getConcepts(eventId)
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
          if (response.data.StatusCode !== 400) {
             
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };
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
            {/* {
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
            } */}
            </div>

            <div>
                <div>
                <div className="update-select-title">{t("Class")}</div>
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
          <Checkbox>Dynamic display</Checkbox>
        </Form.Item>
                <div>
                <div className="update-select-title">{t("Mapped to standared field")}</div>
            <Form.Item
              name="mappedToField"
              className="status-comment-item"
              rules={[
                {
                  required:true,
                  message: "Taxonomy map required",
                  whitespace: true,
                },
              ]}
            >
               <Select
                style={{ width: '100%' }}
                dropdownClassName="contact-select"
                placeholder="Select Mapped Field"
              
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
      treeData={gData}
    />
    </Card>
            <div style={{marginBottom:"10px"}}>
      <Button type="primary" icon={<PlusOutlined />} size={"large"}
      className="add-concept"
      disabled={!isUpdate}
          onClick={()=>addNewConcept()}>
            {t("Concept")}
          </Button>
          {/* <Button type="primary"  size={"large"}
          className={selectedLang=="fr"?"add-concept":"non-selected-btn"}
          disabled={!isUpdate}
          onClick={()=>setSelectedLang("fr")}>
            @fr
          </Button>
          <Button type="primary"  size={"large"}
           disabled={!isUpdate}
          className={selectedLang=="en"?"add-concept":"non-selected-btn"}
          onClick={()=>setSelectedLang("en")}>
           @en
          </Button> */}
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