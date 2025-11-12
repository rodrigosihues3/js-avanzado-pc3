// src/services/producto.service.js
import apiClient from './api';

// GET: Obtiene los productos
export const getProductos = async () => {
  try {
    const response = await apiClient.get('/productos');

    return response.data;
  } catch (error) {
    console.error('Error al obtener productos:', error.response?.data?.message || error.message);
    throw error;
  }
};

// POST: Crea un nuevo producto
export const createProducto = async (productoData) => {
  // productoData debe ser { nombre: "...", precio: 123.45, ... }
  try {
    const response = await apiClient.post('/productos', productoData);

    return response.data;
  } catch (error) {
    console.error('Error al crear producto:', error.response?.data?.message || error.message);
    throw error.response?.data || error;
  }
};