import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import PropTypes from "prop-types";
import {
  Layout,
  Form,
  Input,
  Button,
  TimePicker,
  Select,
  DatePicker,
  Row,
  Col,
  Radio,
  message,
  Divider,
  Space,
  Typography,
  Card,
} from "antd";
import {
  FileImageOutlined,
  CheckOutlined,
  CloseOutlined,
  PlusOutlined,
  MinusOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Upload } from "antd";
import ServiceApi from "../../services/Service";
import EventEditor from "../../components/EventEditor";
import { useNavigate } from "react-router-dom";
import RecurringEvent from "../../components/RecurringEvent";
import Compressor from "compressorjs";
import { useDispatch, useSelector } from "react-redux";
import { fetchAudience, fetchContact, fetchOrg, fetchPlace, fetchTypes } from "../../action";
import { fbUrlValidate, publics, timeZone, urlValidate } from "../../utils/Utility";
import AddNewContactModal from "../../components/AddNewContactModal";
import PriceModal from "../../components/PriceModal/PriceModal";
import Spinner from "../../components/Spinner";

const { Option, OptGroup } = Select;
const { Dragger } = Upload;
// moment.tz.setDefault('Europe/Berlin')
const getSrcFromFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => resolve(reader.result);
  });
};
const AddEvent = function ({ currentLang, eventDetails }) {
  const [formValue, setFormVaue] = useState();
  const [checkselectedOnline, setcheckselectedOnline] = useState(false);
  const [checkselectedOffline, setcheckselectedOffline] = useState(false);
  const [formLocation, setFormLocation] = useState([]);
  const [isEndDate, setIsEndDate] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allLocations, setAllLocations] = useState();
  const [eventType, setEventType] = useState("offline");
  const [fileList, setFileList] = useState([]);
  const [placeList, setPlaceList] = useState([]);
  const [orgList,setOrgList]= useState([])
  const [publicsList,setPublicsList]= useState([])
  const [typeList,setTypeList]= useState([])
  const [contactList, setContactList] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [showAddContact,setShowAddContact]= useState(false)
  const [showAddType,setShowAddType]= useState("Contact")
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [compressedFile, setCompressedFile] = useState(null);
  const [offerConfig, setOfferConfig] = useState();
  const [offerIds, setOfferIds] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const [startDisable, setStartDisable] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [endDisable, setEndDisable] = useState(moment().format("YYYY-MM-DD"));
  const { t, i18n } = useTranslation();

  const dispatch = useDispatch();
  const placeStore = useSelector((state) => state.place);
  const contactStore = useSelector((state) => state.contact);
  const orgStore = useSelector((state) => state.org);
  const audienceStore = useSelector((state) => state.audience);
  const typesStore = useSelector((state) => state.types);
  useEffect(() => {
   

    

    if (audienceStore == null) {
      getPublics();
    } else {
      setPublicsList(audienceStore)
    }

    if (typesStore == null) {
      getTypes();
    } else {
      setTypeList(typesStore)
    }

    
  }, []);

  useEffect(()=>{
    if (orgStore == null) {
      getOrg();
    } else {
      setOrgList(orgStore)
    }
  },[orgStore])

  useEffect(()=>{
    if (placeStore == null) {
      getAllPlaces();
    } else {
      setAllLocations(placeStore);
      setPlaceList(placeStore.places);
    }
  },[placeStore])

  useEffect(()=>{

    if (contactStore == null) {
      getContacts();
    } else {
      setContactList(contactStore.map(item=>{
        const obj={name:item.name["fr"],
      value:item.uuid}
      return obj;
      }));

    }
  },[contactStore])

  const getTypes = (page = 1) => {
    setLoading(true);
    ServiceApi.getTaxonomyType()
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;
         
          setTypeList(events);
          dispatch(fetchTypes(response.data.data));
           
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const getPublics = (page = 1) => {
    setLoading(true);
    ServiceApi.getTaxonomy()
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;
         
          setPublicsList(events);
          dispatch(fetchAudience(response.data.data));
           
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const getOrg = (page = 1) => {
    setLoading(true);
    ServiceApi.getAllOrg()
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;
         
          setOrgList(events);
          dispatch(fetchOrg(response.data.data));
           
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const getContacts = (page = 1) => {
    
    ServiceApi.getAllContacts(page, currentLang === "en" ? "EN" : "FR")
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;
          dispatch(fetchContact(response.data.data));
          
          setContactList(events.map(item=>{
            const obj={name:item.name["fr"],
          value:item.uuid}
          return obj;
          }));
        
        }
        
      })
      .catch((error) => {
        
      });
  };
  const getAllPlaces = () => {
    ServiceApi.getAllPlaces()
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;

          setPlaceList(events.places);
          setAllLocations(events);
          dispatch(fetchPlace(events));
         
        }
      })
      .catch((error) => {});
  };

  const handleSubmit = (values) => {
    setLoading(true)
    if (!isRecurring) {
      values.startDate.set({
        h: values.startTime.get("hour"),
        m: values.startTime.get("minute"),
      });
      if (isEndDate)
        values.endDate.set({
          h: values.endTime.get("hour"),
          m: values.endTime.get("minute"),
        });
    }
    const eventObj = {
      name: {
        fr: values.title,
      },
      description: {
        fr: values.desc,
      },
      startDate: !isRecurring
        ? ServiceApi.parseDate(moment(values.startDate).format("YYYY-MM-DD"),moment(values.startTime).format("HH:mm"),values.timeZone)
        : undefined,
      scheduleTimezone: values.timeZone,
      locationId: {
        place: {
          entityId: formLocation.find(item=>item.type==="Offline")?formLocation.find(item=>item.type==="Offline").value : null,
        },
        virtualLocation: {
          entityId: formLocation.find(item=>item.type==="Online")?formLocation.find(item=>item.type==="Online").value : null,
        },
      },
      contactPoint: values.contact ?{
        entityId: values.contact
      }:null,
      url:values.eventPage && {uri:values.eventPage},
      facebookUrl:values.facebookLink,
      offerConfiguration: offerConfig,
      offers: offerIds && offerIds.map(item=>{ const obj={entityId:item}
      return obj}),
      organizer :values.organization? {organization :values.organization.map(item=>{const
         obj ={
        entityId:item
      }
       return obj})}:undefined,
       audience:values.audience? values.audience.map(item=>{
         const obj ={
       uri:item
     }
      return obj}):undefined,
      additionalType:values.type? values.type.map(item=>{
        const obj ={
      uri:item
    }
     return obj}):undefined
     
    };
    if (isEndDate && !isRecurring)
      eventObj.endDate = moment(values.endDate).format("YYYY-MM-DDTHH:mm:ss");
    if (isRecurring) {
      const recurEvent = {
        frequency: values.frequency,
        startDate:
          form.getFieldsValue().frequency !== "CUSTOM" ?
          moment(values.startDateRecur[0]).format("YYYY-MM-DD"): undefined,
        endDate:
          form.getFieldsValue().frequency !== "CUSTOM" ?
          moment(values.startDateRecur[1]).format("YYYY-MM-DD"): undefined,
        startTime:
          form.getFieldsValue().frequency !== "CUSTOM" ?
          moment(values.startTimeRecur).format("HH:mm") : undefined,
        endTime:
          form.getFieldsValue().frequency !== "CUSTOM" && values.endTimeRecur ?
          moment(values.endTimeRecur).format("HH:mm") : undefined,
        // timeZone: values.timeZone,
        weekDays: values.frequency === "WEEKLY" ? values.daysOfWeek : undefined,
        customDates:
          form.getFieldsValue().frequency === "CUSTOM" ?
          form.getFieldsValue().customDates: undefined,
      };
      eventObj.recurringEvent = recurEvent;
    }

    if (eventDetails)
      ServiceApi.updateEvent(eventObj, eventDetails.uuid)
        .then((response) => {
          if (response && response.data) {
            if (isUpload && fileList.length > 0)
              ServiceApi.imageUpload(
                eventDetails.uuid,
                fileList[0].originFileObj,
                compressedFile
              )
                .then((response) => {
                  setLoading(false)
                  message.success("Event Updated Successfully");
                  navigate(`/admin/events`);
                })
                .catch((error) => {setLoading(false)});
            else {
              setLoading(false)
              message.success("Event Updated Successfully");
              navigate(`/admin/events`);
            }
          }
        })
        .catch((error) => {setLoading(false)});
    else
      ServiceApi.addEvent(eventObj)
        .then((response) => {
          if (response && response.data) {
            if (isUpload && fileList.length > 0)
              ServiceApi.imageUpload(
                response.data.id,
                fileList[0].originFileObj,
                compressedFile
              )
                .then((response) => {
                  setLoading(false)
                  message.success("Event Created Successfully");
                  navigate(`/admin/events`);
                })
                .catch((error) => {setLoading(false)});
            else {
              setLoading(false)
              message.success("Event Created Successfully");
              navigate(`/admin/events`);
            }
          }
        })
        .catch((error) => {});
  };

  useEffect(() => {
    if (eventDetails) {
      setIsUpdate(true);
      if (eventDetails.endDate) setIsEndDate(true);
      if (placeStore !== null)
        setPlaceList(
          eventDetails?.eventAttendanceMode !== "OFFLINE"
            ? placeStore.virtualLocation
            : placeStore.places
        );
        setOfferConfig(eventDetails?.offerConfiguration)
        setOfferIds(eventDetails?.offers?.map(item=>item.uuid))
      form.setFieldsValue({
        contact:eventDetails.contactPoint?.uuid,
        desc: eventDetails.description ? eventDetails.description["fr"]?eventDetails.description["fr"]==="<p><br></p>"?"<p>&nbsp;</p>":eventDetails.description["fr"] : "<p>&nbsp;</p> ":"<p>&nbsp;</p>",
        location: eventDetails.locations&&eventDetails.locations.map(item=>item.uuid),
        startDate: moment(new Date(eventDetails.startDate), "DD-MM-YYYY").tz(
          eventDetails.scheduleTimezone
            ? eventDetails.scheduleTimezone
            : "Canada/Eastern"
        ),
        endDate: eventDetails.endDate
          ? moment(new Date(eventDetails.endDate), "DD-MM-YYYY").tz(
              eventDetails.scheduleTimezone
                ? eventDetails.scheduleTimezone
                : "Canada/Eastern"
            )
          : undefined,
        title: eventDetails.name["fr"],
        endTime: eventDetails.endDate
          ? moment(new Date(eventDetails.endDate), "HH-mm").tz(
            eventDetails.scheduleTimezone
              ? eventDetails.scheduleTimezone
              : "Canada/Eastern"
          )
          : undefined,
        startTime: moment(new Date(eventDetails.startDate), "HH-mm").tz(
          eventDetails.scheduleTimezone
            ? eventDetails.scheduleTimezone
            : "Canada/Eastern"
        ),
        timeZone: eventDetails.scheduleTimezone
          ? eventDetails.scheduleTimezone
          : "Canada/Eastern",
        eventPage:eventDetails.url?.uri,
        facebookLink:eventDetails.facebookUrl ,
        organization:eventDetails?.organizer?.organizations.map(item=>item.uuid),
        audience: eventDetails?.audience?.map(item=>item?.identifier?.uri),
        type: eventDetails?.additionalType?.map(item=>item?.identifier?.uri),
        
      });
      if(eventDetails.locations){
        const eventFormLoc= eventDetails.locations.map(item=>{
          const obj={
            value:item.uuid,
            type: item.isVirtualLocation ? "Online" : "Offline"
          }
          return obj
        })
        setFormLocation(eventFormLoc) 
        const objOnline = eventFormLoc.find(item=>item.type==="Online")
      const objOffline = eventFormLoc.find(item=>item.type==="Offline")
      console.log(objOffline,eventFormLoc)
      if(objOffline)
        setcheckselectedOffline(true)
      else
        setcheckselectedOffline(false)  
        
  
      if(objOnline)
        setcheckselectedOnline(true)
      else 
        setcheckselectedOnline(false) 
       
        // setFormVaue(form.getFieldsValue())
      }
      if (eventDetails.image) {
        const obj = {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: eventDetails.image?.thumbnail?.uri,
        };
        setFileList([obj]);
      } else setFileList([]);
      if (eventDetails.recurringEvent) {
        setNumberOfDays(eventDetails.subEvents?.length);
        form.setFieldsValue({
          frequency: eventDetails.recurringEvent?.frequency,
          startDateRecur: [
            moment(
              moment(eventDetails.recurringEvent?.startDate?eventDetails.recurringEvent?.startDate:eventDetails.startDate, 'YYYY-MM-DD').format('DD-MM-YYYY')
              ,
              "DD-MM-YYYY"
            ),
            moment(
              moment(eventDetails.recurringEvent?.endDate?eventDetails.recurringEvent?.endDate:eventDetails.endDate, 'YYYY-MM-DD').format('DD-MM-YYYY')
             ,
              "DD-MM-YYYY"
            )
          ],
          startTimeRecur:eventDetails.recurringEvent.startTime? moment(
            eventDetails.recurringEvent?.startTime,
            "HH:mm"
          ):undefined,
          endTimeRecur: eventDetails.recurringEvent.endTime?moment(eventDetails.recurringEvent?.endTime, "HH:mm"):undefined,
          customDates: eventDetails.recurringEvent?.customDates,
          daysOfWeek: eventDetails.recurringEvent?.weekDays,
        });
        setIsRecurring(true);
        const obj={
          startTimeRecur:eventDetails.recurringEvent.startTime? moment(
            eventDetails.recurringEvent?.startTime,
            "HH:mm"
          ):undefined
        }
        setFormVaue(obj)
      }
      
    } else
      form.setFieldsValue({
        frequency: "DAILY",
        timeZone: "Canada/Eastern",
        desc: "",
      });
      setFormVaue(form.getFieldsValue())
  }, [eventDetails]);

  const closeWithId=(id)=>{
    setShowAddContact(false)
    if(showAddType==="Contact")
    {
      form.setFieldsValue({
        contact:id
      });
    }
    else if(showAddType==="Location")
    {
      form.setFieldsValue({
        location:[id]
      });
     
        const obj=[{
          value:id,
          type:  "Offline"
        }]
      
      setFormLocation(obj)
      setcheckselectedOffline(true)
      setcheckselectedOnline(false) 
      setFormVaue(form.getFieldsValue())
    }
    else{
      form.setFieldsValue({
        organization:[id]
      });
    }
  }
  // a.substring(11,20)
  const onChangeStart = (date, dateString) => {
    setStartDisable(moment(dateString, "MM-DD-YYYY"));
  };
  const onChangeEnd = (date, dateString) => {
    setEndDisable(moment(dateString, "MM-DD-YYYY"));
  };
  const handleChange = (e, option) => {
    if (e.target.value === "online") {
      setEventType("online");
      setPlaceList(allLocations.virtualLocations);
    } else {
      setEventType("offline");
      setPlaceList(allLocations.places);
    }
  };

  const handleChangeLoc = (value,option) => {
   
    const objOnline = option.find(item=>item.type==="Online")
    const objOffline = option.find(item=>item.type==="Offline")
    setFormLocation(option)
    if(objOffline)
      setcheckselectedOffline(true)
    else
      setcheckselectedOffline(false)  
      

    if(objOnline)
      setcheckselectedOnline(true)
    else 
      setcheckselectedOnline(false) 
    // const selectObj = option.
    // form.setFieldsValue({
    //   location;"jjj"
    // });
  };
 
  const showAddModal=(typeName)=>{
    setShowAddContact(true)
    setShowAddType(typeName)
  }
  const onChange = (info) => {
    setIsUpload(true);
    setFileList(info.fileList);
    new Compressor(info.fileList[0].originFileObj, {
      // quality: 0.8, // 0.6 can also be used, but its not recommended to go below.
      convertSize: 200000,
      success: (compressedResult) => {
        // compressedResult has the compressed file.
        // Use the compressed file to upload the images to your server.
        setCompressedFile(compressedResult);
        console.log();
      },
    });
  };
  const onPreview = async (file) => {
    const src = file.url || (await getSrcFromFile(file));
    const imgWindow = window.open(src);

    if (imgWindow) {
      const image = new Image();
      image.src = src;
      imgWindow.document.write(image.outerHTML);
    } else {
      window.location.href = src;
    }
  };

  const disabledDate = (current) => {
    // Can not select days before today and today
    let customDate = moment().format("YYYY-MM-DD");
    return current && current < moment(customDate, "YYYY-MM-DD");
  };
  const closePriceModal = (config,ids) => {
    setOfferConfig(config);
    setOfferIds(ids)
    console.log(ids,config)
  };
  return (
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
        <Row>
          <Col flex="0 1 450px">
            <div className="update-select-title">
              {t("Title")}
            </div>
            <Form.Item
              name="title"
              className="status-comment-item"
              rules={[
                {
                  required: true,
                  message: "Event name required",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Enter Event Name" className="replace-input" />
            </Form.Item>
            {!isRecurring && (
              <div className="flex-align">
                <div className="date-div">
                  <div className="update-select-title">
                    {t("StartDate", { lng: currentLang })}
                  </div>
                  <Form.Item
                    name="startDate"
                    className="status-comment-item"
                    rules={[{ required: true, message: "Start date required" }]}
                  >
                    <DatePicker
                      onChange={onChangeStart}
                      format="MM-DD-YYYY"
                      // disabledDate={disabledDate}
                      disabledDate={(d) => !d || d.isBefore(endDisable)}
                    />
                  </Form.Item>
                </div>
                <div>
                  <div className="update-select-title">
                    {t("StartTime", { lng: currentLang })}
                  </div>
                  <Form.Item
                    name="startTime"
                    className="status-comment-item"
                    rules={[{ required: true, message: "Start time required" }]}
                  >
                    <TimePicker format="HH:mm"/>
                  </Form.Item>
                </div>
              </div>
            )}

            {!isRecurring && (
              <div>
                <Button
                  className="add-end-date-btn"
                  icon={isEndDate ? <MinusOutlined /> : <PlusOutlined />}
                  onClick={() => setIsEndDate(!isEndDate)}
                >
                  {t("EndDateTime", { lng: currentLang })}
                </Button>
              </div>
            )}
            {isEndDate && !isRecurring && (
              <div className="flex-align">
                <div className="date-div">
                  <div className="update-select-title">
                    {t("EndDate", { lng: currentLang })}
                  </div>
                  <Form.Item
                    name="endDate"
                    className="status-comment-item"
                    rules={[{ required: true, message: "End date required" }]}
                  >
                    <DatePicker
                      format="MM-DD-YYYY"
                      onChange={onChangeEnd}
                      disabledDate={(d) => !d || d.isSameOrBefore(startDisable)}
                    />
                  </Form.Item>
                </div>
                <div>
                  <div className="update-select-title ">
                    {t("EndTime", { lng: currentLang })}
                  </div>
                  <Form.Item
                    name="endTime"
                    className="status-comment-item"
                    rules={[{ required: true, message: "End time required" }]}
                  >
                    <TimePicker format="HH:mm" />
                  </Form.Item>
                </div>
              </div>
            )}
            <div className="customize-div">
              <Button
                className="add-end-date-btn"
                icon={isRecurring ? <MinusOutlined /> : <PlusOutlined />}
                onClick={() => setIsRecurring(!isRecurring)}
              >
                {t("RecurringEvent", { lng: currentLang })}
              </Button>
              <Form.Item
                name="timeZone"
                className="timezone-item"
                rules={[{ required: true, message: "End time required" }]}
              >
                <Select
                  defaultValue="Canada/Eastern"
                  className="time-zone-select"
                  bordered={false}
                >
                  {timeZone.map((item) => (
                    <Option value={item.value} key={item.value}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            {isRecurring && (
              <RecurringEvent
                currentLang={currentLang}
                formFields={formValue}
                numberOfDaysEvent={numberOfDays}
                form={form}
                eventDetails={eventDetails}
              />
            )}
            {/* <div>
              <Radio.Group
                name="radiogroup"
                value={eventType}
                onChange={(e, i) => handleChange(e, i)}
              >
                <Radio value={"offline"}>
                  {t("Offline", { lng: currentLang })}
                </Radio>
                <Radio value={"online"}>
                  {t("Online", { lng: currentLang })}
                </Radio>
              </Radio.Group>
            </div> */}
            <div className="update-select-title">
              {t("Location", { lng: currentLang })}
            </div>

            <Form.Item name={"location"} rules={[{ required: true }]}>
              <Select
                data-testid="update-two-select-dropdown"
                placeholder={`Select Location`}
                key="updateDropdownKey"
                className="search-select"
                dropdownClassName="contact-select"
                optionFilterProp="children"
                showSearch
                mode="multiple"
                filterOption={(input, option) =>
                  option.children &&
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                }
                onChange={handleChangeLoc}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <Space align="center" style={{ padding: "0 8px 4px" }}>
                      <Typography.Link
                        onClick={() => showAddModal("Location")}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <PlusOutlined /> Add New Location
                      </Typography.Link>
                    </Space>
                  </>
                )}
                // onChange={handleChange}
                // defaultValue={selectList && selectList[0].name}
                // value={itemValue}
              >
                <OptGroup label={t("Online", { lng: currentLang })}>
                {allLocations &&
                  allLocations.virtualLocations.map((item) => (
                    <Option
                      type="Online"
                      value={item.uuid}
                      disabled={formValue?.location?.includes(item.uuid)?false: checkselectedOnline}
                      key={item.name["fr"]}
                    >
                      {item.name["fr"]}
                    </Option>
                  ))}
    </OptGroup>
    <OptGroup label={t("Offline", { lng: currentLang })}>
    {allLocations &&
                  allLocations.places.map((item) => (
                    <Option
                    type="Offline"
                      value={item.uuid}
                      disabled={formValue?.location?.includes(item.uuid)?false:checkselectedOffline}
                      // !form.getFieldsValue().location.includes(item.uuid)
                      key={item.name["fr"]}
                    >
                      {item.name["fr"]}
                    </Option>
                  ))}
    </OptGroup>
                
              </Select>
            </Form.Item>

           <div className="update-select-title">
            {t("Publics", { lng: currentLang })}
            </div>

            <Form.Item name={"audience"} rules={[{ required: false }]}>
              <Select
                data-testid="update-two-select-dropdown"
                placeholder={`Select Audience`}
                key="updateDropdownKey"
                className="search-select"
                optionFilterProp="children"
                showSearch
                mode="multiple"
                filterOption={(input, option) =>
                  option.children &&
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                }
                
              >
                {publicsList &&
                  publicsList.map((item) => (
                    <Option
                      data-testid="update-two-select-option"
                      value={item.identifier.uri}
                      key={item.name["fr"]}
                    >
                      {item.name["fr"]}
                    </Option>
                  ))}
              </Select>
            </Form.Item> 

            <div className="update-select-title">
            {t("Types", { lng: currentLang })}
            </div>

            <Form.Item name={"type"} rules={[{ required: false }]}>
              <Select
                data-testid="update-two-select-dropdown"
                placeholder={`Select Types`}
                key="updateDropdownKey"
                className="search-select"
                optionFilterProp="children"
                showSearch
                mode="multiple"
                filterOption={(input, option) =>
                  option.children &&
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                }
                
              >
                {typeList &&
                  typeList.map((item) => (
                    <Option
                      data-testid="update-two-select-option"
                      value={item.identifier.uri}
                      key={item.name["fr"]}
                    >
                      {item.name["fr"]}
                    </Option>
                  ))}
              </Select>
            </Form.Item> 
          </Col>
          <Col className="upload-col">
            
            <Dragger
              listType="picture-card"
              className={
                fileList.length > 0 ? "event-upload" : "ant-event-upload"
              }
              fileList={fileList}
              onChange={onChange}
              onPreview={onPreview}
              aspect="3/3"
              accept="image/*"
            >
              <p className="ant-upload-drag-icon">
                <FileImageOutlined />
              </p>
              <p className="ant-upload-text">
                {t("FileUpload", { lng: currentLang })}
              </p>
              <p className="ant-upload-hint">
                {t("DragAndDrop", { lng: currentLang })}
              </p>
            </Dragger>
            <div>
            <div className="update-select-title">
              {t("Contact", { lng: currentLang })}
            </div>
            <Form.Item
              name="contact"
              className="status-comment-item"
              rules={[
                {
                  required: false,
                  message: "contact required",
                  whitespace: true,
                },
              ]}
            >
              <Select
                style={{ width: 350 }}
                dropdownClassName="contact-select"
                placeholder="Select Contact"
                allowClear
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <Space align="center" style={{ padding: "0 8px 4px" }}>
                      <Typography.Link
                        onClick={() => showAddModal("Contact")}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <PlusOutlined /> Add New Contact
                      </Typography.Link>
                    </Space>
                  </>
                )}
              >
                {contactList.map((item) => (
                  <Option key={item.value} value={item.value}>{item.name}</Option>
                ))}
              </Select>
            </Form.Item>

             <Button
           
           
            size="large"
            style={{marginBottom:"20px",border:" 1px dashed #abaeb2",
            width: "350px"}}
            onClick={()=>setShowPriceModal(true)}
          >
           Price/Prix
          </Button> 
{
  offerConfig &&

          <Card size="small" extra={<DeleteOutlined onClick={()=>{
            setOfferIds([])
            setOfferConfig()
          }}/>} title="PRIX"  style={{ width: 355, marginBottom:"10px" }}>
      <div>{offerConfig.category}</div>
      <div style={{wordBreak:"break-all",color:"#838080"}}>{offerConfig.url?.uri}</div>
      {offerConfig.prices?.map(item=>
        <div><span>{item.price} ${offerConfig.priceCurrency}</span> {item.desc &&<span>({item.desc})</span>}</div>)}
    </Card>
}

<div className="update-select-title">
            {t("Organization", { lng: currentLang })}
            </div>

            <Form.Item name={"organization"} rules={[{ required: false }]}>
              <Select
                data-testid="update-two-select-dropdown"
                placeholder={`Select Organization`}
                key="updateDropdownKey"
                className="search-select"
                optionFilterProp="children"
                showSearch
                mode="multiple"
                dropdownClassName="contact-select"
                filterOption={(input, option) =>
                  option.children &&
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                    0
                }
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    <Divider style={{ margin: "8px 0" }} />
                    <Space align="center" style={{ padding: "0 8px 4px" }}>
                      <Typography.Link
                        onClick={() => showAddModal("Organization")}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <PlusOutlined /> Add New Organization
                      </Typography.Link>
                    </Space>
                  </>
                )}
                
              >
                {orgList &&
                  orgList.map((item) => (
                    <Option
                      data-testid="update-two-select-option"
                      value={item.uuid}
                      key={item.name["fr"]}
                    >
                      {item.name["fr"]}
                    </Option>
                  ))}
              </Select>
            </Form.Item> 

            <div className="update-select-title">
              {t("Facebook Link", { lng: currentLang })}
            </div>
            <Form.Item
              name="facebookLink"
              className="status-comment-item"
              rules={[
                {
                  required: false,
                  message: "url required",
                  whitespace: true,
                },
                {
                  message: 'Enter valid facebook link.',
                  validator: (_, value) => {
                    if (fbUrlValidate(value)) {
                      return Promise.resolve();
                    } else {
                      return Promise.reject('Enter valid facebbok link.');
                    }
                  }
                }
              ]}
              validateTrigger="onBlur"
            >
              <Input placeholder="Enter Event FB Link" className="replace-input" />
            </Form.Item>
            <div className="update-select-title">
              {t("Event", { lng: currentLang })} {" "}Page Link
            </div>
            <Form.Item
              name="eventPage"
              className="status-comment-item"
              rules={[
                {
                  required: false,
                  message: "Event name required",
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
              <Input placeholder="Enter Event Url" className="replace-input" />
            </Form.Item>
            </div>
          </Col>
        </Row>
        <div className="update-select-title">{"Description"}</div>

        <EventEditor />

        <Form.Item className="submit-items">
          <Button
            size="large"
            icon={<CloseOutlined />}
            onClick={() => {
              if (isUpdate) navigate(`/admin/events`);
              else {
                form.resetFields();
                form.setFieldsValue({
                  desc: "",
                });
              }
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
      {showAddContact &&
      <AddNewContactModal isModalVisible={showAddContact} setIsModalVisible={setShowAddContact}
      type={showAddType} closeWithId={closeWithId}/>
}
{showPriceModal && <PriceModal isModalVisible={showPriceModal} setIsModalVisible={setShowPriceModal}
currentLang={currentLang}
offerConfig={offerConfig}
closePriceModal={closePriceModal}/> }
 {loading && <Spinner />}
    </Layout>
  );
};
export default AddEvent;

AddEvent.propTypes = {
  currentLang: PropTypes.string,
};
