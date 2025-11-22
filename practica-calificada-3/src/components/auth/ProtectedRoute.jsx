import React from 'react';
// Hook personalizado para acceder al estado y funciones de autenticación.
import { useAuth } from '../../hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import { Container, Spinner } from 'react-bootstrap';

// Componente de Ruta Protegida (Higher-Order Component).
// Este componente envuelve a otras rutas para restringir el acceso solo a usuarios autenticados.
// Verifica el estado de autenticación del usuario antes de decidir qué renderizar.

function ProtectedRoute() {
  // Obtiene el estado de autenticación (`isLoggedIn`) y el estado de carga (`isLoading`) del contexto de autenticación.
  const { isLoggedIn, isLoading } = useAuth();

  // 1. Manejo del estado de carga inicial.
  // Mientras se verifica el estado de autenticación (por ejemplo, al recargar la página),
  // `isLoading` será `true`. En este caso, se muestra un spinner de carga.
  // Esto evita redirigir al usuario prematuramente antes de confirmar si tiene una sesión válida.
  if (isLoading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  // 2. Verificación del estado de autenticación.
  // Si la carga ha terminado (`isLoading` es `false`) y el usuario NO está autenticado (`isLoggedIn` es `false`),
  // se le redirige a la página de inicio de sesión.
  // El prop `replace` evita que la ruta actual se guarde en el historial de navegación,
  // por lo que el usuario no podrá volver a la ruta protegida usando el botón "atrás" del navegador.
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // 3. Acceso concedido.
  // Si el usuario está autenticado, se renderiza el componente `Outlet`.
  // `Outlet` actúa como un marcador de posición para el componente de la ruta hija que esta `ProtectedRoute` está protegiendo.
  return <Outlet />;
}

export default ProtectedRoute;