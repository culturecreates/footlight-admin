import { Axios,AxiosLogin } from "../utils/ServerConfig";
import * as moment_timezone from "moment-timezone"
import { getCookies } from "../utils/Utility";

export default class ServiceApi {
  static convertDate =(date)=>{
    const [day, month, year] =  date.split(' ')
        return `${year}-${month}-${day}`
    // dd/mm/yyyy
    
  }

  static loginAuth(payload) {
    return AxiosLogin({
      url: `login`,
      method: "POST",
      data: JSON.stringify(payload),

    });
  }

  static addUser(payload) {
    return AxiosLogin({
      url: `users`,
      method: "POST",
      data: JSON.stringify(payload),

    });
  }

  static resetLink(payload) {
    return AxiosLogin({
      url: `users/forgot-password`,
      method: "POST",
      data: JSON.stringify(payload),

    });
  }

  static reset(payload) {
    return AxiosLogin({
      url: `users/reset-password`,
      method: "POST",
      data: JSON.stringify(payload),

    });
  }

  static updateUser(payload) {
    return Axios({
      url: `users`,
      method: "PATCH",
      data: JSON.stringify(payload),

    });
  }

  static inviteUser(payload) {
    return Axios({
      url: `invite`,
      method: "POST",
      data: JSON.stringify(payload),

    });
  }

  static acceptInvite(payload) {
    return Axios({
      url: `invite/accept`,
      method: "POST",
      data: JSON.stringify(payload),

    });
  }

  static invitedUser(id) {
    return Axios({
      url: `invite/${id}`,
      method: "GET",
      

    });
  }

  static updateSingleUser(payload,id) {
    return Axios({
      url: `users/${id}`,
      method: "PATCH",
      data: JSON.stringify(payload),

    });
  }

  static getAllUser() {
    return Axios({
      url: `users/all`,
      method: "GET",
      params:{includeInactiveUsers:true,includeCalendarFilter:true}

    });
  }

  static getAllUserSearch(value) {
    return Axios({
      url: `users/all`,
      method: "GET",
      params:{includeInactiveUsers:true,includeCalendarFilter:false,"search": value}
     

    });
  }

  static updatePassword(payload) {
    return Axios({
      url: `users/modify-password`,
      method: "PATCH",
      data: JSON.stringify(payload),

    });
  }

  static modifyRole(payload,calId) {
    const id_token = getCookies("user_token");
    return AxiosLogin({
      url: `users/modify-role`,
      method: "PATCH",
      data: JSON.stringify(payload),
      headers:{"calendar-id":calId,
      "Authorization":"Bearer "+id_token?.token}

    });
  }

  static getSingleUser(id) {
    return Axios({
      url: `users/${id}`,
      method: "GET",
     

    });
  }

  static getUser() {
    return Axios({
      url: `users`,
      method: "GET",
  

    });
  }

  static getUserRoles() {
    return Axios({
      url: `users/roles`,
      method: "GET",
  

    });
  }
  static deleteContact(id) {
    return Axios({
      url: `contact-points/${id}`,
      method: "DELETE",
    
    });
  }

  static leaveCalendar(calId) {
    const id_token = getCookies("user_token");
    return AxiosLogin({
      url: `users/logged-in/leave-calendar`,
      method: "PATCH",
      headers:{"calendar-id":calId,
      "Authorization":"Bearer "+id_token?.token}
    
    });
  }

  static deactivateCurrentUser() {
    
    return Axios({
      url: `users/deactivate-logged-in-user`,
      method: "PATCH",
    
    });
  }
  static deleteUser(id,type) {
    if(type==="delete")
    return Axios({
      url: `users/${id}`,
      method: "DELETE",
    
    });
    else if(type==="withdraw")
    return Axios({
      url: `invite/withdraw/${id}`,
      method: "POST",
    
    });
    else if(type==="reactivate")
    return Axios({
      url: `users/activate/${id}`,
      method: "PATCH",
    
    });
    else
    return Axios({
      url: `users/deactivate/${id}`,
      method: "PATCH",
    
    });
  }

  static deActiveUser(id) {
    return Axios({
      url: `users/deactivate/${id}`,
      method: "PATCH",
    
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

  static deleteCal(id) {
    return Axios({
      url: `calendar-metadata/{id}`,
      method: "DELETE",
      params:{id}
    
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

  static getAllCalendar() {
    return Axios({
      url: `calendar-metadata`,
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
      url: `events/event-list/admin-view`,
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
      url: `event/${id}`,
      method: "GET",
      params:{
        isAdmin:true,
        includeJsonld:includeJsonld
      }
    });
  }

  static publishEvents(id) {
    return Axios({
      url: `event/${id}/publish/toggle`,
      method: "POST",
      

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

  static getCalDetail(id) {
    return Axios({
      url: `calendar-metadata/{id}`,
      method: "GET",
      params:{'id':id}
      

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
      params:{"concept-scheme":getCookies("concept_scheme")?.AUDIENCE}

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
      params:{"concept-scheme":getCookies("concept_scheme")?.EVENT_ADDITIONAL_TYPES}

    });
  }

  static addEvent(payload) {
    return Axios({
      url: `event`,
      method: "POST",
      data: JSON.stringify(payload),

    });
  }
  static updateEvent(payload,id) {
    return Axios({
      url: `event/${id}`,
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
      url: `event/${id}/image-upload`,
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

  static addCalendar(payload) {
    return Axios({
      url: `calendar-metadata`,
      method: "POST",
      data: JSON.stringify(payload),

    });
  }
  static addTaxonomy(payload) {
    return Axios({
      url: `taxonomy`,
      method: "POST",
      data: JSON.stringify(payload),

    });
  }

  static updateTaxonomy(payload) {
    return Axios({
      url: `taxonomy`,
      method: "PATCH",
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

  static updateCalendar(payload,id) {
    return Axios({
      url: `calendar-metadata/{id}`,
      method: "PATCH",
      params:{id:id},
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
