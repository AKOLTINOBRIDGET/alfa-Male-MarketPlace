import api from './api';

const appointmentService = {
  getAppointments: async (params = {}) => {
    const response = await api.get('/appointments', { params });
    return response;
  },

  getAppointment: async (id) => {
    const response = await api.get(`/appointments/${id}`);
    return response;
  },

  updateAppointment: async (id, appointmentData) => {
    const response = await api.put(`/appointments/${id}`, appointmentData);
    return response;
  },

  deleteAppointment: async (id) => {
    const response = await api.delete(`/appointments/${id}`);
    return response;
  }
};

export default appointmentService;
