// Importación de Axios, un cliente HTTP basado en promesas para realizar peticiones a APIs.
import axios from 'axios';

// Se obtiene la clave de API desde las variables de entorno para mantenerla segura y configurable.
const API_KEY = process.env.DECOLECTA_API_KEY;

// Se crea una instancia pre-configurada de Axios. Esto evita repetir la URL base
// y los encabezados de autorización en cada llamada a la API.
const api = axios.create({
  baseURL: 'https://api.decolecta.com/v1',
  headers: {
    'Authorization': `Bearer ${API_KEY}`,
    'Content-Type': 'application/json' // Se especifica el tipo de contenido esperado.
  }
});

// --- Servicio para consultar DNI (Reniec) ---
export const consultarDni = async (numeroDni) => {
  try {
    // Realiza una petición GET al endpoint de Reniec, pasando el número de DNI como parámetro.
    const response = await api.get(`/reniec/dni?numero=${numeroDni}`);
    return response.data;
  } catch (error) {
    // En caso de error en la petición, se registra el detalle en consola para depuración.
    console.error('Error en servicio de Reniec:', error.response?.data || error.message);
    // Se lanza un nuevo error con un mensaje genérico para que el controlador lo maneje.
    throw new Error('No se pudo consultar el DNI.');
  }
};

// --- Servicio para consultar RUC (Sunat) ---
export const consultarRuc = async (numeroRuc) => {
  try {
    // Realiza una petición GET al endpoint de Sunat para obtener información del RUC.
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
    // Realiza una petición GET para obtener el tipo de cambio del día desde el endpoint de Sunat.
    const response = await api.get('/tipo-cambio/sunat');
    return response.data;
  } catch (error) {
    console.error('Error en servicio de Tipo de Cambio:', error.response?.data || error.message);
    throw new Error('No se pudo consultar el tipo de cambio.');
  }
};