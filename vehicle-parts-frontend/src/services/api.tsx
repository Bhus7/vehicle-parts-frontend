import axios, { AxiosInstance } from "axios";

const API: AxiosInstance = axios.create({
  baseURL: "https://localhost:7278/api",
});

export default API;
