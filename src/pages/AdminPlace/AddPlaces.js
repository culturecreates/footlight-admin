/* eslint-disable react-hooks/exhaustive-deps */
import { Layout, Form, Input, Button, message,Select ,TreeSelect} from "antd";
import React, { useState, useEffect } from "react";
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-places-autocomplete";
import { useNavigate } from "react-router-dom";
import { useTranslation,  } from "react-i18next";
import {
  
  CheckOutlined,
  CloseOutlined,
  
} from "@ant-design/icons";
import { adminPlaces, urlValidate } from "../../utils/Utility";
import ServiceApi from "../../services/Service";
import Spinner from "../../components/Spinner";
import { useDispatch } from "react-redux";
import { fetchPlace } from "../../action";

const { Option } = Select;
const AddPlaces = function ({ currentLang,contentLang,placeDetails,isModal=false,onsuccessAdd,onsuccessAddById }) {
  const [address, setAddress] = useState("");
  const [addressEn, setAddressEn] = useState("");
  const [loading, setLoading] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [containsList, setContainsList] = useState([]);
  const [accessabilityList, setAccessabilityList] = useState([]);
  const [dynamicList, setDynamicList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [typesList, setTypesList] = useState([]);

  const [formValue, setFormVaue] = useState();
  const { t,  } = useTranslation();
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
  

    // getAccessability();
    getPublics();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPublics = () => {
    
    ServiceApi.getFieldConcepts("PLACE")
      .then((response) => {
        if (response && response.data && response.data?.data) {
          const events = response.data.data;
          setDynamicList(events.filter(item=>(item.isDynamicField)))
         
          setRegionList(formatarray(events.filter(item => !(item.isDynamicField)).find(item => item.mappedToField == "Region")?.concept));
          setAccessabilityList(formatarray(events.find(item=>item.mappedToField=="PlaceAccessibility")?.concept));
          setTypesList(formatarray(events.filter(item => !(item.isDynamicField)).find(item=>item.mappedToField=="Type")?.concept));

          // dispatch(fetchAudience(response.data.data));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const getAccessability = (page = 1) => {
    // setLoading(true);
    ServiceApi.getFieldConcepts("PLACE")
      .then((response) => {
        if (response && response.data && response.data) {
          const events = response.data;
          setAccessabilityList(formatarray(events.find(item=>item.taxonomy.mappedToField=="PlaceAccessibility")?.concepts));
          // dispatch(fetchAudience(response.data.data));
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const formatarray = (data) => {
    return data.map((item) => {
      const obj = {
        value: item.id,
        title: item.name[currentLang]?item.name[currentLang]:
        currentLang==="fr"?item.name["en"]:item.name["fr"],
        children: item.children ? formatarrayTree(item.children) : undefined,
      };
      return obj;
    });
  };
  const formatarrayTree = (data) => {
    return data.map((item) => {
      const obj = {
        value: item.id,
        title: item.name[currentLang]?item.name[currentLang]:
        currentLang==="fr"?item.name["en"]:item.name["fr"],
        children: item.children ? formatarrayTree(item.children) : undefined,
      };
      return obj;
    });
  };

  const handleChange = (address) => {
    setAddress(address);
  };

  const handleChangeEn = (address) => {
    setAddressEn(address);
  };

  const handleSelect = (address) => {
    geocodeByAddress(address)
      .then((results) => {
        form.setFieldsValue({
          name: address.split(",").splice(0, 1).join(""),
          nameEn: address.split(",").splice(0, 1).join(""),
          addressCountry: results[0].address_components.find((item) =>
            item.types.includes("country")
          )?.long_name,
          addressCountryEn: results[0].address_components.find((item) =>
            item.types.includes("country")
          )?.long_name,
          addressLocality: results[0].address_components.find((item) =>
            item.types.includes("locality")
          )?.long_name,
          addressLocalityEn: results[0].address_components.find((item) =>
          item.types.includes("locality")
        )?.long_name,
          addressRegion: results[0].address_components.find(
            (item) =>
              item.types.includes("administrative_area_level_2") ||
              item.types.includes("administrative_area_level_3")
          )?.long_name,
          addressRegionEn: results[0].address_components.find(
            (item) =>
              item.types.includes("administrative_area_level_2") ||
              item.types.includes("administrative_area_level_3")
          )?.long_name,
          postalCode: results[0].address_components.find((item) =>
            item.types.includes("postal_code")
          )?.long_name,
          // containedInPlace: results[0].address_components.find((item) =>
          //   item.types.includes("route")
          // )?.long_name,

          streetAddress: results[0].formatted_address,
          streetAddressEn: results[0].formatted_address,
        });

        return getLatLng(results[0]);
      })
      .then((latLng) =>
        form.setFieldsValue({ latitude: ''+latLng.lat, longitude: ''+latLng.lng })
      )
      .catch((error) => console.error("Error", error));
  };
  const handleSubmit = (values) => {
    const dynamicField =  dynamicList.map(item=>{
      const obj ={
        conceptIds: values[item?.id],
        taxonomyId: item.id,
       
      }
      return obj;
    })

    const postalObj = {
      addressCountry: {[contentLang]:values.addressCountry},
      addressLocality: {[contentLang]:values.addressLocality},
      addressRegion: {[contentLang]:values.addressRegion},
      postalCode: values.postalCode,
      streetAddress: {[contentLang]:values.streetAddress},
      
    };

    if(contentLang == "bilengual")
    {
      postalObj.addressCountry = {fr:values.addressCountry, en: values.addressCountryEn};
      postalObj.addressLocality= {fr:values.addressLocality ,en:values.addressLocalityEn};
      postalObj.addressRegion = {fr:values.addressRegion, en: values.addressRegionEn};
      postalObj.streetAddress= {fr:values.streetAddress ,en:values.streetAddressEn};
    }
    else{
      if(placeDetails)
      {
        postalObj.addressCountry = {[contentLang]:values.addressCountry,
          [contentLang=="fr"?"en":"fr"]: placeDetails?.address?.addressCountry[[contentLang=="fr"?"en":"fr"]]};
          postalObj.addressLocality= {[contentLang]:values.addressLocality,
          [contentLang=="fr"?"en":"fr"]: placeDetails?.address?.addressLocality[[contentLang=="fr"?"en":"fr"]]};

        postalObj.addressRegion = {[contentLang]:values.addressRegion,
          [contentLang=="fr"?"en":"fr"]: placeDetails?.address?.addressRegion[[contentLang=="fr"?"en":"fr"]]};
          postalObj.streetAddress= {[contentLang]:values.streetAddress,
          [contentLang=="fr"?"en":"fr"]: placeDetails?.address?.streetAddress[[contentLang=="fr"?"en":"fr"]]};
      }
      else{
        postalObj.addressCountry = {[contentLang]:values.addressCountry};
        postalObj.description= {[contentLang]:values.description}
        postalObj.addressRegion = {[contentLang]:values.addressRegion};
        postalObj.streetAddress= {[contentLang]:values.streetAddress}
      }
      
    }
    setLoading(true)
    if (placeDetails)
    {
    if(!placeDetails.address)
    {
      ServiceApi.addPostalAddress(postalObj)
      .then((response) => {
        if (response && response.data) {
          const placeObj = {
            name: {
              
              [contentLang]: values.name,
            },
            description: {
              
              [contentLang]: values.description,
            },
            
           openingHours: values.openingHours,

            postalAddressId: {
              entityId: response.data.id,
            },
            containedInPlace: values.containedInPlace?{entityId:values.containedInPlace}:undefined,
           
            geo: {
              latitude: values.latitude,
              longitude: values.longitude,
            },
            accessibilityNote: values.accessabilityNote,
      accessibility: values.accessability
      ? values.accessability.map((item) => {
          const obj = {
            entityId: item,
          };
          return obj;
        })
      : undefined,
      dynamicFields:dynamicField,
      regions: values.region
        ? values.region.map((item) => {
          const obj = {
            entityId: item,
          };
          return obj;
        })
        : undefined,
        additionalType:values.type
        ? values.type.map((item) => {
          const obj = {
            entityId: item,
          };
          return obj;
        })
        : undefined,
            
          };
          if(contentLang == "bilengual")
          {
            placeObj.name = {fr:values.name, en: values.nameEn};
            placeObj.description= {fr:values.description ,en:values.descriptionEn}
          }
          else{
            if(placeDetails)
            {
              placeObj.name = {[contentLang]:values.name,
                [contentLang=="fr"?"en":"fr"]: placeDetails?.name[[contentLang=="fr"?"en":"fr"]]};
              placeObj.description= {[contentLang]:values.description,
                [contentLang=="fr"?"en":"fr"]: placeDetails?.description[[contentLang=="fr"?"en":"fr"]]}
            }
            else{
              placeObj.name = {[contentLang]:values.name};
              placeObj.description= {[contentLang]:values.description}
            }
            
          }
          ServiceApi.updatePlace(placeObj,placeDetails.id)
            .then((response) => {
                setLoading(false)
              message.success("Place Updated Successfully");
              navigate(`/admin/places`);
            })
            .catch((error) => {
                setLoading(false)
            });
        }
      })
      .catch((error) => {
        setLoading(false)
      });
    }

    else
     ServiceApi.updatePostalAddress(postalObj,placeDetails.address?.id)
      .then((response) => {
        if (response && response.data) {
          const placeObj = {
            name: {
              
              [contentLang]: values.name,
            },
            description: {
              
              [contentLang]: values.description,
            },
            
           openingHours: values.openingHours,

            postalAddressId: {
              entityId: placeDetails.address.id,
            },
            containedInPlace: values.containedInPlace?{entityId:values.containedInPlace}:undefined,
           
            geo: {
              latitude: values.latitude,
              longitude: values.longitude,
            },
            accessibilityNote: values.accessabilityNote,
      accessibility: values.accessability
      ? values.accessability.map((item) => {
          const obj = {
            entityId: item,
          };
          return obj;
        })
      : undefined,
      dynamicFields:dynamicField,
      regions: values.region
        ? values.region.map((item) => {
          const obj = {
            entityId: item,
          };
          return obj;
        })
        : undefined,
        additionalType:values.type
        ? values.type.map((item) => {
          const obj = {
            entityId: item,
          };
          return obj;
        })
        : undefined,
            
          };
          if(contentLang == "bilengual")
          {
            placeObj.name = {fr:values.name, en: values.nameEn};
            placeObj.description= {fr:values.description ,en:values.descriptionEn}
          }
          else{
            if(placeDetails)
            {
              placeObj.name = {[contentLang]:values.name,
                [contentLang=="fr"?"en":"fr"]: placeDetails?.name[[contentLang=="fr"?"en":"fr"]]};
              placeObj.description= {[contentLang]:values.description,
                [contentLang=="fr"?"en":"fr"]: placeDetails?.description[[contentLang=="fr"?"en":"fr"]]}
            }
            else{
              placeObj.name = {[contentLang]:values.name};
              placeObj.description= {[contentLang]:values.description}
            }
            
          }
          ServiceApi.updatePlace(placeObj,placeDetails.id)
            .then((response) => {
                setLoading(false)
              message.success("Place Updated Successfully");
              navigate(`/admin/places`);
            })
            .catch((error) => {
                setLoading(false)
            });
        }
      })
      .catch((error) => {
        setLoading(false)
      });
    }
      else
      ServiceApi.addPostalAddress(postalObj)
      .then((response) => {
        if (response && response.data) {
          const placeObj = {
            name: {
              
              [contentLang]: values.name,
            },
            description: {
              
              [contentLang]: values.description,
            },
            
            openingHours: values.openingHours,
            postalAddressId: {
              entityId: response.data.id,
            },
            containedInPlace: values.containedInPlace?{entityId:values.containedInPlace}:undefined,
           
            geo: {
              latitude: values.latitude,
              longitude: values.longitude,
            },
            accessibilityNote: values.accessabilityNote,
      accessibility: values.accessability
      ? values.accessability.map((item) => {
          const obj = {
            entityId: item,
          };
          return obj;
        })
      : undefined,
      dynamicFields:dynamicField,  
      regions: values.region
        ? values.region.map((item) => {
          const obj = {
            entityId: item,
          };
          return obj;
        })
        : undefined,
        additionalType:values.type
        ? values.type.map((item) => {
          const obj = {
            entityId: item,
          };
          return obj;
        })
        : undefined,
            
          };
          if(contentLang == "bilengual")
          {
            placeObj.name = {fr:values.name, en: values.nameEn};
            placeObj.description= {fr:values.description ,en:values.descriptionEn}
          }
          else{
            if(placeDetails)
            {
              placeObj.name = {[contentLang]:values.name,
                [contentLang=="fr"?"en":"fr"]: placeDetails?.name[[contentLang=="fr"?"en":"fr"]]};
              placeObj.description= {[contentLang]:values.description,
                [contentLang=="fr"?"en":"fr"]: placeDetails?.description[[contentLang=="fr"?"en":"fr"]]}
            }
            else{
              placeObj.name = {[contentLang]:values.name};
              placeObj.description= {[contentLang]:values.description}
            }
          }
          ServiceApi.addPlace(placeObj)
            .then((response) => {
               
              message.success("Place Created Successfully");
              const getId=response.data?.id
              if(isModal)
             {
                ServiceApi.getAllPlaces()
      .then((response) => {
        setLoading(false);
        if (response && response.data && response.data.data) {
          const events = response.data.data;
         
          dispatch(fetchPlace(events));
          onsuccessAddById(getId)
        }
        
      })
      .catch((error) => {
        setLoading(false);
      });
                
                
              
    } 
    else    
             {
              setLoading(false)
                navigate(`/admin/places`);}
           
            
            })
            .catch((error) => {
                setLoading(false)
            });
        }
      })
      .catch((error) => {
        setLoading(false)
      });
  };

  useEffect(() => {
    if (placeDetails) {
      setIsUpdate(true);
      form.setFieldsValue({
        name: placeDetails.name[contentLang],
        openingHours: placeDetails.openingHours,
        addressCountry:placeDetails.address?.addressCountry[contentLang],
        addressLocality: placeDetails.address?.addressLocality[contentLang],
        addressRegion:placeDetails.address?.addressRegion[contentLang],
        postalCode: placeDetails.address?.postalCode,
        containedInPlace: placeDetails.containedInPlace && placeDetails.containedInPlace?.entityId,

        streetAddress: placeDetails.address?.streetAddress[contentLang],
        latitude: placeDetails.geoCoordinates && ''+placeDetails.geoCoordinates.latitude,
        longitude: placeDetails.geoCoordinates && ''+placeDetails.geoCoordinates.longitude,
        description: placeDetails.description && placeDetails.description[contentLang],
        accessability: placeDetails?.accessibility?.map(
          (item) => item?.entityId
        ),
        accessabilityNote:placeDetails?.accessibilityNote,
        region: placeDetails?.regions?.map(
          (item) => item?.entityId
        ),
        type: placeDetails?.additionalType?.map(
          (item) => item?.entityId
        ),
      });

      if(contentLang == "bilengual")
      {
        form.setFieldsValue({
          name: placeDetails.name?.fr,
          nameEn: placeDetails.name?.en,
          description: placeDetails.description && placeDetails.description?.fr,
          descriptionEn: placeDetails.description && placeDetails.description?.en,

          addressCountryEn:placeDetails.address?.addressCountry.en,
          addressCountry:placeDetails.address?.addressCountry.fr,

        addressLocalityEn: placeDetails.address?.addressLocality.en,
        addressLocality: placeDetails.address?.addressLocality.fr,


        addressRegionEn:placeDetails.address?.addressRegion.en,
        addressRegion:placeDetails.address?.addressRegion.fr,

        streetAddressEn: placeDetails.address?.streetAddress.en,
        streetAddress: placeDetails.address?.streetAddress.fr,
        })
      }
      else{
        form.setFieldsValue({
          name: placeDetails.name[contentLang],
          description: placeDetails.description && placeDetails.description[contentLang],
          addressCountry:placeDetails.address?.addressCountry[contentLang],
        addressLocality: placeDetails.address?.addressLocality[contentLang],
        addressRegion:placeDetails.address?.addressRegion[contentLang],
        streetAddress: placeDetails.address?.streetAddress[contentLang],

        })
      }
      
    } else
      form.setFieldsValue({
        desc: "",
      });
  }, [placeDetails]);

  useEffect(()=>{

    if(placeDetails && placeDetails.dynamicFields && dynamicList.length>0)
    {
      const eventDynamic = placeDetails.dynamicFields;
      if(Array.isArray(eventDynamic))
      for (let i = 0; i <= eventDynamic.length; i++) {
       
        if(eventDynamic[i]?.taxonomyId)
        form.setFieldsValue({
          [eventDynamic[i].taxonomyId]:eventDynamic[i].conceptIds
        })
    }
      
      
    }
  },[placeDetails,dynamicList])

  useEffect(()=>{
    ServiceApi.placeAdminArea()
    .then((response) => {
      setLoading(false);
      if (response && response.data && response.data.data) {
        const events = response.data.data;
        setContainsList(events)
        
      }
      
    })
    .catch((error) => {
      setLoading(false);
    });
        
  },[])
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
        <div className="update-select-title">{t("Name")} {contentLang == "bilengual" && "@fr"}</div>
            <Form.Item
              name="name"
              className="status-comment-item"
              rules={[
                {
                  required:contentLang == "bilengual"? formValue?.nameEn?.length>0?false:true :true,
                  message: "Place name required",
                  whitespace: true,
                },
              ]}
            >
                 <PlacesAutocomplete
                  value={address}
                  onChange={handleChange}
                  onSelect={handleSelect}
                  placeholder={"Place name"}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }) => (
                    <div>
                      <input
                        {...getInputProps({
                          placeholder: "Search Places ...",
                          className: "location-search-input",
                        })}
                      />
                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion) => {
                          const className = suggestion.active
                            ? "suggestion-item--active"
                            : "suggestion-item";
                          // inline style for demonstration purpose
                          const style = suggestion.active
                            ? { backgroundColor: "#fafafa", cursor: "pointer" }
                            : { backgroundColor: "#ffffff", cursor: "pointer" };
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                              })}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
            </Form.Item>
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
                  message: "Place name required",
                  whitespace: true,
                },
              ]}
            >
                  <PlacesAutocomplete
                  value={addressEn}
                  onChange={handleChangeEn}
                  onSelect={handleSelect}
                  placeholder={"Place name"}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }) => (
                    <div>
                      <input
                        {...getInputProps({
                          placeholder: "Search Places ...",
                          className: "location-search-input",
                        })}
                      />
                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion) => {
                          const className = suggestion.active
                            ? "suggestion-item--active"
                            : "suggestion-item";
                          // inline style for demonstration purpose
                          const style = suggestion.active
                            ? { backgroundColor: "#fafafa", cursor: "pointer" }
                            : { backgroundColor: "#ffffff", cursor: "pointer" };
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                              })}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
            </Form.Item>
            </>
            }
        {adminPlaces.filter(item=>contentLang != "bilengual" ? item.isMulti==false :item.name !== "mmm").map((item) => (
          <>
            <div className="update-select-title">{t(item.title,{ lng: currentLang })}
            {((item.title == "Name" || item.title == "Description" ) && contentLang == "bilengual") && " @fr" }</div>
            <Form.Item
              name={item.name}
              className="status-comment-item"
              rules={[
                {
                  required:item.required,
                  whitespace: true,
                },
              ]}
              validateTrigger="onBlur"
            >
              {item.type === "geo" ? (
                <PlacesAutocomplete
                  value={address}
                  onChange={handleChange}
                  onSelect={handleSelect}
                  placeholder={item.placeHolder}
                >
                  {({
                    getInputProps,
                    suggestions,
                    getSuggestionItemProps,
                    loading,
                  }) => (
                    <div>
                      <input
                        {...getInputProps({
                          placeholder: "Search Places ...",
                          className: "location-search-input",
                        })}
                      />
                      <div className="autocomplete-dropdown-container">
                        {loading && <div>Loading...</div>}
                        {suggestions.map((suggestion) => {
                          const className = suggestion.active
                            ? "suggestion-item--active"
                            : "suggestion-item";
                          // inline style for demonstration purpose
                          const style = suggestion.active
                            ? { backgroundColor: "#fafafa", cursor: "pointer" }
                            : { backgroundColor: "#ffffff", cursor: "pointer" };
                          return (
                            <div
                              {...getSuggestionItemProps(suggestion, {
                                className,
                                style,
                              })}
                            >
                              <span>{suggestion.description}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </PlacesAutocomplete>
              ) : item.type === "area"?
                <Input.TextArea
                  placeholder={item.placeHolder}
                  className="replace-input"
                  rows={4}
                />
                : item.type === "select"?
                <Select
                showSearch
                style={{ width: 350 }}
                dropdownClassName="contact-select"
                placeholder="Select Contained place"
                allowClear
                filterOption={(input, option) =>
                  option.children &&
                  option.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              
              >
                {containsList.map((item) => (
                  <Option key={item.id} value={item.id}>{item.name[currentLang]?item.name[currentLang]:
                    currentLang==="fr"?item.name["en"]:item.name["fr"]}</Option>
                ))}
              </Select>
                :
                <Input
                  placeholder={item.placeHolder}
                  className="replace-input"
                  
                />
              }
            </Form.Item>
          </>
        ))}


<div className="update-select-title">
              {t("Accessibility", { lng: currentLang })}
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
              {t("Accessibility Note", { lng: currentLang })}
            </div>

            <Form.Item name={"accessabilityNote"} rules={[{ required: false }]}>
            <Input placeholder="Enter Accessability Note" className="replace-input" />
            </Form.Item>

            <div className="update-select-title">
              {t("Region", { lng: currentLang })}
            </div>

            <Form.Item name={"region"} rules={[{ required: false }]}>
              <TreeSelect
              
                style={{ width: "100%" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                treeData={regionList}
                multiple
                placeholder="Please select"
                showSearch
              treeNodeFilterProp="label"
              filterTreeNode={(search, item) => {
                return item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
              }}
              />
            </Form.Item>

            <div className="update-select-title">
              {t("Type", { lng: currentLang })}
            </div>

            <Form.Item name={"type"} rules={[{ required: false }]}>
              <TreeSelect
              showSearch
                style={{ width: "100%" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                treeData={typesList}
                multiple
                placeholder="Please select"
                
              treeNodeFilterProp="label"
              filterTreeNode={(search, item) => {
                return item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
              }}
              />
            </Form.Item>

        {    dynamicList.length>0 &&
  dynamicList.map(item=>
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

<div className="update-select-title">
                {t("Opening Hours", { lng: currentLang })} 
              </div>
              <Form.Item
                name="openingHours"
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
                  placeholder="Enter Opening hours Url"
                  className="replace-input"
                />
              </Form.Item>
        <Form.Item className="submit-items">
          <Button
            size="large"
            icon={<CloseOutlined />}
            onClick={() => {
              if(isModal)
               onsuccessAdd()
              else if (isUpdate) navigate(`/admin/places`);
              else {
                form.resetFields();
               
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
      {loading && <Spinner />}
    </Layout>
  );
};
export default AddPlaces;
