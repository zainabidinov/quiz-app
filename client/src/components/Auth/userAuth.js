import axios from "axios";

const api = axios.create({
  baseURL: "https://techquiz.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const signUp = async (payload) => {
  try {
    const response = await api.post("/account/register", payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

export const logIn = async (payload) => {
  try {
    const response = await api.post("/account/login", payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

