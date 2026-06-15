import api from './api';

const authService = {
  // Register new user
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.success && response.token) {
      localStorage.setItem('alfa_token', response.token);
      localStorage.setItem('alfa_user', JSON.stringify(response.user));
      localStorage.setItem('alfa_auth', 'true');
    }
    return response;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.success && response.token) {
      localStorage.setItem('alfa_token', response.token);
      localStorage.setItem('alfa_user', JSON.stringify(response.user));
      localStorage.setItem('alfa_auth', 'true');
    }
    return response;
  },

  // Get current user
  getMe: async () => {
    const response = await api.get('/auth/me');
    if (response.success && response.data) {
      localStorage.setItem('alfa_user', JSON.stringify(response.data));
    }
    return response;
  },

  // Logout user
  logout: () => {
    localStorage.removeItem('alfa_token');
    localStorage.removeItem('alfa_user');
    localStorage.setItem('alfa_auth', 'false');
  }
};

export default authService;
