import React, { useState, useEffect } from 'react'; // Hooks básicos de React para estado y efectos secundarios.
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Hooks para la navegación y el manejo de rutas.
import { useAuth } from '../../hooks/useAuth'; // Hook personalizado para acceder al contexto de autenticación.

function AppNavbar() {
  // Extrae el estado y las funciones del contexto de autenticación.
  const { isLoggedIn, user, logout, tipoCambio } = useAuth();
  // Hook para redirigir al usuario a otras rutas programáticamente.
  const navigate = useNavigate();
  // Hook que proporciona información sobre la URL actual.
  const location = useLocation();

  // Define un estado para rastrear si el usuario ha hecho scroll hacia abajo.
  // Esto se usa para cambiar la apariencia del navbar.
  const [navScrolled, setNavScrolled] = useState(false);

  // Determina si la ruta actual es la página de inicio ('/').
  // El estilo del navbar será diferente en la página de inicio.
  const isHomePage = location.pathname === '/';

  // Función para manejar el cierre de sesión del usuario.
  const handleLogout = () => {
    logout(); // Llama a la función del contexto para limpiar el estado de autenticación.
    navigate('/login'); // Redirige al usuario a la página de inicio de sesión.
  };

  // Hook de efecto para gestionar el estilo del navbar al hacer scroll o cambiar de página.
  useEffect(() => {
    // Función que se ejecuta cuando ocurre el evento de scroll.
    const handleScroll = () => {
      // Si el desplazamiento vertical es mayor a 50px, actualiza el estado.
      if (window.scrollY > 50) {
        setNavScrolled(true);
      } else {
        setNavScrolled(false);
      }
    };

    // Si el usuario está en la página de inicio, se aplica el efecto de transparencia.
    if (isHomePage) {
      // Agrega un listener para el evento 'scroll' en el objeto window.
      window.addEventListener('scroll', handleScroll);
      // Función de limpieza: se ejecuta cuando el componente se desmonta o `isHomePage` cambia.
      // Elimina el listener para evitar fugas de memoria.
      return () => window.removeEventListener('scroll', handleScroll);
    } else {
      // Si no es la página de inicio, el navbar siempre tendrá el estilo "scrolled" (fondo sólido).
      setNavScrolled(true);
    }
  }, [isHomePage]); // El efecto se vuelve a ejecutar solo si el valor de `isHomePage` cambia.

  // Define las clases CSS para el Navbar de forma dinámica.
  // Si está en la página de inicio y no se ha hecho scroll, usa la clase para transparencia.
  // De lo contrario, usa la clase para el fondo sólido.
  const navClasses = isHomePage && !navScrolled
    ? 'navbar-transparent'
    : 'navbar-scrolled';

  return (
    <Navbar className={navClasses} expand="lg" sticky="top" variant="light">
      <Container fluid className="py-2 px-4">
        {/* El logo o nombre de la marca, que también es un enlace a la página de inicio. */}
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          PC3
        </Navbar.Brand>
        {/* Botón para expandir el menú en dispositivos móviles. */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* Navegación principal, alineada a la izquierda. */}
          <Nav className="me-auto">
            {/* Renderizado condicional: muestra estos enlaces solo si el usuario ha iniciado sesión. */}
            {isLoggedIn && (
              <>
                <Nav.Link as={Link} to="/comprobante/crear">Crear Comprobante</Nav.Link>
                <Nav.Link as={Link} to="/comprobante/ver">Mis Comprobantes</Nav.Link>
                <Nav.Link as={Link} to="/productos">Productos</Nav.Link>
              </>
            )}
            {/* Muestra el tipo de cambio solo si el dato ha sido cargado desde el contexto. */}
            {tipoCambio && (
              <Navbar.Text className="ms-3 fw-bold text-success">
                T/C Venta: S/ {tipoCambio.sell_price}
              </Navbar.Text>
            )}
          </Nav>
          {/* Navegación secundaria, alineada a la derecha. */}
          <Nav>
            {/* Renderizado condicional basado en el estado de autenticación. */}
            {isLoggedIn ? (
              // Si el usuario está autenticado, muestra su información y el botón de cerrar sesión.
              <>
                <Navbar.Text className="me-3 text-end">
                  {/* Muestra información relevante del usuario obtenida del contexto. */}
                  <span className="fw-bold text-primary" title='RUC'>{'10' + user.dni + '7'}</span>
                  <span className="text-success mx-2 fw-bold">|</span>
                  <span className="fw-bold text-success" title='DNI'>{user.dni}</span>
                  <span className="text-success mx-2 fw-bold">|</span>
                  <span className="fw-bold text-uppercase">{user.nombres + ' ' + user.apellidos}</span>
                </Navbar.Text>
                {/* Botón para ejecutar la función de cierre de sesión. */}
                <Button variant="outline-primary" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              // Si el usuario no está autenticado, muestra los botones para iniciar sesión y registrarse.
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