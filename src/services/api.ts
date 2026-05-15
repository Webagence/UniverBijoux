import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api';

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      const currentPath = window.location.pathname;
      if (currentPath && currentPath !== '/' && currentPath !== '/connexion' && currentPath !== '/inscription') {
        window.location.href = `/connexion?redirect=${encodeURIComponent(currentPath)}`;
      } else {
        window.location.href = '/connexion';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
