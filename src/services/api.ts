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

  const locale = localStorage.getItem('lang') || localStorage.getItem('locale') || 'fr';
  if (config.headers) {
    config.headers['X-Locale'] = locale;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      // Only redirect if not already on auth pages and user was previously logged in
      const currentPath = window.location.pathname;
      const authPaths = ['/connexion', '/inscription', '/'];
      if (!authPaths.includes(currentPath)) {
        const redirect = encodeURIComponent(currentPath);
        window.location.href = `/connexion?redirect=${redirect}`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
