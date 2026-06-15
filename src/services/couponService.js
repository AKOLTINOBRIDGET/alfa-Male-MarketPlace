import api from './api';

const couponService = {
  getCoupons: async () => {
    const response = await api.get('/coupons');
    return response;
  },

  createCoupon: async (couponData) => {
    const response = await api.post('/coupons', couponData);
    return response;
  },

  updateCoupon: async (id, couponData) => {
    const response = await api.put(`/coupons/${id}`, couponData);
    return response;
  },

  deleteCoupon: async (id) => {
    const response = await api.delete(`/coupons/${id}`);
    return response;
  }
};

export default couponService;
