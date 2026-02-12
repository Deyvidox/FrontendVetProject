import axios from 'axios';

const API_URL = 'http://localhost:4000/api/appointments';

export const appointmentService = {
  // Obtiene la lista de Mascotas y Dueños para el formulario
  getFormData: async () => {
    const res = await axios.get(`${API_URL}/form-data`);
    return res.data.data;
  },

  getAll: async () => {
    const res = await axios.get(API_URL);
    return res.data.data;
  },

  create: async (data) => {
    // Aquí 'data' ya lleva: pet_id, appointment_date, appointment_time, service_type, status, notes
    const res = await axios.post(API_URL, data);
    return res.data;
  },

  update: async (id, data) => {
    const res = await axios.put(`${API_URL}/${id}`, data);
    return res.data;
  },

  // NUEVA FUNCIÓN: Para actualizar solo el estado desde la tabla
  updateStatus: async (id, status) => {
    const res = await axios.patch(`${API_URL}/${id}/status`, { status });
    return res.data;
  },

  delete: async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    return true;
  }
};