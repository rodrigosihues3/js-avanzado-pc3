import React from 'react';
// Importa los componentes de layout de React-Bootstrap para un diseño responsivo.
import { Container, Row, Col } from 'react-bootstrap';

// Componente funcional que renderiza el pie de página de la aplicación.
function Footer({ className }) {
  return (
    // El elemento `footer` combina las clases recibidas con las clases de Bootstrap para el estilo.
    <footer className={`${className} bg-light py-3 border-top`}>
      <Container>
        <Row>
          <Col className="text-center text-muted small">
            {/* Muestra el símbolo de copyright, el año actual dinámicamente, y el texto de derechos reservados. */}
            &copy; {new Date().getFullYear()} PC3. Todos los derechos reservados.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;