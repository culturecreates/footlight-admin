import React, { useState, useEffect } from "react";
import moment from "moment-timezone";
import PropTypes from "prop-types";
import ReactPlayer from "react-player";
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
  TreeSelect,
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
  DeleteOutlined,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Upload } from "antd";
import ServiceApi from "../../services/Service";
import EventEditor from "../../components/EventEditor";
import { useNavigate } from "react-router-dom";
import RecurringEvent from "../../components/RecurringEvent";
import Compressor from "compressorjs";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAudience,
  fetchContact,
  fetchOrg,
  fetchPlace,
  fetchTypes,
} from "../../action";
import { fbUrlValidate, getCookies, timeZone, urlValidate, videoUrlValidate } from "../../utils/Utility";
import AddNewContactModal from "../../components/AddNewContactModal";
import PriceModal from "../../components/PriceModal/PriceModal";
import Spinner from "../../components/Spinner";
import RoleOrganizer from "./RoleOrganizer";

const { Option, OptGroup } = Select;
const { Dragger } = Upload;
const getSrcFromFile = (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => resolve(reader.result);
  });
};
const AddEvent = function ({ currentLang, contentLang, eventDetails }) {
  const [formValue, setFormVaue] = useState();
  const [checkselectedOnline, setcheckselectedOnline] = useState(false);
  const [checkselectedOffline, setcheckselectedOffline] = useState(false);
  const [formLocation, setFormLocation] = useState([]);
  const [isEndDate, setIsEndDate] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allLocations, setAllLocations] = useState();
  const [fileList, setFileList] = useState([]);
  const [placeList, setPlaceList] = useState([]);
  const [virtualList, setVirtualList] = useState([]);
  const [orgList, setOrgList] = useState([]);
  const [publicsList, setPublicsList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [inLangList, setInLangList] = useState([]);
  const [dynamicList, setDynamicList] = useState([]);
  const [accessabilityList, setAccessabilityList] = useState([]);
  const [contactList, setContactList] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [showAddType, setShowAddType] = useState("Contact");
  const [numberOfDays, setNumberOfDays] = useState(0);
  const [compressedFile, setCompressedFile] = useState(null);
  const [offerConfig, setOfferConfig] = useState();
  const [offerIds, setOfferIds] = useState([]);
  const [orgRoleList, setOrgRole] = useState([])
  const [contibutorRoleList, setContributorRole] = useState([])
  const [performerRoleList, setPerformerRole] = useState([])

  const [orgSelectedRoleList, setOrgSelectedRole] = useState([])
  const [contibutorSelectedRoleList, setContributorSelectedRole] = useState([])
  const [performerSelectedRoleList, setPerformerSelectedRole] = useState([])

  const [youtubeLink, setYoutubeLink] = useState();
  const [imageFile, setImageFile] = useState();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [startDisable, setStartDisable] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [endDisable, setEndDisable] = useState(moment().format("YYYY-MM-DD"));
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const placeStore = useSelector((state) => state.place);
  const contactStore = useSelector((state) => state.contact);
  const orgStore = useSelector((state) => state.org);
  const audienceStore = useSelector((state) => state.audience);
  const typesStore = useSelector((state) => state.types);

  const checkAdmin = getCookies("user_token")?.user?.roles?.find(item => item.calendarId === getCookies("calendar-id"))

  const formatarray = (data) => {
    return data.map((item) => {
      const obj = {
        value: item.id,
        title: item.name[currentLang] ? item.name[currentLang] :
          currentLang === "fr" ? item.name["en"] : item.name["fr"],
        children: item.children ? formatarrayTree(item.children) : undefined,
      };
      return obj;
    });
  };
  const formatarrayTree = (data) => {
    return data.map((item) => {
      const obj = {
        value: item.id,
        title: item.name[currentLang] ? item.name[currentLang] :
          currentLang === "fr" ? item.name["en"] : item.name["fr"],
        children: item.children ? formatarrayTree(item.children) : undefined,
      };
      return obj;
    });
  };
  useEffect(() => {
    // if (audienceStore == null) {
    //   getPublics();
    // } else {
    //   setPublicsList(formatarray(audienceStore));
    // }

    // if (typesStore == null) {
    //   getTypes();
    // } else {
    //   setTypeList(formatarray(typesStore));
    // }

    getPublics();
    getOrgPublics();
    getVirtualLocation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (orgStore == null) {
      getOrg();
    } else {
      setOrgList(orgStore);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orgStore]);

  useEffect(() => {
    if (placeStore == null) {
      getAllPlaces();
    } else {
      setAllLocations(placeStore);
      setPlaceList(placeStore.places);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placeStore]);

  useEffect(() => {
    if (contactStore == null) {
      getContacts();
    } else {
      setContactList(
        contactStore.map((item) => {
          const obj = {
            name: item.name[currentLang] ? item.name[currentLang] :
              currentLang === "fr" ? item.name["en"] : item.name["fr"]
            , value: item.id
          };
          return obj;
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contactStore]);

  const getTypes = (page = 1) => {
    setLoading(true);
    ServiceApi.getTaxonomyType()
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;
          setTypeList(formatarray(events));
          dispatch(fetchTypes(response.data.data));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const getPublics = () => {

    ServiceApi.getFieldConcepts("EVENT")
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;
      
          setDynamicList(events.filter(item => (item?.isDynamicField)))
          setPublicsList(formatarray(events.filter(item => !(item.isDynamicField)).find(item => item.mappedToField === "Audience")?.concept?
          events.filter(item => !(item.isDynamicField)).find(item => item.mappedToField === "Audience")?.concept:[]));
          setAccessabilityList(formatarray(events.filter(item => !(item.isDynamicField)).find(item => item?.mappedToField === "EventAccessibility")?.concept?
          events.filter(item => !(item.isDynamicField)).find(item => item?.mappedToField === "EventAccessibility")?.concept:[]));
          setTypeList(formatarray(events.filter(item => !(item?.isDynamicField)).find(item => item?.mappedToField === "EventType")?.concept?
          events.filter(item => !(item?.isDynamicField)).find(item => item?.mappedToField === "EventType")?.concept:[]));


          setInLangList(formatarray(events.filter(item => !(item?.isDynamicField)).find(item => item?.mappedToField === "inLanguage")?.concept?
          events.filter(item => !(item?.isDynamicField)).find(item => item?.mappedToField === "inLanguage")?.concept:[]));


          setOrgRole(formatarray(events.filter(item => !(item?.isDynamicField)).find(item => item?.mappedToField === "OrganizerRole")?.concept?
          events.filter(item => !(item?.isDynamicField)).find(item => item?.mappedToField === "OrganizerRole")?.concept:[]));
          setPerformerRole(formatarray(events.filter(item => !(item?.isDynamicField)).find(item => item?.mappedToField === "PerformerRole")?.concept?
          events.filter(item => !(item?.isDynamicField)).find(item => item?.mappedToField === "PerformerRole")?.concept:[]));
          setContributorRole(formatarray(events.filter(item => !(item?.isDynamicField)).find(item => item?.mappedToField === "SupporterRole")?.concept?
          events.filter(item => !(item?.isDynamicField)).find(item => item?.mappedToField === "SupporterRole")?.concept:[]));

          
         
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const getOrgPublics = () => {

    ServiceApi.getFieldConcepts("ORGANIZATION")
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;

          
          console.log("ayatt", events.filter(item => (item?.isDynamicField)))


          // dispatch(fetchAudience(response.data.data));
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
          setContactList(
            events.map((item) => {
              const obj = { name: item.name["fr"], value: item.id };
              return obj;
            })
          );
        }
      })
      .catch((error) => { });
  };
  const getAllPlaces = () => {
    ServiceApi.getAllPlaces()
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;
          setPlaceList(events);
          setAllLocations(events);
          dispatch(fetchPlace(events));
        }
      })
      .catch((error) => { });
  };

  const getVirtualLocation = () => {
    ServiceApi.getVirtualPlaces()
      .then((response) => {
        if (response && response.data && response.data.data) {
          const events = response.data.data;
          setVirtualList(events)
        }
      })
      .catch((error) => { });
  };

  const handleSubmit = (values) => {

    const dynamicField = dynamicList.map(item => {
      const obj = {
        conceptIds: values[item?.id],
        taxonomyId: item?.id,

      }
      return obj;
    })
   
    setLoading(true);
    if (!isRecurring) {
      if (values.startTime)
      values.startDate.set({
        h: values.startTime.get("hour"),
        m: values.startTime.get("minute"),
      });
      if (isEndDate && values.endTime)
        values.endDate.set({
          h: values.endTime.get("hour"),
          m: values.endTime.get("minute"),
        });
    }
    const eventObj = {
      // image: imageFile,
      languages: values.languages,
      eventStatus: values.eventStatus,
      accessibilityNote: values.accessabilityNote,
      dynamicFields: dynamicField,
      startDate:values.startTime?undefined: !isRecurring
        ?  moment(values.startDate).format("YYYY-MM-DD")
        : undefined,
      startDateTime:values.startTime? !isRecurring
        ? ServiceApi.parseDate(
          moment(values.startDate).format("YYYY-MM-DD"),
          moment(values.startTime).format("HH:mm"),
          values.timeZone
        )
        : undefined:undefined,
      scheduleTimezone: values.timeZone,
      locationId: {
        place: {
          entityId: formLocation.find((item) => item.type === "Offline")
            ? formLocation.find((item) => item.type === "Offline").value
            : null,
        },
        virtualLocation: {
          entityId: formLocation.find((item) => item.type === "Online")
            ? formLocation.find((item) => item.type === "Online").value
            : null,
        },
      },
      contactPoint: values.contact
        ? {
          entityId: values.contact,
        }
        : null,
      url: values.eventPage && { uri: values.eventPage },
      facebookUrl: values.facebookLink,
      videoUrl: values.videoUrl,
      offerConfiguration: offerConfig,
      offers:
        offerIds &&
        offerIds.map((item) => {
          const obj = { entityId: item };
          return obj;
        }),
      // organizer: values.organization
      //   ? {
      //       organization: values.organization.map((item) => {
      //         const obj = {
      //           entityId: item,
      //         };
      //         return obj;
      //       }),
      //     }
      //   : undefined,

      audience: values.audience
        ? values.audience.map((item) => {
          const obj = {
            entityId: item,
          };
          return obj;
        })
        : undefined,
        organizers: orgSelectedRoleList.filter(item=>item.entityId).map(({ id, ...item }) => item),
        performers: performerSelectedRoleList.filter(item=>item.entityId).map(({ id, ...item }) => item),
        collaborators: contibutorSelectedRoleList.filter(item=>item.entityId).map(({ id, ...item }) => item),

      additionalType: values.type
        ? values.type.map((item) => {
          const obj = {
            entityId: item,
          };
          return obj;
        })
        : undefined,
      accessibility: values.accessability
        ? values.accessability.map((item) => {
          const obj = {
            entityId: item,
          };
          return obj;
        })
        : undefined,
        inLanguage: values.inLanguage
        ? values.inLanguage.map((item) => {
          const obj = {
            entityId: item,
          };
          return obj;
        })
        : undefined,
    };
    if(imageFile)
      eventObj.image = imageFile
    if (contentLang == "bilengual") {
      eventObj.name = { fr: values.title, en: values.titleEn };
      eventObj.description = { fr: values.desc, en: values.descEn }
    }
    else {
      if (eventDetails) {

        eventObj.name = {
          [contentLang]: values.title,
          [contentLang == "fr" ? "en" : "fr"]: eventDetails?.name[[contentLang == "fr" ? "en" : "fr"]]
        };
        eventObj.description = {
          [contentLang]: values.desc,
          [contentLang == "fr" ? "en" : "fr"]: eventDetails?.description[contentLang == "fr" ? "en" : "fr"]
        }

      }
      else {
        eventObj.name = { [contentLang]: values.title };
        eventObj.description = { [contentLang]: values.desc }
      }
    }
    if (isEndDate && !isRecurring)
    {
      if(values.endTime)
       eventObj.endDateTime = moment(values.endDate).format("YYYY-MM-DDTHH:mm:ss");
      else 
       eventObj.endDate = moment(values.endDate).format("YYYY-MM-DD")
    }
    if (isRecurring) {
      const recurEvent = {
        frequency: values.frequency,
        startDate:
          form.getFieldsValue().frequency !== "CUSTOM"
            ? moment(values.startDateRecur[0]).format("YYYY-MM-DD")
            : undefined,
        endDate:
          form.getFieldsValue().frequency !== "CUSTOM"
            ? moment(values.startDateRecur[1]).format("YYYY-MM-DD")
            : undefined,
        startTime:
          form.getFieldsValue().frequency !== "CUSTOM"
            ? moment(values.startTimeRecur).format("HH:mm")
            : undefined,
        endTime:
          form.getFieldsValue().frequency !== "CUSTOM" && values.endTimeRecur
            ? moment(values.endTimeRecur).format("HH:mm")
            : undefined,
        weekDays: values.frequency === "WEEKLY" ? values.daysOfWeek : undefined,
        customDates:
          form.getFieldsValue().frequency === "CUSTOM"
            ? form.getFieldsValue().customDates
            : undefined,
      };
      eventObj.recurringEvent = recurEvent;
    }

    if (eventDetails)
      ServiceApi.updateEvent(eventObj, eventDetails.id)
        .then((response) => {
          if (response && response.data) {
            setLoading(false);
                  message.success("Event Updated Successfully");
                  navigate(`/admin/events`);
            // if (isUpload && fileList.length > 0)
            //   ServiceApi.imageUpload(
            //     eventDetails.id,
            //     fileList[0].originFileObj,
            //     compressedFile
            //   )
            //     .then((response) => {
            //       setLoading(false);
            //       message.success("Event Updated Successfully");
            //       navigate(`/admin/events`);
            //     })
            //     .catch((error) => {
            //       setLoading(false);
            //     });
            // else {
            //   setLoading(false);
            //   message.success("Event Updated Successfully");
            //   navigate(`/admin/events`);
            // }
          }
        })
        .catch((error) => {
          setLoading(false);
        });
    else
      ServiceApi.addEvent(eventObj)
        .then((response) => {
          if (response && response.data) {
            setLoading(false);
                  message.success("Event Created Successfully");
                  navigate(`/admin/events`);
            // if (isUpload && fileList.length > 0)
            //   ServiceApi.imageUpload(
            //     response.data.id,
            //     fileList[0].originFileObj,
            //     compressedFile
            //   )
            //     .then((response) => {
            //       setLoading(false);
            //       message.success("Event Created Successfully");
            //       navigate(`/admin/events`);
            //     })
            //     .catch((error) => {
            //       setLoading(false);
            //     });
            // else {
            //   setLoading(false);
            //   message.success("Event Created Successfully");
            //   navigate(`/admin/events`);
            // }
          }
        })
        .catch((error) => { });
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
      setOfferConfig(eventDetails?.offerConfiguration);
      setOfferIds(eventDetails?.offers?.map((item) => item.id));
      setYoutubeLink(eventDetails?.videoUrl);
      setOrgSelectedRole(eventDetails.organizer?eventDetails.organizer:[])
      setContributorSelectedRole(eventDetails.collaborators?eventDetails.collaborators:[])
      setPerformerSelectedRole(eventDetails.performer?eventDetails.performer:[])
      form.setFieldsValue({
        // "6353ffdf212b820058acf819":["6353fff9212b820058acf83e"],
        languages: eventDetails.languages,
        eventStatus: eventDetails.eventStatus,
        contact: eventDetails.contactPoint?.id,
        desc: eventDetails.description
          ? eventDetails.description[contentLang]
            ? eventDetails.description[contentLang] === "<p><br></p>"
              ? "<p>&nbsp;</p>"
              : eventDetails.description[contentLang]
            : "<p>&nbsp;</p> "
          : "<p>&nbsp;</p>",
        location:
          eventDetails.locations &&
          eventDetails.locations.map((item) => item.id),
        startDate: moment(new Date(eventDetails.startDate?eventDetails.startDate:eventDetails.startDateTime), "DD-MM-YYYY")
        // .tz(
        //   eventDetails.scheduleTimezone
        //     ? eventDetails.scheduleTimezone
        //     : "Canada/Eastern")
        ,
        endDate: eventDetails.endDate
          ? moment(new Date(eventDetails.endDate), "DD-MM-YYYY").tz(
            eventDetails.scheduleTimezone
              ? eventDetails.scheduleTimezone
              : "Canada/Eastern"
          )
          :eventDetails.endDateTime
          ? moment(new Date(eventDetails.endDateTime), "DD-MM-YYYY").tz(
            eventDetails.scheduleTimezone
              ? eventDetails.scheduleTimezone
              : "Canada/Eastern"
          )
          : undefined,
        title: eventDetails.name[contentLang],
        endTime: eventDetails.endDateTime && eventDetails.endDateTime
          ? moment(new Date(eventDetails.endDateTime), "HH-mm").tz(
            eventDetails.scheduleTimezone
              ? eventDetails.scheduleTimezone
              : "Canada/Eastern"
          )
          : undefined,
        startTime: eventDetails.startDateTime && moment(new Date(eventDetails.startDateTime), "HH-mm").tz(
          eventDetails.scheduleTimezone
            ? eventDetails.scheduleTimezone
            : "Canada/Eastern"
        ),
        timeZone: eventDetails.scheduleTimezone
          ? eventDetails.scheduleTimezone
          : "Canada/Eastern",
        eventPage: eventDetails.url?.uri,
        facebookLink: eventDetails.facebookUrl,
        videoUrl: eventDetails?.videoUrl,
        // organization: eventDetails?.organizer?.organizations?.map(
        //   (item) => item.id
        // ),
        audience: eventDetails?.audience?.map((item) => item?.entityId),
        type: eventDetails?.additionalType?.map(
          (item) => item?.entityId
        ),
        accessability: eventDetails?.accessibility?.map(
          (item) => item?.entityId
        ),
        inLanguage: eventDetails?.inLanguage?.map(
          (item) => item?.entityId
        ),
       
        accessabilityNote: eventDetails?.accessibilityNote
      });
      if (contentLang == "bilengual") {
        form.setFieldsValue({
          title: eventDetails.name?.fr,
          titleEn: eventDetails.name?.en,
          desc: eventDetails.description && eventDetails.description.fr ? (eventDetails.description.fr == "<p><br></p>"
            ? "<p>&nbsp;</p>"
            : eventDetails.description.fr) : "<p>&nbsp;</p>",
          descEn: eventDetails.description && eventDetails.description.en ? (eventDetails.description.en == "<p><br></p>"
            ? "<p>&nbsp;</p>"
            : eventDetails.description.en) : "<p>&nbsp;</p>",
        })
      }
      else {
        form.setFieldsValue({
          title: eventDetails.name[contentLang],
          desc: eventDetails.description
            ? eventDetails.description[contentLang]
              ? eventDetails.description[contentLang] === "<p><br></p>"
                ? "<p>&nbsp;</p>"
                : eventDetails.description[contentLang]
              : "<p>&nbsp;</p> "
            : "<p>&nbsp;</p>",
        })
      }
      if (eventDetails.locations) {
        const eventFormLoc = eventDetails.locations.map((item) => {
          const obj = {
            value: item.id,
            type: item.isVirtualLocation ? "Online" : "Offline",
          };
          return obj;
        });
        setFormLocation(eventFormLoc);
        const objOnline = eventFormLoc.find((item) => item.type === "Online");
        const objOffline = eventFormLoc.find((item) => item.type === "Offline");
        if (objOffline) setcheckselectedOffline(true);
        else setcheckselectedOffline(false);

        if (objOnline) setcheckselectedOnline(true);
        else setcheckselectedOnline(false);
      }
      if (eventDetails.image) {
        const obj = {
          uid: "-1",
          name: "image.png",
          status: "done",
          url: eventDetails.image?.thumbnail,
        };
        setFileList([obj]);
        const imageData = {
          original: {
            entityId: eventDetails.image?.original,
          },
          large: {
            entityId: eventDetails.image?.large,
          },
          thumbnail: {
            entityId: eventDetails.image?.thumbnail,
          },
        };
        //  setImageFile(imageData)
      } else setFileList([]);
      if (eventDetails.recurringEvent) {
        setNumberOfDays(eventDetails.subEvents?.length);
        form.setFieldsValue({
          frequency: eventDetails.recurringEvent?.frequency,
          startDateRecur: [
            moment(
              moment(
                eventDetails.recurringEvent?.startDate
                  ? eventDetails.recurringEvent?.startDate
                  : eventDetails.startDate,
                "YYYY-MM-DD"
              ).format("DD-MM-YYYY"),
              "DD-MM-YYYY"
            ),
            moment(
              moment(
                eventDetails.recurringEvent?.endDate
                  ? eventDetails.recurringEvent?.endDate
                  : eventDetails.endDate,
                "YYYY-MM-DD"
              ).format("DD-MM-YYYY"),
              "DD-MM-YYYY"
            ),
          ],
          startTimeRecur: eventDetails.recurringEvent.startTime
            ? moment(eventDetails.recurringEvent?.startTime, "HH:mm")
            : undefined,
          endTimeRecur: eventDetails.recurringEvent.endTime
            ? moment(eventDetails.recurringEvent?.endTime, "HH:mm")
            : undefined,
          customDates: eventDetails.recurringEvent?.customDates,
          daysOfWeek: eventDetails.recurringEvent?.weekDays,
        });
        setIsRecurring(true);
        const obj = {
          startTimeRecur: eventDetails.recurringEvent.startTime
            ? moment(eventDetails.recurringEvent?.startTime, "HH:mm")
            : undefined,
        };
        setFormVaue(obj);
      }
    } else
      form.setFieldsValue({
        frequency: "DAILY",
        timeZone: "Canada/Eastern",
        desc: "",
        descEn: ""
      });
    setFormVaue(form.getFieldsValue());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventDetails]);

  useEffect(() => {

    if (eventDetails && eventDetails.dynamicFields && dynamicList.length > 0) {
      const eventDynamic = eventDetails.dynamicFields;
      if (Array.isArray(eventDynamic))
        for (let i = 0; i <= eventDynamic.length; i++) {

          if (eventDynamic[i]?.taxonomyId)
          {
            form.setFieldsValue({
              [eventDynamic[i].taxonomyId]: eventDynamic[i].conceptIds
            })
           
          }
        }


    }
  }, [eventDetails, dynamicList])

  const closeWithId = (id) => {
    setShowAddContact(false);
    if (showAddType === "Contact") {
      form.setFieldsValue({
        contact: id,
      });
    } else if (showAddType === "Virtual Location"){
      getVirtualLocation()
    }
    else if (showAddType === "Location") {
      form.setFieldsValue({
        location: [id],
      });

      const obj = [
        {
          value: id,
          type: "Offline",
        },
      ];

      setFormLocation(obj);
      setcheckselectedOffline(true);
      setcheckselectedOnline(false);
      setFormVaue(form.getFieldsValue());
    } else {
      form.setFieldsValue({
        organization: [id],
      });
    }
  };
  const onChangeStart = (date, dateString) => {
    setStartDisable(moment(dateString, "MM-DD-YYYY"));
  };
  const onChangeEnd = (date, dateString) => {
    setEndDisable(moment(dateString, "MM-DD-YYYY"));
  };

  const handleChangeLoc = (value, option) => {
    const objOnline = option.find((item) => item.type === "Online");
    const objOffline = option.find((item) => item.type === "Offline");
    setFormLocation(option);
    if (objOffline) setcheckselectedOffline(true);
    else setcheckselectedOffline(false);

    if (objOnline) setcheckselectedOnline(true);
    else setcheckselectedOnline(false);
  };

  const showAddModal = (typeName) => {
    setShowAddContact(true);
    setShowAddType(typeName);
    console.log("test")
  };
  const onChange = (info) => {
    setIsUpload(true);
    setFileList(info.fileList);
    new Compressor(info.fileList[0].originFileObj, {
      convertSize: 200000,
      success: (compressedResult) => {
        setCompressedFile(compressedResult);
        setLoading(true)
        ServiceApi.imageUpload(
          "id",
          fileList[0].originFileObj,
          compressedResult
        )
          .then((response) => {
            setLoading(false);
            setImageFile(response.data.data)
          })
          .catch((error) => {
            setLoading(false);
          });
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

  const closePriceModal = (config, ids) => {
    setOfferConfig(config);
    setOfferIds(ids);
  };

  const handlePublish = (id) => {

    setLoading(true);
    ServiceApi.publishEvents(id)
      .then((response) => {

        if (response && response.data && response.data) {
          message.success("Event published successfully")
          navigate(`/admin/events`);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
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
            <div className="update-select-title">{t("Title")} {contentLang == "bilengual" && "@fr"}</div>
            <Form.Item
              name="title"
              className="status-comment-item"
              rules={[
                {
                  required: contentLang == "bilengual" ? formValue?.titleEn?.length > 0 ? false : true : true,
                  message: "Event name required",
                  whitespace: true,
                },
              ]}
            >
              <Input placeholder="Enter Event Name" className="replace-input" />
            </Form.Item>
            {
              contentLang == "bilengual" &&
              <>
                <div className="update-select-title">{t("Title")} @en</div>
                <Form.Item
                  name="titleEn"
                  className="status-comment-item"
                  rules={[
                    {
                      required: formValue?.title?.length > 0 ? false : true,
                      message: "Event name required",
                      whitespace: true,
                    },
                  ]}
                >
                  <Input placeholder="Enter Event Name" className="replace-input" />
                </Form.Item>
              </>
            }
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
                    rules={[{ required: false, message: "Start time required" }]}
                  >
                    <TimePicker format="HH:mm" />
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
                    rules={[{ required: false, message: "End time required" }]}
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

            <div className="update-select-title">
              {t("Location", { lng: currentLang })}
            </div>

            <Form.Item name={"location"}>
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
                    <Divider style={{ margin: "8px 0" }} />
                    <Space align="center" style={{ padding: "0 8px 4px" }}>
                      <Typography.Link
                        onClick={() => showAddModal("Virtual Location")}
                        style={{ whiteSpace: "nowrap" }}
                      >
                        <PlusOutlined /> Add New Virtual Location
                      </Typography.Link>
                    </Space>
                    
                  </>
                )}
              >
                <OptGroup label={t("Online", { lng: currentLang })}>
                  {virtualList &&
                      virtualList.map((item) => (
                      <Option
                        type="Online"
                        value={item.id}
                        disabled={
                          formValue?.location?.includes(item.id)
                            ? false
                            : checkselectedOnline
                        }
                        key={item.id}
                      >
                        {item.name["fr"]}
                      </Option>
                    ))}
                </OptGroup>
                <OptGroup label={t("Offline", { lng: currentLang })}>
                  {allLocations &&
                    allLocations.map((item) => (
                      <Option
                        type="Offline"
                        value={item.id}
                        disabled={
                          formValue?.location?.includes(item.id)
                            ? false
                            : checkselectedOffline
                        }
                        key={item.id}
                      >
                        {item.name[currentLang] ? item.name[currentLang] :
                          currentLang === "fr" ?
                            item.name["en"] : item.name["fr"]}
                      </Option>
                    ))}
                </OptGroup>
              </Select>
            </Form.Item>

            <div className="update-select-title">
              {t("Publics", { lng: currentLang })}
            </div>

            <Form.Item name={"audience"} rules={[{ required: false }]}>
              <TreeSelect
               showSearch
                style={{ width: "100%" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                treeData={publicsList}
                multiple
                placeholder="Please select"
                treeNodeFilterProp="label"
                filterTreeNode={(search, item) => {
                  return item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                }}
              />
            </Form.Item>



            <div className="update-select-title">
              {t("Types", { lng: currentLang })}
            </div>

            <Form.Item name={"type"} rules={[{ required: false }]}>
              <TreeSelect
              showSearch
                style={{ width: "100%" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                treeData={typeList}
                multiple
                placeholder="Please select"
                treeNodeFilterProp="label"
                filterTreeNode={(search, item) => {
                  return item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                }}
              />
            </Form.Item>

            <div className="update-select-title">
              {t("EventAccessibility", { lng: currentLang })}
            </div>

            <Form.Item name={"accessability"} rules={[{ required: false }]}>
              <TreeSelect
              showSearch
                style={{ width: "100%" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                treeData={accessabilityList}
                multiple
                placeholder="Please select"
                treeNodeFilterProp="label"
                filterTreeNode={(search, item) => {
                  return item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                }}
              />
            </Form.Item>

            <div className="update-select-title">
              {t("inLanguage", { lng: currentLang })}
            </div>
            <Form.Item name={"inLanguage"} rules={[{ required: false }]}>
              <TreeSelect
              showSearch
                style={{ width: "100%" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                treeData={inLangList}
                multiple
                placeholder="Please select"
                treeNodeFilterProp="label"
                filterTreeNode={(search, item) => {
                  return item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                }}
              />
            </Form.Item>

            <div className="update-select-title">
              {t("Event Accessibility Note", { lng: currentLang })}
            </div>

            <Form.Item name={"accessabilityNote"} rules={[{ required: false }]}>
              <Input placeholder="Enter Event Accessability Note" className="replace-input" />
            </Form.Item>

            {dynamicList.length > 0 &&
              dynamicList.map(item =>
                <div key={item.id}>
                  <div className="update-select-title">
                    {t(item?.name?.fr, { lng: currentLang })}
                  </div>

                  <Form.Item name={item?.id} rules={[{ required: false }]}>
                    <TreeSelect
                    
                      style={{ width: "100%" }}
                      dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                      treeData={formatarray(item.concept)}
                      multiple
                      placeholder="Please select"
                      showSearch
                      treeNodeFilterProp="label"
                      filterTreeNode={(search, item) => {
                        return item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
                      }}
                    />
                  </Form.Item>
                </div>
              )}
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
                    <Option key={item.value} value={item.value}>
                      {item.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Button
                size="large"
                style={{
                  marginBottom: "20px",
                  border: " 1px dashed #abaeb2",
                  width: "350px",
                }}
                onClick={() => setShowPriceModal(true)}
              >
                Price/Prix
              </Button>
              {offerConfig && (
                <Card
                  size="small"
                  extra={
                    <DeleteOutlined
                      onClick={() => {
                        setOfferIds([]);
                        setOfferConfig();
                      }}
                    />
                  }
                  title="PRIX"
                  style={{ width: 355, marginBottom: "10px" }}
                >
                  <div>{offerConfig.category}</div>
                  <div style={{ wordBreak: "break-all", color: "#838080" }}>
                    {offerConfig.url?.uri}
                  </div>
                  {offerConfig.prices?.map((item) => (
                    <div>
                      <span>
                        {item.price} ${offerConfig.priceCurrency}
                      </span>{" "}
                      {item.desc && <span>({item.desc})</span>}
                    </div>
                  ))}
                </Card>
              )}

              {/* <div className="update-select-title">
                {t("Organization Role", { lng: currentLang })}
              </div>

              <Form.Item name={"organizationRole"} rules={[{ required: false }]}>
                <TreeSelect
                  style={{ width: "100%" }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  treeData={orgRoleList}
                  multiple
                  placeholder="Please select"
                />
              </Form.Item>



              <div className="update-select-title">
                {t("Performer Role", { lng: currentLang })}
              </div>

              <Form.Item name={"performerRole"} rules={[{ required: false }]}>
                <TreeSelect
                  style={{ width: "100%" }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  treeData={performerRoleList}
                  multiple
                  placeholder="Please select"
                />
              </Form.Item>

              <div className="update-select-title">
                {t("Contributor Role", { lng: currentLang })}
              </div>

              <Form.Item name={"contributorRole"} rules={[{ required: false }]}>
                <TreeSelect
                  style={{ width: "100%" }}
                  dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                  treeData={contibutorRoleList}
                  multiple
                  placeholder="Please select"
                />
              </Form.Item> */}
              <RoleOrganizer orgList={orgList}
                contibutorRoleList={orgRoleList}
                currentLang={currentLang}
                contentLang={contentLang}
                selectedRoleList={orgSelectedRoleList}
                setSelectedRoleList={setOrgSelectedRole}
                eventDetails={eventDetails}
                nameTitle="OrganizerRole" />

              <RoleOrganizer orgList={orgList}
                contibutorRoleList={performerRoleList}
                currentLang={currentLang}
                contentLang={contentLang}
                selectedRoleList={performerSelectedRoleList}
                setSelectedRoleList={setPerformerSelectedRole}
                eventDetails={eventDetails}
                nameTitle="PerformerRole" />

              <RoleOrganizer orgList={orgList}
                contibutorRoleList={contibutorRoleList}
                currentLang={currentLang}
                contentLang={contentLang}
                selectedRoleList={contibutorSelectedRoleList}
                setSelectedRoleList={setContributorSelectedRole}
                eventDetails={eventDetails}
                nameTitle="SupporterRole" />
              {/* <div className="update-select-title">
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
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
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
                        value={item.id}
                        key={item.id}
                      >
                        {item.name[currentLang]?item.name[currentLang]:
                        currentLang==="fr"?item.name["en"]:item.name["fr"]}
                      </Option>
                    ))}
                </Select>
              </Form.Item> */}

              <div className="update-select-title">
                {t("FacebookLink", { lng: currentLang })}
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
                    message: "Enter valid facebook link.",
                    validator: (_, value) => {
                      if (fbUrlValidate(value)) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject("Enter valid facebbok link.");
                      }
                    },
                  },
                ]}
                validateTrigger="onBlur"
              >
                <Input
                  placeholder="Enter Event FB Link"
                  className="replace-input"
                />
              </Form.Item>
              <div className="update-select-title">
                {t("Event", { lng: currentLang })} Page Link
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
                    message: "Enter valid url.",
                    validator: (_, value) => {
                      if (urlValidate(value)) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject("Enter valid url.");
                      }
                    },
                  },
                ]}
                validateTrigger="onBlur"
              >
                <Input
                  placeholder="Enter Event Url"
                  className="replace-input"
                />
              </Form.Item>

              <div className="update-select-title">
                {t("Video", { lng: currentLang })} Link
              </div>
              <Form.Item
                name="videoUrl"
                className="status-comment-item"
                rules={[
                  {
                    required: false,
                    message: "Video Link required",
                    whitespace: true,
                  },
                  {
                    message: "Enter valid video link.",
                    validator: (_, value) => {
                      if (videoUrlValidate(value)) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject("Enter valid video link.");
                      }
                    },
                  },
                ]}
                validateTrigger="onBlur"
              >
                <Input
                  placeholder="Enter video Url"
                  onChange={(e) => setYoutubeLink(e.target.value)}
                  className="replace-input"
                />
              </Form.Item>
              {youtubeLink && videoUrlValidate(youtubeLink) && (
                youtubeLink.includes("vimeo.com") ?
                  <>
                    <iframe title={youtubeLink} src={`${youtubeLink.replace("vimeo.com", "player.vimeo.com/video")}?h=eda036ee8b&color=ffffff&portrait=0&badge=0`} width="400" height="300" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
                    <p><a href="https://www.youtube.com/watch?v=ysz5S6PUM-U"><div style={{ display: "none" }}>Vemio</div></a></p>
                  </> : <ReactPlayer url={youtubeLink} width="400px" height="300px" />

              )}

            </div>
          </Col>
        </Row>
        <div style={{ display: contentLang == "bilengual" && "flex" }}>
          <div style={{ minWidth: "50%", marginRight: "5px" }}>
            <div className="update-select-title">{t("Description", { lng: currentLang })} {contentLang == "bilengual" && "@fr"}</div>

            <EventEditor formName="desc" />
          </div>
          {
            contentLang == "bilengual" &&
            <div style={{ minWidth: "50%" }}>
              <div className="update-select-title">{t("Description", { lng: currentLang })} @en</div>

              <EventEditor formName="descEn" />
            </div>
          }
        </div>

        <Row>
          <Col flex="0 1 450px">
            <div className="update-select-title">{t("EventStatus", { lng: currentLang })}</div>
            <Form.Item
              name="eventStatus"
              className="status-comment-item"
              rules={[{ required: false, message: "Status required" }]}
            >
              <Select
                style={{ width: 337 }}
                placeholder={`Select Event Status`}
                key="updateDropdownKey"
                className="search-select"
                optionFilterProp="children"
                defaultValue="SCHEDULED"
              // onChange={handleChange}
              >
                <Option value="SCHEDULED">SCHEDULED</Option>
                <Option value="POSTPONED">POSTPONED</Option>
                <Option value="CANCELLED">CANCELLED</Option>
              </Select>
            </Form.Item>
          </Col>
          {/* <Col>
            <div className="update-select-title">{t("Language", { lng: currentLang })}</div>
            <Form.Item
              name="languages"
              className="status-comment-item"
              rules={[{ required: false, message: "Language required" }]}
            >
              <Select
                style={{ width: 337 }}
                placeholder={`Select Language`}
                key="updateDropdownKey"
                className="search-select"
                optionFilterProp="children"
                mode="multiple"
              // defaultValue="French"
              // onChange={handleChange}
              >
                <Option value="English">English</Option>
                <Option value="French">French</Option>

              </Select>
            </Form.Item>
          </Col> */}
        </Row>

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
          {eventDetails && ((getCookies("user_token")?.user?.isSuperAdmin || (checkAdmin && (checkAdmin.role === "ADMIN" || checkAdmin.role === "SUPER_ADMIN" || checkAdmin.role === "EDITOR")))
            || (checkAdmin && (checkAdmin.role === "GUEST" || checkAdmin.role === "CONTRIBUTOR") && getCookies("user_token")?.user?.id === eventDetails?.creator?.userId)
          ) && eventDetails.publishState == "Draft" &&
            <div className="flex-centre">
              <div style={{ width: "125px" }}>This event is in draft mode</div>
              <Button
                size="large"

                onClick={() => {
                  handlePublish(eventDetails.id)
                }}
              >
                Publish
              </Button>
            </div>
          }
        </Form.Item>
      </Form>
      {showAddContact && (
        <AddNewContactModal
          isModalVisible={showAddContact}
          setIsModalVisible={setShowAddContact}
          type={showAddType}
          currentLang={currentLang}
          contentLang={contentLang}
          closeWithId={closeWithId}
        />
      )}
      {showPriceModal && (
        <PriceModal
          isModalVisible={showPriceModal}
          setIsModalVisible={setShowPriceModal}
          currentLang={currentLang}
          contentLang={contentLang}
          offerConfig={offerConfig}
          closePriceModal={closePriceModal}
        />
      )}
      {loading && <Spinner />}
    </Layout>
  );
};
export default AddEvent;
AddEvent.propTypes = {
  currentLang: PropTypes.string,
};
