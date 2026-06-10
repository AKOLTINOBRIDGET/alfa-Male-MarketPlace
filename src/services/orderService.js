import api from './api';

const orderService = {
  // Get all orders (admin)
  getOrders: async (params = {}) => {
    const response = await api.get('/orders', { params });
    return response;
  },

  // Get single order
  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response;
  },

  // Get customer's own orders
  getMyOrders: async (params = {}) => {
    const response = await api.get('/orders/my-orders', { params });
    return response;
  },

  // Create new order
  createOrder: async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response;
  },

  // Update order status (admin)
  updateOrderStatus: async (id, status, note) => {
    const response = await api.put(`/orders/${id}/status`, { status, note });
    return response;
  },

  // Cancel order
  cancelOrder: async (id, reason) => {
    const response = await api.put(`/orders/${id}/cancel`, { reason });
    return response;
  },

  // Assign tailor (admin)
  assignTailor: async (id, tailorId) => {
    const response = await api.put(`/orders/${id}/assign`, { tailorId });
    return response;
  },

  // Add tracking info (admin)
  addTrackingInfo: async (id, trackingData) => {
    const response = await api.put(`/orders/${id}/tracking`, trackingData);
    return response;
  },

  // Update order
  updateOrder: async (id, orderData) => {
    const response = await api.put(`/orders/${id}`, orderData);
    return response;
  },

  // Delete order (admin)
  deleteOrder: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response;
  }
};

export default orderService;
