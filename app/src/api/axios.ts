import axios from 'axios';
import { logger, LogCategory } from '../utils/logger';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    const requestId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    config.headers['X-Request-ID'] = requestId;
    
    logger.info(
      LogCategory.HTTP, 
      `Request: ${config.method?.toUpperCase()} ${config.url}`,
      { data: config.data, params: config.params },
      requestId
    );
    
    return config;
  },
  (error) => {
    logger.error(LogCategory.HTTP, 'Request error', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    const requestId = response.config.headers['X-Request-ID'] as string;
    logger.info(
      LogCategory.HTTP,
      `Response: ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`,
      { data: response.data },
      requestId
    );
    return response;
  },
  (error) => {
    const requestId = error.config?.headers?.['X-Request-ID'] as string;
    const errorData = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    };
    
    logger.error(
      LogCategory.HTTP,
      `Response error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`,
      errorData,
      requestId
    );
    
    if (error.response?.status === 401) {
      logger.warn(LogCategory.AUTH, 'Unauthorized - clearing token and redirecting to login');
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
