import axios from "axios";
import { getCookies, removeCookies } from "./Utility";

export const api = "http://3.96.80.223:3000/";
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
  config.headers["Authorization"] ="Bearer "+id_token.token;
  
  return config;
});
Axios.interceptors.response.use(function (response) {
  // Do something with response data
  
  return response;
}, function (error) {
  // Do something with response error
  if(error.response.data.status === 401)
  {
    removeCookies("user_token");
    return window.location.href = '/' ;
   }
  return Promise.reject(error);
});
