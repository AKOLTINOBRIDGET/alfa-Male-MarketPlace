import api from './api';

const paymentService = {
  // Create payment intent
  createPaymentIntent: async (orderId, amount) => {
    const response = await api.post('/payments/create-intent', { orderId, amount });
    return response;
  },

  // Confirm payment
  confirmPayment: async (paymentIntentId, orderId) => {
    const response = await api.post('/payments/confirm', { paymentIntentId, orderId });
    return response;
  },

  // Get payment by order
  getPaymentByOrder: async (orderId) => {
    const response = await api.get(`/payments/order/${orderId}`);
    return response;
  },

  // Get customer payments
  getMyPayments: async (params = {}) => {
    const response = await api.get('/payments/my-payments', { params });
    return response;
  },

  // Process refund (admin)
  processRefund: async (paymentId, amount, reason) => {
    const response = await api.post(`/payments/${paymentId}/refund`, { amount, reason });
    return response;
  }
};

export default paymentService;
