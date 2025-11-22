import React, { useState, useEffect } from 'react';
// Importa el cliente Axios preconfigurado para realizar llamadas a la API.
import apiClient from '../services/api';
// Importa el objeto de contexto que será utilizado por los componentes consumidores.
import { AuthContext } from '../hooks/useAuth.js';

export function AuthProvider({ children }) {
  // --- ESTADOS GLOBALES ---

  // Almacena el objeto con la información del usuario autenticado.
  const [user, setUser] = useState(null);
  // Almacena el token JWT para autorizar las peticiones a la API.
  const [token, setToken] = useState(null);
  // Almacena la información del tipo de cambio obtenida de la API.
  const [tipoCambio, setTipoCambio] = useState(null);
  // Estado de carga para saber si la verificación inicial de sesión ha terminado.
  // Inicia en `true` para indicar que la app está cargando la sesión.
  const [isLoading, setIsLoading] = useState(true);

  // Este efecto se ejecuta una sola vez cuando el componente `AuthProvider` se monta por primera vez.
  // Su propósito es inicializar el estado de la aplicación.
  useEffect(() => {
    // Función asíncrona para verificar si existe una sesión guardada en el almacenamiento local.
    const checkStoredAuth = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        if (storedToken && storedUser) {
          // Si se encuentran datos, se restaura el estado de autenticación.
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Error al restaurar la sesión desde localStorage:", error);
      } finally {
        // Una vez finalizada la verificación (con o sin éxito), se establece `isLoading` en `false`.
        // Esto es crucial para que las rutas protegidas sepan que ya pueden decidir si redirigir o no.
        setIsLoading(false);
      }
    };

    // Función asíncrona para obtener el tipo de cambio, con una estrategia de caché.
    const fetchTipoCambio = async () => {
      try {
        // 1. Revisar el caché en localStorage.
        const cachedData = localStorage.getItem('tipoCambio');
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          const isCacheValid = (new Date().getTime() - timestamp) < 3600000; // 1 hora en milisegundos.

          if (isCacheValid) {
            // Si el caché es reciente, se utiliza y se evita una llamada a la API.
            setTipoCambio(data);
            return;
          }
        }

        // 2. Si no hay caché o este ha expirado, se realiza una nueva llamada a la API.
        const response = await apiClient.get('/currency/usd-pen');
        setTipoCambio(response.data);

        // 3. Se guarda la nueva información y la marca de tiempo actual en localStorage.
        localStorage.setItem('tipoCambio', JSON.stringify({
          data: response.data,
          timestamp: new Date().getTime()
        }));
      } catch (error) {
        console.error('Error al obtener el tipo de cambio:', error.message);
      }
    };

    checkStoredAuth();
    fetchTipoCambio();
  }, []); // El array vacío `[]` asegura que este efecto se ejecute solo una vez.

  
  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      setToken(response.data.token);
      setUser(response.data.user);

      // Persiste la sesión en el almacenamiento local para futuras visitas.
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return true;
    } catch (error) {
      console.error('Error en el login:', error.response?.data?.message || error.message);
      return false;
    }
  };


  const register = async (userData) => {
    try {
      await apiClient.post('/auth/register', userData);
      return true;
    } catch (error) {
      console.error('Error en el registro:', error.response?.data?.message || error.message);
      return false;
    }
  };

  /**
   * Cierra la sesión del usuario actual.
   * Limpia el estado de la aplicación y elimina los datos de sesión del almacenamiento local.
   */
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Objeto que contiene todos los valores y funciones que se compartirán a través del contexto.
  const value = {
    user,
    token,
    isLoggedIn: !!token, // Un booleano derivado que indica si el usuario está autenticado.
    isLoading, // Expone el estado de carga para que otros componentes puedan usarlo (ej. ProtectedRoute).
    tipoCambio,
    login,
    register,
    logout,
  };

  // El componente Provider envuelve a sus hijos y les proporciona el `value` definido.
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}