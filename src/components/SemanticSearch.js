import React, { useEffect, useState } from "react";
import { Input, AutoComplete } from 'antd';
import PropTypes from "prop-types";
import "./SemanticSearch.css";
import { useCallback } from "react";
import _debounce from 'lodash/debounce';
import ServiceApi from "../services/Service";
import { useTranslation, Trans } from "react-i18next";

const SemanticSearch = function ({ onSelection, onClearSearch,currentLang,searchUpdate="" }) {
    const [options, setOptions] = useState([]);
    const [searchKey, setSearchKey] = useState(searchUpdate)

    useEffect(()=>{setOptions([])},[currentLang])
    useEffect(()=>{
      setSearchKey("")},[searchUpdate])

    const { t, i18n } = useTranslation();
    const renderTitle = (title,lng) => (
        <span className="search-title">
          {t(title, { lng: lng })}
        </span>
      );
      
      const renderItem = (title,types,uuid="") => ({
        value: title,
        options:types,
        key: (types==="audiences" || types === "types")?uuid:title,

        // key: types === "places"?uuid:title,
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            {title}
            
          </div>
        ),
      });
    const searchResult = (query,lng) =>{
        
        ServiceApi.searchSuggesion(query,lng==="en"?"EN":"FR")
        .then((response) => {
          if (response && response.data && response.data.data) {
            const events = response.data.data;
            const array=[
                {
                    label: renderTitle('audiences',lng),
                    options: events.audiences.map(item=>{
                        const obj=renderItem(item.name[lng],"audiences",item.identifier?.uri)
                        return obj
                      })
                  },
                  {
                    label: renderTitle('organizations',lng),
                    options: events.organizations.map(item=>{
                        const obj=renderItem(item.name[lng],"organizations")
                        return obj
                      })
                  },
                  {
                    label: renderTitle('places',lng),
                    options: events.places.map(item=>{
                        const obj=renderItem(item.name[lng],"places",item.uuid)
                        return obj
                      })
                  },
                  {
                    label: renderTitle('types',lng),
                    options: events.types.map(item=>{
                        const obj=renderItem(item.name[lng],"types",item.identifier?.uri)
                        return obj
                      })
                  },
               
            ]
           
            setOptions(array.filter(item=>item.options.length!==0))
            
          }
        })
        .catch((error) => {
        });
    }
    const handleSearch = (value) => {
      setSearchKey(value)
      if(value.length === 0)
       {setOptions([])
         onClearSearch()}
      else 
       debounceFn(value,currentLang)
    };
    const debounceFn = useCallback(_debounce(searchResult, 1000), []);
    const onSelect = (value,options) => {
      const selectObj = {
        type: options.options,
        name: options.key,
        from:"search",
        uri:options.key,
      };
      setSearchKey(value)
      onSelection(selectObj)
    };
    const handleKeyPress = (ev) => {
      // const selectObj = {
      //   type: "queryString",
      //   name: ev.target.value,
      // };
      // if (ev.key === "Enter")
      // onSelection(selectObj)
      };
      const handleClearPress = () => {
        // handleSearch("")
        // onClearSearch()
       
        };
        const handleInputSearch=(value)=>{
          const selectObj = {
            type: "queryString",
            name:value,
            from:"search"
          };
          onSelection(selectObj)
        }
  return (
    <div className="semantic-search-div">
      <AutoComplete
      dropdownMatchSelectWidth={252}
      style={{
        width: 420,
      }}
      options={options}
      onSelect={(val, option) => onSelect(val, option)}
      onSearch={handleSearch}
      onKeyPress={handleKeyPress}
      value={searchKey}
      
    >
      <Input.Search allowClear size="large" placeholder={t("Search", { lng: currentLang })} onClear={handleClearPress}
      onSearch={handleInputSearch} value={searchKey}/>
    </AutoComplete>
    </div>
  );
};
export default SemanticSearch;

SemanticSearch.propTypes = {
  onClose: PropTypes.func,
};
