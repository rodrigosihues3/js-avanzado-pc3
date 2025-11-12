import { createContext, useContext } from 'react';

// 2. Mueve la creación del contexto aquí
export const AuthContext = createContext();

// Hook personalizado para consumir el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};