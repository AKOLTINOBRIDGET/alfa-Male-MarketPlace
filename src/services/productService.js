import api from './api';

const productService = {
  // Get all products with filters
  getProducts: async (params = {}) => {
    const response = await api.get('/products', { params });
    return response;
  },

  // Get single product by ID
  getProductById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response;
  },

  // Get featured products
  getFeaturedProducts: async (limit = 10) => {
    const response = await api.get('/products/featured', { params: { limit } });
    return response;
  },

  // Get related products
  getRelatedProducts: async (id, limit = 6) => {
    const response = await api.get(`/products/${id}/related`, { params: { limit } });
    return response;
  },

  // Search products
  searchProducts: async (query, params = {}) => {
    const response = await api.get(`/products/search/${query}`, { params });
    return response;
  },

  // Admin: Create product
  createProduct: async (productData) => {
    const response = await api.post('/products', productData);
    return response;
  },

  // Admin: Update product
  updateProduct: async (id, productData) => {
    const response = await api.put(`/products/${id}`, productData);
    return response;
  },

  // Admin: Delete product
  deleteProduct: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response;
  }
};

export default productService;
