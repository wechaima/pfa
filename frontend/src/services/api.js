import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000", // Votre backend FastAPI
  timeout: 10000,
});

export default api;
