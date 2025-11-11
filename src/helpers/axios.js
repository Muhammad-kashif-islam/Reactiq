import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'default one',
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json',
    "ngrok-skip-browser-warning": "1234"
  },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {  
    return Promise.reject(error);
  }
);

export default axiosInstance;
