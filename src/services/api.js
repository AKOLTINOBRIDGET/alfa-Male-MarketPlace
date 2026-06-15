import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('alfa_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    const customError = {
      message: 'An unexpected error occurred',
      status: error.response?.status,
      data: error.response?.data
    };

    if (error.response) {
      // Server responded with error
      customError.message = error.response.data?.error || error.response.data?.message || error.message;
      
      // Handle specific status codes
      if (error.response.status === 401) {
        // Unauthorized - clear auth and redirect to login
        localStorage.removeItem('alfa_token');
        localStorage.removeItem('alfa_user');
        localStorage.setItem('alfa_auth', 'false');
        window.location.href = '/login';
      }
    } else if (error.request) {
      // Request made but no response
      customError.message = 'No response from server. Please check your connection.';
    }

    return Promise.reject(customError);
  }
);

export default api;
