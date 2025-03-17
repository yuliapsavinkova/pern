import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_URL; // Fallback for local dev
console.log("Backend URL:", BASE_URL); // Debugging log

const API_URL = `${BASE_URL}/api/trades`;
console.log("API URL:", API_URL);

export const fetchTrades = async () => {
  try {
    console.log("Fetching from:", API_URL);
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching trades:", error);
    throw error;
  }
};

export const getTrade = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createTrade = async (trade) => {
  const response = await axios.post(`${API_URL}`, trade);
  return response.data;
};

export const updateTrade = async (id, trade) => {
  const response = await axios.put(`${API_URL}/${id}`, trade);
  return response.data;
};

export const deleteTrade = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};
