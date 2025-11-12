import apiClient from './api';

export const createComprobante = async (comprobanteData) => {
  try {
    const response = await apiClient.post('/comprobantes', comprobanteData);
    return response.data;
  } catch (error) {
    console.error('Error al crear el comprobante:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const getComprobantes = async () => {
  try {
    const response = await apiClient.get('/comprobantes');
    return response.data;
  } catch (error) {
    console.error('Error al obtener comprobantes:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const getComprobanteById = async (id) => {
  try {
    const response = await apiClient.get(`/comprobantes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el detalle:', error.response?.data?.message || error.message);
    throw error;
  }
};