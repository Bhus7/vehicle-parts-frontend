import axios from "axios";

const API = axios.create({
  baseURL: "https://localhost:7278/api",
});

export default API;