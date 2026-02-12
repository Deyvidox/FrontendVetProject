import axios from 'axios';

const API_URL = 'http://localhost:4000/api/pets';

export const getPets = async (filters = {}) => {
    const response = await axios.get(API_URL, { params: filters });
    return response.data; // Retorna { success: true, data: [...] }
};

export const createPet = async (formData) => {
    return await axios.post(API_URL, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const updatePet = async (id, formData) => {
    return await axios.put(`${API_URL}/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
};

export const deletePet = async (id) => {
    return await axios.delete(`${API_URL}/${id}`);
};