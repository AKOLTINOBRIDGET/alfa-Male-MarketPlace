import api from './api';

const userService = {
  // Get user profile
  getProfile: async () => {
    const response = await api.get('/auth/me');
    return response;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response;
  },

  // Get wishlist
  getWishlist: async () => {
    const response = await api.get('/users/wishlist');
    return response;
  },

  // Add to wishlist
  addToWishlist: async (productId) => {
    const response = await api.post('/users/wishlist', { productId });
    return response;
  },

  // Remove from wishlist
  removeFromWishlist: async (productId) => {
    const response = await api.delete(`/users/wishlist/${productId}`);
    return response;
  },

  // Add address
  addAddress: async (addressData) => {
    const response = await api.post('/users/addresses', addressData);
    return response;
  },

  // Update address
  updateAddress: async (addressId, addressData) => {
    const response = await api.put(`/users/addresses/${addressId}`, addressData);
    return response;
  },

  // Delete address
  deleteAddress: async (addressId) => {
    const response = await api.delete(`/users/addresses/${addressId}`);
    return response;
  },

  // Add measurement
  addMeasurement: async (measurementData) => {
    const response = await api.post('/users/measurements', measurementData);
    return response;
  },

  // Get measurements
  getMeasurements: async () => {
    const response = await api.get('/users/measurements');
    return response;
  },

  // Update preferences
  updatePreferences: async (preferences) => {
    const response = await api.put('/users/preferences', preferences);
    return response;
  },

  // Admin: Get all customers
  getCustomers: async (params = {}) => {
    const response = await api.get('/users/customers', { params });
    return response;
  },

  // Admin: Get all users
  getAdminUsers: async () => {
    const response = await api.get('/admin/users');
    return response;
  },

  // Admin: Create a new user
  createAdminUser: async (userData) => {
    const response = await api.post('/admin/users', userData);
    return response;
  }
};

export default userService;
