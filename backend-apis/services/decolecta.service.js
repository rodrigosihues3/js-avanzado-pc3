import axios from 'axios';

// API key desde el archivo .env
const API_KEY = process.env.DECOLECTA_API_KEY;

// Configuramos una "instancia" de Axios con los headers que siempre se repiten
const api = axios.create({
  baseURL: 'https://api.decolecta.com/v1',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json'
  }
});

// --- Servicio para consultar DNI (Reniec) ---
export const consultarDni = async (numeroDni) => {
  try {
    const response = await api.get(`/reniec/dni?numero=${numeroDni}`);
    return response.data;
  } catch (error) {
    // Manejamos el error de la API externa
    console.error('Error en servicio de Reniec:', error.response?.data || error.message);
    throw new Error('No se pudo consultar el DNI.');
  }
};

// --- Servicio para consultar RUC (Sunat) ---
export const consultarRuc = async (numeroRuc) => {
  try {
    const response = await api.get(`/sunat/ruc?numero=${numeroRuc}`);
    return response.data;
  } catch (error) {
    console.error('Error en servicio de Sunat:', error.response?.data || error.message);
    throw new Error('No se pudo consultar el RUC.');
  }
};

// --- Servicio para consultar Tipo de Cambio (Sunat) ---
export const consultarTipoCambio = async () => {
  try {
    // Pide el tipo de cambio del día (sin parámetros)
    const response = await api.get('/tipo-cambio/sunat');
    return response.data;
  } catch (error) {
    console.error('Error en servicio de Tipo de Cambio:', error.response?.data || error.message);
    throw new Error('No se pudo consultar el tipo de cambio.');
  }
};