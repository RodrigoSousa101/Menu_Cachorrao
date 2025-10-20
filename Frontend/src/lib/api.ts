import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // vem do .env
});

export default api;
