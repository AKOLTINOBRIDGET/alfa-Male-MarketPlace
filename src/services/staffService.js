import api from './api';

const staffService = {
  getAllStaff: async () => {
    const response = await api.get('/staff');
    return response;
  },

  getStaffById: async (id) => {
    const response = await api.get(`/staff/${id}`);
    return response;
  },

  createStaff: async (staffData) => {
    const response = await api.post('/staff', staffData);
    return response;
  },

  updateStaff: async (id, staffData) => {
    const response = await api.put(`/staff/${id}`, staffData);
    return response;
  },

  deleteStaff: async (id) => {
    const response = await api.delete(`/staff/${id}`);
    return response;
  }
};

export default staffService;
