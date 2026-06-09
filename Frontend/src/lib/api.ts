import axios from "axios";

// Instância base do Axios configurada com a URL do Backend vinda das variáveis de ambiente
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  headers: {
    "Content-Type": "application/json",
  },
});

// Envia os dados para a API de criação de Eventos Internos
export const createEvent = async (payload: any) => {
  const response = await api.post("/events", payload);
  return response.data;
};

// Envia os dados para a API de criação de Locações Externas
export const createLocation = async (payload: any) => {
  const response = await api.post("/locations", payload);
  return response.data;
};

export default api;
