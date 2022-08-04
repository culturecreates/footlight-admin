import axios from "axios";

export const api = "http://3.96.80.223:3000/";
export const Axios = axios.create({
  baseURL: api,
  headers: {
    "Content-Type": "application/json",
    //   Authorization: "Bearer " + localStorage.getItem("token")
  },
});
