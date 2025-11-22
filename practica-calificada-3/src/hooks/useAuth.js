import { createContext, useContext } from 'react';

export const AuthContext = createContext();

// Hook personalizado para consumir el contexto fácilmente
export const useAuth = () => {
  return useContext(AuthContext);
};