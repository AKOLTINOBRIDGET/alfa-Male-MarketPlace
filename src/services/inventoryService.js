import api from './api';

const inventoryService = {
  getInventory: async () => {
    const response = await api.get('/inventory');
    return response;
  },

  createInventoryItem: async (inventoryData) => {
    const response = await api.post('/inventory', inventoryData);
    return response;
  },

  updateInventoryItem: async (id, inventoryData) => {
    const response = await api.put(`/inventory/${id}`, inventoryData);
    return response;
  },

  deleteInventoryItem: async (id) => {
    const response = await api.delete(`/inventory/${id}`);
    return response;
  }
};

export default inventoryService;
