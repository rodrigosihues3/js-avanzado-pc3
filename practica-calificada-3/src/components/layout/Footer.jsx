// src/components/layout/Footer.jsx
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer({ className }) {
  return (
    <footer className={`${className} bg-light py-3 border-top`}>
      <Container>
        <Row>
          <Col className="text-center text-muted small">
            &copy; {new Date().getFullYear()} PC3. Todos los derechos reservados.
          </Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;