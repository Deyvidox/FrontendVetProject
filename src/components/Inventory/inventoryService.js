import axios from "axios";

const API_URL = "http://localhost:4000/api/inventory";

export const getInventoryRequest = async (params = {}) => {
    // Axios convierte los objetos params automáticamente en ?search=...&type=...
    const res = await axios.get(API_URL, { params });
    return res.data; 
};

export const createProductRequest = async (product) => {
    const form = new FormData();
    form.append('name', product.name);
    form.append('type', product.type);
    form.append('instructions', product.instructions || "");
    form.append('quantity', product.quantity);
    form.append('unit_price', product.unit_price);
    form.append('status', product.status);

    // Verificamos si hay imagen seleccionada
    if (product.imagen && product.imagen[0]) {
        form.append('imagen', product.imagen[0]); 
    }

    const res = await axios.post(API_URL, form, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
};

export const updateProductRequest = async (id, product) => {
    const form = new FormData();
    
    // Iteramos sobre las propiedades del producto
    for (const key in product) {
        if (key === 'imagen') {
            if (product[key] && product[key][0] instanceof File) {
                form.append('imagen', product[key][0]);
            }
        } else if (product[key] !== undefined && product[key] !== null) {
            form.append(key, product[key]);
        }
    }

    const res = await axios.put(`${API_URL}/${id}`, form, {
        headers: { "Content-Type": "multipart/form-data" }
    });
    return res.data;
};

export const deleteProductRequest = async (id) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data; 
};