// El "Context" de React nos permite compartir el estado del usuario (si está logueado o no) 
// a través de toda la aplicación, sin tener que pasar datos manualmente de un componente a otro.
import React, { useState, useEffect } from 'react';
import apiClient from '../services/api'; // Importamos nuestro mensajero
import { AuthContext } from '../hooks/useAuth.js';

// Proveedor (el componente que manejará la lógica)
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  // --- ESTADO PARA EL TIPO DE CAMBIO ---
  const [tipoCambio, setTipoCambio] = useState(null);

  // useEffect se ejecuta cuando la app carga por primera vez
  useEffect(() => {
    // Revisa si ya hay un token guardado en el navegador
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }

    // --- TIPO DE CAMBIO LLAMADA A LA API ---
    // Función anónima para cargar el tipo de cambio
    const fetchTipoCambio = async () => {
      try {
        // 1. Revisamos si ya tenemos un T/C guardado y si es reciente
        const cachedData = localStorage.getItem('tipoCambio');
        if (cachedData) {
          const { data, timestamp } = JSON.parse(cachedData);
          // Si tiene menos de 1 hora de antigüedad, usamos el caché
          if (new Date().getTime() - timestamp < 3600000) { // 3600000ms = 1 hora
            setTipoCambio(data);
            return; // No llamamos a la API
          }
        }

        // 2. Si no hay caché o está viejo, llamamos a la API
        const response = await apiClient.get('/currency/usd-pen');
        setTipoCambio(response.data);

        // 3. Guardamos la nueva data Y la fecha actual en localStorage
        localStorage.setItem('tipoCambio', JSON.stringify({
          data: response.data,
          timestamp: new Date().getTime()
        }));
      } catch (error) {
        console.error('Error al cargar tipo de cambio:', error.message);
      }
    };

    fetchTipoCambio(); // Ejecutamos la función
  }, []);

  // Función de Login
  const login = async (email, password) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });

      // Guardar los datos
      setToken(response.data.token);
      setUser(response.data.user);

      // Guardar en localStorage para persistir la sesión
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      return true; // Éxito
    } catch (error) {
      console.error('Error en el login:', error.response?.data?.message || error.message);
      return false; // Fallo
    }
  };

  // Función de Registro
  const register = async (userData) => {
    // userData debe ser un objeto: { nombres, apellidos, dni, email, password }
    try {
      await apiClient.post('/auth/register', userData);
      return true; // Éxito
    } catch (error) {
      console.error('Error en el registro:', error.response?.data?.message || error.message);
      return false; // Fallo
    }
  };

  // Función de Logout
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  // Compartir los valores con todos los componentes "hijos"
  const value = {
    user,
    token,
    login,
    register,
    logout,
    isLoggedIn: !!token, // Booleano simple para saber si hay token
    tipoCambio
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}