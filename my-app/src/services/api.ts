import { API_BASE_URL, API_TIMEOUT, STORAGE_KEYS } from '@/constants';
import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token to requests
    const token = globalThis.localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      globalThis.localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      globalThis.location.href = '/login';
    }
    
    return Promise.reject(error instanceof Error ? error : new Error(String(error)));
  }
);

// API methods
export const apiClient = {
  get: <T = any>(url: string, config?: AxiosRequestConfig) =>
    api.get<T>(url, config),
    
  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    api.post<T>(url, data, config),
    
  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    api.put<T>(url, data, config),
    
  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig) =>
    api.patch<T>(url, data, config),
    
  delete: <T = any>(url: string, config?: AxiosRequestConfig) =>
    api.delete<T>(url, config),
};

export default api;
