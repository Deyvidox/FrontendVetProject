import axios from 'axios';

// URL de tu servidor Express real
const API_URL = 'https://vetproyectbackend.onrender.com/appointments'; 

export const appointmentService = {
  getAll: async () => {
    try {
      const response = await axios.get(API_URL);
      // Estructura según tu controlador: response.data.message.appointments
      return response.data.message.appointments || [];
    } catch (error) {
      throw error.response?.data?.message || "Error al cargar citas";
    }
  },

  create: async (data) => {
    try {
      const payload = {
        pet_id: Number(data.mascota_id),
        status: data.estado,
        notes: data.notas || ""
      };
      const response = await axios.post(API_URL, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al crear cita";
    }
  },

  update: async (id, data) => {
    try {
      const payload = {
        status: data.estado,
        notes: data.notas
      };
      const response = await axios.put(`${API_URL}/${id}`, payload);
      return response.data;
    } catch (error) {
      throw error.response?.data?.message || "Error al actualizar";
    }
  },

  delete: async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      throw error.response?.data?.message || "Error al eliminar";
    }
  }
};