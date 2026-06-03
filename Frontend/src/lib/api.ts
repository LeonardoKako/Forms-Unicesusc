import axios from "axios";

// Instância base do Axios configurada com a URL do Backend vinda das variáveis de ambiente
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
