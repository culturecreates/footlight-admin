import Item from "antd/lib/list/Item";
import { Axios } from "../utils/ServerConfig";
import moment from "moment";
import * as moment_timezone from "moment-timezone"

export default class ServiceApi {
  static convertDate =(date)=>{
    const [day, month, year] =  date.split(' ')
        return `${year}-${month}-${day}`
    // dd/mm/yyyy
    
  }
  static deleteContact(id) {
    return Axios({
      url: `contact-points/${id}`,
      method: "DELETE",
    
    });
  }

  static deletePlace(id) {
    return Axios({
      url: `places/${id}`,
      method: "DELETE",
    
    });
  }

  static deleteOrg(id) {
    return Axios({
      url: `organizations/${id}`,
      method: "DELETE",
    
    });
  }

  static deleteTaxonomy(id) {
    return Axios({
      url: `taxonomy/${id}`,
      method: "DELETE",
    
    });
  }

  static deleteEvent(id) {
    return Axios({
      url: `events/${id}`,
      method: "DELETE",
    
    });
  }
  static calendarInfo() {
    return Axios({
      url: `calendar-info`,
      method: "GET",
    
    });
  }
  static getAllContacts() {
    return Axios({
      url: `contact-points`,
      method: "GET",
      
    });
  }
  static getAllPlaces() {
    return Axios({
      url: `all-venues`,
      method: "GET",
      params:{
        excludeContainsPlace: true
      }
    });
  }
  static getAllOrg() {
    return Axios({
      url: `organizations`,
      method: "GET",
    });
  }
  static searchSuggesion(value,lng="fr") {
    return Axios({
      url: `search-suggestion`,
      method: "GET",
      params:{
        "language":lng,
         "search-key": value
      }
    });
  }
  static eventList(page=1,filterArray=[],lng="fr") {
    console.log(filterArray,filterArray.find((o) => o.type === "queryString")&&filterArray.find((o) => o.type === "queryString").name)
    return Axios({
      url: `events/list`,
      method: "GET",
      params:{
         "language":lng,
          page:page,
          limit: 20,
          audiences:filterArray.filter(item=>(item.type === "Public" || item.type === "audiences")).map(item=>item.uri),
          types:filterArray.filter(item=>(item.type === "Type" || item.type === "types")).map(item=>item.uri),
          venues: filterArray.filter(item=>(item.type === "places" || item.type === "Region")).map(item=>item.name),
          query:filterArray.find((o) => o.type === "queryString")&&filterArray.find((o) => o.type === "queryString").name, 
          organizations: filterArray.filter(item=>item.type === "organizations").map(item=>item.name),
          "date-filter": filterArray.find((o) => o.type === "Date")&&this.convertDate(filterArray.find((o) => o.type === "Date").name)
          
      }
    });
  }

  static getEventDetail(id,isAdmin= false,includeJsonld=true) {
    return Axios({
      url: `events/${id}`,
      method: "GET",
      params:{
        isAdmin:true,
        includeJsonld:includeJsonld
      }
    });
  }

  static getContactDetail(id) {
    return Axios({
      url: `contact-points/${id}`,
      method: "GET",
      

    });
  }
  static getPlaceDetail(id) {
    return Axios({
      url: `places/${id}`,
      method: "GET",
      

    });
  }

  static getOrgDetail(id) {
    return Axios({
      url: `organizations/${id}`,
      method: "GET",
      

    });
  }

  static getTaxonomyDetail(id) {
    return Axios({
      url: `taxonomy/${id}`,
      method: "GET",
      

    });
  }

  static getTaxonomy() {
    return Axios({
      url: `taxonomy`,
      method: "GET",
      params:{"concept-scheme":process.env.REACT_APP_CONCEPT_SCHEME}

    });
  }

  static getAllTaxonomy() {
    return Axios({
      url: `taxonomy`,
      method: "GET",

    });
  }

  static getTaxonomyType() {
    return Axios({
      url: `taxonomy`,
      method: "GET",
      params:{"concept-scheme":"https://cultureoutaouais.com/resource/TypeEvenementConcept"}

    });
  }

  static addEvent(payload) {
    return Axios({
      url: `events`,
      method: "POST",
      data: JSON.stringify(payload),

    });
  }
  static updateEvent(payload,id) {
    return Axios({
      url: `events/${id}`,
      method: "PATCH",
      data: JSON.stringify(payload),

    });
  }
  static imageUpload(id,payload,compressedFile) {
    const formdata = new FormData()
    // formdata.append("files",[payload,new File([compressedFile], "name")])
    formdata.append("files",payload)
    formdata.append("files",new File([compressedFile], "compressed"+compressedFile.name))
    return Axios({
      url: `events/${id}/image-upload`,
      method: "PATCH",
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: formdata

    });
  }
  
  static addPostalAddress(payload) {
    return Axios({
      url: `postal-addresses`,
      method: "POST",
      data: JSON.stringify(payload),

    });
  }

  static addContact(payload) {
    return Axios({
      url: `contact-points`,
      method: "POST",
      data: JSON.stringify(payload),

    });
  }

  static addOrg(payload) {
    return Axios({
      url: `organizations`,
      method: "POST",
      data: JSON.stringify(payload),

    });
  }

  static addPlace(payload) {
    return Axios({
      url: `places`,
      method: "POST",
      data: JSON.stringify(payload),

    });
  }

  static updatePostalAddress(payload,id) {
    return Axios({
      url: `postal-addresses/${id}`,
      method: "PATCH",
      data: JSON.stringify(payload),

    });
  }
  static updatePlace(payload,id) {
    return Axios({
      url: `places/${id}`,
      method: "PATCH",
      data: JSON.stringify(payload),

    });
  }

  static updateContact(payload,id) {
    return Axios({
      url: `contact-points/${id}`,
      method: "PATCH",
      data: JSON.stringify(payload),

    });
  }

  static updateOrg(payload,id) {
    return Axios({
      url: `organizations/${id}`,
      method: "PATCH",
      data: JSON.stringify(payload),

    });
  }

  static addOffer(payload) {
    return Axios({
      url: `offers`,
      method: "POST",
      data: JSON.stringify(payload),

    });
  }

  static placeAdminArea() {
    return Axios({
      url: `places/administrative-area`,
      method: "GET",
     

    });
  }
  
  /**
    * @description date: 2020-11-05,time:05:00,timezone:Canada/Atlantic   => formattedDate: 2020-11-05T08:00 +00.00
    * @returns {Date}
    */
   static parseDate(date, time, timezone) {
    const rawDate = `${date} ${time}`;
    const formattedDate = moment_timezone.tz(rawDate, timezone).toDate();
    return formattedDate;
  }


}
