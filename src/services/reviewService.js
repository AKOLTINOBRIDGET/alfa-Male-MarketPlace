import api from './api';

const reviewService = {
  getReviews: async () => {
    const response = await api.get('/reviews');
    return response;
  },

  deleteReview: async (id) => {
    const response = await api.delete(`/reviews/${id}`);
    return response;
  }
};

export default reviewService;
