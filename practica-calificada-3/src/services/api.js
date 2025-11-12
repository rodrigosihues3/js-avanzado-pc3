// npm install axios
import axios from 'axios';

// Instancia de Axios con la configuración base
// const apiClient = axios.create({
//   // URL del backend Express (el puerto 3002)
//   baseURL: 'http://localhost:3002/api'
// });
const apiClient = axios.create({
  // Simplemente usa una ruta relativa.
  baseURL: '/api'
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