import axios from "axios";

const API_URL = process.env.NODE_ENV === 'production'
  ? '/api' // In production, the backend serves the frontend, so we use a relative path
  : 'http://localhost:3000/api';


const api = axios.create({
  baseURL: API_URL
});

// add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config;
},
  (error) => {
    return Promise.reject(error)
  }
)

export default api;