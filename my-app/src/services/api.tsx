import axios from "axios";
import type { AxiosInstance } from "axios";

const API: AxiosInstance = axios.create({
  baseURL: "https://localhost:7278/api",
});

export default API;
