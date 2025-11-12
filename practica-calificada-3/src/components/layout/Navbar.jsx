// src/components/layout/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

function AppNavbar() {
  const { isLoggedIn, user, logout, tipoCambio } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Hook para saber en qué página estamos

  // 1. Estado para manejar si el usuario ha hecho scroll
  const [navScrolled, setNavScrolled] = useState(false);

  // 2. Solo queremos el efecto transparente en la página de inicio
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 3. Efecto para escuchar el evento de scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }
    };

    if (isHomePage) {
      // Si estamos en el Home, escucha el scroll
      window.addEventListener('scroll', handleScroll);
      // Limpia el listener cuando el componente se desmonta
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      // Si estamos en cualquier otra página, el navbar es blanco siempre
      setNavScrolled(true);
    }
  }, [isHomePage]); // Se re-ejecuta cada vez que cambiamos de página

  // 4. Define las clases dinámicas para el Navbar
  const navClasses = isHomePage && !navScrolled
    ? 'navbar-transparent'
    : 'navbar-scrolled';

  return (
    <Navbar className={navClasses} expand="lg" sticky="top" variant="light">
      <Container fluid className="py-2 px-4">
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          PC3
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/comprobante/crear">Crear Comprobante</Nav.Link>
                <Nav.Link as={Link} to="/comprobante/ver">Mis Comprobantes</Nav.Link>
                <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
              </>
            )}
            {/* Tipo de Cambio (si ya cargó) */}
            {tipoCambio && (
              <Navbar.Text className="ms-3 fw-bold text-success">
                T/C Venta: S/ {tipoCambio.sell_price}
              </Navbar.Text>
            )}
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <>
                <Navbar.Text className="me-3 text-end">
                  {/* Mostramos el nombre */}
                  <span className="fw-bold text-primary" title='RUC'>{'10' + user.dni + '7'}</span>
                  <span className="text-success mx-2 fw-bold">|</span>
                  <span className="fw-bold text-success" title='DNI'>{user.dni}</span>
                  <span className="text-success mx-2 fw-bold">|</span>
                  <span className="fw-bold text-uppercase">{user.nombres + ' ' + user.apellidos}</span>
                </Navbar.Text>
                <Button variant="outline-primary" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="me-2">
                  <Button variant="outline-primary">
                    Iniciar Sesión
                  </Button>
                </Nav.Link>
                <Nav.Link as={Link} to="/registro">
                  <Button variant="primary">Registrarse</Button>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;