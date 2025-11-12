// src/components/auth/ProtectedRoute.jsx
import React from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
  // 1. OBTÉN EL ESTADO 'isLoading'
  const { isLoggedIn, isLoading } = useAuth();

  // 2. SI ESTÁ CARGANDO, MUESTRA UN SPINNER
  // (Esto detiene la redirección prematura)
  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  // 3. SI TERMINÓ DE CARGAR Y NO ESTÁ LOGUEADO, REDIRIGE
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 4. SI TERMINÓ DE CARGAR Y SÍ ESTÁ LOGUEADO, MUESTRA LA PÁGINA
  return <Outlet />;
}

export default ProtectedRoute;