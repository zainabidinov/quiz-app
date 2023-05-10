import axios from "axios";

const api = axios.create({
  baseURL: "/api",
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
    const response = await api.post("/users/register", payload);
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
    const response = await api.post("/users/login", payload);
    return response.data;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    } else {
      throw error;
    }
  }
};

///////////////// old code 2
// import axios from "axios";

// const api = axios.create({
//   baseURL: "/api",
//   headers: {
//     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   },
// });

// export const signUp = async (payload) => {
//   try {
//     const response = await api.post("/users/register", payload);
//     return response.data;
//   } catch (error) {
//     return error.response.data;
//   }
// };

// export const logIn = async (payload) => {
//   try {
//     const response = await api.post("/users/login", payload);
//     return response.data;
//   } catch (error) {
//     return error.response.data;
//   }
// };

// old code
// const { default: axiosInstance } = require(".");

// export const signUp = async (payload) => {
//   try {
//     const response = await axiosInstance.post("/api/users/register", payload);
//     return response.data;
//   } catch (error) {
//     return error.response.data;
//   }
// };
