// npm install axios
import axios from 'axios';

// Si VITE_API_URL existe (en .env.development), la usa.
// Si no (en producción), usa '/api' por defecto.
const baseURL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  // Simplemente usa una ruta relativa.
  baseURL: baseURL
});

// --- ¡NUEVO CÓDIGO AQUÍ! ---
// Esto se ejecuta ANTES de que cada petición sea enviada.
apiClient.interceptors.request.use(
  (config) => {
    // Token de localStorage
    const token = localStorage.getItem('token');

    // Si el token existe, se añade a los headers
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;