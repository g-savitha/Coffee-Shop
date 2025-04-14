import axios from "axios";

const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-production-backend-url.com/api'
  : 'http://localhost:3001/api';


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