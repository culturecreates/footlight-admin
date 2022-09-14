import axios from "axios";
import { getCookies, removeCookies } from "./Utility";

export const api = process.env.REACT_APP_BASE_URL;
export const Axios = axios.create({
  baseURL: api,
  headers: {
    "Content-Type": "application/json",
    //   Authorization: "Bearer " + localStorage.getItem("token")
  },
});
export const AxiosLogin = axios.create({
  baseURL: api,
  headers: {
    "Content-Type": "application/json",
    //   Authorization: "Bearer " + localStorage.getItem("token")
  },
});

Axios.interceptors.request.use(async (config) => {
  // config.baseURL = api;
  const id_token = getCookies("user_token");
  const id_cal = getCookies("calendar-id");
  console.log("raseem",id_cal)
  config.headers["Authorization"] ="Bearer "+id_token?.token;
  config.headers["calendar-id"] = id_cal;
  return config;
});
Axios.interceptors.response.use(function (response) {
  // Do something with response data
  
  return response;
}, function (error) {
  // Do something with response error
  console.log(error.response.data.statusCode)
  if(error.response.data.statusCode === 401)
  {
    removeCookies("user_token");
    return window.location.href = '/' ;
   }
  return Promise.reject(error);
});
